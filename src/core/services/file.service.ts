import axios, { AxiosResponse } from 'axios';

import { fileServiceUrl as externalFileUrl, maintenanceServiceUrl } from '../environment';
import { File as FFile } from '../models';

const fileUrl = `${maintenanceServiceUrl}/file`;

export const uploadFile = async (data: File): Promise<FFile> => {
  const formData = new FormData();
  formData.append('file', data);
  const response: AxiosResponse<{ data: FFile }> = await axios.post(
    `${externalFileUrl}/v1/file`,
    formData,
  );
  return { ...response.data.data, name: data.name };
};

export const uploadFilesMany = async (
  data: Array<File | FFile>,
  // eslint-disable-next-line no-return-await
): Promise<FFile[]> => await Promise.all(
  data
    .filter((file) => file instanceof File)
    .map(async (file) => {
      const response = await uploadFile(file as File);
      return {
        id: response.id,
        name: file.name,
      };
    }),
);

export const deleteExternalFile = async (id: string): Promise<void> => {
  await axios.delete(`${externalFileUrl}/v1/file/${id}`);
};

export const createFile = async (data: FFile): Promise<FFile> => {
  const response: AxiosResponse<FFile> = await axios.post(fileUrl, data);
  return { ...response.data, name: data.name };
};

export const deleteFile = async (id: string): Promise<void> => {
  await axios.delete(`${fileUrl}/${id}`);
};

export const getFileUrl = (id: string) => `${externalFileUrl}/v1/file/${id}`;

export const getIconUrl = (value: string) => {
  if (value) {
    if (value.includes('http://') || value.includes('https://')) {
      return value;
    }
    return externalFileUrl + '/v1/file/' + value;
  }
  
  return 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg';
}
