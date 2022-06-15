import React, { FC } from 'react';
import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import common from '../../../styles/common';
import { Button } from '../../atomic';
import { selectCurrentAsset } from '../../../core/store/assets/assets.selectors';
import styles from './asset-information.module.scss';
import { OPERATING_HOURS_PROP_KEY, DISTANCE_PROP_KEY, STROKES_PROP_KEY } from 'shared/common/models';

interface Props {
  open: boolean;
  onRequestClose: () => void;
}

const AssetInformation: FC<Props> = ({ open, onRequestClose }) => {
  const currentAsset = useSelector(selectCurrentAsset);
  const { t } = useTranslation();
  return (
    <ReactModal isOpen={open} style={{ content: { width: 552 } }} onRequestClose={onRequestClose}>
      <div className={common.modal.header}>
        <div className={common.modal.title}>{currentAsset?.name.en_EN}</div>
        <Button
          variant="square"
          color="transparent"
          className={common.modal.close}
          onClick={onRequestClose}
        >
          <span className={common.icon.greycross} />
        </Button>
      </div>

      <div className={common.modal.body}>
        <div className={classNames(styles.property)}>
          <span className={classNames(styles.propname)}>{t('telTec')}</span>
          <span className={classNames(styles.propvalue)}>
            {currentAsset?.properties?.find(property => property.key === 'wm-service-phone')?.value}
          </span>
        </div>
        <div className={classNames(styles.property)}>
          <span className={classNames(styles.propname)}>{t('emailTect')}</span>
          <span className={classNames(styles.propvalue)}>
            {currentAsset?.properties?.find(property => property.key === 'wm-service-email')?.value}
          </span>
        </div>
        <div className={classNames(styles.property)}>
          <span className={classNames(styles.propname)}>{t('operatingHours')}</span>
          <span className={classNames(styles.propvalue)}>
            {
              currentAsset?.properties?.find(property => property.key === OPERATING_HOURS_PROP_KEY)
                ?.value
            }
          </span>
        </div>
        <div className={classNames(styles.property)}>
          <span className={classNames(styles.propname)}>{t('distance')}</span>
          <span className={classNames(styles.propvalue)}>
            {
              currentAsset?.properties?.find(property => property.key === DISTANCE_PROP_KEY)
                ?.value
            }
          </span>
        </div>
        <div className={classNames(styles.property)}>
          <span className={classNames(styles.propname)}>{t('strokes')}</span>
          <span className={classNames(styles.propvalue)}>
            {
              currentAsset?.properties?.find(property => property.key === STROKES_PROP_KEY)
                ?.value
            }
          </span>
        </div>
        <div className={classNames(styles.property)}>
          <span className={classNames(styles.propname)}>{t('costCenter')}</span>
          <span className={classNames(styles.propvalue)}>
            {currentAsset?.properties?.find(property => property.key === 'wm-cost-center')?.value}
          </span>
        </div>
        <div className={classNames(styles.property)}>
          <span className={classNames(styles.propname)}>{t('sapWorkplace')}</span>
          <span className={classNames(styles.propvalue)}>
            {currentAsset?.properties?.find(property => property.key === 'wm-sap-workplace')?.value}
          </span>
        </div>
        <div className={classNames(styles.property)}>
          <span className={classNames(styles.propname)}>{t('warrantyPeroid')}</span>
          <span className={classNames(styles.propvalue)}>
            {
              currentAsset?.properties?.find(property => property.key === 'wm-warranty-period')
                ?.value
            }
          </span>
        </div>
      </div>

      <div className={common.modal.footer}>
        <Button
          className={classNames(styles.closebutton)}
          variant="common"
          width="auto"
          onClick={onRequestClose}
        >
          {t('close')}
        </Button>
      </div>
    </ReactModal>
  );
};

export default AssetInformation;
