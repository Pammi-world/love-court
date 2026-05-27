"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HistoryCase {
  partnerAName?: string;
  partnerBName?: string;
  disputeDescription: string;
  category: string;
  intensity: number;
  submittedAt: string;
  partnerBSubmittedAt?: string;
  theirSide: string;
  agree: boolean | null;
  verdict?: "A" | "B";
  verdictAt?: string;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function getCategoryLabel(value: string): string {
  const categories: Record<string, string> = {
    chores: "🧹 Chores",
    dishes: "🍽️ Dishes",
    "tv-remote": "📺 TV Remote",
    money: "💰 Money",
    plans: "📅 Plans",
    other: "🤷 Other",
  };
  return categories[value] || value;
}

function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export default function History() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("loveCourt_history");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
    setLoading(false);
  }, []);

  const clearHistory = () => {
<<<<<<< HEAD
    if (confirm("Are you sure you want to clear all case records? This cannot be undone.")) {
=======
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
>>>>>>> origin/main
      localStorage.removeItem("loveCourt_history");
      setHistory([]);
    }
  };

  const goHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center">
        <div className="text-[#1e3a5f] text-lg flex items-center gap-2">
          <span className="loading-shimmer w-4 h-4 rounded-full"></span>
          Loading records...
        </div>
=======
      <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex items-center justify-center">
        <div className="text-rose-500 text-lg">Loading...</div>
>>>>>>> origin/main
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f]" style={{ fontFamily: 'Georgia, serif' }}>
            📜 Case Records
          </h1>
          <p className="text-[#4a4a4a]">
            {history.length} case{history.length === 1 ? "" : "s"} adjudicated
          </p>
        </div>

        {/* Back to Court Button */}
        <button
          onClick={goHome}
          className="inline-flex items-center gap-2 text-[#1e3a5f] hover:text-[#c9a227] font-medium transition-colors"
        >
          ← Return to Court
=======
    <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-600">
            📜 Case History
          </h1>
          <p className="text-rose-500">
            {history.length} case{history.length === 1 ? "" : "s"} resolved
          </p>
        </div>

        {/* Back to Home */}
        <button
          onClick={goHome}
          className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium transition-colors"
        >
          ← Back to Court
>>>>>>> origin/main
        </button>

        {/* History List */}
        {history.length === 0 ? (
<<<<<<< HEAD
          <div className="w-full bg-white rounded-sm shadow-md p-8 text-center space-y-4 border-t-4 border-[#c9a227]">
            <div className="text-6xl">📭</div>
            <p className="text-[#4a4a4a]">No case records found.</p>
            <p className="text-[#8b7355] text-sm">
=======
          <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center space-y-4">
            <div className="text-6xl">📭</div>
            <p className="text-gray-600">No cases in history yet.</p>
            <p className="text-gray-500 text-sm">
>>>>>>> origin/main
              Cases will appear here after verdicts are rendered.
            </p>
            <Link
              href="/submit-a"
<<<<<<< HEAD
              className="inline-block mt-4 px-6 py-3 bg-[#1e3a5f] text-white rounded-sm font-medium hover:bg-[#0f2744] transition-all border-2 border-[#c9a227]"
            >
              File Your First Case
=======
              className="inline-block mt-4 px-6 py-3 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-all"
            >
              Start Your First Case
>>>>>>> origin/main
            </Link>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {history.map((caseItem, index) => (
              <div
                key={index}
<<<<<<< HEAD
                className="w-full bg-white rounded-sm shadow-md p-5 space-y-3 border-t-4 border-[#c9a227] hover:shadow-lg transition-shadow"
              >
                {/* Date and Verdict Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8b7355]">
=======
                className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 space-y-3"
              >
                {/* Date and Verdict Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
>>>>>>> origin/main
                    {formatRelativeTime(caseItem.verdictAt || caseItem.submittedAt)}
                  </span>
                  {caseItem.verdict && (
                    <span
<<<<<<< HEAD
                      className={`px-3 py-1 rounded-sm text-sm font-bold ${
                        caseItem.verdict === "A"
                          ? "bg-[#1e3a5f] text-white"
                          : "bg-[#8b7355] text-white"
                      }`}
                    >
                      Ruling: {caseItem.verdict === "A" ? "Petitioner" : "Respondent"} Wins
=======
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        caseItem.verdict === "A"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      Winner: Partner {caseItem.verdict}
>>>>>>> origin/main
                    </span>
                  )}
                </div>

                {/* Category */}
                <div className="flex items-center gap-2">
<<<<<<< HEAD
                  <span className="font-medium text-[#1a1a1a]">
                    {getCategoryLabel(caseItem.category)}
                  </span>
                  <span className="text-[#8b7355]">•</span>
                  <span className="text-[#4a4a4a]">
=======
                  <span className="font-medium text-gray-700">
                    {getCategoryLabel(caseItem.category)}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
>>>>>>> origin/main
                    {truncate(caseItem.disputeDescription, 60)}
                  </span>
                </div>

                {/* Winner indicator */}
<<<<<<< HEAD
                <div className="text-sm text-[#8b7355]">
                  {caseItem.verdict === "A" ? (
                    <>
                      <span className="font-medium text-[#1e3a5f]">
                        {caseItem.partnerAName || "Petitioner"}
                      </span>{" "}
                      prevails!
                    </>
                  ) : caseItem.verdict === "B" ? (
                    <>
                      <span className="font-medium text-[#8b7355]">
                        {caseItem.partnerBName || "Respondent"}
                      </span>{" "}
                      prevails!
                    </>
                  ) : (
                    <>Awaiting judgment...</>
=======
                <div className="text-sm text-gray-500">
                  {caseItem.verdict === "A" ? (
                    <>
                      <span className="font-medium text-rose-600">
                        {caseItem.partnerAName || "Partner A"}
                      </span>{" "}
                      wins the case!
                    </>
                  ) : caseItem.verdict === "B" ? (
                    <>
                      <span className="font-medium text-pink-600">
                        {caseItem.partnerBName || "Partner B"}
                      </span>{" "}
                      wins the case!
                    </>
                  ) : (
                    <>Verdict pending...</>
>>>>>>> origin/main
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear History Button */}
        {history.length > 0 && (
          <button
            onClick={clearHistory}
<<<<<<< HEAD
            className="px-6 py-3 text-red-700 font-medium hover:bg-red-50 rounded-sm transition-all"
          >
            🗑️ expunge All Records
=======
            className="px-6 py-3 text-red-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
          >
            🗑️ Clear All History
>>>>>>> origin/main
          </button>
        )}
      </main>
    </div>
  );
}