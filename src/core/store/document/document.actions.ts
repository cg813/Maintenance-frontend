import { Dispatch } from 'redux';

import { Document, Filters } from '../../models';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_LOAD_ALL,
  DOCUMENT_UPDATE,
} from '../action-types';
import * as documentService from '../../services/document.service';
import * as fileService from '../../services/file.service';
import errorHandler from '../errorHandler';
import { formatDocumentsRelations } from '../../services/document.service';

export const loadDocuments = (filters?: Filters) => async (dispatch: Dispatch) => {
  try {
    const { documents, assets, maintenances, tasks } = await documentService.loadDocuments(filters);

    dispatch({
      type: DOCUMENT_LOAD_ALL,
      payload: {
        documents: documents.map(formatDocumentsRelations),
        assets,
        maintenances,
        tasks,
      },
    });
  } catch (error) {
    errorHandler(error, DOCUMENT_LOAD_ALL);
  }
};

export const createDocument = (data: Partial<Document>) => async (dispatch: Dispatch) => {
  try {
    const document: Document = await documentService.createDocument(data);

    dispatch({
      type: DOCUMENT_CREATE,
      payload: { document },
    });

    return document;
  } catch (error) {
    errorHandler(error, DOCUMENT_CREATE);
  }
};

export const updateDocument = (id: string, data: Partial<Document>) => async (
  dispatch: Dispatch,
) => {
  try {
    const document: Document = await documentService.updateDocument(id, data);

    dispatch({
      type: DOCUMENT_UPDATE,
      payload: { document },
    });

    return document;
  } catch (error) {
    errorHandler(error, DOCUMENT_UPDATE);
  }
};

export const deleteDocument = (document: Document) => async (dispatch: Dispatch) => {
  try {
    await documentService.deleteDocument(document.id);
    await fileService.deleteExternalFile(document.file.id);
    await fileService.deleteFile(document.file.id);

    dispatch({
      type: DOCUMENT_DELETE,
      payload: { id: document.id },
    });
  } catch (error) {
    errorHandler(error, DOCUMENT_DELETE);
  }
};
