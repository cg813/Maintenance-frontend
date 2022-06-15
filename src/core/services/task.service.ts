import axios, { AxiosResponse } from 'axios';

import { maintenanceServiceUrl } from '../environment';
import { Task, Tasks } from '../models';

const taskUrl = `${maintenanceServiceUrl}/task`;

export const loadTask = async (taskId: string): Promise<Task> => {
  const response: AxiosResponse<Task> = await axios.get(`${taskUrl}/${taskId}`);

  return response.data;
};

export const loadTasks = async (maintenanceId: string): Promise<Task[]> => {
  const response: AxiosResponse<Task[]> = await axios.get(
    `${taskUrl}/by-maintenance/${maintenanceId}`,
  );

  return response.data;
};

export const createTask = async (data: Task): Promise<Task> => {
  const response: AxiosResponse<Task> = await axios.post(taskUrl, data);

  return response.data;
};

export const updateTask = async (id: string, data: Task): Promise<Task> => {
  const response: AxiosResponse<Task> = await axios.put(`${taskUrl}/${id}`, data);

  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await axios.delete(`${taskUrl}/${taskId}`);
};

export const getAllTasks = async (filters?: unknown): Promise<Tasks> => {
  const response: AxiosResponse<Tasks> = await axios.get(`${taskUrl}/all`, { params: filters });

  return response.data;
};

export const updatePosition = async (
  maintenanceId: string,
  previousPosition: number,
  nextPosition: number,
) => {
  await axios.put(`${taskUrl}/by-maintenance/${maintenanceId}/position`, {
    prevPosition: previousPosition,
    nextPosition,
  });
};
