import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

import * as format from '../../../core/utils/format';
import common from '../../../styles/common';
import { Button, CheckBox, TargetTime } from '../../atomic';
import { Confirm } from '../../modals/dialogs';
import { showModal } from '../../../core/store/modals/modals.actions';
import {
  CREATE_EDIT_MAINTENANCE,
  COMPLETE_MAINTENANCE,
} from '../../../core/store/modals/modal-types';
import { selectMaintenance } from '../../../core/store/maintenance/maintenance.selectors';
import {
  clearMaintenanceFromStore,
  deleteMaintenance,
  loadMaintenance,
  updateMaintenance,
} from '../../../core/store/maintenance/maintenance.actions';
import { File, Task, Document } from '../../../core/models';
import { loadTasks, updateTask } from '../../../core/store/task/task.actions';
import { selectTasks } from '../../../core/store/task/task.selectors';
import {
  intervalLabels,
  mapColorByStatus,
  intervalLabelsSingular,
  internalExternal,
  fileTypes,
} from '../../../core/utils/constants';
import { selectAssetsTree, selectCurrentAsset } from '../../../core/store/assets/assets.selectors';
import { setCurrentAsset } from '../../../core/store/assets/assets.actions';
import { getFileUrl } from '../../../core/services/file.service';
import { CompleteTask, PdfViewer, AssetInformation, ViewVideo } from '../../modals';
import { RoleGuard } from '../../../core/guards';
import { TruncateText } from '../../core-ui';
import { UTCAsLocalTime } from '../../../core/utils/format';
import { DISTANCE_PROP_KEY, OPERATING_HOURS_PROP_KEY, STROKES_PROP_KEY } from 'shared/common/models';

