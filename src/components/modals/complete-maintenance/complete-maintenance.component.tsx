import React, { FC, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { COMPLETE_MAINTENANCE } from '../../../core/store/modals/modal-types';
import {
  selectModalProperties,
  selectModalType,
} from '../../../core/store/modals/modals.selectors';
import { hideModal } from '../../../core/store/modals/modals.actions';
import common from '../../../styles/common';
import { Button, TargetTime } from '../../atomic';
import { completeMaintenance } from '../../../core/store/maintenance/maintenance.actions';
import { selectMaintenance } from '../../../core/store/maintenance/maintenance.selectors';
import { Comment, Document, File as FFile, TimeUnit } from '../../../core/models';
import { UploadFile } from '../../core-ui';
import { selectCurrentAsset } from '../../../core/store/assets/assets.selectors';
import { saveOperatingHours } from '../../../core/services/assets.service';
import DocumentManager from '../document-manager/document-manager.component';
import { OPERATING_HOURS_PROP_KEY, DISTANCE_PROP_KEY, STROKES_PROP_KEY } from 'shared/common/models';

const CompleteMaintenance: FC = () => {
  const dispatch = useDispatch();
  const modalType = useSelector(selectModalType);
  const modalProperties = useSelector(selectModalProperties);
  const maintenance = useSelector(selectMaintenance);
  const currentAsset = useSelector(selectCurrentAsset);
  const [operatingHours, setOperatingHours] = useState<string>('');
  const [distance, setDistance] = useState<number>(0);
  const [strokes, setStrokes] = useState<number>(0);
  // const [files, setFiles] = useState<Array<File | FFile>>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAttachDocumentsOpened, setAttachDocumentsOpened] = useState<boolean>();
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.seconds);
  const { t } = useTranslation();

  const { register, handleSubmit } = useForm<Comment>();

  useEffect(() => {
    setOperatingHours(
      (currentAsset?.properties?.find(property => property.key === OPERATING_HOURS_PROP_KEY)
        ?.value as string) || '',
    );

    setDistance(
      (currentAsset?.properties?.find(property => property.key === DISTANCE_PROP_KEY)
        ?.value as number) || 0,
    );

    setStrokes(
      (currentAsset?.properties?.find(property => property.key === STROKES_PROP_KEY)
        ?.value as number) || 0,
    );
  }, [currentAsset]);

  const onSubmit = async (data: Comment) => {
    if (maintenance) {
      delete maintenance.files;

      if (currentAsset) {
        await saveOperatingHours(currentAsset.id, operatingHours);
      }

      dispatch(
        completeMaintenance(
          maintenance,
          {
            ...data,
            duration: maintenance.actuallySpendTime || 0,
            timeUnit,
            maintenance: { id: maintenance.id },
          },
          documents,
        ),
      );
      dispatch(hideModal);
    }
  };

  const updateMaintenanceDocuments = (newDocument: Document) =>
    setDocuments([...documents, newDocument]);

  const handleRemoveFile = (file: File | FFile, index: number) => {
    setDocuments([...(documents.splice(index, 1) && documents)]);
  };

  if (modalType !== COMPLETE_MAINTENANCE) {
    return null;
  }

  return (
    <>
      <ReactModal
        isOpen={!!modalProperties?.open}
        style={{ content: { width: 552 } }}
        onRequestClose={() => dispatch(hideModal)}
      >
        <div className={common.modal.header}>
          <div className={common.modal.title}>
            <span className={classNames(common.icon.repair, 'mr-3')} />
            {maintenance?.title} <span className="text-lowercase ml-1">{t('markAsDone')}</span>
          </div>
          <Button
            variant="square"
            color="transparent"
            className={common.modal.close}
            onClick={() => dispatch(hideModal)}
          >
            <span className={common.icon.greycross} />
          </Button>
        </div>
        <div className={common.modal.body} style={{ overflow: 'visible' }}>
          <div className="d-flex justify-content-between">
            <div>
              <div className={common.forms.w230}>
                <label className={common.forms.label}>{t('duration')}</label>
                <div className="d-flex justify-content-between">
                  <TargetTime displayLabel={true} seconds={maintenance?.actuallySpendTime || 0} />
                  {} {(maintenance?.actuallySpendTime || 0) < 86400}
                </div>
              </div>
              <div className="mt-3">
                <label className={common.forms.label}>{t('completedBy')}</label>
                <input
                  name="responsible"
                  className={classNames(common.forms.input, common.forms.w230)}
                  ref={register({ required: true })}
                />
              </div>
              <div className="mt-3">
                <label className={common.forms.label}>{t('operatingHours')}</label>
                <input
                  type="number"
                  className={classNames(common.forms.input, common.forms.w230)}
                  value={operatingHours}
                  onChange={event => setOperatingHours(event.target.value)}
                />
              </div>
            </div>
            <div className="d-flex flex-column">
              <label className={common.forms.label}>{t('comment')}</label>
              <textarea
                name="comment"
                className={classNames(common.forms.input, common.forms.w230, 'flex-fill')}
                ref={register}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button
              color="dark"
              className={common.forms.w230}
              onClick={() => setAttachDocumentsOpened(true)}
            >
              <span className={classNames(common.icon.plus, 'mr-3')} />
              {t('uploadFiles')}
            </Button>
          </div>
          <UploadFile.List files={documents} onDelete={handleRemoveFile} />
        </div>
        <div className={common.modal.footer}>
          <Button variant="square" color="transparent">
            <span className={common.icon.help} />
          </Button>
          <div className="d-flex align-items-center">
            <Button variant="link" width="auto" onClick={() => dispatch(hideModal)}>
              {t('cancel')}
            </Button>
            <Button
              className="ml-3 py-0 pl-3 pr-4 d-flex align-items-center"
              width="auto"
              onClick={handleSubmit(onSubmit)}
            >
              <span className={classNames(common.icon.check, 'mr-2')} />
              {t('complete')}
            </Button>
          </div>
        </div>
        <DocumentManager
          archived={true}
          isOpen={!!isAttachDocumentsOpened}
          onUpdate={updateMaintenanceDocuments}
          onRequestClose={() => setAttachDocumentsOpened(undefined)}
        />
      </ReactModal>
    </>
  );
};

export default CompleteMaintenance;
