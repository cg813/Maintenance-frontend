import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Button, DropdownItem } from '../../atomic';
import Tray from '../../atomic/icons/tray';
import styles from './task-create-item.module.scss';
import common from '../../../styles/common';
import { Task, TimeUnit } from '../../../core/models';
import { timeUnitLabels } from '../../../core/utils/constants';
import { Dropdown } from '..';

interface Props {
  onRemove: () => void;
  onChange: (task: Task) => void;
  initialTask: Task;
}

const TaskCreateItem: FC<Props> = ({ onChange, onRemove, initialTask }) => {
  const [task, setTask] = useState<Task>(initialTask);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(task.timeUnit || TimeUnit.seconds);
  const { t } = useTranslation();

  useEffect(() => {
    onChange(task);
  }, [task, onChange]);

  const changeTask = (name: keyof Task) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask({
      ...task,
      timeUnit,
      [name]: event.target.value,
    });
  };

  useEffect(() => {
    setTask({
      ...task,
      timeUnit,
    });
  }, [timeUnit]);

  return (
    <tr>
      <td className={classNames(styles.task, 'pr-3')}>
        <input
          className={classNames(common.forms.input, 'w-100')}
          value={task.name}
          onChange={changeTask('name')}
        />
      </td>
      <td className={classNames(styles.input, 'pr-3')}>
        <input
          className={classNames(common.forms.input, 'w-100')}
          value={task.responsible}
          onChange={changeTask('responsible')}
        />
      </td>
      <td className={classNames(styles.input, 'pr-3')}>
        <input
          className={classNames(common.forms.input, 'w-100')}
          value={task.targetTime}
          type='number'
          onChange={changeTask('targetTime')}
        />
      </td>
      <td className={classNames(styles.input, 'pr-3 text-nowrap')}>
        <Dropdown width='auto' label={t(timeUnitLabels[timeUnit]) as string}>
          <DropdownItem onClick={() => setTimeUnit(TimeUnit.minutes)}>{t('minutes')}</DropdownItem>
          <DropdownItem onClick={() => setTimeUnit(TimeUnit.hours)}>{t('hours')}</DropdownItem>
  {/* <DropdownItem onClick={() => setTimeUnit(TimeUnit.days)}>{t('days')}</DropdownItem> */}
        </Dropdown>
      </td>
      <td className='d-flex justify-content-end'>
        <Button variant='square' color='red' onClick={() => onRemove()}>
          <Tray fill='#fff' />
        </Button>
      </td>
    </tr>
  );
};

export default TaskCreateItem;
