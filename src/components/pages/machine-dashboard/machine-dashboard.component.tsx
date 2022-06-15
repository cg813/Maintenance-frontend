import React, { FC, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useLocation, useRouteMatch, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ISA95EquipmentHierarchyModelElement } from 'shared/common/models';

import styles from './machine-dashboard.module.scss';
import * as format from '../../../core/utils/format';
import { Dropdown, FloatingScroll, Table, TruncateText } from '../../core-ui';
import { Balloon, Button, DropdownItem, Filters, TargetTime } from '../../atomic';
import { Maintenance, Task } from '../../../core/models';
import {
  selectMaintenances,
  selectSummarize,
} from '../../../core/store/maintenance/maintenance.selectors';
import { loadMaintenances } from '../../../core/store/maintenance/maintenance.actions';
import {
  selectAsset,
  selectAssetsTree,
  selectCurrentAsset,
  selectMachines,
} from '../../../core/store/assets/assets.selectors';
import { setCurrentAsset } from '../../../core/store/assets/assets.actions';
import { ColProps as ColProperties } from '../../core-ui/table/table.component';
import { internalExternal, mapColorByStatus, statuses } from '../../../core/utils/constants';
import { useFilters } from '../../../core/utils/hooks/filters';
import common from '../../../styles/common';
import { selectSidebarState } from '../../../core/store/ui/ui.selectors';

