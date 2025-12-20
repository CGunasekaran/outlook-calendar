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

const DEFAULT_EVENTS_TEXT = `Mid-Year Review - 15th of June
Year-End Close - 31st of December
Q1 Financial Review - 30th of March
Q2 Financial Review - 30th of June
Q3 Financial Review - 30th of September
Q4 Financial Review - 31st of December`;

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
    <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Calendar Configuration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Year Selection */}
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-white mb-2"
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
            className="w-32 px-3 py-2 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/20 backdrop-blur-sm text-white placeholder-white/60"
          />
        </div>

        {/* Events Text Area */}
        <div>
          <label
            htmlFor="eventsText"
            className="block text-sm font-medium text-white mb-2"
          >
            Calendar Events (one per line)
          </label>
          <textarea
            id="eventsText"
            rows={12}
            value={eventsText}
            onChange={(e) => setEventsText(e.target.value)}
            className="w-full px-4 py-4 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base leading-relaxed bg-white/20 backdrop-blur-sm text-white placeholder-white/60"
            placeholder="Enter your events here, one per line..."
            style={{
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              lineHeight: "1.6",
              letterSpacing: "0.02em",
            }}
          />
          <p className="mt-2 text-sm text-white/80">
            You can edit the events above. Each line should contain an event
            name and its schedule description.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Generate Calendar
          </button>
        </div>
      </form>
    </div>
  );
}
