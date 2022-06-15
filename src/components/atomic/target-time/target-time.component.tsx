import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import * as format from '../../../core/utils/format';
import { TimeUnit } from '../../../core/models';

interface Props {
  seconds: number;
  displayLabel?: boolean;
}

const TargetTime: FC<Props> = ({ seconds, displayLabel }) => {
  const date = format.seconds(seconds);
  const { t } = useTranslation();
  return (
    <>
      {
        String(date[TimeUnit.days]).padStart(2, '0')
      }:{
        String(date[TimeUnit.hours]).padStart(2, '0')
      }:{
        String(date[TimeUnit.minutes]).padStart(2, '0')
      }
      {displayLabel && ' DD:HH:MM'}
    </>
  );
};

export default TargetTime;
