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
  const [showPatternHelp, setShowPatternHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: FormData = {
      year: currentYear,
      eventsText,
    };

    onFormSubmit(formData);
  };

  return (
    <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl shadow-xl p-6 mb-8 relative">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">
          Calendar Configuration
        </h2>
        <button
          type="button"
          onClick={() => setShowPatternHelp(true)}
          className="group relative flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/30 border border-blue-400/50 hover:bg-blue-500/50 transition-all duration-200"
          title="View allowed patterns"
        >
          <span className="text-blue-200 text-sm font-bold">i</span>
        </button>
      </div>

      {/* Pattern Help Popup */}
      {showPatternHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h3 className="text-2xl font-bold text-white">
                📅 Supported Event Patterns
              </h3>
              <button
                onClick={() => setShowPatternHelp(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Date Patterns */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-200">📅 Basic Dates</h4>
                  <div className="space-y-1 text-sm text-white/80">
                    <div><code className="text-green-300">"15th of June"</code></div>
                    <div><code className="text-green-300">"March 30th"</code></div>
                    <div><code className="text-green-300">"December 31st"</code></div>
                    <div><code className="text-green-300">"2026-06-15"</code></div>
                    <div><code className="text-green-300">"06/15/2026"</code></div>
                  </div>
                </div>

                {/* Daily Patterns */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-200">🔄 Daily Patterns</h4>
                  <div className="space-y-1 text-sm text-white/80">
                    <div><code className="text-green-300">"every day"</code></div>
                    <div><code className="text-green-300">"daily"</code></div>
                    <div><code className="text-green-300">"every day except weekends"</code></div>
                    <div><code className="text-green-300">"weekdays only"</code></div>
                  </div>
                </div>

                {/* Weekly Patterns */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-200">📊 Weekly Patterns</h4>
                  <div className="space-y-1 text-sm text-white/80">
                    <div><code className="text-green-300">"every Monday"</code></div>
                    <div><code className="text-green-300">"every Friday"</code></div>
                    <div><code className="text-green-300">"weekly"</code></div>
                    <div><code className="text-green-300">"bi-weekly"</code></div>
                    <div><code className="text-green-300">"every two weeks"</code></div>
                  </div>
                </div>

                {/* Monthly Patterns */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-200">🗓️ Monthly Patterns</h4>
                  <div className="space-y-1 text-sm text-white/80">
                    <div><code className="text-green-300">"monthly"</code></div>
                    <div><code className="text-green-300">"15th of every month"</code></div>
                    <div><code className="text-green-300">"last day of month"</code></div>
                    <div><code className="text-green-300">"end of month"</code></div>
                  </div>
                </div>

                {/* Business Day Patterns */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-200">💼 Business Days</h4>
                  <div className="space-y-1 text-sm text-white/80">
                    <div><code className="text-green-300">"first business day"</code></div>
                    <div><code className="text-green-300">"last working day"</code></div>
                    <div><code className="text-green-300">"every business day"</code></div>
                    <div><code className="text-green-300">"first working day"</code></div>
                  </div>
                </div>

                {/* Ordinal Patterns */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-200">🎯 Ordinal Days</h4>
                  <div className="space-y-1 text-sm text-white/80">
                    <div><code className="text-green-300">"first Monday"</code></div>
                    <div><code className="text-green-300">"second Tuesday"</code></div>
                    <div><code className="text-green-300">"third Wednesday"</code></div>
                    <div><code className="text-green-300">"last Friday"</code></div>
                  </div>
                </div>

                {/* Quarterly/Annual */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-200">📈 Periodic</h4>
                  <div className="space-y-1 text-sm text-white/80">
                    <div><code className="text-green-300">"quarterly"</code></div>
                    <div><code className="text-green-300">"every quarter"</code></div>
                    <div><code className="text-green-300">"semi-annual"</code></div>
                    <div><code className="text-green-300">"annually"</code></div>
                    <div><code className="text-green-300">"yearly"</code></div>
                  </div>
                </div>

                {/* Time-based */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-200">⏰ With Times</h4>
                  <div className="space-y-1 text-sm text-white/80">
                    <div><code className="text-green-300">"every day 6:30 PM to 7:30 PM"</code></div>
                    <div><code className="text-green-300">"Monday 9:00 AM"</code></div>
                    <div><code className="text-green-300">"15th at 3:00 PM"</code></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/20 border border-blue-300/40 rounded-lg">
                <h5 className="font-semibold text-white mb-2">💡 Examples:</h5>
                <div className="space-y-1 text-sm text-white/90">
                  <div>• <strong>Team Meeting</strong> - every Monday 9:00 AM</div>
                  <div>• <strong>Monthly Review</strong> - last Friday of every month</div>
                  <div>• <strong>Quarterly Report</strong> - 15th of every quarter</div>
                  <div>• <strong>Daily Standup</strong> - every day 10:00 AM except weekends</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
