import React, { FC, useCallback, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AssetTreeNodeDto, ISA95EquipmentHierarchyModelElement, DEVICE_PROP_KEY } from 'shared/common/models';

import common from 'styles/common';
import { Breadcrumbs, Button, DropdownItem } from '../../atomic';
import {
  selectModalProperties,
  selectModalType,
} from '../../../core/store/modals/modals.selectors';
import { CREATE_EDIT_MAINTENANCE } from '../../../core/store/modals/modal-types';
import { hideModal } from '../../../core/store/modals/modals.actions';
import {
  IntervalUnit,
  Maintenance,
  Task,
  Document,
  TimeUnit,
  TaskErrors,
  TaskError,
} from '../../../core/models';
import { ModalProps } from '../../../core/store/modals/modals.reducer';
import { selectMaintenance } from '../../../core/store/maintenance/maintenance.selectors';
import { selectTasks } from '../../../core/store/task/task.selectors';
import {
  createMaintenance,
  updateMaintenance,
  getMachinesWithStatus,
} from '../../../core/store/maintenance/maintenance.actions';
import {
  selectAsset,
  selectAssetsTree,
  selectCurrentAsset,
  selectMachines,
} from '../../../core/store/assets/assets.selectors';
import FirstStep from './first-step.component';
import SecondStep from './second-step.component';
import { copyMaintenance } from '../../../core/services/maintenance.service';
import { Dropdown } from '../../core-ui';
import { getChildrenFlat } from '../../../core/utils/tree';
import { OPERATING_HOURS_PROP_KEY, DISTANCE_PROP_KEY, STROKES_PROP_KEY } from 'shared/common/models';

