import React, { FC, useEffect, useState } from 'react';
import ReactModal, { Props as ReactModalProperties } from 'react-modal';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import common from '../../../styles/common';
import { Button, CheckBox } from '../../atomic';
import { MaintenanceTask } from '../../../core/models';
import { useFilters } from '../../../core/utils/hooks/filters';
import { getAllTasks } from '../../../core/services/task.service';

interface Props extends ReactModalProperties {
  onAccept: (tasks: Partial<MaintenanceTask>[]) => void;
  initialTasks: Partial<MaintenanceTask>[];
}

const AssignFileToTask: FC<Props> = ({ onAccept, initialTasks, ...props }) => {
  const { t } = useTranslation();

  const { filters, ...filter } = useFilters();
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [searchString, setSearchString] = useState<string>('');
  const [selectedTasks, setSelectedTasks] = useState<Partial<MaintenanceTask>[]>(initialTasks);

  useEffect(() => {
    (async () => {
      setTasks((await getAllTasks(filters)).tasks);
    })();
  }, [filters]);

  useEffect(() => {
    setSelectedTasks(initialTasks);
  }, [initialTasks]);

  const onPressEnterOnSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      filter.setSearchString(searchString);
    }
  };

  const changeSelectedTasks = (task: Partial<MaintenanceTask>) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.checked) {
      setSelectedTasks([...selectedTasks, task]);
    } else {
      const nextTasks = [...selectedTasks];
      const index = nextTasks.findIndex(({ id }) => id === task.id);
      nextTasks.splice(index, 1);
      setSelectedTasks(nextTasks);
    }
  };

  const renderTask = (task: Partial<MaintenanceTask>) => (
    <tr key={task.id}>
      <td valign='middle'>{task.name}</td>
      <td valign='middle'>{task.maintenance}</td>
      <td>
        <div className='d-flex justify-content-end'>
          <CheckBox
            checked={selectedTasks.map(({ id }) => id).includes(task.id)}
            onChange={changeSelectedTasks(task)}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <ReactModal {...props} style={{ content: { width: 668 } }}>
      <div className={classNames(common.modal.header, 'justify-content-between mb-0')}>
        <div className={common.modal.title}>
          <span className={classNames(common.icon.repair, 'mr-3')} />
          „Datei 1“ einer neuen Aufgabe zuordnen
        </div>
        <Button
          variant='square'
          color='transparent'
          className={common.modal.close}
          onClick={props.onRequestClose}
        >
          <span className={common.icon.greycross} />
        </Button>
      </div>
      <div className={common.modal.body}>
        <div className={classNames(common.forms.w230, 'ml-auto d-flex')}>
          <input
            value={searchString}
            onChange={(event) => setSearchString(event.target.value)}
            onKeyDown={onPressEnterOnSearch}
            placeholder='Search'
            className={classNames(common.forms.input, 'flex-fill')}
          />
          <Button
            variant='square'
            color='dark'
            onClick={() => filter.setSearchString(searchString)}
          >
            <span className={common.icon.search} />
          </Button>
        </div>
        <table className='mt-3 w-100'>
          <thead className={classNames(common.table.header, common.table.small)}>
            <tr>
              <td>{t('tasks')}</td>
              <td>{t('maintenance')}</td>
              <td />
            </tr>
          </thead>
          <tbody className={common.table.body}>
            {selectedTasks.map(renderTask)}
            {tasks
              .filter((task) => !selectedTasks.map(({ id }) => id).includes(task.id))
              .map(renderTask)}
          </tbody>
        </table>
      </div>
      <div className={common.modal.footer}>
        <Button variant='square' color='transparent'>
          <span className={common.icon.help} />
        </Button>
        <div className='d-flex align-items-center'>
          <Button variant='link' width='auto' onClick={props.onRequestClose}>
            {t('cancel')}
          </Button>
          <Button
            className='ml-3 py-0 pl-3 pr-4 d-flex align-items-center'
            width='auto'
            onClick={() => onAccept(selectedTasks)}
          >
            <span className={classNames(common.icon.check, 'mr-2')} />
            {t('save')}
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};

export default AssignFileToTask;
