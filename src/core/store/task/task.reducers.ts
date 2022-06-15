import { Action, Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { MaintenanceTask, Task } from '../../models';
import { TASK_LOAD_ALL, TASK_LOAD_FROM_MAINTENANCE, TASK_UPDATE } from '../action-types';

export interface TaskState {
  tasks: Task[];
  allTasks: MaintenanceTask[];
  statuses: { status: string; count: string }[];
  assets: { assetId: string; count: string }[];
  responsible: { responsible: string; count: string }[];
}

interface TaskAction extends Action {
  payload: {
    tasks: Task[];
    task: Task;
    taskId: number;
    allTasks: MaintenanceTask[];
    statuses: { status: string; count: string }[];
    assets: { assetId: string; count: string }[];
    responsible: { responsible: string; count: string }[];
  };
}

const initialState: TaskState = {
  tasks: [],
  allTasks: [],
  statuses: [],
  assets: [],
  responsible: [],
};

export const taskReducer: Reducer<TaskState, TaskAction> = handleActions(
  {
    [TASK_LOAD_FROM_MAINTENANCE]: (
      state: TaskState,
      { payload: { tasks } }: TaskAction,
    ) => ({ ...state, tasks }),
    [TASK_UPDATE]: (
      state: TaskState,
      { payload: { task } }: TaskAction,
    ) => ({
      ...state,
      tasks: [
        ...(state.tasks.splice(
          state.tasks.findIndex((t) => t.id === task.id),
          1,
          task,
        ) && state.tasks),
      ],
    }),
    [TASK_LOAD_ALL]: (
      state: TaskState,
      { payload: { allTasks, statuses, assets, responsible } }: TaskAction,
    ) => ({ ...state, allTasks, statuses, assets, responsible }),
  },
  initialState,
);
