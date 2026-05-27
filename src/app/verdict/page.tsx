"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DisputeData {
  partnerAName?: string;
  partnerBName?: string;
  disputeDescription: string;
  category: string;
  intensity: number;
  submittedAt: string;
  partnerBSubmittedAt?: string;
  theirSide: string;
  agree: boolean | null;
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

function getHeatEmoji(level: number): string {
  const flames = ["🥶", "😤", "🔥", "💢", "🤬"];
  return flames[level - 1];
}

function getHeatLabel(level: number): string {
  const labels = ["Ice Cold", "Chilly", "Warm", "Hot", "Explosive"];
  return labels[level - 1];
}

// Simple "random" verdict based on hash of dispute description
function calculateVerdict(dispute: DisputeData): "A" | "B" {
  const combined = dispute.disputeDescription + dispute.category + dispute.theirSide;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 2 === 0 ? "A" : "B";
}

export default function Verdict() {
  const router = useRouter();
  const [dispute, setDispute] = useState<DisputeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [verdict, setVerdict] = useState<"A" | "B" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("loveCourt_dispute");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDispute(parsed);

        // Calculate winner
        const winner = calculateVerdict(parsed);
        setVerdict(winner);

        // Save to history
        const historyItem = {
          ...parsed,
          verdict: winner,
          verdictAt: new Date().toISOString(),
        };

        // Get existing history
        const existingHistory = localStorage.getItem("loveCourt_history");
        let history: DisputeData[] = [];
        if (existingHistory) {
          try {
            history = JSON.parse(existingHistory);
          } catch (e) {
            history = [];
          }
        }

        // Add new case to beginning
        history.unshift(historyItem);

        // Save back to localStorage
        localStorage.setItem("loveCourt_history", JSON.stringify(history));
      } catch (e) {
        console.error("Failed to parse dispute:", e);
      }
    }
    setLoading(false);
  }, []);

  const startNewCase = () => {
    localStorage.removeItem("loveCourt_dispute");
    router.push("/submit-a");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center">
        <div className="text-[#1e3a5f] text-lg flex items-center gap-2">
          <span className="loading-shimmer w-4 h-4 rounded-full"></span>
          Rendering verdict...
        </div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#1e3a5f]">No Case Found</h1>
          <p className="text-[#4a4a4a]">
            Please complete both submissions first.
          </p>
          <Link
            href="/submit-a"
            className="inline-block px-6 py-3 bg-[#1e3a5f] text-white rounded-sm font-medium hover:bg-[#0f2744] transition-all border-2 border-[#c9a227]"
          >
            ← File New Case
          </Link>
        </div>
      </div>
    );
  }

  const winnerName = verdict === "A"
    ? (dispute.partnerAName || "Petitioner")
    : (dispute.partnerBName || "Respondent");
  const loserName = verdict === "A"
    ? (dispute.partnerBName || "Respondent")
    : (dispute.partnerAName || "Petitioner");

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center gap-6 animate-fade-in">
        {/* Gavel Animation */}
        <div className="text-6xl sm:text-8xl">
          ⚖️⚖️
        </div>

        {/* Verdict Banner */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f]" style={{ fontFamily: 'Georgia, serif' }}>
            The Courthas Rendered Its Verdict
          </h1>
          <p className="text-[#4a4a4a]">
            After careful deliberation of the evidence...
          </p>
        </div>

        {/* Winner Card */}
        <div className="w-full bg-[#1e3a5f] rounded-sm shadow-lg p-8 text-center text-white border-4 border-[#c9a227]">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {winnerName} is Vindicated!
          </h2>
          <p className="text-[#e8d48a] text-lg">
            The court rules in your favor.
          </p>
        </div>

        {/* Case Summary */}
        <div className="w-full bg-white rounded-sm shadow-md p-6 space-y-4 border-t-4 border-[#c9a227]">
          <h3 className="text-lg font-bold text-[#1e3a5f]">Case Summary</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#8b7355]">Category:</span>
              <span className="font-medium text-[#1a1a1a]">
                {getCategoryLabel(dispute.category)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-[#8b7355]">Intensity:</span>
              <span className="font-medium text-[#1a1a1a] flex items-center gap-2">
                {getHeatEmoji(dispute.intensity)} {getHeatLabel(dispute.intensity)}
              </span>
            </div>
            
            <div className="border-t border-[#e0e0e0] pt-3">
              <span className="text-[#8b7355] block mb-1">Petition:</span>
              <p className="text-[#1a1a1a] bg-[#f5f0e6] rounded-sm p-3 italic font-serif">
                "{dispute.disputeDescription}"
              </p>
            </div>
            
            <div className="border-t border-[#e0e0e0] pt-3">
              <span className="text-[#8b7355] block mb-1">{loserName}'s Defense:</span>
              <p className="text-[#1a1a1a] bg-[#f5f0e6] rounded-sm p-3 italic font-serif">
                "{dispute.theirSide}"
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/history"
            className="px-6 py-3 bg-[#f5f0e6] text-[#1e3a5f] rounded-sm font-medium hover:bg-[#e0d8c8] transition-all"
          >
            📜 View Records
          </Link>
          <button
            onClick={startNewCase}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-sm font-medium hover:bg-[#0f2744] transition-all border-2 border-[#c9a227]"
          >
            ⚖️ New Case
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-[#8b7355] mt-4">
          Case #{Math.floor(Math.random() * 9000) + 1000} • Love Court Judicial © 2024
        </p>
      </main>
    </div>
  );
}