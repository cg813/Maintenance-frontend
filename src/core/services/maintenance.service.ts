import axios, { AxiosResponse } from 'axios';

import { maintenanceServiceUrl } from '../environment';
import { Filters, MachinesStatuses, Maintenance, Task, Document, Comment } from '../models';

const maintenanceUrl = `${maintenanceServiceUrl}/maintenance`;

export const loadMaintenance = async (maintenanceId: string): Promise<Maintenance> => {
  const response: AxiosResponse<Maintenance> = await axios.get(
    `${maintenanceUrl}/${maintenanceId}`,
  );

  return response.data;
};

export const loadMaintenances = async (
  machineId: string | string[],
  filters?: Filters,
): Promise<{
  data: Maintenance[];
  summarize: { status: string; count: string }[];
}> => {
  const url = machineId ? `${maintenanceUrl}` : maintenanceUrl;

  const response: AxiosResponse<{
    data: Maintenance[];
    summarize: { status: string; count: string }[];
  }> = await axios.get(url, {
    params: {
      filters,
      machineId,
    },
  });

  return response.data;
};

export const createMaintenance = async (data: Maintenance): Promise<Maintenance> => {
  const response: AxiosResponse<Maintenance> = await axios.post(maintenanceUrl, data);

  return response.data;
};

export const updateMaintenance = async (
  id: string,
  data: Partial<Maintenance>,
): Promise<Maintenance> => {
  const response: AxiosResponse<Maintenance> = await axios.put(`${maintenanceUrl}/${id}`, data);

  return response.data;
};

export const completeMaintenance = async (maintenanceId: string) => {
  const response: AxiosResponse<Maintenance> = await axios.put(
    `${maintenanceUrl}/complete/${maintenanceId}`,
  );

  return response.data;
};

export const deleteMaintenance = async (maintenanceId: string) => {
  await axios.delete(`${maintenanceUrl}/${maintenanceId}`);
};

export const getMachinesWithStatus = async (status: string): Promise<MachinesStatuses[]> => {
  const response: AxiosResponse<{ machineId: string; status: string }[]> = await axios.get(
    `${maintenanceUrl}/machines/${status}`,
  );
  return response.data;
};

export const getPlannedTime = async (id: string): Promise<number> => {
  const response: AxiosResponse<{ plannedTime: number }> = await axios.get(
    `${maintenanceUrl}/planned-time/${id}`,
  );

  return response.data.plannedTime;
};

interface TaskCopy extends Omit<Task, 'documents' | 'comments'> {
  documents: Partial<Document>[];
}

interface MaintenanceCopy extends Omit<Maintenance, 'tasks'> {
  tasks: TaskCopy[];
}

export const copyMaintenance = async (data: MaintenanceCopy): Promise<Maintenance> => {
  const response: AxiosResponse<Maintenance> = await axios.post(`${maintenanceUrl}/copy`, data);

  return response.data;
};
