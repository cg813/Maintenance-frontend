import { Dispatch } from 'redux';

import { HIDE_MODAL, SHOW_MODAL } from '../action-types';
import { ModalProps as ModalProperties } from './modals.reducer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showModal = (modalProperties: ModalProperties, modalType: string | null): any => (
  dispatch: Dispatch,
) => dispatch({
  type: SHOW_MODAL,
  payload: {
    modalProps: modalProperties,
    modalType,
  },
});

export const hideModal = (dispatch: Dispatch) => dispatch({ type: HIDE_MODAL });
