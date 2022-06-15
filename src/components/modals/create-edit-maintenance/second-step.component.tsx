import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import common from '../../../styles/common';
import { Button, DropdownItem, LeftCharacters } from '../../atomic';
import { Dropdown, UploadFile } from '../../core-ui';
import taskStyles from '../../core-ui/task-create-item/task-create-item.module.scss';
import { File, Task, TaskError, TaskErrors, TEMP_PREFIX, TimeUnit } from '../../../core/models';
import { internalExternal, timeUnitLabels } from '../../../core/utils/constants';
import Tray from '../../atomic/icons/tray';
import AssignFileToMaintenance from '../assign-file-to-maintenance/assign-file-to-maintenance.component';

interface Props {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  taskErrors: TaskErrors;
}

interface TaskNameInput {
  task: Task;
  taskError?: TaskError;
}

const setDefaultValue = (value: string) => (ref: HTMLInputElement | null) => {
  if (ref) {
    Object.assign(ref, { value });
  }
};

const TaskNameInput: FC<TaskNameInput> = ({ task, taskError }) => {
  const [length, setLength] = useState<number>(task.name.length);
  const maxLength = 100;

  return (
    <>
      <input
        className={classNames(
          common.forms.input,
          'w-100',
          (taskError?.name || length > maxLength) && common.forms.error,
        )}
        onChange={(event) => {
          setLength(event.target.value.length);
          Object.assign<Task, Partial<Task>>(task, { name: event.target.value });
        }}
        ref={setDefaultValue(task.name)}
      />
      <LeftCharacters total={maxLength} entered={length} className='mr-3' style={{ bottom: -14 }} />
    </>
  );
};

