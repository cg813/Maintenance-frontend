import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AssetTreeNodeDto, ISA95EquipmentHierarchyModelElement } from 'shared/common/models';

import {
  loadAssetsTree,
  loadMachines,
  setCurrentAsset,
} from '../../../core/store/assets/assets.actions';
import { MachinesStatuses } from '../../../core/models';
import styles from './factory-tree.module.scss';
import {
  selectAssetsTree,
  selectCurrentAsset,
  selectMachines,
} from '../../../core/store/assets/assets.selectors';
import { selectSidebarState } from '../../../core/store/ui/ui.selectors';
import { Breadcrumbs, Button } from '../../atomic';
import { selectStatuses } from '../../../core/store/maintenance/maintenance.selectors';
import {
  clearMaintenanceFromStore,
  getMachinesWithStatus,
} from '../../../core/store/maintenance/maintenance.actions';
import { toggleSidebar } from '../../../core/store/ui/ui.actions';
import common from '../../../styles/common';
import { getFileUrl } from '../../../core/services/file.service';
import ThumbnailImg from '../../../assets/asset-thumbnail.jpg';

interface Props {
  treeItem: AssetTreeNodeDto;
  statuses?: MachinesStatuses[];
  hidden?: boolean;
}

const icons: { [key: string]: string } = {
  'asset-factory': styles.factory,
  'asset-home': styles.home,
  'asset-machine': styles.machine,
  'asset-scrap': styles.scrap,
  'asset-line': styles.scrap,
};

const shouldHaveIndicator = (
  treeItem: AssetTreeNodeDto,
  statuses: MachinesStatuses[] = [],
): string => {
  if (statuses.length === 0) {
    return '';
  }

  if (treeItem.assetType?.equipmentType === ISA95EquipmentHierarchyModelElement.PRODUCTION_UNIT) {
    const machines = statuses.filter(({ machineId }) => machineId === treeItem.id);

    if (machines.find(({ status }) => status === 'overdue')) {
      return 'overdue';
    }
    if (machines.length) {
      return 'dueSoon';
    }
    return '';
  }

  const checkChildrenOrder = (item: AssetTreeNodeDto) => (
    status: string,
    machineStatus: MachinesStatuses,
  ): string => {
    if (
      status !== 'overdue'
      && item.children.map((child) => child.id).includes(machineStatus.machineId)
    ) {
      return machineStatus.status;
    }
    return status;
  };

  const result = treeItem.children.reduce<string>((status, item) => {
    const next = statuses.reduce<string>(checkChildrenOrder(item), status);
    if (next !== 'overdue') {
      return shouldHaveIndicator(item, statuses) || next;
    }
    return next;
  }, '');

  return statuses.reduce<string>(checkChildrenOrder(treeItem), result);
};

const hasSelectedMachine = (treeItem: AssetTreeNodeDto, machineId: string | undefined): boolean => {
  if (!machineId) return false;

  return (
    treeItem.children.reduce<boolean>(
      (previous, current) => previous || hasSelectedMachine(current, machineId),
      false,
    ) || treeItem.children.map((child) => child.id).includes(machineId)
  );
};

