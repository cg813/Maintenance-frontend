import { Action, Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { HIDE_MODAL, SHOW_MODAL } from '../action-types';

export interface ModalProps {
  open: boolean;
  role?: 'create'|'edit'|'copy';
}

export interface ModalsState {
  modalType: string | null;
  modalProps: ModalProps;
}

export interface ModalsAction extends Action {
  payload: {
    modalType: string;
    modalProps: ModalProps;
  };
}

const initialState: ModalsState = { modalType: null, modalProps: { open: false } };

export const modalsReducer: Reducer<ModalsState, ModalsAction> = handleActions(
  {
    [SHOW_MODAL]: (state: ModalsState, { payload: { modalProps, modalType } }: ModalsAction) => ({
      modalProps,
      modalType,
    }),
    [HIDE_MODAL]: () => initialState,
  },
  initialState,
);
