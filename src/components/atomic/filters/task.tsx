import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Dropdown from '../../core-ui/dropdown/dropdown.component';
import { Task as TaskModel } from '../../../core/models';
import DropdownItem from '../dropdown-item/dropdown-item.component';

interface Props {
  taskId: string;
  summarize: { taskId: string; count: string }[];
  setTaskId: (taskId: string) => void;
  tasks: Partial<TaskModel>[];
  className?: string;
}

const Task: FC<Props> = ({
  tasks,
  summarize,
  setTaskId,
  taskId,
  className,
}) => {
  const { t } = useTranslation();

  let label = t('all');

  if (taskId) {
    const task = tasks.find((a) => a.id === taskId);
    if (task && task.name) {
      label = task.name;
    } else {
      label = taskId;
    }
  }

  return (
    <Dropdown
      label={
        <div className='text-nowrap'>
          <strong>{t('task')}:</strong> {label}
        </div>
      }
      className={className}
    >
      <DropdownItem selected={!taskId} onClick={() => setTaskId('')}>
        {t('all')}
      </DropdownItem>
      {tasks.map((task) => (
        <DropdownItem
          key={task.id}
          selected={task.id === taskId}
          disabled={!summarize?.find((sum) => sum.taskId === task.id)}
          onClick={() => setTaskId(task.id as string)}
        >
          {task.name}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};

export default Task;