const SecondStep: FC<Props> = ({ tasks, setTasks, taskErrors }) => {
  const [taskToAttachDocuments, setTaskToAttachDocuments] = useState<Task>();

  const { t } = useTranslation();

  useEffect(() => {
    tasks.forEach((task, index) => {
      Object.assign(task, { position: index });
    });
  }, [tasks]);

  const createTask = () => {
    setTasks([
      ...tasks,
      {
        id: TEMP_PREFIX + String(Math.random()),
        completed: false,
        name: '',
        responsible: '',
        targetTime: 0,
        position: tasks.length,
        timeUnit: TimeUnit.seconds,
        documents: [],
        isInternal: true,
      },
    ]);
  };

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    if (oldIndex === newIndex) {
      return;
    }
    setTasks(arrayMove(tasks, oldIndex, newIndex));
  };

  const removeTask = (task: Task) => {
    const taskIndex = tasks.findIndex(({ id }) => id === task.id);
    if (taskIndex < 0) {
      return;
    }

    setTasks([...tasks.slice(0, taskIndex), ...tasks.slice(taskIndex + 1)]);
  };

  const changeTask = (
    task?: Task,
    property?: keyof Task,
    value?: string | number | Document[] | boolean,
  ) => {
    if (!task || !property) {
      return;
    }
    Object.assign(task, { [property]: value });
    setTasks([...tasks]);
  };

  const deleteFile = (task: Task, file: File) => {
    task.documents.splice(
      task.documents.findIndex(({ id }) => id === file.id),
      1,
    );

    changeTask(task, 'documents', ([...task.documents] as unknown) as Document[]);
  };

  const DragHandle = SortableHandle(() => (
    <span className={classNames(common.icon.dragyreorder, 'mr-3')} />
  ));

  const TaskItem = SortableElement(({ value: task }: { value: Task }) => (
    <tbody key={`create-edit-maintenance-task-${task.id}`}>
      <tr>
        <td>
          <DragHandle />
        </td>
        <td className={classNames(taskStyles.task, 'pr-3 position-relative')}>
          <TaskNameInput task={task} taskError={taskErrors[task.id]} />
        </td>
        <td className={classNames(taskStyles.input, 'pr-3')}>
          <input
            className={classNames(common.forms.input, 'w-100')}
            onChange={(event) => {
              Object.assign<Task, Partial<Task>>(task, { responsible: event.target.value });
            }}
            ref={setDefaultValue(task.responsible)}
          />
        </td>
        <td className={classNames(taskStyles.input, 'pr-3 text-nowrap')}>
          <Dropdown width='auto' label={t(internalExternal[Number(task.isInternal)]) as string}>
            <DropdownItem onClick={() => changeTask(task, 'isInternal', true)}>
              {t(internalExternal[1])}
            </DropdownItem>
            <DropdownItem onClick={() => changeTask(task, 'isInternal', false)}>
              {t(internalExternal[0])}
            </DropdownItem>
          </Dropdown>
        </td>
        <td className={classNames(taskStyles.input, 'pr-3')}>
          <input
            className={classNames(
              common.forms.input,
              'w-100',
              taskErrors[task.id]?.targetTime && common.forms.error,
            )}
            onChange={(event) => {
              Object.assign<Task, Partial<Task>>(task, { targetTime: Number(event.target.value) });
            }}
            ref={setDefaultValue(String(task.targetTime))}
            min='0'
            type='number'
          />
        </td>
        <td className={classNames(taskStyles.input, 'pr-3 text-nowrap')}>
          <Dropdown
            width='auto'
            label={t(timeUnitLabels[task.timeUnit]) as string}
            isError={taskErrors[task.id]?.timeUnit}
          >
            <DropdownItem onClick={() => changeTask(task, 'timeUnit', TimeUnit.minutes)}>
              {t('minutes')}
            </DropdownItem>
            <DropdownItem onClick={() => changeTask(task, 'timeUnit', TimeUnit.hours)}>
              {t('hours')}
            </DropdownItem>
          </Dropdown>
        </td>
        <td className='d-flex justify-content-end'>
          <Button
            className='mr-3'
            variant='square'
            color='dark'
            onClick={() => setTaskToAttachDocuments(task)}
          >
            <span className={common.icon.attach} />
          </Button>
          <Button variant='square' color='red' onClick={() => removeTask(task)}>
            <Tray fill='#fff' />
          </Button>
        </td>
      </tr>
      {task.documents?.length > 0 && (
        <tr>
          <td />
          <td colSpan={6}>
            <UploadFile.List
              files={task.documents}
              onDelete={(file) => deleteFile(task, file as File)}
            />
          </td>
        </tr>
      )}
    </tbody>
  ));

  const TasksList = SortableContainer(({ items }: { items: Task[] }) => (
    <table className={classNames(taskStyles.table, 'w-100 mt-3')}>
      <thead>
        <tr>
          <td />
          <td className={classNames(common.forms.label, taskStyles.task, 'pr-3 d-table-cell')}>
            {t('tasks')}
          </td>
          <td className={classNames(common.forms.label, taskStyles.input, 'pr-3 d-table-cell')}>
            {t('responsible')}
          </td>
          <td className={classNames(common.forms.label, taskStyles.input, 'pr-3 d-table-cell')}>
            {t(internalExternal[1])}/{t(internalExternal[0])}
          </td>
          <td className={classNames(common.forms.label, taskStyles.input, 'pr-3 d-table-cell')}>
            {t('targetTime')}
          </td>
          <td className={classNames(common.forms.label, taskStyles.input, 'pr-3 d-table-cell')}>
            {t('timeUnit')}
          </td>
          <td></td>
        </tr>
      </thead>
      {items.map((task, index) => (
        <TaskItem key={`item-${task.id}`} value={task} index={index} />
      ))}
    </table>
  ));

  return (
    <>
      <div className='d-flex justify-content-end'>
        <Button color='dark' className='px-2' onClick={() => createTask()}>
          <span className={classNames(common.icon.plus, 'mr-3')} />
          {t('addTask')}
        </Button>
      </div>
      {tasks?.length ? (
        <TasksList
          items={tasks}
          onSortEnd={onSortEnd}
          helperClass='z-10000'
          useDragHandle
          lockAxis='y'
        />
      ) : null}
      <div className='my-4 pt-4' />
      <AssignFileToMaintenance
        isOpen={!!taskToAttachDocuments}
        initialDocuments={taskToAttachDocuments?.documents || []}
        onRequestClose={() => setTaskToAttachDocuments(undefined)}
        onAccept={(documents) => {
          changeTask(taskToAttachDocuments, 'documents', documents as Document[]);
          setTaskToAttachDocuments(undefined);
        }}
      />
    </>
  );
};

export default SecondStep;
