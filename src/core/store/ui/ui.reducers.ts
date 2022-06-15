import { Action, Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { TOGGLE_SIDEBAR } from '../action-types';

export interface UIState {
  sidebarOpened: boolean;
}

export interface UIAction extends Action {
  payload: {
    sidebarOpened: boolean;
  };
}

export const initialState: UIState = { sidebarOpened: JSON.parse(localStorage.getItem('sidebarState') || 'true') };

export const uiReducer: Reducer<UIState, UIAction> = handleActions(
  {
    [TOGGLE_SIDEBAR]: (state: UIState) => ({
      ...state,
      sidebarOpened: !state.sidebarOpened,
    }),
  },
  initialState,
);
