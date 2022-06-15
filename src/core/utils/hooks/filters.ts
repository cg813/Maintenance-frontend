import { useState } from 'react';

import { Filters, Sorting } from '../../models';

export const useFilters = (initialFilters: Filters = {}) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const setStatus = (status: string) => setFilters({ ...filters, status });
  const setResponsible = (responsible: string) => setFilters({ ...filters, responsible });
  const setSearchString = (searchString: string) => setFilters({ ...filters, searchString });
  const setIsInternal = (isInternal?: boolean) => setFilters({ ...filters, isInternal });
  const setDate = (date: Date) => {
    switch (true) {
      case !filters.startDate:
        setFilters({ ...filters, startDate: date });
        break;
      case filters.startDate && date < filters.startDate:
        setFilters({ ...filters, endDate: filters.startDate, startDate: date });
        break;
      case filters.endDate && date > filters.endDate:
        setFilters({ ...filters, startDate: filters.endDate, endDate: date });
        break;
      default:
        setFilters({ ...filters, endDate: date });
    }
  };
  const setMaintenanceId = (maintenanceId: string) => setFilters({ ...filters, maintenanceId });
  const setTaskId = (taskId: string) => setFilters({ ...filters, taskId });
  const setAssetId = (assetId: string) => setFilters({ ...filters, assetId });
  const clearDates = () => setFilters({ ...filters, startDate: null, endDate: null });
  const setSorting = (sorting: Sorting) => {
    if (sorting.target !== filters.sorting?.target) {
      setFilters({ ...filters, sorting: { ...sorting, order: 'ASC' } });
    } else {
      setFilters({ ...filters, sorting });
    }
  };
  const setDefaultSorting = () => {
    if (initialFilters.sorting) {
      setSorting(initialFilters.sorting);
    }
  };
  const clearSorting = (setDefault = false) => {
    const nextFilters = { ...filters };
    delete nextFilters.sorting;
    if (setDefault) {
      setDefaultSorting();
    } else {
      setFilters(nextFilters);
    }
  };
  const toggleSorting = (target: string, setDefault = false, ignore?: string[]) => {
    if (ignore?.includes(target)) {
      return;
    }

    if (filters.sorting?.order === 'ASC') {
      setSorting({ target, order: 'DESC' });
    } else if (filters.sorting?.order === 'DESC' && target === filters.sorting.target) {
      clearSorting(setDefault);
    } else {
      setSorting({ target, order: 'ASC' });
    }
  };

  return {
    filters,
    setFilters,
    setDate,
    setStatus,
    setMaintenanceId,
    setTaskId,
    setAssetId,
    setSorting,
    clearDates,
    clearSorting,
    toggleSorting,
    setDefaultSorting,
    setResponsible,
    setSearchString,
    setIsInternal,
  };
};
