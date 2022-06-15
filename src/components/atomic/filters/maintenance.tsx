import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Dropdown from '../../core-ui/dropdown/dropdown.component';
import { Maintenance as MaintenanceModel } from '../../../core/models';
import DropdownItem from '../dropdown-item/dropdown-item.component';

interface Props {
  maintenanceId: string;
  summarize: { maintenanceId: string; count: string }[];
  setMaintenanceId: (maintenanceId: string) => void;
  maintenances: Partial<MaintenanceModel>[];
  className?: string;
}

const Maintenance: FC<Props> = ({
  maintenances,
  summarize,
  setMaintenanceId,
  maintenanceId,
  className,
}) => {
  const { t } = useTranslation();

  let label = t('all');

  if (maintenanceId) {
    const maintenance = maintenances.find((a) => a.id === maintenanceId);
    if (maintenance && maintenance.title) {
      label = maintenance.title;
    } else {
      label = maintenanceId;
    }
  }

  return (
    <Dropdown
      label={
        <div className='w-100 text-nowrap'>
          <strong>{t('maintenance')}:</strong> {label}
        </div>
      }
      className={className}
    >
      <DropdownItem selected={!maintenanceId} onClick={() => setMaintenanceId('')}>
        {t('all')}
      </DropdownItem>
      {maintenances.map((m) => (
        <DropdownItem
          key={m.id}
          selected={m.id === maintenanceId}
          disabled={!summarize?.find((sum) => sum.maintenanceId === m.id)}
          onClick={() => setMaintenanceId(m.id as string)}
        >
          {m.title}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};

export default Maintenance;
