import { Dispatch } from 'redux';
import { MACHINE_EQUIPMENT_TYPE } from 'definitions';
import { AssetTreeNodeDto, ISA95EquipmentHierarchyModelElement } from 'shared/common/models';

import * as maintenanceService from '../../services/maintenance.service';
import * as taskService from '../../services/task.service';
import * as fileService from '../../services/file.service';
import * as commentService from '../../services/comment.service';
import * as documentService from '../../services/document.service';
import errorHandler from '../errorHandler';
import {
  MAINTENANCE_CLEAR_FROM_STORE,
  MAINTENANCE_CREATE,
  MAINTENANCE_DELETE,
  MAINTENANCE_LOAD_FROM_MACHINE,
  MAINTENANCE_LOAD_SPECIFIC,
  MAINTENANCE_STATUSES,
  MAINTENANCE_UPDATE,
} from '../action-types';
import {
  Maintenance,
  Task,
  Comment,
  File as FFile,
  MachinesStatuses,
  Filters,
  Document,
  TEMP_PREFIX,
} from '../../models';
import { loadTasks } from '../task/task.actions';
import { AppState } from '..';

export const getMachinesWithStatus = async (dispatch: Dispatch) => {
  try {
    const dueSoon: MachinesStatuses[] = await maintenanceService.getMachinesWithStatus('dueSoon');
    const overdue: MachinesStatuses[] = await maintenanceService.getMachinesWithStatus('overdue');

    dispatch({
      type: MAINTENANCE_STATUSES,
      payload: { statuses: [...dueSoon, ...overdue] },
    });
  } catch (error) {
    errorHandler(error, MAINTENANCE_STATUSES);
  }
};

export const loadMaintenances = (asset: AssetTreeNodeDto | string, filters?: Filters) => async (
  dispatch: Dispatch,
) => {
  try {
    let machineId: string | string[] = typeof asset === 'string' ? asset : asset.id || '';

    if (
      typeof asset !== 'string' &&
      asset.assetType?.equipmentType !== ISA95EquipmentHierarchyModelElement.PRODUCTION_UNIT
    ) {
      machineId = [];

      const mapAsset = (item: AssetTreeNodeDto) => {
        if (item.assetType?.equipmentType === ISA95EquipmentHierarchyModelElement.PRODUCTION_UNIT) {
          (machineId as string[]).push(item.id);
        } else if (item.children) {
          item.children.map(mapAsset);
        }
      };

      asset.children.map(mapAsset);

      if (machineId.length === 0) {
        machineId = '0';
      }
    }

    const { data: maintenances, summarize } = await maintenanceService.loadMaintenances(
      machineId,
      filters,
    );

    dispatch({
      type: MAINTENANCE_LOAD_FROM_MACHINE,
      payload: { maintenances, summarize },
    });
  } catch (error) {
    errorHandler(error, MAINTENANCE_LOAD_FROM_MACHINE);
  }
};

export const loadMaintenance = (maintenanceId: string) => async (dispatch: Dispatch) => {
  try {
    const maintenance: Maintenance = await maintenanceService.loadMaintenance(maintenanceId);
    const comment: Comment = await commentService.getCommentByMaintenance(maintenanceId);

    dispatch({
      type: MAINTENANCE_LOAD_SPECIFIC,
      payload: {
        maintenance: {
          ...maintenance,
          comment,
        },
      },
    });
  } catch (error) {
    errorHandler(error, MAINTENANCE_LOAD_SPECIFIC);
  }
};

const updateTasks = async (tasks: Task[], id: string, state?: AppState) => {
  await Promise.all(
    tasks
      .filter(task => task.id.startsWith(TEMP_PREFIX))
      .map(async task => {
        // eslint-disable-next-line no-param-reassign
        // delete task.id;
        const temporary = {
          completed: task.completed,
          name: task.name,
          responsible: task.responsible,
          targetTime: task.targetTime,
          timeUnit: task.timeUnit,
          documents: task.documents,
          isInternal: task.isInternal,
          maintenance: task.maintenance,
          completedDate: task.completedDate,
          position: task.position,
          comments: task.comments || [],
        } as Task;
        // eslint-disable-next-line no-return-await
        return await taskService.createTask({ ...temporary, maintenance: { id } });
      }),
  );
  await Promise.all(
    tasks
      .filter(task => !task.id.startsWith(TEMP_PREFIX))
      .filter(t => !!t.id)
      .map(t => taskService.updateTask(t.id, t)),
  );
  await Promise.all(
    state?.taskModule.tasks
      .filter(sTask => !tasks.find(t => t.id === sTask.id))
      // eslint-disable-next-line no-return-await
      .map(async sTask => await taskService.deleteTask(sTask.id)) || [],
  );
};

