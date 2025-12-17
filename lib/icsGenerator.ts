// lib/icsGenerator.ts
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";

export function generateICS(events: CalendarEvent[], year: number): string {
  const icsLines: string[] = [];

  // ICS Header
  icsLines.push("BEGIN:VCALENDAR");
  icsLines.push("VERSION:2.0");
  icsLines.push("PRODID:-//Business Calendar Generator//EN");
  icsLines.push("CALSCALE:GREGORIAN");
  icsLines.push("METHOD:PUBLISH");
  icsLines.push(`X-WR-CALNAME:Business Calendar ${year}`);
  icsLines.push(`X-WR-CALDESC:Business events and important dates for ${year}`);

  // Add each event
  events.forEach((event, index) => {
    const eventDate = event.date;
    const dateStr = format(eventDate, "yyyyMMdd");
    const uid = `${event.id}-${dateStr}@business-calendar.com`;
    const now = new Date();
    const timestamp = format(now, "yyyyMMdd'T'HHmmss'Z'");

    // Event start
    icsLines.push("BEGIN:VEVENT");

    // Event properties
    icsLines.push(`UID:${uid}`);
    icsLines.push(`DTSTAMP:${timestamp}`);
    icsLines.push(`DTSTART;VALUE=DATE:${dateStr}`);
    icsLines.push(`DTEND;VALUE=DATE:${dateStr}`);
    icsLines.push(`SUMMARY:${escapeICSText(event.ruleName)}`);

    if (event.notes) {
      icsLines.push(`DESCRIPTION:${escapeICSText(event.notes)}`);
    }

    icsLines.push("STATUS:CONFIRMED");
    icsLines.push("TRANSP:TRANSPARENT"); // Mark as free time since these are business deadlines
    icsLines.push("CATEGORIES:Business,Deadline");

    // Set reminder for 1 day before
    icsLines.push("BEGIN:VALARM");
    icsLines.push("TRIGGER:-P1D"); // 1 day before
    icsLines.push("ACTION:DISPLAY");
    icsLines.push(
      `DESCRIPTION:Reminder: ${escapeICSText(event.ruleName)} is tomorrow`
    );
    icsLines.push("END:VALARM");

    // Event end
    icsLines.push("END:VEVENT");
  });

  // ICS Footer
  icsLines.push("END:VCALENDAR");

  return icsLines.join("\r\n");
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

export function downloadICS(events: CalendarEvent[], year: number): void {
  const icsContent = generateICS(events, year);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `business-calendar-${year}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
