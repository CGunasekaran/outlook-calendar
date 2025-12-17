// types/calendar.ts
export interface EventRule {
  id: string;
  name: string;
  type: "first-working-day" | "specific-day" | "nth-day" | "custom";
  dayOfMonth?: number;
  weekendBehavior: "next-working-day" | "previous-friday" | "no-shift";
  description: string;
}

export interface CalendarEvent {
  id: string;
  ruleName: string;
  date: Date;
  month: number;
  year: number;
  notes?: string;
  color?: string;
}

export interface MonthData {
  month: number;
  year: number;
  events: CalendarEvent[];
}
