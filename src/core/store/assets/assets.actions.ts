import { Dispatch } from 'redux';
import { AssetDto, AssetTreeNodeDto } from 'shared/common/models';

import errorHandler from '../errorHandler';
import { ASSETS_LOAD_MACHINES, ASSETS_LOAD_TREE, ASSETS_SELECT_CURRENT } from '../action-types';
import * as assetsService from '../../services/assets.service';
import { AppState } from '..';

const generatePath = (asset: AssetTreeNodeDto): AssetTreeNodeDto => {
  const newAsset = asset;
  if (newAsset.children) {
    newAsset.children = newAsset.children.map((a) => generatePath(a));
  }
  return newAsset;
};

export const loadAssetsTree = async (dispatch: Dispatch) => {
  try {
    const tree: AssetTreeNodeDto[] = (await assetsService.loadAssetsTree()).map((asset) => generatePath(asset));

    dispatch({
      type: ASSETS_LOAD_TREE,
      payload: { tree },
    });
  } catch (error) {
    errorHandler(error, ASSETS_LOAD_TREE);
  }
};

export const loadMachines = async (dispatch: Dispatch) => {
  try {
    const machines: AssetDto[] = await assetsService.loadMachines();

    dispatch({
      type: ASSETS_LOAD_MACHINES,
      payload: { machines },
    });
  } catch (error) {
    errorHandler(error, ASSETS_LOAD_MACHINES);
  }
};

export const setCurrentAsset = (assetId: string) => (
  dispatch: Dispatch,
  getState: () => AppState,
) => {
  const { tree } = getState().assetsModule;
  let asset: AssetTreeNodeDto | undefined;

  const mapTree = (a: AssetTreeNodeDto) => {
    if (a.id === assetId) {
      asset = a;
    } else {
      a.children.forEach(mapTree);
    }
  };

  (tree || []).forEach(mapTree);

  dispatch({
    type: ASSETS_SELECT_CURRENT,
    payload: { asset },
  });
};
