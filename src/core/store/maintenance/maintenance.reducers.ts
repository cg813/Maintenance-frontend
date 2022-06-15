import { Action, Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { MachinesStatuses, Maintenance } from '../../models';
import {
  MAINTENANCE_CLEAR_FROM_STORE,
  MAINTENANCE_CREATE,
  MAINTENANCE_DELETE,
  MAINTENANCE_LOAD_FROM_MACHINE,
  MAINTENANCE_LOAD_SPECIFIC,
  MAINTENANCE_STATUSES,
  MAINTENANCE_UPDATE,
} from '../action-types';

export interface MaintenanceState {
  maintenances: Maintenance[];
  maintenance?: Maintenance;
  statuses?: MachinesStatuses[];
  summarize: {
    statuses: { status: string; count: string }[];
    assets: { assetId: string; count: string }[];
    responsible: { responsible: string; count: string }[];
  };
}

interface MaintenanceAction extends Action {
  payload: {
    maintenances: Maintenance[];
    maintenance: Maintenance;
    maintenanceId: string;
    statuses: MachinesStatuses[];
    summarize: {
      statuses: { status: string; count: string }[];
      assets: { assetId: string; count: string }[];
      responsible: { responsible: string; count: string }[];
    };
  };
}

const initialState: MaintenanceState = {
  maintenances: [],
  summarize: {
    assets: [],
    responsible: [],
    statuses: [],
  },
};

export const maintenanceReducer: Reducer<MaintenanceState, MaintenanceAction> = handleActions(
  {
    [MAINTENANCE_LOAD_FROM_MACHINE]: (
      state: MaintenanceState,
      { payload: { maintenances, summarize } }: MaintenanceAction,
    ) => ({ ...state, maintenances, summarize }),
    [MAINTENANCE_LOAD_SPECIFIC]: (
      state: MaintenanceState,
      { payload: { maintenance } }: MaintenanceAction,
    ) => ({ ...state, maintenance }),
    [MAINTENANCE_CREATE]: (
      state: MaintenanceState,
      { payload: { maintenance } }: MaintenanceAction,
    ) => ({ ...state, maintenance }),
    [MAINTENANCE_UPDATE]: (
      state: MaintenanceState,
      { payload: { maintenance } }: MaintenanceAction,
    ) => ({ ...state, maintenance }),
    [MAINTENANCE_DELETE]: (
      state: MaintenanceState,
      { payload: { maintenanceId } }: MaintenanceAction,
    ) => ({
      ...state,
      maintenances: [
        ...(state.maintenances.splice(
          state.maintenances.findIndex((m) => m.id === maintenanceId),
          1,
        ) && state.maintenances),
      ],
    }),
    [MAINTENANCE_STATUSES]: (
      state: MaintenanceState,
      { payload: { statuses } }: MaintenanceAction,
    ) => ({ ...state, statuses }),
    [MAINTENANCE_CLEAR_FROM_STORE]: (state: MaintenanceState) => ({
      ...state,
      maintenance: undefined,
    }),
  },
  initialState,
);
