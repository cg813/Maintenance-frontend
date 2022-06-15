import { createSelector } from 'reselect';

import { MaintenanceState } from './maintenance.reducers';
import { MachinesStatuses, Maintenance } from '../../models';
import { AppState } from '..';

const formatDates = (maintenance: Maintenance): Maintenance => {
  if (maintenance.dueDate) {
    // eslint-disable-next-line no-param-reassign
    maintenance.dueDate = new Date(maintenance.dueDate);
  }
  if (maintenance.earliestExecTime) {
    // eslint-disable-next-line no-param-reassign
    maintenance.earliestExecTime = new Date(maintenance.earliestExecTime);
  }
  return maintenance;
};

export const selectMaintenances = createSelector<AppState, MaintenanceState, Maintenance[]>(
  (state) => state.maintenanceModule,
  (maintenanceModule) => maintenanceModule.maintenances.map(formatDates),
);

export const selectMaintenance = createSelector<
AppState,
MaintenanceState,
Maintenance | undefined
>(
  (state) => state.maintenanceModule,
  (maintenanceModule) => maintenanceModule.maintenance && formatDates(maintenanceModule.maintenance),
);

export const selectSummarize = createSelector<
AppState,
MaintenanceState,
{
  statuses: { status: string; count: string }[];
  assets: { assetId: string; count: string }[];
  responsible: { responsible: string; count: string }[];
}
>(
  (state) => state.maintenanceModule,
  (maintenanceModule) => maintenanceModule.summarize,
);

export const selectStatuses = createSelector<
AppState,
MaintenanceState,
MachinesStatuses[] | undefined
>(
  (state) => state.maintenanceModule,
  (maintenanceModule) => maintenanceModule.statuses,
);
