import axios, { AxiosResponse } from 'axios';

import { maintenanceServiceUrl } from '../environment';
import { Comment } from '../models';

const commentsUrl = `${maintenanceServiceUrl}/comment`;

export const createMaintenanceComment = async (data: Comment): Promise<Comment> => {
  const response: AxiosResponse<Comment> = await axios.post(`${commentsUrl}/maintenance`, data);

  return response.data;
};

export const createTaskComment = async (data: Comment): Promise<Comment> => {
  const response: AxiosResponse<Comment> = await axios.post(`${commentsUrl}/task`, data);

  return response.data;
};

export const getCommentByMaintenance = async (maintenanceId: string): Promise<Comment> => {
  const response: AxiosResponse<Comment> = await axios.get(
    `${commentsUrl}/maintenance/${maintenanceId}`,
  );

  return response.data;
};

export const updateComment = async (data: Comment): Promise<Comment> => {
  const response: AxiosResponse<Comment> = await axios.put(`${commentsUrl}/update`, data);

  return response.data;
};
