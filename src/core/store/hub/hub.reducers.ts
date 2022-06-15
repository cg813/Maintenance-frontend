import { Action, Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { TileConfiguration } from '../../models';
import {
  HUB_TILES_LOAD
} from '../action-types';

export interface HubState {
  tileConfigurations: TileConfiguration[];
}

interface HubAction extends Action {
  payload: {
    tileConfigurations: TileConfiguration[];
  };
}

const initialState: HubState = {
  tileConfigurations: []
};

export const hubReducer: Reducer<HubState, HubAction> = handleActions(
  {
    [HUB_TILES_LOAD]: (
      state: HubState,
      { payload: { tileConfigurations } }: HubAction,
    ) => ({ ...state, tileConfigurations })
  },
  initialState,
);
