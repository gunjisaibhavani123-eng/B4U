import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

export const useCurrentMonth = () => {
  const [date, setDate] = useState(dayjs());

  const month = date.month() + 1;
  const year = date.year();
  const label = date.format('MMMM YYYY');

  const goNext = useCallback(() => {
    setDate((d) => d.add(1, 'month'));
  }, []);

  const goPrev = useCallback(() => {
    setDate((d) => d.subtract(1, 'month'));
  }, []);

  const isCurrentMonth = dayjs().month() === date.month() && dayjs().year() === date.year();

  return { month, year, label, goNext, goPrev, isCurrentMonth };
};
