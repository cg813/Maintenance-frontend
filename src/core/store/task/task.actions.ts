import { Dispatch } from 'redux';

import errorHandler from '../errorHandler';
import {
  TASK_CREATE,
  TASK_DELETE,
  TASK_LOAD_ALL,
  TASK_LOAD_FROM_MAINTENANCE,
  TASK_LOAD_SPECIFIC,
  TASK_UPDATE,
} from '../action-types';
import * as taskService from '../../services/task.service';
import { Task } from '../../models';

export const loadTasks = (maintenanceId: string) => async (dispatch: Dispatch) => {
  try {
    const tasks: Task[] = await taskService.loadTasks(maintenanceId);

    dispatch({
      type: TASK_LOAD_FROM_MAINTENANCE,
      payload: { tasks },
    });
  } catch (error) {
    errorHandler(error, TASK_LOAD_FROM_MAINTENANCE);
  }
};

export const loadTask = (taskId: string) => async (dispatch: Dispatch) => {
  try {
    const task: Task = await taskService.loadTask(taskId);

    dispatch({
      type: TASK_LOAD_SPECIFIC,
      payload: { task },
    });
  } catch (error) {
    errorHandler(error, TASK_LOAD_SPECIFIC);
  }
};

export const createTask = (data: Task) => async (dispatch: Dispatch) => {
  try {
    await taskService.createTask(data);

    dispatch({ type: TASK_CREATE });
  } catch (error) {
    errorHandler(error, TASK_CREATE);
  }
};

export const updateTask = (id: string, data: Task) => async (dispatch: Dispatch) => {
  try {
    const task = await taskService.updateTask(id, data);

    dispatch({
      type: TASK_UPDATE,
      payload: { task },
    });
  } catch (error) {
    errorHandler(error, TASK_UPDATE);
  }
};

export const deleteTask = (taskId: string) => async (dispatch: Dispatch) => {
  try {
    await taskService.deleteTask(taskId);

    dispatch({
      type: TASK_DELETE,
      payload: { taskId },
    });
  } catch (error) {
    errorHandler(error, TASK_DELETE);
  }
};

export const loadAllTasks = (filters?: unknown) => async (dispatch: Dispatch) => {
  try {
    const { tasks: allTasks, statuses, assets, responsible } = await taskService.getAllTasks(
      filters,
    );

    dispatch({
      type: TASK_LOAD_ALL,
      payload: { allTasks, statuses, assets, responsible },
    });
  } catch (error) {
    errorHandler(error, TASK_LOAD_ALL);
  }
};
