import React, { FC } from 'react';

import styles from './loading.module.scss';

const Loading: FC = () => (
  <div className={styles.loading}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default Loading;
