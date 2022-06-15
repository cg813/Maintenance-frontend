import moment from 'moment';

import { TimeUnit } from '../models';
import { getTimezoneOffsetInSeconds } from './constants';

export const DATE_FORMAT = 'DD.MM.YYYY';
export const DATETIME_FORMAT = 'DD.MM.YYYY | HH:mm';

export const seconds = (s: number) => {
  let days = Math.floor(s / 60);
  const minutes = days % 60;
  days = (days - minutes) / 60;
  const hours = days % 24;
  days = (days - hours) / 24;

  return {
    [TimeUnit.seconds]: s % 60,
    [TimeUnit.minutes]: minutes,
    [TimeUnit.hours]: hours,
    [TimeUnit.days]: days,
  } as { [key: number]: number };
};

export const localTimeAsUTC = (date: Date) => new Date(date.getTime() - getTimezoneOffsetInSeconds());
export const UTCAsLocalTime = (date: Date) => new Date(date.getTime() + getTimezoneOffsetInSeconds());

export const date = (d: Date | string) => moment(
  UTCAsLocalTime(d instanceof Date ? d : new Date(d)),
).format(DATE_FORMAT);

export const datetime = (d: Date | string) => moment(
  UTCAsLocalTime(d instanceof Date ? d : new Date(d)),
).add(2, 'hours').format(DATETIME_FORMAT);
