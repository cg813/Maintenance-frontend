import { Dispatch } from 'redux';

import * as hubService from '../../services/hub.service';
import errorHandler from '../errorHandler';
import {
  HUB_TILES_LOAD
} from '../action-types';
import {
  TileConfiguration
} from '../../models';

export const getTileConfigurations = async (dispatch: Dispatch) => {
  try {
    const tileConfigurations: TileConfiguration[] = await hubService.getTileConfigurations();

    dispatch({
      type: HUB_TILES_LOAD,
      payload: { tileConfigurations },
    });
  } catch (error) {
    errorHandler(error, HUB_TILES_LOAD);
  }
};
