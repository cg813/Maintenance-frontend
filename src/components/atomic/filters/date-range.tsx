import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import common from '../../../styles/common';
import * as format from '../../../core/utils/format';
import Button from '../button/button.component';
import Datepicker from '../datepicker/datepicker.component';

interface Props {
  startDate: Date | null;
  endDate: Date | null;
  setDate: (date: Date) => void;
  clearDates: () => void;
  className?: string;
}

const DateRange: FC<Props> = ({
  startDate,
  endDate,
  setDate = () => null,
  clearDates = () => null,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={classNames('d-flex align-items-center', className)}>
      {startDate || endDate ? (
        <Button variant='square' color='red' onClick={() => clearDates()}>
          <span className={common.icon.cross} />
        </Button>
      ) : null}
      <Datepicker onChange={setDate} selected={startDate} startDate={startDate} endDate={endDate}>
        <strong>{t('due')}: </strong>
        {!startDate && !endDate ? (
          t('dateFilter')
        ) : (
          <>
            {startDate && format.date(startDate)} - {endDate && format.date(endDate)}
          </>
        )}
      </Datepicker>
    </div>
  );
};

export default DateRange;
