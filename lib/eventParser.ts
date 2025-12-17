// lib/eventParser.ts
import { CalendarEvent } from "@/types/calendar";

export interface ParsedEvent {
  name: string;
  rule: string;
  description: string;
}

export function parseEventsText(eventsText: string): ParsedEvent[] {
  const lines = eventsText.split("\n").filter((line) => line.trim());

  return lines.map((line) => {
    const [name, ...descriptionParts] = line.split(" - ");
    const description = descriptionParts.join(" - ");

    return {
      name: name.trim(),
      rule: description.trim(),
      description: description.trim(),
    };
  });
}

export function generateCalendarEvents(
  parsedEvents: ParsedEvent[],
  year: number
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (let month = 0; month < 12; month++) {
    parsedEvents.forEach((parsedEvent, index) => {
      const date = calculateEventDate(parsedEvent.rule, year, month);
      if (date) {
        events.push({
          id: `${index}-${month}`,
          ruleName: parsedEvent.name,
          date,
          month,
          year,
          notes: parsedEvent.description,
        });
      }
    });
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function calculateEventDate(
  rule: string,
  year: number,
  month: number
): Date | null {
  const ruleLower = rule.toLowerCase();

  try {
    // First working day
    if (ruleLower.includes("first working day")) {
      return getFirstWorkingDay(year, month);
    }

    // First of month
    if (ruleLower.includes("first of") || ruleLower.includes("1st of")) {
      return new Date(year, month, 1);
    }

    // Second of month
    if (ruleLower.includes("2nd of")) {
      return new Date(year, month, 2);
    }

    // 9th with weekend handling
    if (ruleLower.includes("9th") && ruleLower.includes("previous friday")) {
      const date = new Date(year, month, 9);
      if (isWeekend(date)) {
        return getPreviousFriday(date);
      }
      return date;
    }

    // 12th with weekend handling
    if (ruleLower.includes("12th") && ruleLower.includes("next monday")) {
      const date = new Date(year, month, 12);
      if (isWeekend(date)) {
        return getNextMonday(date);
      }
      return date;
    }

    // 13th with weekend handling
    if (ruleLower.includes("13th") && ruleLower.includes("next working day")) {
      const date = new Date(year, month, 13);
      if (isWeekend(date)) {
        return getNextWorkingDay(date);
      }
      return date;
    }

    // 15th (no shifting)
    if (ruleLower.includes("15th")) {
      return new Date(year, month, 15);
    }

    // 19th (no shifting)
    if (ruleLower.includes("19th")) {
      return new Date(year, month, 19);
    }

    return null;
  } catch (error) {
    console.warn(`Could not parse rule: ${rule}`, error);
    return null;
  }
}

function getFirstWorkingDay(year: number, month: number): Date {
  let date = new Date(year, month, 1);

  while (isWeekend(date)) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
}

function getPreviousFriday(date: Date): Date {
  const newDate = new Date(date);
  const daysToSubtract = date.getDay() === 0 ? 2 : 1; // If Sunday, go back 2 days; if Saturday, go back 1 day
  newDate.setDate(newDate.getDate() - daysToSubtract);
  return newDate;
}

function getNextMonday(date: Date): Date {
  const newDate = new Date(date);
  const daysToAdd = date.getDay() === 0 ? 1 : 2; // If Sunday, add 1 day; if Saturday, add 2 days
  newDate.setDate(newDate.getDate() + daysToAdd);
  return newDate;
}

function getNextWorkingDay(date: Date): Date {
  const newDate = new Date(date);

  do {
    newDate.setDate(newDate.getDate() + 1);
  } while (isWeekend(newDate));

  return newDate;
}
