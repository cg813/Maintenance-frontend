import { Dispatch } from 'redux';

import { AUTH_LOGIN, AUTH_LOGOUT } from '../action-types';
import errorHandler from '../errorHandler';

const roles: { [key: string]: 'operator'|'manager'|'admin' } = {
  operator: 'operator',
  manager: 'manager',
  administrator: 'admin',
};

export const login = (username: string, password: string) => async (dispatch: Dispatch) => {
  try {
    if (
      !Object.keys(roles).includes(username)
      || password !== 'schuler'
    ) {
      throw new Error('wrong credentials');
    }

    localStorage.setItem('username', username);
    localStorage.setItem('role', roles[username]);

    dispatch({
      type: AUTH_LOGIN,
      payload: {
        user: {
          username,
          role: roles[username],
        },
      },
    });
  } catch (error) {
    errorHandler(error, AUTH_LOGIN);
  }
};

export const logout = (dispatch: Dispatch) => {
  localStorage.removeItem('username');
  localStorage.removeItem('role');

  dispatch({ type: AUTH_LOGOUT });
};
