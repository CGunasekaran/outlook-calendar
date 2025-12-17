// lib/csvGenerator.ts
import { format } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';

export function generateCSV(events: CalendarEvent[], year: number) {
  const headers = ['Month', 'Date', 'Day', 'Event Name', 'Notes'];
  
  const rows = events
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(event => [
      format(event.date, 'MMMM'),
      format(event.date, 'yyyy-MM-dd'),
      format(event.date, 'EEEE'),
      event.ruleName,
      event.notes || ''
    ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `calendar-${year}.csv`;
  link.click();
}