const MaintenanceDetail: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const dispatch = useDispatch();
  const maintenance = useSelector(selectMaintenance);
  const currentAsset = useSelector(selectCurrentAsset);

  const tree = useSelector(selectAssetsTree);
  const loadedTasks = useSelector(selectTasks);
  const [tasks, setTasks] = useState(loadedTasks);
  const [isDelete, setIsDelete] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>();
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [isAssetInfoOpen, setAssetInfoOpen] = useState(false);
  const [taskToConfirm, setTaskToConfirm] = useState<Task | null>(null);
  const history = useHistory();

  const operatingHours =
    useSelector(selectCurrentAsset)?.properties?.find(
      property => property.key === OPERATING_HOURS_PROP_KEY,
    )?.value || 0;
    const strokes =
    useSelector(selectCurrentAsset)?.properties?.find(
      property => property.key === STROKES_PROP_KEY,
    )?.value || 0;
    const distance =
    useSelector(selectCurrentAsset)?.properties?.find(
      property => property.key === DISTANCE_PROP_KEY,
    )?.value || 0;

  const { t } = useTranslation();

  let canComplete = true;

  if (
    (maintenance?.earliestExecTime && new Date() < maintenance.earliestExecTime) ||
    !!tasks.find(task => !task.completed)
  ) {
    canComplete = false;
  }

  useEffect(() => {
    setTasks(loadedTasks);
  }, [loadedTasks]);

  useEffect(() => {
    dispatch(clearMaintenanceFromStore);
    dispatch(loadMaintenance(match.params.id));
    dispatch(loadTasks(match.params.id));
  }, [dispatch, match]);

  useEffect(() => {
    if (!currentAsset && tree && maintenance) {
      dispatch(setCurrentAsset(maintenance.machineId));
    }
  }, [maintenance, tree, dispatch, currentAsset]);

  const getFileId = (file: File | Document) => ('file' in file ? file.file.id : file.id) || '';

  const openPDFViewer = (file: File | Document) => {
    setFileUrl(getFileUrl(getFileId(file)));

    setIsPDFOpen(true);
  };

  const downloadFile = (file: Document) => {
    const link = document.createElement('a');
    link.href = `${getFileUrl(getFileId(file))}?disposition=attachment`;
    link.target = '_blank';
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewDocument = (document: Document) => {
    if (document.ext === 'pdf') {
      openPDFViewer(document);
    } else if (fileTypes.video.includes(document.ext)) {
      setVideoUrl(getFileUrl(getFileId(document)));
    } else {
      downloadFile(document);
    }
  };

  const openAssetInfo = () => {
    setAssetInfoOpen(true);
  };

  const onDeleteDocument = (document: Document) => {
    if (maintenance?.documents) {
      dispatch(
        updateMaintenance(maintenance.id, {
          documents: maintenance.documents.filter(({ id }) => id !== document.id) || [],
        }),
      );
    }
  };

  const onDeleteAccept = () => {
    if (maintenance && currentAsset) {
      dispatch(deleteMaintenance(maintenance.id));

      history.push(`/machine/${currentAsset.id}`);
    }
  };

  const toggleComplete = (task: Task) => {
    if (
      maintenance?.earliestExecTime &&
      UTCAsLocalTime(maintenance.earliestExecTime) > new Date()
    ) {
      toastr.warning(t('error'), t('taskCompleteWarning'));
      return;
    }
    if (
      maintenance?.useOperatingHours &&
      (maintenance.earliestProcessing || 0) > parseInt(operatingHours.toString()) + 0.1
    ) {
      toastr.warning(t('error'), t('taskCompleteWarning'));
      return;
    }
    if (
      maintenance?.useDistance &&
      (maintenance.earliestProcessing || 0) > parseInt(distance.toString()) + 0.1
    ) {
      toastr.warning(t('error'), t('taskCompleteWarning'));
      return;
    }
    if (
      maintenance?.useStrokes &&
      (maintenance.earliestProcessing || 0) > parseInt(strokes.toString()) + 0.1
    ) {
      toastr.warning(t('error'), t('taskCompleteWarning'));
      return;
    }

    if (task.completed) {
      const newTask = {
        ...task,
        completed: false,
        completedDate: undefined,
      };
      delete newTask.comments;
      dispatch(updateTask(newTask.id, newTask));
      dispatch(loadMaintenance(match.params.id));
    } else {
      setTaskToConfirm(task);
    }
  };

  return (
    <div>
      <div className={classNames(common.table.header, common.table.small, 'd-flex')}>
        <Button
          variant="square"
          color="transparent"
          className="mr-3"
          onClick={history.goBack}
          style={{ marginLeft: -10 }}
        >
          <span className={common.icon.backarrow} />
        </Button>
        <TruncateText width="50%" className={classNames(common.table.title, 'd-inline-block')}>
          {maintenance?.title}
        </TruncateText>
        <div className="d-flex flex-fill justify-content-end">
          <RoleGuard roles={['admin', 'manager']}>
            <Button
              variant="square"
              color="dark"
              className="mr-2"
              onClick={() =>
                dispatch(showModal({ open: true, role: 'copy' }, CREATE_EDIT_MAINTENANCE))
              }
            >
              <span className={common.icon.copy} />
            </Button>
          </RoleGuard>
          {maintenance?.completed ? (
            <span className={common.icon.lock} />
          ) : (
            <>
              <Button
                variant="square"
                color="black"
                onClick={() =>
                  dispatch(showModal({ open: true, role: 'edit' }, CREATE_EDIT_MAINTENANCE))
                }
              >
                <span className={common.icon.edit} />
              </Button>
              <Button
                variant="square"
                color="red"
                className="ml-2"
                onClick={() => setIsDelete(true)}
              >
                <span className={common.icon.trash} />
              </Button>
              <Button
                variant="common"
                className="ml-2"
                disabled={!canComplete}
                onClick={() => dispatch(showModal({ open: true }, COMPLETE_MAINTENANCE))}
              >
                {t('markAsDone')}
              </Button>
            </>
          )}
        </div>
      </div>
      <table className="w-100">
        <thead>
          <tr>
            <td className="p-0 w-25" />
            <td className="p-0 w-25" />
            <td className="p-0 w-25" />
            <td className="p-0 w-25" />
          </tr>
        </thead>
        <tbody className={common.table.body}>
          <tr>
            <td>
              <strong>{t('status')}</strong>
            </td>
            <td colSpan={3}>
              <span
                className={maintenance ? `status-${mapColorByStatus[maintenance?.status]}` : ''}
              >
                {maintenance ? t(maintenance.status) : '-'}
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <strong>{t('dueDate')}</strong>
            </td>
            <td>{maintenance?.dueDate ? format.date(maintenance.dueDate) : '-'}</td>
            <td>
              <strong>{t('category')}</strong>
            </td>
            <td>{maintenance?.category || '-'}</td>
          </tr>
          <tr>
            <td>
              <strong>{t('earliestExecution')}</strong>
            </td>
            <td>
              {maintenance?.useOperatingHours
                ? `${t('after')} ${maintenance?.earliestProcessing} ${t('hours')}` || '-'
                : maintenance?.useDistance ? `${t('after')} ${maintenance?.earliestProcessing} ${t('km')}` || '-' 
                : maintenance?.useStrokes ? `${t('after')} ${maintenance?.earliestProcessing} ${t('strokes')}` || '-' 
                : maintenance?.earliestExecTime ? format.date(maintenance.earliestExecTime) : '-'}
            </td>
            <td>
              <strong>{t('responsible')}</strong>
            </td>
            <td>{maintenance?.responsible || '-'}</td>
          </tr>
          <tr>
            <td>
              <strong>{t('repeatInterval')}</strong>
            </td>
            <td>
              {maintenance?.intervalUnit && maintenance.intervalUnit > 0
                ? `
                    ${
                      maintenance.interval > 1
                        ? ` ${t('every')} ${maintenance.interval} ${t(
                            intervalLabels[maintenance.intervalUnit],
                          )}`
                        : `${t('everySingular')} ${t(
                            intervalLabelsSingular[maintenance.intervalUnit],
                          )}`
                    }`
                : '-'}
            </td>
            <td>
              <strong>{t('actuallySpendTime')}</strong>
            </td>
            <td>
              {maintenance?.actuallySpendTime ? (
                <div
                  className={
                    maintenance.actuallySpendTime && maintenance.plannedTime
                      ? classNames(
                          maintenance.actuallySpendTime / maintenance.plannedTime >= 0.8
                            ? 'status-yellow'
                            : null,
                          maintenance.actuallySpendTime / maintenance.plannedTime >= 1
                            ? 'status-red'
                            : null,
                        )
                      : undefined
                  }
                >
                  <TargetTime displayLabel={true} seconds={maintenance.actuallySpendTime} />
                </div>
              ) : (
                '-'
              )}
            </td>
          </tr>
          <tr>
            <td>
              <RoleGuard roles={['admin']}>
                <strong>{t('targetTime')}</strong>
              </RoleGuard>
            </td>
            <td>
              <RoleGuard roles={['admin']}>
                {maintenance?.plannedTime ? (
                  <TargetTime displayLabel={true} seconds={maintenance.plannedTime} />
                ) : (
                  '-'
                )}
              </RoleGuard>
            </td>
            <td>
              <strong>
                {t('internal')}/{t('external')}
              </strong>
            </td>
            <td>
              {maintenance?.isInternal ? (
                t('internal')
              ) : (
                <>
                  <span className={classNames(common.icon.external)} />
                  <span> {t('external')}</span>
                </>
              )}
            </td>
          </tr>
          {maintenance?.completed && maintenance.completedAt ? (
            <>
              <tr>
                <td>
                  {' '}
                  <strong>{t('completed')}</strong>
                </td>
                <td>{format.datetime(maintenance.completedAt || '0')}</td>
                <td>
                  {' '}
                  <strong>{t('completedBy')}</strong>
                </td>
                <td>{maintenance.comment?.responsible}</td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <strong>{t('comment')}</strong>
                </td>
                <td colSpan={3}>{maintenance.comment?.comment}</td>
              </tr>
            </>
          ) : null}
          <tr>
            <td colSpan={4}>
              <strong>{t('description')}</strong>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>{maintenance?.description || '-'}</td>
            <td
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {' '}
              <Button variant="square" className="p-2" color="transparent">
                <span className={common.icon.info} onClick={() => openAssetInfo()} />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      {tasks.map((task, index) => (
        <div
          key={'task-item-' + index}
          className={classNames('w-100', index > 0 ? 'mt-3' : 'mt-4')}
        >
          <div
            className={classNames(
              common.table.header,
              common.table.small,
              'd-flex align-items-center',
            )}
          >
            <CheckBox
              className="mr-3"
              checked={task.completed}
              disabled={maintenance?.completed}
              onChange={() => toggleComplete(task)}
            />
            <span className={classNames(common.table.title, 'mr-4')}>{t('task')}</span>
            <TruncateText width="75%">{task.name}</TruncateText>
          </div>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #DBDBDB',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 0',
            }}
          >
            <div style={{ display: 'flex', margin: '12px 0' }}>
              <div className={classNames(common.table.narrowrow)}>
                <strong>{t('responsible')}</strong>
              </div>
              <div className={classNames(common.table.narrowrow)}>{task.responsible}</div>
              <div className={classNames(common.table.narrowrow)}>
                <strong>
                  {t(internalExternal[1])}/{t(internalExternal[0])}
                </strong>
              </div>
              <div className={classNames(common.table.narrowrow)}>
                {t(internalExternal[Number(task.isInternal)])}
              </div>
              <RoleGuard roles={['admin']}>
                <div className={classNames(common.table.narrowrow)}>
                  <strong>{t('targetTime')}</strong>
                </div>
                <div className={classNames(common.table.narrowrow)}>
                  <TargetTime seconds={task.targetTime * task.timeUnit} />
                </div>
              </RoleGuard>
              <RoleGuard roles={['admin']} not>
                <div className={classNames(common.table.narrowrow)} />
              </RoleGuard>
            </div>
            <div style={{ display: 'flex', margin: '12px 0' }}>
              <div
                style={{
                  flex: '0 0 150px',
                  padding: '3px 32px',
                  color: '#403F3F',
                  fontSize: '14px',
                }}
              >
                <strong>{t('documents')}</strong>
              </div>
              <div
                style={{
                  flex: '1',
                  padding: '3px 32px',
                  color: '#403F3F',
                  fontSize: '14px',
                }}
              >
                {task.documents.map(document => (
                  <span
                    onClick={() => viewDocument(document)}
                    key={`maintenance-detail-task-document-${document.id}`}
                    className="comma-separated"
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="text-underline">{document.title}</span>
                  </span>
                ))}
                {task.documents.length === 0 && '-'}
              </div>
            </div>
            {(task.comments && task.comments.length && (
              <div style={{ display: 'flex', margin: '12px 0' }}>
                <span
                  style={{
                    flex: '0 0 150px',
                    padding: '3px 32px',
                    color: '#403F3F',
                    fontSize: '14px',
                  }}
                >
                  <strong>{t('comment')}</strong>
                </span>
                <span
                  style={{
                    wordBreak: 'break-all',
                    flex: '1',
                    padding: '3px 32px',
                    fontSize: '14px',
                  }}
                >
                  {task.comments[0].comment}
                </span>
              </div>
            )) ||
              null}
          </div>
        </div>
      ))}

      <table className="mt-4 w-100">
        <thead className={classNames(common.table.header, common.table.small)}>
          <tr>
            <td className={common.table.title} style={{ width: 300 }}>
              {t('documents')}
            </td>
            <td>{t('type')}</td>
            <td />
          </tr>
        </thead>
        <tbody className={classNames(common.table.body, common.table.small)}>
          {maintenance && maintenance.documents && maintenance.documents.length > 0 ? (
            maintenance.documents.map(document => (
              <tr key={document.id}>
                <td style={{ cursor: 'pointer' }} valign="middle">
                  <TruncateText width={200} onClick={() => viewDocument(document as Document)}>
                    {document.title}
                  </TruncateText>
                </td>
                <td valign="middle">
                  <span className="text-uppercase">{document.ext}</span>
                </td>
                <td valign="middle">
                  <div className="d-flex flex-fill justify-content-end">
                    <a
                      href={getFileUrl(getFileId(document as Document))}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="square" color="dark">
                        <span className={common.icon.download} />
                      </Button>
                    </a>
                    {!maintenance?.completed && (
                      <Button
                        variant="square"
                        color="red"
                        className="ml-2"
                        onClick={() => onDeleteDocument(document as Document)}
                      >
                        <span className={common.icon.trash} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No documents have been added to this maintenance.</td>
            </tr>
          )}
        </tbody>
      </table>

      <CompleteTask
        task={taskToConfirm}
        open={!!taskToConfirm}
        onRequestClose={() => setTaskToConfirm(null)}
      />
      <Confirm
        onAccept={onDeleteAccept}
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        iconClass={common.icon.redtrash}
        message="Wollen Sie „Wartungsplan 1“ wirklich unwiderruflich löschen?"
      />
      {isPDFOpen && (
        <PdfViewer isOpen onRequestClose={() => setIsPDFOpen(false)} fileUrl={fileUrl} />
      )}
      {!!videoUrl && (
        <ViewVideo url={videoUrl || ''} isOpen onRequestClose={() => setVideoUrl(undefined)} />
      )}
      <AssetInformation open={isAssetInfoOpen} onRequestClose={() => setAssetInfoOpen(false)} />
    </div>
  );
};

export default MaintenanceDetail;
