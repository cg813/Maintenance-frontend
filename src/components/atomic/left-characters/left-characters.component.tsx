import React, { CSSProperties, FC } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import styles from './left-characters.module.scss';

interface Props {
  total: number;
  entered: number;
  className?: string;
  style?: CSSProperties;
}

const LeftCharacters: FC<Props> = ({ total, entered, className, style }) => {
  const { t } = useTranslation();
  return (
    (entered / total >= 0.8 || total < 5) ? (
      <span className={classNames(styles.left, entered > total && styles.error, className)} style={style}>
        { entered > total ? `${t('limit')} ${total} ${t('reached')}` : `${t('left')} ${total - entered} ${t('characters')}` }
      </span>
    ) : null
  );
};

export default LeftCharacters;
