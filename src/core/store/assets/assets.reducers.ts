import { Action, Reducer } from 'redux';
import { handleActions } from 'redux-actions';
import { AssetDto, AssetTreeNodeDto } from 'shared/common/models';

import { ASSETS_LOAD_MACHINES, ASSETS_LOAD_TREE, ASSETS_SELECT_CURRENT } from '../action-types';

export interface AssetsState {
  tree?: AssetTreeNodeDto[];
  machines: AssetDto[];
  asset?: AssetTreeNodeDto;
}

interface AssetsAction extends Action {
  payload: {
    tree: AssetTreeNodeDto[];
    machines: AssetDto[];
    asset: AssetTreeNodeDto;
  };
}

export const initialState: AssetsState = { machines: [] };

export const assetsReducer: Reducer<AssetsState, AssetsAction> = handleActions(
  {
    [ASSETS_LOAD_TREE]: (state: AssetsState, { payload: { tree } }: AssetsAction) => ({
      ...state,
      tree,
    }),
    [ASSETS_LOAD_MACHINES]: (state: AssetsState, { payload: { machines } }: AssetsAction) => ({
      ...state,
      machines,
    }),
    [ASSETS_SELECT_CURRENT]: (state: AssetsState, { payload: { asset } }: AssetsAction) => ({
      ...state,
      asset,
    }),
  },
  initialState,
);
