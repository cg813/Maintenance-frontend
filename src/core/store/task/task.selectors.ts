import { createSelector } from 'reselect';

import { TaskState } from './task.reducers';
import { MaintenanceTask, Task } from '../../models';
import { AppState } from '..';

const formatDates = (task: MaintenanceTask|Task): MaintenanceTask|Task => {
  if ((task as MaintenanceTask).dueDate) {
    // eslint-disable-next-line no-param-reassign
    (task as MaintenanceTask).dueDate = new Date((task as MaintenanceTask).dueDate);
  }
  if ((task as Task).completedDate) {
    // eslint-disable-next-line no-param-reassign
    (task as Task).completedDate = new Date((task as Required<Task>).completedDate);
  }
  return task;
};

export const selectTasks = createSelector<AppState, TaskState, Task[]>(
  (state) => state.taskModule,
  (taskModule) => taskModule.tasks.map(formatDates) as Task[],
);

export const selectAllTasks = createSelector<AppState, TaskState, MaintenanceTask[]>(
  (state) => state.taskModule,
  (taskModel) => taskModel.allTasks.map(formatDates) as MaintenanceTask[],
);

export const selectSummarizeStatuses = createSelector<AppState, TaskState, { status: string; count: string }[]>(
  (state) => state.taskModule,
  (taskModel) => taskModel.statuses,
);

export const selectSummarizeAssets = createSelector<AppState, TaskState, { assetId: string; count: string }[]>(
  (state) => state.taskModule,
  (taskModel) => taskModel.assets,
);

export const selectSummarizeResponsible = createSelector<AppState, TaskState, { responsible: string; count: string }[]>(
  (state) => state.taskModule,
  (taskModel) => taskModel.responsible,
);