const MachineDashboard: FC<RouteComponentProps<{ id: string }>> = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  const match = useRouteMatch<{ id: string }>();
  const history = useHistory();

  const machines = useSelector(selectMachines);
  const summarize = useSelector(selectSummarize);
  const maintenances = useSelector(selectMaintenances);
  const tree = useSelector(selectAssetsTree);
  const currentAsset = useSelector(selectCurrentAsset);
  const { filters, ...filter } = useFilters({
    sorting: { target: 'dueDate', order: 'ASC' },
    status: location.pathname.includes('archive') ? 'completed' : '',
  });

  const { t } = useTranslation();

  const columns = [
    ['dueDate', t('dueDate')],
    ['title', t('title')],
    ['machineId', t('asset')],
    ['responsible', t('responsible')],
    ['status', t('status')],
    ['tasks', t('tasks')],
  ];

  const archiveColumns = [
    ['dueDate', t('dueDate')],
    ['title', t('title')],
    ['machineId', t('asset')],
    ['responsible', t('responsible')],
    ['completedAt', t('completedAt')],
    ['timeSpend', t('timeSpend')],
  ];

  useEffect(() => {
    if (location.pathname.includes('archive') && filters.status !== 'completed') {
      filter.setStatus('completed');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (tree && tree.length > 0) {
      dispatch(setCurrentAsset(match.params.id));
    }
  }, [dispatch, match, tree]);

  useEffect(() => {
    if (currentAsset && currentAsset.id === match.params.id) {
      dispatch(loadMaintenances(currentAsset, filters));
    } else if (!currentAsset) {
      dispatch(loadMaintenances(match.params.id || '', filters));
    }
  }, [filters, dispatch, currentAsset]);

  const sidebarOpened = useSelector(selectSidebarState);

  const setStatus = (status: string) => {
    if (status === filters.status) {
      filter.setStatus('');
    } else {
      filter.setStatus(status);
    }
  };

  const AssetCol: FC<{ assetId: string }> = ({ assetId }) => {
    const asset = useSelector(selectAsset(assetId));

    return <td>{asset?.name.en_EN || '-'}</td>;
  };

  const RenderCols: FC<ColProperties> = ({ item, col, value, DefaultCol }) => {
    const maintenance = item as Maintenance;

    switch (col) {
      case 'dueDate':
        return (
          <td>
            <div className='position-relative'>
              <div
                className='position-absolute d-flex'
                style={{ top: '50%', transform: 'translate(-109%, -50%)' }}
              >
                {maintenance.documents?.find((document) => document.archive) && (
                  <span style={{ marginRight: '5px' }} className={common.icon.attachgrey} />
                )}
                {maintenance.comment?.comment && <span className={common.icon.comment} />}
              </div>
              {format.date(value as Date)}
            </div>
          </td>
        );
      case 'tasks':
        return <td>{((value as unknown) as Task[]).length}</td>;
      case 'status':
        return <td>{t(value as string)}</td>;
      case 'machineId':
        return <AssetCol assetId={value as string} />;
      case 'completedAt':
        return <td>{format.datetime(value as Date)}</td>;
      case 'timeSpend':
        return (
          <td>
            <TargetTime seconds={maintenance.actuallySpendTime || 0} />
          </td>
        );
      case 'title':
        return (
          <td>
            <div className='position-relative w-100 h-100'>
              {maintenance.isInternal ? null : (
                <span
                  style={{
                    top: '50%',
                    transform: 'translate(calc(-5px - 100%), -50%)',
                  }}
                  className={classNames(common.icon.external, 'position-absolute')}
                />
              )}
              <TruncateText maxWidth={150}>{value}</TruncateText>
            </div>
          </td>
        );
      default:
        return DefaultCol ? <DefaultCol col={col} value={value} /> : null;
    }
  };

  const TableActions = () => (
    <div className='d-flex align-items-center'>
      <Dropdown
        label={
          <>
            <strong>I/E: </strong>
            {filters.isInternal === undefined
              ? t('all')
              : t(internalExternal[Number(filters.isInternal)])}
          </>
        }
        className='mr-3'
      >
        <DropdownItem onClick={() => filter.setIsInternal(undefined)}>{t('all')}</DropdownItem>
        <DropdownItem onClick={() => filter.setIsInternal(true)}>
          {t(internalExternal[1])}
        </DropdownItem>
        <DropdownItem onClick={() => filter.setIsInternal(false)}>
          {t(internalExternal[0])}
        </DropdownItem>
      </Dropdown>
      {currentAsset
      && currentAsset.assetType?.equipmentType
        === ISA95EquipmentHierarchyModelElement.PRODUCTION_UNIT ? (
        <>
          <Filters.DateRange
            clearDates={filter.clearDates}
            setDate={filter.setDate}
            startDate={filters.startDate || null}
            endDate={filters.endDate || null}
          />
          {filters.status !== 'completed' && (
            <Filters.Status
              className='ml-3'
              setStatus={setStatus}
              status={filters.status || ''}
              summarize={summarize.statuses || []}
            />
          )}
        </>
        ) : (
        <>
          <Filters.PersonResponsible
            person={filters.responsible || ''}
            summarize={summarize.responsible}
            setPerson={filter.setResponsible}
            persons={summarize.responsible.map(({ responsible }) => responsible)}
          />
          <Filters.Asset
            className='ml-3'
            assetId={filters.assetId || ''}
            summarize={summarize.assets}
            setAssetId={filter.setAssetId}
            assets={machines || []}
          />
          <Filters.DateRange
            className='ml-3'
            clearDates={filter.clearDates}
            setDate={filter.setDate}
            startDate={filters.startDate || null}
            endDate={filters.endDate || null}
          />
        </>
        )}
    </div>
  );

  const statusFilters = (
    <div
      className='d-flex mb-4 justify-content-around px-5 position-relative'
      style={{ width: 841 }}
    >
      {Object.entries(statuses).map(([status]) => (
        <Balloon
          key={status}
          color={mapColorByStatus[status]}
          label={t(status)}
          num={Number(summarize.statuses.find((sum) => sum.status === status)?.count || 0)}
          active={filters.status === status}
          hidden={!!filters.status && filters.status !== status}
          disabled={!summarize.statuses.find((sum) => sum.status === status)}
          onClick={() => setStatus(status)}
        />
      ))}
      <div
        className='position-absolute d-flex flex-column align-items-center link'
        style={{ right: 0 }}
      >
        <Button
          variant='square'
          color='dark'
          className='mb-2'
          onClick={() => history.push(`/archive/${match.params.id || ''}`)}
        >
          <span className={common.icon.archive} />
        </Button>
        {t('archive')}
      </div>
    </div>
  );

  return (
    <div
      className={classNames(
        'd-flex flex-column align-items-center',
        sidebarOpened ? styles.content : styles.collapsed,
      )}
    >
      {filters.status !== 'completed' && statusFilters}
      <Table
        withBackArrow={filters.status === 'completed'}
        onBackArrowClick={() => history.push(`/machine/${match.params.id || ''}`)}
        className='w-100'
        title={location.pathname.includes('archive') ? t('archive') : t('maintenance')}
        tableActions={<TableActions />}
        columns={filters.status === 'completed' ? archiveColumns : columns}
        noWrap
        sortable
        onRequestSort={(column) => filter.toggleSorting(column, true)}
        target={filters.sorting?.target}
        order={filters.sorting?.order || undefined}
        items={maintenances || []}
        RowActions={({ item }) => (
          <td className='d-flex justify-content-end'>
            <Button
              variant='reference'
              color={mapColorByStatus[(item as Maintenance).status]}
              onClick={() => history.push(`/maintenance/${(item as Maintenance).id}`)}
            />
          </td>
        )}
        ColComponent={RenderCols}
      />
    </div>
  );
};

export default MachineDashboard;
