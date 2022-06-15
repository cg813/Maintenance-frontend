import React, { FC } from 'react';
import ReactModal, { Props as ReactModalProperties } from 'react-modal';
import { Document, Page } from 'react-pdf';
import classNames from 'classnames';

import common from '../../../styles/common';
import { Button } from '../../atomic';

interface Props extends ReactModalProperties {
  fileUrl: string | File;
}

const PdfViewer: FC<Props> = ({ fileUrl, ...props }) => (
  <ReactModal {...props}>
    <div className={classNames(common.modal.header, 'justify-content-end border-0 mb-0 pb-0')}>
      <Button
        variant='square'
        color='transparent'
        onClick={props.onRequestClose}
        className={common.modal.close}
      >
        <span className={common.icon.greycross} />
      </Button>
    </div>
    <div className={common.modal.body}>
      <Document file={fileUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  </ReactModal>
);

export default PdfViewer;
