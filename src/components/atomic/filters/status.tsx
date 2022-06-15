import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Dropdown from '../../core-ui/dropdown/dropdown.component';
import { statuses } from '../../../core/utils/constants';
import DropdownItem from '../dropdown-item/dropdown-item.component';

interface Props {
  status: string;
  summarize: { status: string; count: string }[];
  setStatus: (status: string) => void;
  className?: string;
}

const Status: FC<Props> = ({ status, summarize, setStatus, className }) => {
  const { t } = useTranslation();

  return (
    <Dropdown
      label={
        <>
          <strong>{t('status')}:</strong> {status ? statuses[status] : t('all')}
        </>
      }
      className={className}
    >
      <DropdownItem selected={!status} onClick={() => setStatus('')}>
        {t('all')}
      </DropdownItem>
      {Object.entries(statuses).map(([s]) => (
        <DropdownItem
          key={s}
          selected={s === status}
          disabled={!summarize?.find((sum) => sum.status === s)}
          onClick={() => setStatus(s)}
        >
          {t(s)}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};

export default Status;
