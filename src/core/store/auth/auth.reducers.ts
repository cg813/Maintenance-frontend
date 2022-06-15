import { Action, Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { User } from '../../models';
import { AUTH_LOGIN, AUTH_LOGOUT } from '../action-types';

export interface AuthState {
  user: User;
  loggedIn: boolean;
}

interface AuthAction extends Action {
  payload: {
    user: User;
    loggedIn: boolean;
  };
}

export const initialState: AuthState = {
  user: {
    role: localStorage.getItem('role') || 'admin',
    username: localStorage.getItem('username') || 'administrator',
  },
  // loggedIn: !!localStorage.getItem('username'),
  loggedIn: true,
};

export const authReducer: Reducer<AuthState, AuthAction> = handleActions(
  {
    [AUTH_LOGIN]: (state: AuthState, { payload: { user } }: AuthAction) => ({
      ...state,
      user,
      loggedIn: true,
    }),
    [AUTH_LOGOUT]: () => ({
      user: {
        role: '',
        username: '',
      },
      loggedIn: false,
    }),
  },
  initialState,
);
