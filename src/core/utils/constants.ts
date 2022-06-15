import { TimeUnit, IntervalUnit } from '../models';
import { getFileUrl } from '../services/file.service';

export const statuses: { [key: string]: string } = {
  scheduled: 'geplant',
  dueSoon: 'bald fällig',
  overdue: 'überfällig',
  // completed: 'abgeschlossen',
};

export const mapColorByStatus: { [key: string]: 'green' | 'red' | 'yellow' | 'black' } = {
  scheduled: 'black',
  dueSoon: 'yellow',
  overdue: 'red',
  completed: 'green',
};

export const timeUnitLabels: { [key: number]: string } = {
  [TimeUnit.seconds]: 'choose',
  [TimeUnit.minutes]: 'minutes',
  [TimeUnit.hours]: 'hours',
  [TimeUnit.days]: 'days',
};

export const intervalLabels: { [key: number]: string } = {
  [IntervalUnit.yearly]: 'yearly',
  [IntervalUnit.monthly]: 'monthly',
  [IntervalUnit.weekly]: 'weekly',
  [IntervalUnit.daily]: 'daily',
  [IntervalUnit.hourly]: 'hourly',
  [IntervalUnit.km]: 'kilometers',
  [IntervalUnit.no]: 'No of Strokes'
};

export const intervalLabelsSingular: { [key: number]: string } = {
  [IntervalUnit.yearly]: 'year',
  [IntervalUnit.monthly]: 'month',
  [IntervalUnit.weekly]: 'week',
  [IntervalUnit.daily]: 'day',
  [IntervalUnit.hourly]: 'hour',
};

export const intervals: IntervalUnit[] = [
  IntervalUnit.yearly,
  IntervalUnit.monthly,
  IntervalUnit.weekly,
  IntervalUnit.daily,
  IntervalUnit.hourly,
];

export const internalExternal: { [key: number]: string } = {
  1: 'internal',
  0: 'external',
};

export const fileTypes = {
  video: [
    'mkv',
    'webm',
    'mov',
    'avi',
    'mp3',
    'wav',
    'mp4',
    'm4v',
  ],
};

export const getTimezoneOffsetInSeconds = () => new Date().getTimezoneOffset() * 60000;
