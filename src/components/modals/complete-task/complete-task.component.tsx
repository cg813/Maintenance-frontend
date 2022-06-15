import React, { FC, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useForm, ValidationOptions } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import common from '../../../styles/common';
import { Button, DropdownItem } from '../../atomic';
import { Comment, Task, TimeUnit } from '../../../core/models';
import { createTaskComment, updateComment } from '../../../core/services/comment.service';
import { updateTask } from '../../../core/store/task/task.actions';
import { Dropdown } from '../../core-ui';
import { timeUnitLabels } from '../../../core/utils/constants';
import { loadMaintenance } from '../../../core/store/maintenance/maintenance.actions';
import { selectMaintenance } from '../../../core/store/maintenance/maintenance.selectors';

interface Props {
  task: Task | null;
  open: boolean;
  onRequestClose: () => void;
}

const CompleteTask: FC<Props> = ({ task, open, onRequestClose }) => {
  const dispatch = useDispatch();
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.seconds);
  const maintenance = useSelector(selectMaintenance);
  const { t } = useTranslation();

  const { register, handleSubmit, errors } = useForm<Comment>();

  useEffect(() => {
    if (task?.comments?.length) {
      setTimeUnit(task.comments[0].timeUnit);
    }
  }, [task]);

  const setDefaultValue = (value: string, options: ValidationOptions) => (
    ref: HTMLInputElement | HTMLTextAreaElement | null,
  ) => {
    if (ref) {
      Object.assign(ref, { value: value || ref.value });
    }
    register(ref, options);
  };

  const onSubmit = async (data: Comment) => {
    if (!timeUnit || Number(timeUnit) === 1) {
      return;
    }
    if (task) {
      if (task.comments?.length) {
        await updateComment({
          ...data,
          timeUnit,
          id: task.comments[0].id,
          duration: data.duration,
        });
      } else {
        await createTaskComment({
          ...data,
          timeUnit,
          duration: data.duration,
          task: { id: task.id },
        });
      }
      const newTask = {
        ...task,
        completed: true,
      };
      delete newTask.comments;
      dispatch(updateTask(newTask.id, newTask));
      if (maintenance) {
        dispatch(loadMaintenance(maintenance.id));
      }
    }
    onRequestClose();
  };

  return (
    <ReactModal isOpen={open} style={{ content: { width: 552 } }} onRequestClose={onRequestClose}>
      <div className={common.modal.header}>
        <div className={common.modal.title}>
          <span className={classNames(common.icon.repair, 'mr-3')} />„{task?.name}“{' '}
          <span className='text-lowercase ml-1'>{t('markAsDone')}</span>
        </div>
        <Button
          variant='square'
          color='transparent'
          className={common.modal.close}
          onClick={onRequestClose}
        >
          <span className={common.icon.greycross} />
        </Button>
      </div>
      <div className={common.modal.body} style={{ overflow: 'visible' }}>
        <div className='d-flex justify-content-between'>
          <div className={classNames('pb-5', common.forms.w230)}>
            <label className={common.forms.label}>{t('duration')}</label>
            <div className='d-flex justify-content-between'>
              <input
                name='duration'
                className={classNames(
                  common.forms.input,
                  errors.duration ? common.forms.error : '',
                  'flex-fill w-25 mr-3',
                )}
                type='number'
                ref={setDefaultValue(
                  task?.comments?.length ? String(task?.comments[0].duration) : '',
                  {
                    required: true,
                    min: 0,
                  },
                )}
              />
              <Dropdown width='auto' label={t(timeUnitLabels[timeUnit]) as string}>
                <DropdownItem onClick={() => setTimeUnit(TimeUnit.minutes)}>
                  {t('minutes')}
                </DropdownItem>
                <DropdownItem onClick={() => setTimeUnit(TimeUnit.hours)}>
                  {t('hours')}
                </DropdownItem>
                <DropdownItem onClick={() => setTimeUnit(TimeUnit.days)}>{t('days')}</DropdownItem>
              </Dropdown>
            </div>
          </div>
          <div className='d-flex flex-column'>
            <label className={common.forms.label}>{t('comment')}</label>
            <textarea
              name='comment'
              className={classNames(common.forms.input, common.forms.w230, 'flex-fill')}
              ref={setDefaultValue(task?.comments?.length ? task?.comments[0].comment : '', {})}
            />
          </div>
        </div>
      </div>
      <div className={common.modal.footer}>
        <Button variant='square' color='transparent'>
          <span className={common.icon.help} />
        </Button>
        <div className='d-flex align-items-center'>
          <Button variant='link' width='auto' onClick={onRequestClose}>
            {t('cancel')}
          </Button>
          <Button
            className='ml-3 py-0 pl-3 pr-4 d-flex align-items-center'
            width='auto'
            onClick={handleSubmit(onSubmit)}
          >
            <span className={classNames(common.icon.check, 'mr-2')} />
            {t('complete')}
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};

export default CompleteTask;
