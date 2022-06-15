import { createSelector } from 'reselect';

import { HubState } from './hub.reducers';
import { AppState } from '..';
import { TileConfiguration } from '../../models';

export const selectTileConfigurations = createSelector<AppState, HubState, TileConfiguration[]>(
  (state) => state.hubModule,
  (hubModule) => hubModule.tileConfigurations,
);
