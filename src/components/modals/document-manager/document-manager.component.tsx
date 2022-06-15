import React, { FC, useCallback, useEffect, useState } from 'react';
import ReactModal, { Props as ReactModalProperties } from 'react-modal';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import common from '../../../styles/common';
import { Button, Loading /* Collapse */ } from '../../atomic';
import { UploadFile } from '../../core-ui';
// import AssignFileToTask from '../assign-file-to-task/assign-file-to-task.component';
import { MaintenanceTask, File as FFile, Document } from '../../../core/models';
import { createDocument, updateDocument } from '../../../core/store/document/document.actions';
import { createFile, uploadFile } from '../../../core/services/file.service';

interface Props extends ReactModalProperties {
  archived?: boolean;
  document?: Document;
  save?: boolean;
  onUpdate?: (document: Document) => void;
}

const DocumentManager: FC<Props> = ({ archived, document, onUpdate, save = true, ...props }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  // const [tasksOpened, setTasksOpened] = useState<boolean>(false);
  // const [isAssignToTaskOpened, setAssignToTaskOpened] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Partial<MaintenanceTask>[]>([]);
  const [file, setFile] = useState<FFile | File | undefined>(document?.file);
  const [title, setTitle] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();

  useEffect(() => {
    setFile(document?.file);
    setTitle(document?.title);
    setTasks(document?.tasks || []);
  }, [document, props.isOpen]);

  const handleAssignTasks = (selectedTasks: Partial<MaintenanceTask>[]) => {
    setTasks(selectedTasks);
    // setAssignToTaskOpened(false);
  };

  // const handleUnAssignTask = (task: Partial<MaintenanceTask>) => {
  //   const nextTasks = [...tasks];
  //   const index = nextTasks.findIndex(({ id }) => id === task.id);
  //   nextTasks.splice(index, 1);
  //   setTasks(nextTasks);
  // };

  const handleLoadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleAbort = (event: React.MouseEvent | React.KeyboardEvent) => {
    setSubmitting(false);
    if (props.onRequestClose) {
      props.onRequestClose(event);
    }
  };

  const handleSubmit = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      setSubmitting(true);
      if (file instanceof File) {
        try {
          const externalFile = await uploadFile(file);
          const savedFile = await createFile(externalFile);
          const newDocument = await dispatch(
            createDocument({
              tasks: tasks.map(({ id }) => ({ id })),
              maintenances: document?.maintenances || [],
              archive: archived,
              title: title || file.name.replace(/\.[^.]*$/, ''),
              ext: savedFile.name.replace(/.*\.([^.]*)$/, '$1'),
              file: savedFile,
            }),
          );
          if (onUpdate) {
            onUpdate((newDocument as unknown) as Document);
          }
        } catch (error) {
          setSubmitting(false);
          toastr.error(t('error'), t('fileUploadError'));
          return;
        }
      } else {
        const newDocument: Partial<Document> = {
          ...document,
          tasks: tasks.map(({ id }) => ({ id })),
          maintenances: document?.maintenances || [],
          title,
        };
        if (save && document?.id) {
          delete newDocument.file;
          const updatedDocument = dispatch(updateDocument(document.id, newDocument));
          if (onUpdate) {
            onUpdate((updatedDocument as unknown) as Document);
          }
        } else if (onUpdate) {
          onUpdate(newDocument as Document);
        }
      }
      setSubmitting(false);
      if (props.onRequestClose && event) {
        props.onRequestClose(event);
      }
    },
    [archived, file, title, setSubmitting],
  );

  return (
    <>
      <ReactModal {...props} style={{ content: { width: 668 } }}>
        <div className={classNames(common.modal.header, 'justify-content-between mb-0')}>
          <div className={common.modal.title}>
            <span className={classNames(common.icon.repair, 'mr-3')} />
            {t('editDocument')}
          </div>
          <Button
            variant="square"
            color="transparent"
            className={common.modal.close}
            onClick={props.onRequestClose}
          >
            <span className={common.icon.greycross} />
          </Button>
        </div>
        <div className={common.modal.body}>
          <div className={classNames('d-flex')}>
            <div className="w-50 d-flex flex-column">
              <strong className={common.forms.label}>{t('title')}</strong>
              <input
                className={classNames(common.forms.input, common.forms.w230)}
                value={title || ''}
                onChange={event => setTitle(event.target.value)}
              />
            </div>
            <div className="w-50 d-flex flex-column">
              <strong className={common.forms.label}>Document</strong>
              {file instanceof File ? (
                <span
                  className={classNames(
                    common.forms.input,
                    'border-0 px-0 d-flex align-items-center',
                  )}
                >
                  <UploadFile.List files={[file]} onDelete={() => setFile(undefined)} />
                </span>
              ) : (
                file && (
                  <span className={classNames(common.forms.input, 'border-0 px-0')}>
                    {file?.name}
                  </span>
                )
              )}
              {!file && <UploadFile.UploadButton onChange={handleLoadFile} />}
            </div>
          </div>
          {/* <Collapse */}
          {/*  open={tasksOpened} */}
          {/*  label={t('assignTasks')} */}
          {/*  onToggle={() => setTasksOpened(!tasksOpened)} */}
          {/*  className={classNames(common.modal.hdiv, 'border-0')} */}
          {/* > */}
          {/*  <div className={classNames(common.modal.body, 'w-100')}> */}
          {/*    <table className='w-100'> */}
          {/*      <thead className={classNames(common.table.header, common.table.small)}> */}
          {/*        <tr> */}
          {/*          <td>{t('tasks')}</td> */}
          {/*          <td>{t('maintenance')}</td> */}
          {/*          <td> */}
          {/*            <div className='d-flex justify-content-end'> */}
          {/*              <Button */}
          {/*                className='px-4' */}
          {/*                color='dark' */}
          {/*                onClick={() => setAssignToTaskOpened(true)} */}
          {/*              > */}
          {/*                <span className={classNames(common.icon.plus, 'mr-4')} /> */}
          {/*                {t('connectTasks')} */}
          {/*              </Button> */}
          {/*            </div> */}
          {/*          </td> */}
          {/*        </tr> */}
          {/*      </thead> */}
          {/*      <tbody className={classNames(common.table.body, common.table.nowrap)}> */}
          {/*        {tasks.map((task) => ( */}
          {/*          <tr key={`selected-${task.id}`}> */}
          {/*            <td valign='middle'>{task.name}</td> */}
          {/*            <td valign='middle'>{task.maintenance}</td> */}
          {/*            <td> */}
          {/*              <div className='d-flex justify-content-end'> */}
          {/*                <Button */}
          {/*                  variant='square' */}
          {/*                  color='red' */}
          {/*                  onClick={() => handleUnAssignTask(task)} */}
          {/*                > */}
          {/*                  <span className={common.icon.cross} /> */}
          {/*                </Button> */}
          {/*              </div> */}
          {/*            </td> */}
          {/*          </tr> */}
          {/*        ))} */}
          {/*      </tbody> */}
          {/*    </table> */}
          {/*  </div> */}
          {/* </Collapse> */}
        </div>
        <div className={common.modal.footer}>
          <Button variant="square" color="transparent">
            <span className={common.icon.help} />
          </Button>
          <div className="d-flex align-items-center">
            <Button variant="link" width="auto" onClick={handleAbort}>
              {t('cancel')}
            </Button>
            <Button
              className="ml-3 py-0 pl-3 pr-4 d-flex align-items-center"
              width="auto"
              disabled={!file || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <Loading />
              ) : (
                <span className={classNames(common.icon.check, 'mr-2')} />
              )}
              {!file || file instanceof File ? t('create') : t('save')}
            </Button>
          </div>
        </div>
      </ReactModal>
      {/* <AssignFileToTask */}
      {/*  isOpen={isAssignToTaskOpened} */}
      {/*  onRequestClose={() => setAssignToTaskOpened(false)} */}
      {/*  onAccept={handleAssignTasks} */}
      {/*  initialTasks={tasks} */}
      {/* /> */}
    </>
  );
};

export default DocumentManager;
