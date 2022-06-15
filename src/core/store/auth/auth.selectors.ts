import { createSelector } from 'reselect';

import { User } from '../../models';
import { AuthState } from './auth.reducers';
import { AppState } from '..';

export const selectUser = createSelector<AppState, AuthState, User>(
  (state) => state.authModule,
  (authModule) => authModule.user,
);

export const selectLoggedIn = createSelector<AppState, AuthState, boolean>(
  (state) => state.authModule,
  (authModule) => authModule.loggedIn,
);
