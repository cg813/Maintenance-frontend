import React, { FC } from 'react';
import ReactModal, { Props as ReactModalProperties } from 'react-modal';

interface Props extends ReactModalProperties {
  url: string;
}

const ViewVideo: FC<Props> = ({ url, ...props }) => (
  <ReactModal {...props} style={{ content: { background: 'transparent', border: 'none' } }}>
    <video controls width={700}>
      <source src={url}/>
    </video>
  </ReactModal>
);

export default ViewVideo;
