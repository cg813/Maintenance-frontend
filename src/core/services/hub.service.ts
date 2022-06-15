import axios, { AxiosResponse } from 'axios';

import { hubServiceUrl as externalHubUrl } from '../environment';

import { TileConfiguration } from '../models';

export const getTileConfigurations = async (): Promise<TileConfiguration[]> => {
  const response: AxiosResponse<{ data: TileConfiguration[] }> = await axios.get(
    `${externalHubUrl}/tile-configuration`,
  );

  return response.data.data;
};
