import { createSelector } from 'reselect';

import { DocumentState } from './document.reducers';
import { Document } from '../../models';
import { AppState } from '..';

export const selectDocuments = createSelector<AppState, DocumentState, Document[]>(
  (state) => state.documentModule,
  (documentModule) => documentModule.documents,
);

export const selectSummarize = createSelector<AppState, DocumentState, {
  assets: { assetId: string; count: string }[];
  maintenances: { title: string; maintenanceId: string; count: string}[];
  tasks: { name: string; taskId: string; count: string }[];
}>(
  (state) => state.documentModule,
  (documentModule) => documentModule.summarize,
);
