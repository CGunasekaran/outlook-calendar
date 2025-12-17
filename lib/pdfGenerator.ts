// lib/pdfGenerator.ts
import jsPDF from "jspdf";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isWeekend,
} from "date-fns";
import { CalendarEvent } from "@/types/calendar";
import { FormData } from "@/components/UserInputForm";

export function generatePDF(
  events: CalendarEvent[],
  year: number,
  formData?: FormData
) {
  const doc = new jsPDF("l", "mm", "a4"); // Landscape orientation for calendar layout

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Title page
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  const title = `IBIS ${year} Production Calendar`;
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, pageHeight / 2 - 20);

  doc.setFontSize(12);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate calendar pages (one month per page)
  for (let month = 0; month < 12; month++) {
    doc.addPage();
    generateMonthCalendar(doc, month, year, events, pageWidth, pageHeight);
  }

  // Summary page with all events
  doc.addPage();
  generateEventsSummary(doc, events, year, pageWidth, pageHeight);

  doc.save(`business-calendar-${year}.pdf`);
}

function generateMonthCalendar(
  doc: jsPDF,
  month: number,
  year: number,
  events: CalendarEvent[],
  pageWidth: number,
  pageHeight: number
) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);

  const margin = 15;
  const headerHeight = 25;
  const calendarWidth = pageWidth - 2 * margin;
  const calendarHeight = pageHeight - headerHeight - 2 * margin;

  // Month and year header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const monthTitle = `${monthNames[month]} ${year}`;
  const titleWidth = doc.getTextWidth(monthTitle);
  doc.text(monthTitle, (pageWidth - titleWidth) / 2, margin + 15);

  // Calendar grid
  const cellWidth = calendarWidth / 7;
  const cellHeight = calendarHeight / 7; // 6 weeks + header
  const startX = margin;
  const startY = margin + headerHeight;

  // Draw grid lines
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);

  // Vertical lines
  for (let i = 0; i <= 7; i++) {
    doc.line(
      startX + i * cellWidth,
      startY,
      startX + i * cellWidth,
      startY + 6 * cellHeight
    );
  }

  // Horizontal lines
  for (let i = 0; i <= 6; i++) {
    doc.line(
      startX,
      startY + i * cellHeight,
      startX + calendarWidth,
      startY + i * cellHeight
    );
  }

  // Day headers
  const dayHeaders = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);

  dayHeaders.forEach((day, index) => {
    const x = startX + index * cellWidth + cellWidth / 2;
    const y = startY + cellHeight / 2;
    const textWidth = doc.getTextWidth(day);
    doc.text(day, x - textWidth / 2, y + 2);
  });

  // Draw calendar days
  doc.setTextColor(0, 0, 0);

  // Empty cells for days before month starts
  let currentRow = 1;
  let currentCol = firstDayOfWeek;

  // Draw days
  days.forEach((day, dayIndex) => {
    const x = startX + currentCol * cellWidth;
    const y = startY + currentRow * cellHeight;

    // Day number
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    const dayNumber = format(day, "d");
    const isWeekendDay = isWeekend(day);

    // Events for this day
    const dayEvents = events.filter(
      (event) => format(event.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );

    // Background colors based on content
    if (dayEvents.length > 0) {
      // Light blue background for days with events
      doc.setFillColor(230, 240, 255);
      doc.rect(x, y, cellWidth, cellHeight, "F");

      // Add border for event days
      doc.setDrawColor(100, 150, 255);
      doc.setLineWidth(1);
      doc.rect(x, y, cellWidth, cellHeight, "S");
    } else if (isWeekendDay) {
      // Light gray background for weekends without events
      doc.setFillColor(248, 248, 248);
      doc.rect(x, y, cellWidth, cellHeight, "F");
    }

    // Day number styling
    if (dayEvents.length > 0) {
      // Bold and darker for event days
      doc.setTextColor(0, 0, 100);
      doc.setFont("helvetica", "bold");
    } else {
      doc.setTextColor(isWeekendDay ? 150 : 0, 0, 0);
      doc.setFont("helvetica", isWeekendDay ? "normal" : "bold");
    }

    doc.text(dayNumber, x + 3, y + 10);

    if (dayEvents.length > 0) {
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 100);

      dayEvents.slice(0, 4).forEach((event, eventIndex) => {
        const eventY = y + 15 + eventIndex * 6;
        let eventText = event.ruleName;

        // Truncate text to fit cell
        while (
          doc.getTextWidth(eventText) > cellWidth - 6 &&
          eventText.length > 3
        ) {
          eventText = eventText.substring(0, eventText.length - 1);
        }
        if (eventText !== event.ruleName) {
          eventText += "...";
        }

        doc.text(eventText, x + 2, eventY);
      });

      // Show "+" if more events
      if (dayEvents.length > 4) {
        doc.setTextColor(100, 100, 100);
        doc.text(`+${dayEvents.length - 4} more`, x + 2, y + cellHeight - 5);
      }
    }

    // Move to next cell
    currentCol++;
    if (currentCol >= 7) {
      currentCol = 0;
      currentRow++;
    }
  });
}

function generateEventsSummary(
  doc: jsPDF,
  events: CalendarEvent[],
  year: number,
  pageWidth: number,
  pageHeight: number
) {
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`${year} Events Summary`, 20, 25);

  let yPosition = 45;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  for (let month = 0; month < 12; month++) {
    const monthEvents = events.filter((e) => e.month === month);

    if (monthEvents.length === 0) continue;

    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 25;
    }

    // Month header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 150);
    doc.text(monthNames[month], 20, yPosition);
    yPosition += 8;

    // Events list
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    monthEvents
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .forEach((event) => {
        const dateStr = format(event.date, "EEE, MMM dd");
        const text = `${dateStr} - ${event.ruleName}`;

        doc.text(text, 25, yPosition);
        yPosition += 5;

        if (event.notes) {
          doc.setTextColor(100, 100, 100);
          doc.text(`   Note: ${event.notes}`, 25, yPosition);
          doc.setTextColor(0, 0, 0);
          yPosition += 5;
        }

        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 25;
        }
      });

    yPosition += 5;
  }
}