const TreeItem: FC<Props> = ({ treeItem, hidden = false, statuses }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [selected, setSelected] = useState(false);
  const [indicator, setIndicator] = useState('');
  const isMachine = treeItem.assetType?.equipmentType === ISA95EquipmentHierarchyModelElement.PRODUCTION_UNIT;
  const hasChildren = !!treeItem.children?.length;
  const history = useHistory();
  const currentAsset = useSelector(selectCurrentAsset);

  useEffect(() => {
    if (hasSelectedMachine(treeItem, currentAsset?.id)) {
      setCollapsed(false);
    }
  }, [currentAsset, treeItem]);

  useEffect(() => {
    if (statuses) {
      setIndicator(shouldHaveIndicator(treeItem, statuses));
    }
  }, [indicator, treeItem, statuses]);

  useEffect(() => {
    if (treeItem.children.length === 0) {
      setCollapsed(true);
    }
  }, [collapsed, treeItem]);

  useEffect(() => {
    if (currentAsset?.id === treeItem.id) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [currentAsset, treeItem, history.location.pathname]);

  const navigateToMachine = () => {
    if (history.location.pathname.includes('archive')) {
      history.push(`/archive/${treeItem.id || ''}`);
    } else {
      history.push(`/machine/${treeItem.id || ''}`);
    }
  };

  const navigateToAsset = () => {
    if (history.location.pathname.includes('archive')) {
      history.push(`/archive/${treeItem.id || ''}`);
    } else {
      history.push(`/asset/${treeItem.id || ''}`);
    }
  };

  const toggleCollapse = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCollapsed(!collapsed);
  };

  const imageIdToUrl = (imageId: string) => {
    if (!imageId) return;
    return getFileUrl(imageId);
  };

  return (
    <div className={classNames(hidden && styles.collapsed)}>
      <div
        className={classNames('py-2 d-flex align-items-center', selected && styles.selected)}
        // style={{ paddingLeft: (Number(treeItem.level) + 0.5) * 20 + Number(hasChildren) * -36 }}
        onClick={() => (isMachine ? navigateToMachine() : navigateToAsset())}
      >
        {hasChildren && (
          <Button color='transparent' variant='square' onClick={toggleCollapse}>
            <span className={classNames(styles.arrow, collapsed && styles.collapsed)} />
          </Button>
        )}
        <img
          className='ml-2 mr-3'
          height='50px'
          alt=''
          src={treeItem.imageId ? imageIdToUrl(treeItem.imageId) : ThumbnailImg}
        />
        <button className='border-0 bg-transparent outline-none'>{treeItem.name.en_EN}</button>
        <div className={classNames('ml-auto mr-3', `indicator-${indicator}`)} />
      </div>
      {treeItem.children.map((treeChild) => (
        <TreeItem key={treeChild.id} treeItem={treeChild} hidden={collapsed} statuses={statuses} />
      ))}
    </div>
  );
};

const FactoryTree: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tree = useSelector(selectAssetsTree);
  const statuses = useSelector(selectStatuses);
  const machines = useSelector(selectMachines);
  const history = useHistory();
  const sidebarOpened = useSelector(selectSidebarState);
  const currentAsset = useSelector(selectCurrentAsset);
  const mapLevelToLink = ['home', 'location', 'area', 'line', 'machine'];
  const [allSelected, setAllSelected] = useState<boolean>(false);

  useEffect(() => {
    if (!tree) {
      dispatch(loadAssetsTree);
    } else {
      dispatch(loadMachines);
      dispatch(getMachinesWithStatus);
    }
  }, [tree, dispatch]);

  useEffect(() => {
    if (machines?.length && history.location.pathname === '/') {
      history.push(`/machine/${machines[0].id}`);
    }
    setAllSelected(
      ['/machine', '/machine/', '/archive', '/archive/'].includes(history.location.pathname),
    );
  }, [machines, history.location.pathname]);

  useEffect(() => {
    if (allSelected) {
      dispatch(clearMaintenanceFromStore);
      dispatch(setCurrentAsset(''));
    }
  }, [allSelected]);

  const breadcrumbs = () => {
    const bcs = [];
    const level = 0;
    if (currentAsset) {
      bcs.push({
        name: currentAsset.name.en_EN,
        link: `${mapLevelToLink[Number(level)]}/${currentAsset.id}`,
        level,
      });
    }

    currentAsset?.children.map((child, idx) => bcs.push({
      name: child.name.en_EN,
      link: `${mapLevelToLink[Number(idx + 1)]}/${child.id}`,
      level: Number(idx + 1),
    }),
    );

    return bcs;
  };

  const navigateToAll = () => {
    if (history.location.pathname.includes('archive')) {
      history.push('/archive');
    } else {
      history.push('/machine');
    }
  };

  return (
    <div className={classNames(styles.tree, !sidebarOpened && styles.collapsed)}>
      <div className='position-absolute w-100 h-100 overflow-auto pb-10'>
        {sidebarOpened ? (
          <>
            <div
              className={classNames(styles.all, allSelected && styles.selected, 'text-nowrap')}
              onClick={() => navigateToAll()}
            >
              {t('all')} {t('maintenance')}
            </div>
            {tree?.map((treeChild) => (
              <TreeItem key={treeChild.id} treeItem={treeChild} statuses={statuses} />
            ))}
          </>
        ) : (
          <>
            <div className='mt-5' />
            <Breadcrumbs breadcrumbs={breadcrumbs()} vertical />
          </>
        )}
      </div>
      <div className={styles.shadow} />
      <Button
        variant='square'
        color='transparent'
        className={classNames(styles.collapseButton, 'position-absolute')}
        style={{ outline: 'none' }}
        onClick={() => dispatch(toggleSidebar)}
      >
        <span
          className={classNames(
            !sidebarOpened && styles.collapsed,

            common.icon.arrowdownwhite,
          )}
        />
      </Button>
    </div>
  );
};

export default FactoryTree;
