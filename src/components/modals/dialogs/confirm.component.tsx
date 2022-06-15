import React, { FC } from 'react';
import ReactModal, { Props as ReactModalProperties } from 'react-modal';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import common from '../../../styles/common';
import { Button } from '../../atomic';

interface Props extends ReactModalProperties {
  onAccept: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  message: string;
  iconClass?: string;
}

const Confirm: FC<Props> = ({ onAccept, message, iconClass, ...props }) => {
  const { t } = useTranslation();

  return (
    <ReactModal style={{ content: { width: 544 } }} {...props}>
      <div className={classNames(common.modal.header, 'justify-content-end border-0 mb-0 pb-0')}>
        <Button variant='square' color='transparent' onClick={props.onRequestClose} className={common.modal.close}>
          <span className={common.icon.greycross} />
        </Button>
      </div>

      <div className={classNames(common.modal.body, 'd-flex flex-column align-items-center')}>
        { iconClass && <span className={iconClass} /> }
        <div style={{ width: 260 }} className='mt-3 mb-4 text-center'>
          {message}
        </div>
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
            onClick={onAccept}
          >
            <span className={classNames(common.icon.check, 'mr-2')} />
            {t('confirm')}
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};

export default Confirm;
