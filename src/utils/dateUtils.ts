import { format, parse, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const formatDate = (date: string | Date) => {
  if (typeof date === 'string') {
    return format(parse(date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy');
  }
  return format(date, 'MMM dd, yyyy');
};

export const getLastNMonths = (n: number) => {
  const today = new Date();
  const months = [];
  
  for (let i = 0; i < n; i++) {
    const date = subMonths(today, i);
    months.push({
      startDate: startOfMonth(date),
      endDate: endOfMonth(date),
      label: format(date, 'MMMM yyyy')
    });
  }
  
  return months;
};

export const parseFilterDates = (startDate: string, endDate: string) => {
  return {
    startDate: parse(startDate, 'yyyy-MM-dd', new Date()),
    endDate: parse(endDate, 'yyyy-MM-dd', new Date())
  };
};