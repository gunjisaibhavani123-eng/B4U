import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const formatDateShort = (date) => {
  const d = dayjs(date);
  if (d.isToday()) return 'Today';
  if (d.isYesterday()) return 'Yesterday';
  return d.format('DD MMM');
};

export const formatDateFull = (date) => {
  return dayjs(date).format('DD MMM YYYY');
};

export const formatMonthYear = (date) => {
  return dayjs(date).format('MMMM YYYY');
};

export const getCurrentMonth = () => dayjs().month() + 1;
export const getCurrentYear = () => dayjs().year();
