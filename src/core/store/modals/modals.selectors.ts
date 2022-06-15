import { createSelector } from 'reselect';

import { AppState } from '..';
import { ModalProps as ModalProperties, ModalsState } from './modals.reducer';

export const selectModalProperties = createSelector<
AppState,
ModalsState,
ModalProperties | undefined
>(
  (state) => state.modalModule,
  (modalModule) => modalModule.modalProps,
);

export const selectModalType = createSelector<AppState, ModalsState, string | null>(
  (state) => state.modalModule,
  (modalModule) => modalModule.modalType,
);
