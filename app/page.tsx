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
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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

  const handlePreviewPDF = async () => {
    try {
      // Generate PDF as blob instead of downloading
      const { generatePDFBlob } = await import("@/lib/pdfGenerator");
      const pdfBlob = generatePDFBlob(events, year);
      const url = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(url);
      setShowPreview(true);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>

      <main className="flex-grow p-4 sm:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 drop-shadow-2xl relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                Production Calendar
              </span>
              <br />
              <span className="text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-white to-purple-200">
                Generator
              </span>
              {/* Decorative line */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
            </h1>
            <p className="text-xl text-white/90 drop-shadow-md font-light max-w-2xl mx-auto leading-relaxed">
              Create stunning custom calendars with intelligent event scheduling
              and modern design
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-white/80 text-sm">
                  ✨ Smart Scheduling
                </span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-white/80 text-sm">
                  🎨 Beautiful Design
                </span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-white/80 text-sm">📱 Export Ready</span>
              </div>
            </div>
          </div>

          {/* User Input Form */}
          <UserInputForm
            onFormSubmit={handleFormSubmit}
            currentYear={year}
            onYearChange={setYear}
          />

          {/* Download Buttons */}
          {isCalendarGenerated && events.length > 0 && (
            <div className="backdrop-blur-sm bg-white/10 border border-white/25 rounded-2xl shadow-2xl p-8 mb-8 relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6 text-white text-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-purple-200">
                    Export Your Calendar
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <button
                    onClick={handlePreviewPDF}
                    className="group relative bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 transition-all duration-500 font-semibold flex items-center justify-center gap-3 shadow-2xl hover:shadow-amber-500/25 transform hover:-translate-y-2 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-2xl">👁️</span>
                    <span className="relative z-10">Preview PDF</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="group relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-8 py-4 rounded-2xl hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 transition-all duration-500 font-semibold flex items-center justify-center gap-3 shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-2 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-2xl">📄</span>
                    <span className="relative z-10">Download PDF</span>
                  </button>

                  <button
                    onClick={handleDownloadCSV}
                    className="group relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-8 py-4 rounded-2xl hover:from-purple-400 hover:via-pink-400 hover:to-rose-400 transition-all duration-500 font-semibold flex items-center justify-center gap-3 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-2xl">📊</span>
                    <span className="relative z-10">Export CSV</span>
                  </button>

                  <button
                    onClick={handleDownloadOutlook}
                    className="group relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-8 py-4 rounded-2xl hover:from-blue-400 hover:via-indigo-400 hover:to-purple-400 transition-all duration-500 font-semibold flex items-center justify-center gap-3 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-2xl">📅</span>
                    <span className="relative z-10">Add to Outlook</span>
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-300/40 rounded-2xl backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                          <h4 className="font-bold text-white mb-2">
                            Outlook Integration
                          </h4>
                          <p className="text-sm text-white/90 leading-relaxed">
                            Click "Add to Outlook" to download an .ics file.
                            Import all events with automatic reminders set for 1
                            day before each event.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/40 rounded-2xl backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">📈</span>
                        <div>
                          <h4 className="font-bold text-white mb-2">
                            Calendar Summary
                          </h4>
                          <p className="text-sm text-white/90 leading-relaxed">
                            Generated{" "}
                            <span className="font-semibold text-cyan-200">
                              {events.length} events
                            </span>{" "}
                            for{" "}
                            <span className="font-semibold text-cyan-200">
                              {year}
                            </span>{" "}
                            from your custom event rules
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Grid Display */}
          {isCalendarGenerated && events.length > 0 && (
            <div className="relative">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-purple-200">
                    Calendar Preview
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }, (_, month) => {
                  const monthEvents = events.filter((e) => e.month === month);
                  return (
                    <div key={month}>
                      <CalendarGrid
                        month={month}
                        year={year}
                        events={monthEvents}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* PDF Preview Modal */}
      {showPreview && pdfPreviewUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h3 className="text-2xl font-bold text-white">
                Calendar PDF Preview
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <span>📄</span>
                  Download
                </button>
                <button
                  onClick={closePreview}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-[70vh] rounded-lg"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Footer */}
      <footer className="relative bg-black/30 backdrop-blur-md border-t border-white/30 py-8 mt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full mb-4"></div>
              <p className="text-white/90 text-base font-medium">
                © {new Date().getFullYear()} Calendar Generator
              </p>
              <p className="text-white/70 text-sm mt-2">
                Created with <span className="text-red-400">❤️</span> by{" "}
                <a
                  href="https://gunasekaran-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-cyan-300 transition-all duration-300 underline decoration-cyan-400/60 hover:decoration-cyan-300 font-semibold"
                >
                  Gunasekaran
                </a>
              </p>
            </div>
            <div className="flex justify-center space-x-6 text-white/60 text-xs">
              <span>🚀 Intelligent Scheduling</span>
              <span>•</span>
              <span>🎨 Beautiful Design</span>
              <span>•</span>
              <span>📱 Multi-format Export</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
