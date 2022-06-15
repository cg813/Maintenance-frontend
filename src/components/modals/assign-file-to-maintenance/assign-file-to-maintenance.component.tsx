import React, { FC, useEffect, useState } from 'react';
import ReactModal, { Props as ReactModalProperties } from 'react-modal';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import common from '../../../styles/common';
import { Button } from '../../atomic';
import { Document } from '../../../core/models';
import DocumentManager from '../document-manager/document-manager.component';
import Documents from '../../pages/documents/documents.component';

interface Props extends ReactModalProperties {
  archived?: boolean;
  onAccept: (documents: Partial<Document>[]) => void;
  initialDocuments: Partial<Document>[];
}

const AssignFileToMaintenance: FC<Props> = ({
  archived,
  onAccept,
  initialDocuments,
  ...props
}) => {
  const { t } = useTranslation();

  const [selectedDocuments, setSelectedDocuments] = useState<Partial<Document>[]>(initialDocuments);
  // const [isDocumentManagerOpened, setDocumentManagerOpened] = useState<boolean>(false);

  useEffect(() => {
    setSelectedDocuments(initialDocuments);
  }, [initialDocuments]);

  return (
    <>
      <ReactModal {...props} style={{ content: { width: 1124 } }}>
        <div className={classNames(common.modal.header, 'justify-content-between mb-0')}>
          <div className={common.modal.title}>
            <span className={classNames(common.icon.repair, 'mr-3')} />
            {t('addExistingDocument')}
          </div>
          <Button
            variant='square'
            color='transparent'
            className={common.modal.close}
            onClick={props.onRequestClose}
          >
            <span className={common.icon.greycross} />
          </Button>
        </div>
        <div className={classNames(common.modal.body)}>
          <Documents
            role='modal'
            archived={archived}
            selectedDocuments={selectedDocuments}
            setSelectedDocuments={setSelectedDocuments}
          />
        </div>
        <div className={common.modal.footer}>
          <Button variant='square' color='transparent'>
            <span className={common.icon.help} />
          </Button>
          <div className='d-flex align-items-center'>
            <Button variant='link' width='auto' onClick={props.onRequestClose}>
              {t('cancel')}
            </Button>
            <Button
              className='ml-3 py-0 pl-3 pr-4 d-flex align-items-center'
              width='auto'
              onClick={() => onAccept(selectedDocuments.filter((document, index) => (
                selectedDocuments.findIndex(({ id }) => id === document.id) === index
              )))}
            >
              <span className={classNames(common.icon.check, 'mr-2')} />
              {t('save')}
            </Button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default AssignFileToMaintenance;
