// app/page.tsx
"use client";

import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";
import { generatePDF } from "@/lib/pdfGenerator";
import { generateCSV } from "@/lib/csvGenerator";
import { downloadICS } from "@/lib/icsGenerator";
import { parseEventsText, generateCalendarEvents } from "@/lib/eventParser";
import CalendarGrid from "@/components/CalendarGrid";
import UserInputForm, { FormData } from "@/components/UserInputForm";

export default function Home() {
  const [year, setYear] = useState(2026);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isCalendarGenerated, setIsCalendarGenerated] = useState(false);

  // Handle form submission
  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setYear(data.year);
    generateYearEvents(data);
    setIsCalendarGenerated(true);
  };

  // Generate all events for the year
  const generateYearEvents = (data: FormData) => {
    const parsedEvents = parseEventsText(data.eventsText);
    const allEvents = generateCalendarEvents(parsedEvents, data.year);
    setEvents(allEvents);
  };

  const handleDownloadPDF = () => {
    generatePDF(events, year);
  };

  const handleDownloadCSV = () => {
    generateCSV(events, year);
  };

  const handleDownloadOutlook = () => {
    downloadICS(events, year);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
          Production Calendar Generator
        </h1>

        {/* User Input Form */}
        <UserInputForm
          onFormSubmit={handleFormSubmit}
          currentYear={year}
          onYearChange={setYear}
        />

        {/* Download Buttons */}
        {isCalendarGenerated && events.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Export Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                📄 Download Calendar PDF
              </button>
              <button
                onClick={handleDownloadCSV}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                📊 Download Events CSV
              </button>
              <button
                onClick={handleDownloadOutlook}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                📅 Add to Outlook Calendar
              </button>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                💡 <strong>Outlook Calendar:</strong> Click "Add to Outlook
                Calendar" to download an .ics file. Open this file to import all
                events into your Outlook calendar with automatic reminders set
                for 1 day before each event.
              </p>
            </div>

            {/* Events Summary */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Calendar Summary
              </h3>
              <p className="text-blue-800">
                Generated {events.length} events for {year} from your custom
                event rules
              </p>
            </div>
          </div>
        )}

        {/* Calendar Grid Display */}
        {isCalendarGenerated && events.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Calendar Preview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }, (_, month) => {
                const monthEvents = events.filter((e) => e.month === month);
                return (
                  <CalendarGrid
                    key={month}
                    month={month}
                    year={year}
                    events={monthEvents}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
