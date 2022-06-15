import axios, { AxiosResponse } from 'axios';

import { maintenanceServiceUrl } from '../environment';
import { Document, DocumentMaintenance, Filters, MaintenanceTask } from '../models';

const documentUrl = `${maintenanceServiceUrl}/document`;

const unique = <T extends { id: string }>(subjects: T[]): T[] =>
  subjects &&
  subjects.filter(
    (subject, index, self) =>
      self.findIndex(s => ('id' in s ? s.id === subject.id : false)) === index,
  );

export const formatDocumentsRelations = (document: Document): Document => ({
  ...document,
  tasks: unique<MaintenanceTask>(JSON.parse((document.tasks as unknown) as string)),
  maintenances: unique<DocumentMaintenance>(
    JSON.parse((document.maintenances as unknown) as string),
  ),
  file: JSON.parse((document.file as unknown) as string),
});

export const loadDocuments = async (filters?: Filters) => {
  const response: AxiosResponse<{
    documents: Document[];
    assets: { assetId: string; count: string }[];
    maintenances: { title: string; maintenanceId: string; count: string }[];
    tasks: { name: string; taskId: string; count: string }[];
  }> = await axios.get(documentUrl, { params: filters });

  return response.data;
};

export const createDocument = async (document: Partial<Document>) => {
  const response: AxiosResponse<Document> = await axios.post(documentUrl, document);

  return formatDocumentsRelations(response.data);
};

export const updateDocument = async (id: string, document: Partial<Document>) => {
  const response: AxiosResponse<Document> = await axios.put(`${documentUrl}/${id}`, document);

  return formatDocumentsRelations(response.data);
};

export const deleteDocument = async (id: string) => axios.delete(`${documentUrl}/${id}`);
