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
      const generatedEvents = parseEventRule(parsedEvent, year, month, index);
      events.push(...generatedEvents);
    });
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function parseEventRule(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number
): CalendarEvent[] {
  const rule = parsedEvent.rule.toLowerCase().trim();
  const events: CalendarEvent[] = [];

  try {
    // Daily patterns
    if (rule.includes("every day") || rule.includes("daily")) {
      return generateDailyEvents(parsedEvent, year, month, index);
    }

    // Weekly patterns
    if (rule.includes("every week") || rule.includes("weekly")) {
      return generateWeeklyEvents(parsedEvent, year, month, index);
    }

    // Monthly patterns
    if (rule.includes("every month") || rule.includes("monthly")) {
      return generateMonthlyEvents(parsedEvent, year, month, index);
    }

    // Specific day of week patterns
    const dayOfWeekPatterns = [
      "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
      "mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays", "sundays"
    ];
    
    for (const dayPattern of dayOfWeekPatterns) {
      if (rule.includes(`every ${dayPattern}`) || rule.includes(`all ${dayPattern}`)) {
        return generateDayOfWeekEvents(parsedEvent, year, month, index, dayPattern);
      }
    }

    // Bi-weekly patterns
    if (rule.includes("bi-weekly") || rule.includes("biweekly") || rule.includes("every two weeks")) {
      return generateBiWeeklyEvents(parsedEvent, year, month, index);
    }

    // Quarterly patterns
    if (rule.includes("quarterly") || rule.includes("every quarter")) {
      return generateQuarterlyEvents(parsedEvent, year, month, index);
    }

    // Semi-annual patterns
    if (rule.includes("semi-annual") || rule.includes("twice a year") || rule.includes("every 6 months")) {
      return generateSemiAnnualEvents(parsedEvent, year, month, index);
    }

    // Annual patterns
    if (rule.includes("annually") || rule.includes("yearly") || rule.includes("once a year")) {
      return generateAnnualEvents(parsedEvent, year, month, index);
    }

    // Last day of month patterns
    if (rule.includes("last day of") || rule.includes("end of month")) {
      return generateEndOfMonthEvents(parsedEvent, year, month, index);
    }

    // First/Second/Third/Fourth/Last occurrence of a day
    const ordinalMatches = rule.match(/(first|second|third|fourth|last)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
    if (ordinalMatches) {
      return generateOrdinalDayEvents(parsedEvent, year, month, index, ordinalMatches[1], ordinalMatches[2]);
    }

    // Business days patterns
    if (rule.includes("business day") || rule.includes("weekday") || rule.includes("working day")) {
      return generateBusinessDayEvents(parsedEvent, year, month, index);
    }

    // Single date patterns
    const singleDate = calculateEventDate(parsedEvent.rule, year, month);
    if (singleDate) {
      events.push({
        id: `${index}-${month}`,
        ruleName: parsedEvent.name,
        date: singleDate,
        month,
        year,
        notes: parsedEvent.description,
      });
    }

    return events;
  } catch (error) {
    console.warn(`Error parsing rule: ${parsedEvent.rule}`, error);
    return [];
  }
}

function generateDailyEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const ruleLower = parsedEvent.rule.toLowerCase();
  const excludeWeekends = ruleLower.includes("except weekends") || ruleLower.includes("weekdays only");
  
  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Generate events for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    
    // Skip weekends if specified
    if (excludeWeekends && isWeekend(date)) {
      continue;
    }
    
    events.push({
      id: `${index}-${month}-${day}`,
      ruleName: parsedEvent.name,
      date,
      month,
      year,
      notes: parsedEvent.description,
    });
  }
  
  return events;
}

function generateWeeklyEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const ruleLower = parsedEvent.rule.toLowerCase();
  
  // Default to Monday if no specific day is mentioned
  let targetDay = 1; // Monday
  
  // Check for specific day mentions
  const dayMatches = ruleLower.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
  if (dayMatches) {
    const dayMap = { 'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6 };
    targetDay = dayMap[dayMatches[1] as keyof typeof dayMap];
  }
  
  // Generate weekly events
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Find first occurrence of target day in month
  let currentDate = new Date(firstDay);
  while (currentDate.getDay() !== targetDay && currentDate <= lastDay) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Add weekly occurrences
  while (currentDate <= lastDay) {
    events.push({
      id: `${index}-${month}-${currentDate.getDate()}`,
      ruleName: parsedEvent.name,
      date: new Date(currentDate),
      month,
      year,
      notes: parsedEvent.description,
    });
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return events;
}

function generateDayOfWeekEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number,
  dayPattern: string
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const dayMap = { 
    'sunday': 0, 'sundays': 0,
    'monday': 1, 'mondays': 1,
    'tuesday': 2, 'tuesdays': 2,
    'wednesday': 3, 'wednesdays': 3,
    'thursday': 4, 'thursdays': 4,
    'friday': 5, 'fridays': 5,
    'saturday': 6, 'saturdays': 6
  };
  
  const targetDay = dayMap[dayPattern as keyof typeof dayMap];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Find first occurrence of target day in month
  let currentDate = new Date(firstDay);
  while (currentDate.getDay() !== targetDay && currentDate <= lastDay) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Add all occurrences of that day in the month
  while (currentDate <= lastDay) {
    events.push({
      id: `${index}-${month}-${currentDate.getDate()}`,
      ruleName: parsedEvent.name,
      date: new Date(currentDate),
      month,
      year,
      notes: parsedEvent.description,
    });
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return events;
}

function generateMonthlyEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number
): CalendarEvent[] {
  const ruleLower = parsedEvent.rule.toLowerCase();
  
  // Extract day number if specified
  const dayMatch = ruleLower.match(/(\d+)(?:st|nd|rd|th)?/);
  const day = dayMatch ? parseInt(dayMatch[1]) : 1;
  
  // Handle "last day" specifically
  if (ruleLower.includes("last day")) {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return [{
      id: `${index}-${month}`,
      ruleName: parsedEvent.name,
      date: new Date(year, month, lastDay),
      month,
      year,
      notes: parsedEvent.description,
    }];
  }
  
  // Regular monthly event on specified day
  if (day <= new Date(year, month + 1, 0).getDate()) {
    return [{
      id: `${index}-${month}`,
      ruleName: parsedEvent.name,
      date: new Date(year, month, day),
      month,
      year,
      notes: parsedEvent.description,
    }];
  }
  
  return [];
}

function generateBiWeeklyEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const ruleLower = parsedEvent.rule.toLowerCase();
  
  // Default to Monday if no specific day is mentioned
  let targetDay = 1;
  const dayMatches = ruleLower.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
  if (dayMatches) {
    const dayMap = { 'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6 };
    targetDay = dayMap[dayMatches[1] as keyof typeof dayMap];
  }
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Find first occurrence of target day in month
  let currentDate = new Date(firstDay);
  while (currentDate.getDay() !== targetDay && currentDate <= lastDay) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Add bi-weekly occurrences (every 14 days)
  while (currentDate <= lastDay) {
    events.push({
      id: `${index}-${month}-${currentDate.getDate()}`,
      ruleName: parsedEvent.name,
      date: new Date(currentDate),
      month,
      year,
      notes: parsedEvent.description,
    });
    currentDate.setDate(currentDate.getDate() + 14);
  }
  
  return events;
}

function generateQuarterlyEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number
): CalendarEvent[] {
  // Only generate events in quarter months (0, 3, 6, 9)
  if (month % 3 !== 0) return [];
  
  const ruleLower = parsedEvent.rule.toLowerCase();
  let day = 1;
  
  // Check for specific day
  const dayMatch = ruleLower.match(/(\d+)(?:st|nd|rd|th)?/);
  if (dayMatch) {
    day = parseInt(dayMatch[1]);
  } else if (ruleLower.includes("last day") || ruleLower.includes("end of")) {
    day = new Date(year, month + 1, 0).getDate();
  }
  
  return [{
    id: `${index}-${month}`,
    ruleName: parsedEvent.name,
    date: new Date(year, month, day),
    month,
    year,
    notes: parsedEvent.description,
  }];
}

function generateSemiAnnualEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number
): CalendarEvent[] {
  // Only generate events in January (0) and July (6)
  if (month !== 0 && month !== 6) return [];
  
  const ruleLower = parsedEvent.rule.toLowerCase();
  let day = 1;
  
  const dayMatch = ruleLower.match(/(\d+)(?:st|nd|rd|th)?/);
  if (dayMatch) {
    day = parseInt(dayMatch[1]);
  } else if (ruleLower.includes("last day") || ruleLower.includes("end of")) {
    day = new Date(year, month + 1, 0).getDate();
  }
  
  return [{
    id: `${index}-${month}`,
    ruleName: parsedEvent.name,
    date: new Date(year, month, day),
    month,
    year,
    notes: parsedEvent.description,
  }];
}

function generateAnnualEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number
): CalendarEvent[] {
  const ruleLower = parsedEvent.rule.toLowerCase();
  
  // Check if specific month is mentioned
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                     'july', 'august', 'september', 'october', 'november', 'december'];
  
  let targetMonth = 0; // Default to January
  for (let i = 0; i < monthNames.length; i++) {
    if (ruleLower.includes(monthNames[i])) {
      targetMonth = i;
      break;
    }
  }
  
  // Only generate event in the target month
  if (month !== targetMonth) return [];
  
  let day = 1;
  const dayMatch = ruleLower.match(/(\d+)(?:st|nd|rd|th)?/);
  if (dayMatch) {
    day = parseInt(dayMatch[1]);
  }
  
  return [{
    id: `${index}-${month}`,
    ruleName: parsedEvent.name,
    date: new Date(year, month, day),
    month,
    year,
    notes: parsedEvent.description,
  }];
}

function generateEndOfMonthEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number
): CalendarEvent[] {
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  return [{
    id: `${index}-${month}`,
    ruleName: parsedEvent.name,
    date: new Date(year, month, lastDay),
    month,
    year,
    notes: parsedEvent.description,
  }];
}

function generateOrdinalDayEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number,
  ordinal: string,
  dayName: string
): CalendarEvent[] {
  const dayMap = { 'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6 };
  const targetDay = dayMap[dayName as keyof typeof dayMap];
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  let occurrences: Date[] = [];
  let currentDate = new Date(firstDay);
  
  // Find all occurrences of the target day in the month
  while (currentDate <= lastDay) {
    if (currentDate.getDay() === targetDay) {
      occurrences.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  let targetDate: Date | null = null;
  
  switch (ordinal) {
    case 'first':
      targetDate = occurrences[0] || null;
      break;
    case 'second':
      targetDate = occurrences[1] || null;
      break;
    case 'third':
      targetDate = occurrences[2] || null;
      break;
    case 'fourth':
      targetDate = occurrences[3] || null;
      break;
    case 'last':
      targetDate = occurrences[occurrences.length - 1] || null;
      break;
  }
  
  if (targetDate) {
    return [{
      id: `${index}-${month}`,
      ruleName: parsedEvent.name,
      date: targetDate,
      month,
      year,
      notes: parsedEvent.description,
    }];
  }
  
  return [];
}

function generateBusinessDayEvents(
  parsedEvent: ParsedEvent,
  year: number,
  month: number,
  index: number
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const ruleLower = parsedEvent.rule.toLowerCase();
  
  // If it's a specific business day (like "first business day")
  if (ruleLower.includes("first business day") || ruleLower.includes("first working day")) {
    const firstBusinessDay = getFirstWorkingDay(year, month);
    return [{
      id: `${index}-${month}`,
      ruleName: parsedEvent.name,
      date: firstBusinessDay,
      month,
      year,
      notes: parsedEvent.description,
    }];
  }
  
  // If it's "last business day"
  if (ruleLower.includes("last business day") || ruleLower.includes("last working day")) {
    const lastBusinessDay = getLastWorkingDay(year, month);
    return [{
      id: `${index}-${month}`,
      ruleName: parsedEvent.name,
      date: lastBusinessDay,
      month,
      year,
      notes: parsedEvent.description,
    }];
  }
  
  // If it's "every business day" or "all business days"
  if (ruleLower.includes("every business day") || ruleLower.includes("all business days") || ruleLower.includes("every weekday")) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (!isWeekend(date)) {
        events.push({
          id: `${index}-${month}-${day}`,
          ruleName: parsedEvent.name,
          date,
          month,
          year,
          notes: parsedEvent.description,
        });
      }
    }
  }
  
  return events;
}

function calculateEventDate(
  rule: string,
  year: number,
  month: number
): Date | null {
  const ruleLower = rule.toLowerCase();

  try {
    // ISO Date format (YYYY-MM-DD)
    const isoDateMatch = rule.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoDateMatch) {
      const eventYear = parseInt(isoDateMatch[1]);
      const eventMonth = parseInt(isoDateMatch[2]) - 1; // JS months are 0-based
      const eventDay = parseInt(isoDateMatch[3]);
      if (eventYear === year && eventMonth === month) {
        return new Date(year, month, eventDay);
      }
      return null;
    }

    // Date format (MM/DD/YYYY or DD/MM/YYYY)
    const dateSlashMatch = rule.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dateSlashMatch) {
      const eventYear = parseInt(dateSlashMatch[3]);
      const eventMonth = parseInt(dateSlashMatch[1]) - 1; // Assume MM/DD/YYYY format
      const eventDay = parseInt(dateSlashMatch[2]);
      if (eventYear === year && eventMonth === month) {
        return new Date(year, month, eventDay);
      }
      return null;
    }

    // Month name patterns (e.g., "January 15", "15th of June")
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    for (let i = 0; i < monthNames.length; i++) {
      const monthName = monthNames[i];
      if (ruleLower.includes(monthName)) {
        if (i === month) {
          // Extract day number
          const dayMatch = ruleLower.match(/(\d+)(?:st|nd|rd|th)?/);
          if (dayMatch) {
            const day = parseInt(dayMatch[1]);
            if (day >= 1 && day <= new Date(year, month + 1, 0).getDate()) {
              return new Date(year, month, day);
            }
          }
        }
        return null; // Wrong month
      }
    }

    // Time-based patterns with dates
    const timePatternMatch = ruleLower.match(/(\d+)(?:st|nd|rd|th)?\s+(?:at\s+)?(\d{1,2}):?(\d{0,2})\s*(?:am|pm)?/);
    if (timePatternMatch) {
      const day = parseInt(timePatternMatch[1]);
      if (day >= 1 && day <= new Date(year, month + 1, 0).getDate()) {
        return new Date(year, month, day);
      }
    }

    // Christmas, New Year, and other holidays
    const holidays = {
      'christmas': [11, 25], // December 25
      'new year': [0, 1],    // January 1
      'valentine': [1, 14],  // February 14
      'halloween': [9, 31],  // October 31
      'independence day': [6, 4] // July 4
    };
    
    for (const [holidayName, [holidayMonth, holidayDay]] of Object.entries(holidays)) {
      if (ruleLower.includes(holidayName) && month === holidayMonth) {
        return new Date(year, month, holidayDay);
      }
    }

    // First working day
    if (ruleLower.includes("first working day") || ruleLower.includes("first business day")) {
      return getFirstWorkingDay(year, month);
    }

    // Last working day
    if (ruleLower.includes("last working day") || ruleLower.includes("last business day")) {
      return getLastWorkingDay(year, month);
    }

    // First of month
    if (ruleLower.includes("first of") || ruleLower.includes("1st of")) {
      return new Date(year, month, 1);
    }

    // Second of month
    if (ruleLower.includes("2nd of") || ruleLower.includes("second of")) {
      return new Date(year, month, 2);
    }

    // Third of month
    if (ruleLower.includes("3rd of") || ruleLower.includes("third of")) {
      return new Date(year, month, 3);
    }

    // Simple day number patterns
    for (let day = 1; day <= 31; day++) {
      const patterns = [
        `${day}st`, `${day}nd`, `${day}rd`, `${day}th`,
        ` ${day} `, `^${day} `, ` ${day}$`, `^${day}$`
      ];
      
      for (const pattern of patterns) {
        const regex = new RegExp(pattern.replace(/\^|\$/g, ''), 'i');
        if (regex.test(` ${ruleLower} `)) {
          if (day <= new Date(year, month + 1, 0).getDate()) {
            return new Date(year, month, day);
          }
        }
      }
    }

    // Weekend handling patterns
    if (ruleLower.includes("9th") && ruleLower.includes("previous friday")) {
      const date = new Date(year, month, 9);
      if (isWeekend(date)) {
        return getPreviousFriday(date);
      }
      return date;
    }

    if (ruleLower.includes("12th") && ruleLower.includes("next monday")) {
      const date = new Date(year, month, 12);
      if (isWeekend(date)) {
        return getNextMonday(date);
      }
      return date;
    }

    if (ruleLower.includes("13th") && ruleLower.includes("next working day")) {
      const date = new Date(year, month, 13);
      if (isWeekend(date)) {
        return getNextWorkingDay(date);
      }
      return date;
    }

    // January-only events
    if (ruleLower.includes("first month") || ruleLower.includes("only in january")) {
      if (month === 0) { // January
        const dayMatch = ruleLower.match(/(\d+)(?:st|nd|rd|th)?/);
        if (dayMatch) {
          const day = parseInt(dayMatch[1]);
          return new Date(year, month, day);
        }
      }
      return null; // Skip for other months
    }

    // General patterns
    const dayMatch = ruleLower.match(/(\d+)(?:st|nd|rd|th)?\s+of\s+every\s+month/) ||
                    ruleLower.match(/every\s+(\d+)(?:st|nd|rd|th)?/);
    if (dayMatch) {
      const day = parseInt(dayMatch[1]);
      if (day >= 1 && day <= new Date(year, month + 1, 0).getDate()) {
        return new Date(year, month, day);
      }
    }

    // Runs every patterns
    if (ruleLower.includes("runs every")) {
      const runsDayMatch = ruleLower.match(/runs every (\d+)(?:st|nd|rd|th)?/);
      if (runsDayMatch) {
        const day = parseInt(runsDayMatch[1]);
        if (day >= 1 && day <= new Date(year, month + 1, 0).getDate()) {
          const date = new Date(year, month, day);
          if (ruleLower.includes("previous friday") && isWeekend(date)) {
            return getPreviousFriday(date);
          }
          return date;
        }
      }
    }

    return null;
  } catch (error) {
    console.warn(`Could not parse rule: ${rule}`, error);
    return null;
  }
}
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

    // January-only events
    if (
      ruleLower.includes("first month") ||
      ruleLower.includes("only in january")
    ) {
      if (month === 0) {
        // January
        if (ruleLower.includes("9th") || ruleLower.includes("9 ")) {
          return new Date(year, month, 9);
        }
        if (ruleLower.includes("23rd") || ruleLower.includes("23 ")) {
          return new Date(year, month, 23);
        }
      }
      return null; // Skip for other months
    }

    // General day patterns with "of every month" or "every [day]"
    const dayMatch =
      ruleLower.match(/(\d+)(?:st|nd|rd|th)?\s+of\s+every\s+month/) ||
      ruleLower.match(/every\s+(\d+)(?:st|nd|rd|th)?/);
    if (dayMatch) {
      const day = parseInt(dayMatch[1]);
      if (day >= 1 && day <= 31) {
        return new Date(year, month, day);
      }
    }

    // Catch "runs every" patterns
    if (ruleLower.includes("runs every")) {
      const runsDayMatch = ruleLower.match(/runs every (\d+)(?:st|nd|rd|th)?/);
      if (runsDayMatch) {
        const day = parseInt(runsDayMatch[1]);
        if (day >= 1 && day <= 31) {
          const date = new Date(year, month, day);
          // Apply weekend shifting if mentioned
          if (ruleLower.includes("previous friday") && isWeekend(date)) {
            return getPreviousFriday(date);
          }
          return date;
        }
      }
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

function getLastWorkingDay(year: number, month: number): Date {
  let date = new Date(year, month + 1, 0); // Last day of month

  while (isWeekend(date)) {
    date.setDate(date.getDate() - 1);
  }

  return date;
}