const updateFiles = async (files: FFile[], id: string, previousFiles: FFile[]) => {
  const previousIds = previousFiles.map(file => file.id);
  const newIds: string[] = files.map(file => file.id);

  await Promise.all(
    files
      .filter(file => !previousIds.includes(file.id))
      .map(
        // eslint-disable-next-line no-return-await
        async file =>
          await fileService.createFile({
            ...file,
            maintenance: { id },
          }),
      ),
  );

  await Promise.all(
    previousFiles
      .filter(file => !newIds.includes(file.id))
      .map(async file => {
        await fileService.deleteExternalFile(file.id);
        await fileService.deleteFile(file.id);
      }),
  );
};

export const createMaintenance = ({ tasks, files, ...data }: Maintenance) => async (
  dispatch: Dispatch,
) => {
  try {
    const maintenance = await maintenanceService.createMaintenance(data);

    if (tasks) {
      await updateTasks(tasks, maintenance.id);

      await loadTasks(maintenance.id)(dispatch);
    }

    if (files) {
      await updateFiles(files, maintenance.id, maintenance.files || []);
    }

    dispatch({
      type: MAINTENANCE_CREATE,
      payload: { maintenance },
    });

    await loadMaintenances(data.machineId)(dispatch);
    await getMachinesWithStatus(dispatch);
  } catch (error) {
    errorHandler(error, MAINTENANCE_CREATE);
  }
};

export const updateMaintenance = (
  id: string,
  { tasks, files, ...data }: Partial<Maintenance>,
) => async (dispatch: Dispatch, getState: () => AppState) => {
  try {
    if (tasks) {
      await updateTasks(tasks, id, getState());
    }

    const promises: [Promise<Maintenance>, Promise<Comment>, Promise<unknown>?] = [
      maintenanceService.updateMaintenance(id, data as Maintenance),
      commentService.getCommentByMaintenance(id),
      loadTasks(id)(dispatch),
    ];

    if (files) {
      promises.push(updateFiles(files, id, getState().maintenanceModule.maintenance?.files || []));
    }

    const [maintenance, comment] = (await Promise.all(promises)) as [Maintenance, Comment];

    dispatch({
      type: MAINTENANCE_UPDATE,
      payload: {
        maintenance: {
          ...maintenance,
          comment,
        },
      },
    });

    await getMachinesWithStatus(dispatch);
  } catch (error) {
    errorHandler(error, MAINTENANCE_UPDATE);
  }
};

export const completeMaintenance = (
  maintenance: Maintenance,
  data: Comment,
  documents: Document[],
) => async (dispatch: Dispatch, getState: () => AppState) => {
  try {
    const nextDocuments = [...(maintenance.documents || []), ...documents];

    await maintenanceService.updateMaintenance(maintenance.id, {
      documents: nextDocuments.filter(
        (document, index) => nextDocuments.findIndex(({ id }) => id === document.id) === index,
      ),
    });

    const comment = await commentService.createMaintenanceComment(data);
    const completedMaintenance = await maintenanceService.completeMaintenance(maintenance.id);

    dispatch({
      type: MAINTENANCE_UPDATE,
      payload: {
        maintenance: {
          ...completedMaintenance,
          comment,
        },
      },
    });

    await getMachinesWithStatus(dispatch);
  } catch (error) {
    errorHandler(error, MAINTENANCE_UPDATE);
  }
};

export const deleteMaintenance = (maintenanceId: string) => async (
  dispatch: Dispatch,
  getState: () => AppState,
) => {
  try {
    await updateFiles([], maintenanceId, getState().maintenanceModule.maintenance?.files || []);
    await maintenanceService.deleteMaintenance(maintenanceId);

    dispatch({
      type: MAINTENANCE_DELETE,
      payload: { maintenanceId },
    });

    await getMachinesWithStatus(dispatch);
  } catch (error) {
    errorHandler(error, MAINTENANCE_DELETE);
  }
};

export const clearMaintenanceFromStore = (dispatch: Dispatch) => {
  dispatch({ type: MAINTENANCE_CLEAR_FROM_STORE });
};
