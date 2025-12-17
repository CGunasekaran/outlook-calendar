// components/UserInputForm.tsx
"use client";

import { useState } from "react";

interface UserInputFormProps {
  onFormSubmit: (data: FormData) => void;
  currentYear: number;
  onYearChange: (year: number) => void;
}

export interface FormData {
  year: number;
  eventsText: string;
}

const DEFAULT_EVENTS_TEXT = `NA Monthend - first working day of every month
EU Monthend - 2nd of every month, no holiday shifting
EU Revenue Allocations - 12th of every month, if 12th is weekend, then the next Monday
GLOBAL IMPRS - 13th of every month, if 13th is weekend then the next working day
NA F&V allocations - 15th of every month, no holiday shifting
EU F&V allocations - 19th of every month, no holiday shifting
IMG Allocations and adjustments - 15th of every month, no holiday shifting
EU cost corrections - runs every 9th, if 9th is weekend it runs on the previous Friday
Money currency update - first of every month
EU Dealer price extract - 1st of every month`;

export default function UserInputForm({
  onFormSubmit,
  currentYear,
  onYearChange,
}: UserInputFormProps) {
  const [eventsText, setEventsText] = useState(DEFAULT_EVENTS_TEXT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: FormData = {
      year: currentYear,
      eventsText,
    };

    onFormSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Calendar Configuration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Year Selection */}
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Calendar Year
          </label>
          <input
            type="number"
            id="year"
            min="2020"
            max="2050"
            value={currentYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        {/* Events Text Area */}
        <div>
          <label
            htmlFor="eventsText"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Calendar Events (one per line)
          </label>
          <textarea
            id="eventsText"
            rows={12}
            value={eventsText}
            onChange={(e) => setEventsText(e.target.value)}
            className="w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base leading-relaxed bg-gray-50 text-black"
            placeholder="Enter your events here, one per line..."
            style={{
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              lineHeight: "1.6",
              letterSpacing: "0.02em",
              color: "#000000",
            }}
          />
          <p className="mt-2 text-sm text-gray-600">
            You can edit the events above. Each line should contain an event
            name and its schedule description.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Generate Calendar
          </button>
        </div>
      </form>
    </div>
  );
}