const CreateEditMaintenance: FC = () => {
  const history = useHistory();
  const machines = useSelector(selectMachines);
  const modalProperties: ModalProps | undefined = useSelector(selectModalProperties);
  const modalType = useSelector(selectModalType);
  const maintenance = useSelector(selectMaintenance);
  const maintenanceTasks = useSelector(selectTasks);
  const maintenanceAsset = useSelector(selectAsset(maintenance?.machineId || ''));
  const asset = useSelector(selectCurrentAsset);
  const [currentAsset, setCurrentAsset] = useState<AssetTreeNodeDto>();
  const dispatch = useDispatch();
  const tree = useSelector(selectAssetsTree);
  const [location, setLocation] = useState<AssetTreeNodeDto>();
  const [department, setDepartment] = useState<AssetTreeNodeDto>();
  const [allLocations, setAllLocations] = useState<AssetTreeNodeDto[]>();
  const [allMachines, setAllMachines] = useState<AssetTreeNodeDto[]>();
  const [allDepartments, setAllDepartments] = useState<AssetTreeNodeDto[]>();
  const [machine, setMachine] = useState<any>();
  const [machineIdError, setMachineIdError] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [earliestExecTime, setEarliestExecTime] = useState<Date | null>(null);
  const [category, setCategory] = useState<string>('');
  const [interval, setRepeatInterval] = useState<number>(1);
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit | 0>(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskErrors, setTaskErrors] = useState<TaskErrors>({});
  const [title, setTitle] = useState<string>('');
  const [responsible, setResponsible] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isInternal, setIsInternal] = useState<boolean>(true);
  const [useOperatingHours, setUseOperatingHours] = useState<boolean>(false);
  const [useDistance, setUseDistance] = useState<boolean>(false);
  const [useStrokes, setUseStrokes] = useState<boolean>(false);
  const [dueAt, setDueAt] = useState<number>();
  const [earliestProcessing, setEarliestProcessing] = useState<number>();
  const [hasDeviceKey, setHasDeviceKey] = useState<boolean>(false);
  const mapLevelToLink = ['home', 'location', 'area', 'line', 'machine'];
  // const breadcrumbs = currentAsset?.path?.map((path) => ({
  //   name: path.name,
  //   link: `${mapLevelToLink[Number(path.level)]}/${path.id}`,
  // })) || [];
  const [step, setStep] = useState<1 | 2>(1);

  const { t } = useTranslation();

  const getMachineOperatingHours = useCallback(() => {
    if (!currentAsset) {
      return 0;
    }

    const machineOperatingHours = Number(
      currentAsset?.properties?.find(property => property.key === OPERATING_HOURS_PROP_KEY)?.value,
    );

    if (!machineOperatingHours || isNaN(machineOperatingHours)) {
      return 0;
    }

    if (machineOperatingHours - Math.floor(machineOperatingHours) > 0) {
      return Number(String(machineOperatingHours).replace('.', ''));
    }

    return machineOperatingHours;
  }, [currentAsset]);

  const getDistance = useCallback(() => {
    if (!currentAsset) {
      return 0;
    }

    const machineDistance = Number(
      currentAsset?.properties?.find(property => property.key === DISTANCE_PROP_KEY)?.value,
    );

    if (!machineDistance || isNaN(machineDistance)) {
      return 0;
    }

    return machineDistance;
  }, [currentAsset]);

  const getStrokes = useCallback(() => {
    if (!currentAsset) {
      return 0;
    }

    const machineStrokes = Number(
      currentAsset?.properties?.find(property => property.key === STROKES_PROP_KEY)?.value,
    );

    if (!machineStrokes || isNaN(machineStrokes)) {
      return 0;
    }

    return machineStrokes;
  }, [currentAsset]);

  const form = useForm<Maintenance>();
  form.register({ name: 'dueDate' }, { required: true });
  form.register({ name: 'earliestExecTime' });
  form.register({ name: 'category' });
  form.register({ name: 'interval' });
  form.register({ name: 'isInternal' });
  form.register({ name: 'title' }, { required: true, maxLength: 100 });
  form.register({ name: 'responsible' }, { required: true });
  form.register({ name: 'description' }, { required: true, maxLength: 100 });
  form.register({ name: 'useOperatingHours' });
  form.register({ name: 'dueAt' }, { min: getMachineOperatingHours() });
  form.register({ name: 'useDistance' });
  form.register({ name: 'distance' }, { min: getDistance() });
  form.register({ name: 'useStrokes' });
  form.register({ name: 'strokes' }, { min: getStrokes() });
  form.register({ name: 'earliestProcessing' });
  useEffect(() => {
    form.setValue('dueDate', dueDate as Date);
  }, [dueDate, form.setValue]);
  useEffect(() => {
    form.setValue('earliestExecTime', earliestExecTime as Date);
  }, [earliestExecTime, form.setValue]);
  useEffect(() => {
    form.setValue('category', category);
  }, [category, form.setValue]);
  useEffect(() => {
    const temporary = Number(interval);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(temporary) || temporary < 0) {
      setRepeatInterval(0);
    }
    setDueAt(getMachineOperatingHours() + Number(interval));
    form.setValue('interval', interval);
  }, [interval, form.setValue, getMachineOperatingHours]);
  useEffect(() => {
    form.setValue('title', title);
  }, [title, form.setValue]);
  useEffect(() => {
    form.setValue('responsible', responsible);
  }, [responsible, form.setValue]);
  useEffect(() => {
    form.setValue('description', description);
  }, [description, form.setValue]);
  useEffect(() => {
    form.setValue('isInternal', isInternal);
  }, [isInternal, form.setValue]);
  useEffect(() => {
    form.setValue('useOperatingHours', useOperatingHours);
  }, [useOperatingHours, form.setValue]);
  useEffect(() => {
    const machineOperatingHours = getMachineOperatingHours();

    if (!dueAt || dueAt < machineOperatingHours) {
      form.setError([{ name: 'dueAt', type: 'min' }]);
    } else {
      form.clearError('dueAt');
    }

    form.setValue('dueAt', dueAt);
  }, [dueAt, form.setValue]);
  useEffect(() => {
    form.setValue('useDistance', useDistance);
  }, [useDistance, form.setValue]);
  useEffect(() => {
    form.setValue('useStrokes', useStrokes);
  }, [useStrokes, form.setValue]);
  useEffect(() => {
    form.setValue('earliestProcessing', earliestProcessing);
  }, [earliestProcessing, form.setValue]);

  useEffect(() => {
    setStep(1);
    if (['edit', 'copy'].includes(modalProperties?.role || '')) {
      setDueDate(maintenance?.dueDate ? new Date(maintenance?.dueDate) : null);
      setEarliestExecTime(
        maintenance?.earliestExecTime ? new Date(maintenance?.earliestExecTime) : null,
      );
      setCategory(maintenance?.category || '');
      setTitle(maintenance?.title || '');
      setResponsible(maintenance?.responsible || '');
      setDescription(maintenance?.description || '');
      setTasks(JSON.parse(JSON.stringify(maintenanceTasks)));
      // dont copy archived documents
      setDocuments([
        ...((maintenance?.documents as Document[]) || []).filter(
          d => modalProperties?.role !== 'copy' || !d.archive,
        ),
      ]);
      setRepeatInterval(maintenance?.interval || 1);
      setIntervalUnit(Number(maintenance?.intervalUnit) || 0);
      setIsInternal(maintenance?.isInternal || true);
      setUseOperatingHours(maintenance?.useOperatingHours || false);
      setDueAt(maintenance?.dueAt || 0);
      setUseDistance(maintenance?.useDistance || false);
      setUseStrokes(maintenance?.useStrokes || false);
      setEarliestProcessing(maintenance?.earliestProcessing || 0);
    } else {
      setDueDate(null);
      setEarliestExecTime(null);
      setCategory('');
      setTitle('');
      setResponsible('');
      setDescription('');
      setTasks([]);
      setDocuments([]);
      setRepeatInterval(1);
      setIntervalUnit(0);
      setIsInternal(true);
      setUseOperatingHours(false);
      setDueAt(0);
      setUseDistance(false);
      setUseStrokes(false);
      setEarliestProcessing(0);
    }
  }, [maintenance, form.setValue, modalProperties, maintenanceTasks]);

  useEffect(() => {
    if (modalProperties?.role === 'create') {
      setCurrentAsset(asset);
    } else {
      setCurrentAsset(maintenanceAsset);
    }
  }, [maintenanceAsset, asset, modalProperties]);

  useEffect(() => {
    if (currentAsset && currentAsset.properties && currentAsset.properties.length > 0) {
      currentAsset.properties.forEach(property => {
        if (property.key === DEVICE_PROP_KEY) {
          setHasDeviceKey(true);
        }
      });
    } else {
      setHasDeviceKey(false);
    }
  }, [currentAsset]);

  useEffect(() => {
    tasks.forEach((task, index) => {
      // eslint-disable-next-line no-param-reassign
      task.position = index;
    });
  }, [tasks]);

  useEffect(() => {
    if (
      (department && location && !location.children.map(c => c.id).includes(department.id)) ||
      !location
    ) {
      setDepartment(undefined);
    }
  }, [location]);

  useEffect(() => {
    if (department && !location && allLocations) {
      const nextLocation = allLocations.find(l =>
        getChildrenFlat(l)
          .map(c => c.id)
          .includes(department.id),
      );
      setLocation(nextLocation);
    }
    if (
      (machine?.id &&
        department &&
        !getChildrenFlat(department)
          .map(c => c.id)
          .includes(machine.id)) ||
      !department
    ) {
      setMachine(undefined);
    }
  }, [department]);

  useEffect(() => {
    if (machine) {
      setMachineIdError(false);
    }
    if (machine && !department && allDepartments) {
      const nextDepartment = allDepartments.find(d =>
        getChildrenFlat(d)
          .map(c => c.id)
          .includes(machine.id),
      );
      setDepartment(nextDepartment);
    }
  }, [machine]);

  const reduceAssetTree = (result: AssetTreeNodeDto[], factory: AssetTreeNodeDto) => [
    ...result,
    ...factory.children,
  ];

  const getMachines = (result: AssetTreeNodeDto[], root: AssetTreeNodeDto) => [
    ...result,
    ...getChildrenFlat(root).filter(
      item => item.assetType?.equipmentType === ISA95EquipmentHierarchyModelElement.PRODUCTION_UNIT,
    ),
  ];

  useEffect(() => {
    const nextLocations: AssetTreeNodeDto[] = (tree || []).reduce(
      reduceAssetTree,
      [] as AssetTreeNodeDto[],
    );
    setAllLocations(nextLocations);

    const nextDepartments = nextLocations.reduce(reduceAssetTree, [] as AssetTreeNodeDto[]);
    setAllDepartments(nextDepartments);

    const nextMachines = nextDepartments.reduce(getMachines, [] as AssetTreeNodeDto[]);
    setAllMachines(nextMachines);
  }, [tree]);
  useEffect(() => {
    setLocation(undefined);
  }, [modalProperties?.open]);

  const resetAssets = () => {
    setMachine(undefined);
    setDepartment(undefined);
    setLocation(undefined);
  };

  const onSubmit = async (data: Maintenance) => {
    if (modalProperties?.role === 'copy' && !machine?.id) {
      setMachineIdError(true);
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    let tasksClear = true;
    let newTaskErrors: TaskErrors = {};

    tasks.forEach(task => {
      const nextError: TaskError = {};
      if (!task.name || task.name.length > 500) {
        nextError.name = true;
      }
      if (!task.targetTime || task.targetTime < 0) {
        nextError.targetTime = true;
      }
      if (task.timeUnit < TimeUnit.minutes) {
        nextError.timeUnit = true;
      }

      newTaskErrors = {
        ...newTaskErrors,
        [task.id]: nextError,
      };

      if (Object.keys(nextError).length > 0) {
        tasksClear = false;
      }
    });

    if (!tasksClear) {
      setTaskErrors({
        ...taskErrors,
        ...newTaskErrors,
      });
      setStep(2);
      return;
    }

    if (currentAsset?.id) {
      if (modalProperties?.role === 'edit') {
        dispatch(
          updateMaintenance(maintenance?.id as string, {
            ...data,
            machineId: currentAsset.id,
            intervalUnit,
            tasks: tasks.map(({ comments, ...task }) => task),
            documents: documents.map(({ id }) => ({ id })),
          }),
        );
      } else if (modalProperties?.role === 'copy' && maintenance && machine) {
        const newMaintenance = await copyMaintenance({
          ...maintenance,
          ...data,
          machineId: machine?.id,
          intervalUnit,
          tasks: tasks.map(task => ({
            ...task,
            id: (undefined as unknown) as string,
            documents: task.documents.map(({ id }) => ({ id })),
            comments: task.comments ? task.comments.map(({ id, ...comment }) => comment) : [],
          })),
          documents,
        });
        dispatch(getMachinesWithStatus);

        history.push(`/maintenance/${newMaintenance.id}`);
      } else {
        dispatch(
          createMaintenance({
            ...data,
            tasks: tasks.map(({ comments, ...task }) => task),
            intervalUnit,
            documents: documents.map(({ id }) => ({ id })),
            // files: newFiles,
            machineId: currentAsset.id,
          }),
        );
      }
    }
    dispatch(hideModal);
  };

  if (modalType !== CREATE_EDIT_MAINTENANCE) {
    return null;
  }

  const machinesFromLocation = (): AssetTreeNodeDto[] => {
    const result = location ? getMachines([], location) : [];
    return result;
  };
  const machinesFromDepartement = (): AssetTreeNodeDto[] => {
    const result = department ? getMachines([], department) : [];
    return result;
  };

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

    currentAsset?.children.map((child, idx) =>
      bcs.push({
        name: child.name.en_EN,
        link: `${mapLevelToLink[Number(idx + 1)]}/${child.id}`,
        level: Number(idx + 1),
      }),
    );

    return bcs;
  };

  return (
    <ReactModal
      isOpen={!!modalProperties?.open}
      style={{ content: { width: step === 1 ? 799 : 1015 } }}
      onRequestClose={() => dispatch(hideModal)}
    >
      <div className={common.modal.header}>
        <div className={common.modal.title}>
          {step === 2 ? (
            <Button
              onClick={() => setStep(1)}
              className="mr-3 px-0"
              width="auto"
              color="transparent"
            >
              <span className={common.icon.backarrow} />
            </Button>
          ) : (
            <span className={classNames(common.icon.repair, 'mr-3')} />
          )}
          {modalProperties?.role === 'edit' && t('editMaintenance')}
          {modalProperties?.role === 'create' && t('createNewMaintenance')}
          {modalProperties?.role === 'copy' && t('copyMaintenance')}
        </div>
        <Button
          variant="square"
          color="transparent"
          className={common.modal.close}
          onClick={() => dispatch(hideModal)}
        >
          <span className={common.icon.greycross} />
        </Button>
      </div>

      <div className={classNames(common.modal.body, 'pt-0 overflow-auto')}>
        {modalProperties?.role === 'copy' && step === 1 ? (
          <div className="d-flex justify-content-between">
            <Dropdown
              className={common.forms.w230}
              label={
                <div className="text-nowrap text-ellipsis">
                  <strong>{t('Location')}: </strong>
                  {location?.name.en_EN || t('choose')}
                </div>
              }
            >
              <DropdownItem onClick={resetAssets}>{t('all')}</DropdownItem>
              {allLocations?.map(loc => (
                <DropdownItem
                  selected={loc.id === location?.id}
                  key={`select-asset-to-copy-${loc.id}`}
                  onClick={() => setLocation(loc)}
                >
                  {loc.name.en_EN}
                </DropdownItem>
              ))}
            </Dropdown>
            <Dropdown
              className={common.forms.w230}
              label={
                <div className="text-nowrap text-ellipsis">
                  <strong>{t('Department')}: </strong>
                  {department?.name.en_EN || t('choose')}
                </div>
              }
            >
              <DropdownItem onClick={resetAssets}>{t('all')}</DropdownItem>
              {(location?.children || allDepartments)?.map(dep => (
                <DropdownItem
                  selected={dep.id === department?.id}
                  key={`select-asset-to-copy-${dep.id}`}
                  onClick={() => setDepartment(dep)}
                >
                  {dep.name.en_EN}
                </DropdownItem>
              ))}
            </Dropdown>
            <Dropdown
              className={common.forms.w230}
              isError={machineIdError}
              label={
                <div className="text-nowrap text-ellipsis">
                  <strong>{t('asset')}: </strong>
                  {machine?.name.en_EN || t('choose')}
                </div>
              }
            >
              <DropdownItem onClick={resetAssets}>{t('all')}</DropdownItem>
              {(department?.children
                ? machinesFromDepartement()
                : location
                ? machinesFromLocation()
                : allMachines
              )?.map(mach => (
                <DropdownItem
                  selected={mach.id === machine?.id}
                  key={`select-asset-to-copy-${mach.id}`}
                  onClick={() => setMachine(mach)}
                >
                  {mach.name.en_EN}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        ) : (
          <Breadcrumbs breadcrumbs={breadcrumbs()} />
        )}
        {step === 1 && (
          <FirstStep
            form={form}
            category={category}
            setCategory={setCategory}
            description={description}
            setDescription={setDescription}
            dueDate={dueDate}
            setDueDate={setDueDate}
            earliestExecTime={earliestExecTime}
            setEarliestExecTime={setEarliestExecTime}
            interval={interval}
            setRepeatInterval={setRepeatInterval}
            intervalUnit={intervalUnit}
            setIntervalUnit={setIntervalUnit}
            responsible={responsible}
            setResponsible={setResponsible}
            title={title}
            setTitle={setTitle}
            documents={documents}
            setDocuments={setDocuments}
            isInternal={isInternal}
            setIsInternal={setIsInternal}
            useOperatingHours={useOperatingHours}
            setUseOperatingHours={setUseOperatingHours}
            dueAt={dueAt}
            setDueAt={setDueAt}
            useDistance={useDistance}
            setUseDistance={setUseDistance}
            useStrokes={useStrokes}
            setUseStrokes={setUseStrokes}
            earliestProcessing={earliestProcessing}
            setEarliestProcessing={setEarliestProcessing}
            hasDeviceKey={hasDeviceKey}
          />
        )}
        {step === 2 && <SecondStep tasks={tasks} setTasks={setTasks} taskErrors={taskErrors} />}
      </div>

      <div className={classNames(common.modal.footer, 'mt-0')}>
        <Button variant="square" color="transparent">
          <span className={common.icon.help} />
        </Button>
        <div className="d-flex align-items-center">
          <Button variant="link" width="auto" onClick={() => dispatch(hideModal)}>
            {t('cancel')}
          </Button>
          <Button
            className="ml-3 py-0 pl-3 pr-4 d-flex align-items-center"
            width="auto"
            disabled={step === 2 && tasks.length < 1}
            onClick={form.handleSubmit(onSubmit)}
          >
            {step === 1 ? (
              <span className={classNames(common.icon.backarrowwhite, 'mr-2 rotate-180')} />
            ) : (
              <span className={classNames(common.icon.check, 'mr-2')} />
            )}
            {step === 1 && 'Weiter'}
            {step === 2 && modalProperties?.role === 'edit' && t('save')}
            {step === 2 && modalProperties?.role === 'create' && t('create')}
            {step === 2 && modalProperties?.role === 'copy' && t('createCopy')}
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};

export default CreateEditMaintenance;
