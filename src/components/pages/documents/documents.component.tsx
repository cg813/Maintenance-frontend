import React, { FC, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import * as format from '../../../core/utils/format';
import common from '../../../styles/common';
import { Button, CheckBox, Filters } from '../../atomic';
import { DocumentManager, ViewVideo } from '../../modals';
import { Document } from '../../../core/models';
import { deleteDocument, loadDocuments } from '../../../core/store/document/document.actions';
import { selectDocuments, selectSummarize } from '../../../core/store/document/document.selectors';
import { useFilters } from '../../../core/utils/hooks/filters';
import { Confirm } from '../../modals/dialogs';
import PdfViewer from '../../modals/pdf-viewer/pdf-viewer.component';
import { getFileUrl } from '../../../core/services/file.service';
import { selectMachines } from '../../../core/store/assets/assets.selectors';
import { fileTypes } from '../../../core/utils/constants';
import { TruncateText } from '../../core-ui';

interface Props {
  role?: 'modal';
  archived?: boolean;
  selectedDocuments?: Partial<Document>[];
  setSelectedDocuments?: React.Dispatch<SetStateAction<Partial<Document>[]>>;
}

const Documents: FC<Props> = ({
  role,
  selectedDocuments,
  setSelectedDocuments,
  archived = false,
}) => {
  const { t } = useTranslation();

  const width = role === 'modal' ? '100%' : 1070;

  const dispatch = useDispatch();
  const documents: Document[] = useSelector(selectDocuments);
  const summarize = useSelector(selectSummarize);
  const machines = useSelector(selectMachines);

  const { filters, ...filter } = useFilters();
  const [documentToEdit, setDocumentToEdit] = useState<Document>();
  const [documentToDelete, setDocumentToDelete] = useState<Document>();
  const [isCEDocumentOpened, setCEDocumentOpened] = useState<boolean>(false);
  const [videoToView, setVideoToView] = useState<string>();
  const [fileUrl, setFileUrl] = useState<string>();
  const [searchString, setSearchString] = useState<string>('');

  useEffect(() => {
    dispatch(loadDocuments(filters));
  }, [filters]);

  useEffect(() => {
    if (!isCEDocumentOpened) {
      setDocumentToEdit(undefined);
    }
  }, [isCEDocumentOpened]);

  const handleEditDocument = (document: Document) => {
    setDocumentToEdit(document);
    setCEDocumentOpened(true);
  };

  const handleDeleteDocument = async () => {
    if (documentToDelete) {
      await dispatch(deleteDocument(documentToDelete));
      setDocumentToDelete(undefined);
    }
  };

  const downloadFile = (file: Document, inlineView?: boolean) => {
    const link = document.createElement('a');
    link.href = `${getFileUrl(file.file.id)}?disposition=${inlineView ? 'inline' : 'attachment'}`;
    link.target = '_blank';
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFileToView = (document: Document) => {
    if (document.ext === 'pdf') {
      setFileUrl(getFileUrl(document.file.id));
    } else if (fileTypes.video.includes(document.ext)) {
      setVideoToView(getFileUrl(document.file.id));
    } else {
      downloadFile(document);
    }
  };

  const onPressEnterOnSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      filter.setSearchString(searchString);
    }
  };

  const toggleDocument = (document: Partial<Document>) => {
    if (!selectedDocuments || !setSelectedDocuments) {
      return;
    }

    const index = selectedDocuments.findIndex(({ id }) => id === document.id);
    const newDocuments = [...selectedDocuments];

    if (index >= 0) {
      newDocuments.splice(index, 1);
    } else {
      newDocuments.push(document);
    }

    setSelectedDocuments(newDocuments);
  };

  const renderDocument = (document: Partial<Document>) => (
    <tr key={`documents-page-document-${document.id}`}>
      <td valign="middle">
        <TruncateText 
          width={150}
          onClick={() => downloadFile(document as Document, true)}
          className="cursor-pointer"
        >
          {document.title}
        </TruncateText>
      </td>
      <td valign="middle">
        <span className="text-uppercase">{document.ext}</span>
      </td>
      <td valign="middle">
        <TruncateText width={150}>
          {document.tasks &&
            document.tasks.map(task => (
              <span
                key={`documents-page-document-${document.id}-task-${task.id}`}
                className="comma-separated"
              >
                {task.name}
              </span>
            ))}
        </TruncateText>
      </td>
      <td valign="middle">
        <TruncateText width={150}>
          {document.maintenances &&
            document.maintenances.map(maintenance => (
              <span
                key={`documents-page-document-${document.id}-maintenance-${maintenance.id}`}
                className="comma-separated"
              >
                {maintenance.title}
              </span>
            ))}
        </TruncateText>
      </td>
      <td valign="middle">{format.datetime(document.createdAt as Date)}</td>
      <td valign="middle">
        <div className="d-flex justify-content-end">
          {role === 'modal' ? (
            <CheckBox
              checked={!!selectedDocuments?.find(({ id }) => id === document.id)}
              onChange={() => toggleDocument(document)}
            />
          ) : (
            <>
              <Button
                variant="square"
                color="red"
                onClick={() => setDocumentToDelete(document as Document)}
              >
                <span className={common.icon.trash} />
              </Button>
              <Button
                variant="square"
                color="black"
                className="ml-2"
                onClick={() => handleEditDocument(document as Document)}
              >
                <span className={common.icon.edit} />
              </Button>
              <Button
                variant="square"
                color="dark"
                className="ml-2"
                onClick={() => openFileToView(document as Document)}
              >
                <span className={common.icon.filedownload} />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-100 align-items-center d-flex flex-column" style={{ minWidth: width }}>
        <div className="d-flex justify-content-between" style={{ width }}>
          <Filters.Asset
            className="flex-fill mr-4"
            assets={machines}
            assetId={filters.assetId || ''}
            setAssetId={filter.setAssetId}
            summarize={summarize.assets}
          />
          <Filters.Maintenance
            className="flex-fill mr-4"
            maintenances={summarize.maintenances.map(({ title, maintenanceId }) => ({
              title,
              id: maintenanceId,
            }))}
            maintenanceId={filters.maintenanceId || ''}
            setMaintenanceId={filter.setMaintenanceId}
            summarize={summarize.maintenances}
          />
          <Filters.Task
            className="flex-fill mr-4"
            tasks={summarize.tasks.map(({ taskId, name }) => ({
              name,
              id: taskId,
            }))}
            taskId={filters.taskId || ''}
            setTaskId={filter.setTaskId}
            summarize={summarize.tasks}
          />
          <div className={classNames('d-flex', !role && common.forms.w230)}>
            <input
              className={classNames(common.forms.input, 'flex-fill w-25')}
              placeholder="Search"
              value={searchString}
              onChange={event => setSearchString(event.target.value)}
              onKeyDown={onPressEnterOnSearch}
            />
            <Button
              variant="square"
              color="dark"
              onClick={() => filter.setSearchString(searchString)}
            >
              <span className={common.icon.search} />
            </Button>
          </div>
          <Button
            color="dark"
            style={{ width: 210 }}
            className={classNames(
              'ml-4 text-nowrap d-flex justify-content-around align-items-center',
            )}
            onClick={() => setCEDocumentOpened(true)}
          >
            <span className={common.icon.plus} />
            {t('uploadNewFiles')}
          </Button>
        </div>
        <div className="w-auto overflow-auto" style={{ maxWidth: '100%', minWidth: width }}>
          <table className="w-100 mt-4">
            <thead className={classNames(common.table.header)}>
              <tr>
                <td>{t('documents')}</td>
                <td>{t('type')}</td>
                <td>{t('tasks')}</td>
                <td>{t('maintenance')}</td>
                <td>{t('createdAt')}</td>
                <td />
              </tr>
            </thead>
            <tbody className={classNames(common.table.body, common.table.nowrap)}>
              {selectedDocuments
                ?.map(
                  selected => documents.find(document => selected.id === document.id) || selected,
                )
                .map(renderDocument)}
              {documents
                .filter(
                  document =>
                    !document.archive && !selectedDocuments?.find(({ id }) => id === document.id),
                )
                .map(renderDocument)}
            </tbody>
          </table>
        </div>
      </div>
      <PdfViewer
        isOpen={!!fileUrl}
        onRequestClose={() => setFileUrl(undefined)}
        fileUrl={fileUrl as string}
      />
      <DocumentManager
        archived={archived}
        isOpen={isCEDocumentOpened}
        onRequestClose={() => setCEDocumentOpened(false)}
        document={documentToEdit}
        onUpdate={toggleDocument}
      />
      <Confirm
        onAccept={handleDeleteDocument}
        isOpen={!!documentToDelete}
        onRequestClose={() => setDocumentToDelete(undefined)}
        iconClass={common.icon.redtrash}
        message={`Wollen Sie „${documentToDelete?.title}“ wirklich unwiderruflich löschen?`}
      />
      <ViewVideo
        url={videoToView || ''}
        isOpen={!!videoToView}
        onRequestClose={() => setVideoToView(undefined)}
      />
    </>
  );
};

export default Documents;
