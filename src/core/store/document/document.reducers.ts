import { Action, Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { Document } from '../../models';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_LOAD_ALL,
  DOCUMENT_UPDATE,
} from '../action-types';

export interface DocumentState {
  documents: Document[];
  summarize: {
    assets: { assetId: string; count: string }[];
    maintenances: { title: string; maintenanceId: string; count: string }[];
    tasks: { name: string; taskId: string; count: string }[];
  };
}

interface DocumentAction extends Action {
  payload: {
    documents: Document[];
    document: Document;
    id: string;
    assets: { assetId: string; count: string }[];
    maintenances: { title: string; maintenanceId: string; count: string }[];
    tasks: { name: string; taskId: string; count: string }[];
  };
}

export const initialState: DocumentState = {
  documents: [],
  summarize: {
    assets: [],
    maintenances: [],
    tasks: [],
  },
};

export const documentReducer: Reducer<DocumentState, DocumentAction> = handleActions(
  {
    [DOCUMENT_LOAD_ALL]: (state: DocumentState, {
      payload: {
        documents,
        assets,
        maintenances,
        tasks,
      },
    }: DocumentAction) => ({
      ...state,
      documents,
      summarize: {
        assets,
        maintenances,
        tasks,
      },
    }),
    [DOCUMENT_CREATE]: (state: DocumentState, { payload: { document } }: DocumentAction) => ({
      ...state,
      documents: [document, ...state.documents],
    }),
    [DOCUMENT_UPDATE]: (state: DocumentState, { payload: { document } }: DocumentAction) => ({
      ...state,
      documents: [
        ...(state.documents.splice(
          state.documents.findIndex(({ id }) => id === document.id),
          1,
          document,
        ) && state.documents),
      ],
    }),
    [DOCUMENT_DELETE]: (state: DocumentState, { payload: { id } }: DocumentAction) => ({
      ...state,
      documents:
        state.documents.splice(
          state.documents.findIndex((document) => document.id === id),
          1,
        ) && state.documents,
    }),
  },
  initialState,
);
