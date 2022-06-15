import { createSelector } from 'reselect';

import { UIState } from './ui.reducers';
import { AppState } from '..';

export const selectSidebarState = createSelector<AppState, UIState, boolean>(
  (state) => state.uiModule,
  (uiModule) => uiModule.sidebarOpened,
);
