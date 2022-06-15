import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { reducer as toastrReducer } from 'react-redux-toastr';

import { modalsReducer } from './modals/modals.reducer';
import { maintenanceReducer } from './maintenance/maintenance.reducers';
import { taskReducer } from './task/task.reducers';
import { assetsReducer } from './assets/assets.reducers';
import { uiReducer } from './ui/ui.reducers';
import { authReducer } from './auth/auth.reducers';
import { documentReducer } from './document/document.reducers';
import { hubReducer } from './hub/hub.reducers';

const rootReducer = combineReducers({
  modalModule: modalsReducer,
  maintenanceModule: maintenanceReducer,
  taskModule: taskReducer,
  assetsModule: assetsReducer,
  uiModule: uiReducer,
  authModule: authReducer,
  documentModule: documentReducer,
  toastr: toastrReducer,
  hubModule: hubReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const logger = createLogger();

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));
