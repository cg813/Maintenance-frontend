import { createSelector } from 'reselect';
import { AssetDto, AssetTreeNodeDto } from 'shared/common/models';

import { AssetsState } from './assets.reducers';
import { AppState } from '..';

export const selectAssetsTree = createSelector<AppState, AssetsState, AssetTreeNodeDto[] | undefined>(
  (state) => state.assetsModule,
  (assetsModule) => assetsModule.tree,
);

export const selectMachines = createSelector<AppState, AssetsState, AssetDto[]>(
  (state) => state.assetsModule,
  (assetsModule) => assetsModule.machines,
);

export const selectCurrentAsset = createSelector<AppState, AssetsState, AssetTreeNodeDto | undefined>(
  (state) => state.assetsModule,
  (assetsModule) => assetsModule.asset,
);

export const selectAsset = (assetId: string) => createSelector<AppState, AssetsState, AssetTreeNodeDto | undefined>(
  (state) => state.assetsModule,
  (assetsModule) => {
    let asset: AssetTreeNodeDto | undefined;
    const mapAssetTree = (assetItem: AssetTreeNodeDto) => {
      if (assetItem.id === assetId) {
        asset = assetItem;
      } else if (assetItem.children) {
        assetItem.children.forEach(mapAssetTree);
      }
    };

    (assetsModule.tree || []).forEach(mapAssetTree);

    return asset;
  },
);
