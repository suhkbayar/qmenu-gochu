import { isEmpty } from 'lodash';
import moment from 'moment';

export const numberFormat = new Intl.NumberFormat();
export const optionsCalc = (options: any) => {
  if (isEmpty(options)) {
    return [];
  } else {
    return options
      .map((option: any) => option.price)
      .reduce((acc: any, a: any) => {
        return acc + a;
      }, 0);
  }
};

export const parseConfig = (value: string): any | null => {
  try {
    return value === undefined ? null : JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const isCurrentlyOpen = (timetable?: any): boolean => {
  if (!timetable) return true;

  const now = moment();
  const day = now.format('ddd').toLowerCase(); // mon, tue, etc.

  const isDayActive = timetable?.[day];
  const open = timetable?.[`${day}Open`];
  const close = timetable?.[`${day}Close`];

  if (!isDayActive) return false;

  if (!isDayActive || !open || !close) return true;

  // Use full datetime for today
  const todayStr = now.format('YYYY-MM-DD');
  const openTime = moment(`${todayStr} ${open}`, 'YYYY-MM-DD HH:mm');
  let closeTime = moment(`${todayStr} ${close}`, 'YYYY-MM-DD HH:mm');
  // Handle overnight shift (e.g. open: 22:00, close: 02:00 next day)
  if (closeTime.isBefore(openTime)) {
    closeTime.add(1, 'day');
  }

  return now.isBetween(openTime, closeTime);
};
