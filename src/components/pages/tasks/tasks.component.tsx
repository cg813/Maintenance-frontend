import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Table } from '../../core-ui';
import { Button, Filters } from '../../atomic';
import { mapColorByStatus } from '../../../core/utils/constants';
import { MaintenanceTask } from '../../../core/models';
import {
  selectAllTasks,
  selectSummarizeAssets,
  selectSummarizeStatuses,
} from '../../../core/store/task/task.selectors';
import { loadAllTasks } from '../../../core/store/task/task.actions';
import { useFilters } from '../../../core/utils/hooks/filters';
import { ColProps as ColProperties } from '../../core-ui/table/table.component';
import { selectAsset, selectMachines } from '../../../core/store/assets/assets.selectors';

const Tasks: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const allTasks = useSelector(selectAllTasks);
  const summarizeStatuses = useSelector(selectSummarizeStatuses);
  const summarizeAssets = useSelector(selectSummarizeAssets);
  const machines = useSelector(selectMachines);
  const { t } = useTranslation();

  const { filters, ...filter } = useFilters();

  useEffect(() => {
    dispatch(loadAllTasks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAllTasks(filters));
  }, [filters, dispatch]);

  const setStatus = (status: string) => {
    if (status === filters.status) {
      filter.setStatus('');
    } else {
      filter.setStatus(status);
    }
  };

  const setAssetId = (assetId: string) => {
    if (assetId === filters.assetId) {
      filter.setAssetId('');
    } else {
      filter.setAssetId(assetId);
    }
  };

  const TableActions = () => (
    <div className='d-flex align-items-center'>
      <Filters.DateRange
        clearDates={filter.clearDates}
        setDate={filter.setDate}
        startDate={filters.startDate || null}
        endDate={filters.endDate || null}
      />
      {/* <Filters.PersonResponsible
        person={filters.responsible || ''}
        summarize={summarizeResponsible}
        setPerson={filter.setResponsible}
        persons={summarizeResponsible.map(({ responsible }) => responsible)}
     /> */}
      <Filters.Asset
        className='ml-3'
        assetId={filters.assetId || ''}
        summarize={summarizeAssets}
        setAssetId={setAssetId}
        assets={machines || []}
      />
      <Filters.Status
        className='ml-3'
        setStatus={setStatus}
        status={filters.status || ''}
        summarize={summarizeStatuses}
      />
    </div>
  );

  const RenderCols: FC<ColProperties> = ({ col, value, DefaultCol }) => {
    switch (col) {
      case 'status':
        return <td>{t(value as string)}</td>;
      case 'machineId':
        return <AssetCol assetId={value as string} />;
      default:
        return DefaultCol ? <DefaultCol col={col} value={value} /> : null;
    }
  };

  const AssetCol: FC<{ assetId: string }> = ({ assetId }) => {
    const asset = useSelector(selectAsset(assetId));

    return <td>{asset?.name.en_EN || '-'}</td>;
  };

  return (
    <Table
      title={t('tasks')}
      noWrap
      tableActions={<TableActions />}
      className='w-auto'
      sortable
      onRequestSort={filter.toggleSorting}
      target={filters.sorting?.target}
      order={filters.sorting?.order || undefined}
      RowActions={({ item }) => (
        <td className='d-flex justify-content-end'>
          <Button
            variant='reference'
            color={mapColorByStatus[(item as MaintenanceTask).status]}
            onClick={() => history.push(`/maintenance/${(item as MaintenanceTask).maintenanceId}`)}
          />
        </td>
      )}
      columns={[
        ['dueDate', t('dueDate')],
        ['name', t('task')],
        ['maintenance', t('maintenance')],
        ['machineId', t('asset')],
        ['responsible', t('responsible')],
        ['status', t('status')],
      ]}
      items={allTasks}
      ColComponent={RenderCols}
    />
  );
};

export default Tasks;
