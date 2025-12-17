// lib/dateCalculations.ts
import { 
  addDays, 
  subDays, 
  getDay, 
  startOfMonth, 
  endOfMonth,
  isWeekend,
  nextMonday,
  previousFriday,
  format
} from 'date-fns';
import { EventRule } from '@/types/calendar';

export function isWorkingDay(date: Date, holidays: Date[] = []): boolean {
  if (isWeekend(date)) return false;
  
  // Check if date is in holidays array
  const dateStr = format(date, 'yyyy-MM-dd');
  return !holidays.some(holiday => format(holiday, 'yyyy-MM-dd') === dateStr);
}

export function getNextWorkingDay(date: Date, holidays: Date[] = []): Date {
  let current = date;
  while (!isWorkingDay(current, holidays)) {
    current = addDays(current, 1);
  }
  return current;
}

export function getPreviousFriday(date: Date): Date {
  const day = getDay(date);
  if (day === 0) return subDays(date, 2); // Sunday -> Friday
  if (day === 6) return subDays(date, 1); // Saturday -> Friday
  return date;
}

export function calculateEventDate(
  year: number,
  month: number,
  rule: EventRule,
  holidays: Date[] = []
): Date {
  let baseDate: Date;

  switch (rule.type) {
    case 'first-working-day':
      baseDate = startOfMonth(new Date(year, month, 1));
      return getNextWorkingDay(baseDate, holidays);

    case 'specific-day':
      baseDate = new Date(year, month, rule.dayOfMonth!);
      
      switch (rule.weekendBehavior) {
        case 'next-working-day':
          if (isWeekend(baseDate)) {
            return nextMonday(baseDate);
          }
          return getNextWorkingDay(baseDate, holidays);
          
        case 'previous-friday':
          if (isWeekend(baseDate)) {
            return getPreviousFriday(baseDate);
          }
          return baseDate;
          
        case 'no-shift':
        default:
          return baseDate;
      }

    default:
      return new Date(year, month, 1);
  }
}
