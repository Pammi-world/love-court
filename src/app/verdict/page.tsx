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
// In a real app, this would use actual voting/social features
function calculateVerdict(dispute: DisputeData): "A" | "B" {
  // Use a simple hash to determine winner (deterministic based on content)
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
  const [showConfetti, setShowConfetti] = useState(false);

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

        // Show confetti
        setTimeout(() => setShowConfetti(true), 500);
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
      <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex items-center justify-center">
        <div className="text-rose-500 text-lg">Deliberating...</div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-rose-600">No Dispute Found</h1>
          <p className="text-rose-500">
            Please complete both submissions first.
          </p>
          <Link
            href="/submit-a"
            className="inline-block px-6 py-3 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-all"
          >
            ← Start New Dispute
          </Link>
        </div>
      </div>
    );
  }

  const winnerName = verdict === "A"
    ? (dispute.partnerAName || "Partner A")
    : (dispute.partnerBName || "Partner B");
  const loserName = verdict === "A"
    ? (dispute.partnerBName || "Partner B")
    : (dispute.partnerAName || "Partner A");

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {["💖", "💕", "❤️", "✨", "🌸"][i % 5]}
            </div>
          ))}
        </div>
      )}

      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Gavel Animation */}
        <div className="text-6xl sm:text-8xl animate-bounce">
          ⚖️👩‍⚖️
        </div>

        {/* Verdict Banner */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-600">
            The Verdict is In!
          </h1>
          <p className="text-rose-500">
            After careful consideration...
          </p>
        </div>

        {/* Winner Card */}
        <div className="w-full bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl shadow-2xl p-8 text-center text-white">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {winnerName} Wins!
          </h2>
          <p className="text-rose-100 text-lg">
            The court has ruled in your favor.
          </p>
        </div>

        {/* Case Summary */}
        <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-700">Case Summary</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Category:</span>
              <span className="font-medium text-gray-700">
                {getCategoryLabel(dispute.category)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Intensity:</span>
              <span className="font-medium text-gray-700 flex items-center gap-2">
                {getHeatEmoji(dispute.intensity)} {getHeatLabel(dispute.intensity)}
              </span>
            </div>
            
            <div className="border-t border-gray-100 pt-3">
              <span className="text-gray-500 block mb-1">Dispute:</span>
              <p className="text-gray-700 bg-rose-50 rounded-lg p-3 italic">
                "{dispute.disputeDescription}"
              </p>
            </div>
            
            <div className="border-t border-gray-100 pt-3">
              <span className="text-gray-500 block mb-1">{loserName}'s Response:</span>
              <p className="text-gray-700 bg-pink-50 rounded-lg p-3 italic">
                "{dispute.theirSide}"
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/history"
            className="px-6 py-3 bg-rose-100 text-rose-700 rounded-full font-medium hover:bg-rose-200 transition-all"
          >
            📜 View History
          </Link>
          <button
            onClick={startNewCase}
            className="px-6 py-3 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-all"
          >
            ⚖️ New Case
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-400 mt-4">
          Case #{Math.floor(Math.random() * 9000) + 1000} • Love Court © 2024
        </p>
      </main>
    </div>
  );
}