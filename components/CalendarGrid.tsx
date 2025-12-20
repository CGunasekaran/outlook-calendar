// components/CalendarGrid.tsx
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";
import { CalendarEvent } from "@/types/calendar";

// Helper function to determine if a color is light
function isColorLight(hexColor: string): boolean {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}

interface CalendarGridProps {
  month: number;
  year: number;
  events: CalendarEvent[];
}

export default function CalendarGrid({
  month,
  year,
  events,
}: CalendarGridProps) {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const monthName = format(monthStart, "MMMM yyyy");
  const firstDayOfWeek = getDay(monthStart);

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl shadow-xl p-4 calendar-text">
      <h3 className="text-xl font-bold text-center mb-4 text-white">
        {monthName}
      </h3>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-sm text-white p-2 bg-white/20 rounded-t"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}

        {days.map((day) => {
          const dayEvents = getEventsForDate(day);
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;
          const isToday =
            format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

          return (
            <div
              key={day.toString()}
              className={`min-h-[90px] p-2 border rounded-lg transition-colors ${
                isWeekend ? "bg-white/5" : "bg-white/10"
              } ${
                isToday
                  ? "border-red-400 bg-red-500/20"
                  : dayEvents.length > 0
                  ? "border-blue-400"
                  : "border-white/30"
              } hover:shadow-sm backdrop-blur-sm`}
            >
              <div
                className={`font-semibold text-sm mb-1 ${
                  isToday ? "text-red-300" : "text-white"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="text-xs space-y-1">
                {dayEvents.map((event) => {
                  const eventColor = event.color || "#3B82F6";
                  const isLightColor = isColorLight(eventColor);

                  return (
                    <div
                      key={event.id}
                      className="px-1 py-0.5 rounded text-xs truncate cursor-pointer"
                      style={{
                        backgroundColor: eventColor + "20", // Add transparency
                        borderLeft: `3px solid ${eventColor}`,
                        color: isLightColor ? "#1F2937" : eventColor,
                      }}
                      title={`${event.ruleName}${
                        event.notes ? " - " + event.notes : ""
                      }`}
                    >
                      {event.ruleName.length > 12
                        ? event.ruleName.substring(0, 12) + "..."
                        : event.ruleName}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
