import { Dispatch } from 'redux';

import { TOGGLE_SIDEBAR } from '../action-types';
import { AppState } from '..';

export const toggleSidebar = (dispatch: Dispatch, getState: () => AppState) => {
  localStorage.setItem('sidebarState', JSON.stringify(!getState().uiModule.sidebarOpened));
  dispatch({ type: TOGGLE_SIDEBAR });
};
