import axios from 'axios';
import { AssetDto, AssetTreeNodeDto } from 'shared/common/models';

import { maintenanceServiceUrl } from '../environment';

const assetsUrl = `${maintenanceServiceUrl}/assets`;

export const loadAssetsTree = async (): Promise<AssetTreeNodeDto[]> => {
  const response = await axios.get<{ meta: {}; data: AssetTreeNodeDto[] }>(`${assetsUrl}/tree`);

  return response.data.data;
};

export const loadMachines = async (): Promise<AssetDto[]> => {
  const response = await axios.get<{ meta: {}; data: AssetDto[] }>(`${assetsUrl}/machines`);

  return response.data.data;
};

export const saveOperatingHours = async (assetId: string, value: string) => {
  await axios.post(`${assetsUrl}/operating-hours`, {
    assetId,
    value,
  });
};
