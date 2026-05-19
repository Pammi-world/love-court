"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DisputeData {
  partnerAName: string;
  disputeDescription: string;
  category: string;
  intensity: number;
  partnerBName?: string;
  theirSide: string;
  agree: boolean;
  submittedAt?: string;
  partnerBSubmittedAt?: string;
}

// Template-based reasoning sentences
const reasoningTemplates = [
  "After careful consideration of both arguments, the court finds that love means sometimes letting small things go.",
  "The evidence shows that both parties have valid points, but compromise is the true winner today.",
  "Upon reviewing all the facts and feelings, this court believes the best relationships require give and take.",
  "The court recognizes that love is not about being right—it's about being happy together.",
  "Both sidespresented their case well, but ultimately, a happy relationship trumps winning an argument.",
  "This court finds that sometimes the brightest hearts are the ones that know when to apologize.",
  "After weighing all the love, the court rules that effective communication would have prevented this dispute.",
];

// Categories mapping
const getCategoryLabel = (value: string) => {
  const categories: Record<string, string> = {
    chores: "🧹 Chores",
    dishes: "🍽️ Dishes",
    "tv-remote": "📺 TV Remote",
    money: "💰 Money",
    plans: "📅 Plans",
    other: "🤷 Other",
  };
  return categories[value] || value;
};

// Heat level helpers
const getHeatEmoji = (level: number) => {
  const flames = ["🥶", "😤", "🔥", "💢", "🤬"];
  return flames[level - 1];
};

const getHeatLabel = (level: number) => {
  const labels = ["Ice Cold", "Chilly", "Warm", "Hot", "Explosive"];
  return labels[level - 1];
};

// Determine winner algorithmically
const determineWinner = (data: DisputeData): { winner: "Partner A" | "Partner B" | "Draw"; reasoningIndex: number } => {
  // Simple algorithm: random with some weight based on intensity and agreeableness
  const rand = Math.random();
  
  // If Partner A's intensity is very high (5) and Partner B disagrees, slight bias to A (they're really passionate)
  // If Partner B agrees, slight bias to A as they're acknowledged
  let partnerAWins: number, partnerBWins: number;
  
  if (data.agree === true) {
    // Partner B agreed with A - slight bias to A
    partnerAWins = 0.45;
    partnerBWins = 0.25;
  } else if (data.agree === false) {
    // Partner B disagreed - more balanced
    partnerAWins = 0.35;
    partnerBWins = 0.35;
  } else {
    // Default case
    partnerAWins = 0.38;
    partnerBWins = 0.38;
  }
  
  // Add randomness
  const drawChance = 1 - partnerAWins - partnerBWins;
  
  if (rand < partnerAWins) {
    return { winner: "Partner A", reasoningIndex: Math.floor(Math.random() * reasoningTemplates.length) };
  } else if (rand < partnerAWins + partnerBWins) {
    return { winner: "Partner B", reasoningIndex: Math.floor(Math.random() * reasoningTemplates.length) };
  } else {
    return { winner: "Draw", reasoningIndex: Math.floor(Math.random() * reasoningTemplates.length) };
  }
};

export default function VerdictPage() {
  const router = useRouter();
  const [isJudging, setIsJudging] = useState(true);
  const [disputeData, setDisputeData] = useState<DisputeData | null>(null);
  const [verdict, setVerdict] = useState<{ winner: "Partner A" | "Partner B" | "Draw"; reasoningIndex: number } | null>(null);

  // Load data and simulate judgment delay
  useEffect(() => {
    const stored = localStorage.getItem("loveCourt_dispute");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DisputeData;
        setDisputeData(parsed);
        
        // Simulate 2-3 second "deliberation"
        const deliberationTime = 2000 + Math.random() * 1000;
        setTimeout(() => {
          setVerdict(determineWinner(parsed));
          setIsJudging(false);
        }, deliberationTime);
      } catch (e) {
        console.error("Failed to parse stored dispute:", e);
        setIsJudging(false);
      }
    } else {
      // No data found
      setIsJudging(false);
    }
  }, []);

  const handleStartNewCase = () => {
    localStorage.removeItem("loveCourt_dispute");
    router.push("/");
  };

  // Loading/Judging state
  if (isJudging) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex flex-col items-center justify-center p-4">
        {/* Gavel animation */}
        <div className="text-6xl sm:text-8xl mb-8 animate-pulse" role="img" aria-label="judging">
          ⚖️👩‍⚖️
        </div>
        
        {/* Judging text with suspense */}
        <h1 className="text-3xl sm:text-4xl font-bold text-rose-600 mb-4">
          The Court is Deliberating...
        </h1>
        
        {/* Animated dots */}
        <div className="flex gap-2 mb-8">
          <span className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
          <span className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
          <span className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
        </div>
        
        {/* Suspense message */}
        <p className="text-rose-500 text-lg max-w-md text-center">
          The AI Judge is carefully weighing your hearts, examining the evidence, and seeking justice for love! 💕
        </p>
        
        {/* Scales animation */}
        <div className="mt-12 text-5xl animate-bounce" role="img" aria-label="scales">
          ⚖️
        </div>
      </div>
    );
  }

  // No data state
  if (!disputeData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-rose-600">No Case Found</h1>
          <p className="text-rose-500">
            There's no dispute to judge. Start a new case!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-all"
          >
            ← Start New Case
          </Link>
        </div>
      </div>
    );
  }

  // Get the winner announcement
  const getWinnerAnnouncement = () => {
    if (!verdict) return "";
    
    switch (verdict.winner) {
      case "Partner A":
        return disputeData.partnerAName ? `${disputeData.partnerAName} Wins!` : "Partner A Wins!";
      case "Partner B":
        return disputeData.partnerBName ? `${disputeData.partnerBName} Wins!` : "Partner B Wins!";
      case "Draw":
        return "It's a Draw!";
    }
  };

  // Get the verdict emoji
  const getWinnerEmoji = () => {
    if (!verdict) return "⚖️";
    
    switch (verdict.winner) {
      case "Partner A":
        return "🏆";
      case "Partner B":
        return "🏆";
      case "Draw":
        return "🤝";
    }
  };

  // Get winner color class
  const getWinnerColor = () => {
    if (!verdict) return "text-rose-600";
    
    switch (verdict.winner) {
      case "Partner A":
        return "text-rose-600";
      case "Partner B":
        return "text-pink-600";
      case "Draw":
        return "text-purple-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Verdict Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl sm:text-6xl mb-2" role="img">
            ⚖️👩‍⚖️
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-600">
            The Court Finds...
          </h1>
        </div>

        {/* Winner Announcement Card */}
        <div className={`w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-4 ${verdict?.winner === "Partner A" ? "border-4 border-rose-300" : verdict?.winner === "Partner B" ? "border-4 border-pink-300" : "border-4 border-purple-300"}`}>
          <div className="text-6xl sm:text-7xl animate-bounce" role="img" aria-label="winner">
            {getWinnerEmoji()}
          </div>
          
          <h2 className={`text-3xl sm:text-4xl font-extrabold ${getWinnerColor()}`}>
            {getWinnerAnnouncement()}
          </h2>
          
          {/* Reasoning */}
          <p className="text-gray-700 text-lg italic leading-relaxed max-w-lg mx-auto">
            "{reasoningTemplates[verdict?.reasoningIndex || 0]}"
          </p>
          
          {/* Justice emoji */}
          <div className="flex justify-center gap-3 text-2xl pt-2">
            <span role="img" aria-label="heart">💗</span>
            <span role="img" aria-label="scale">⚖️</span>
            <span role="img" aria-label="heart">💗</span>
          </div>
        </div>

        {/* Summary of Both Sides */}
        <div className="w-full grid md:grid-cols-2 gap-4">
          {/* Partner A Summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 space-y-3">
            <h3 className="text-lg font-bold text-rose-600 flex items-center gap-2">
              👤 Partner A
            </h3>
            
            <div className="space-y-2">
              {disputeData.partnerAName && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Name:</span> {disputeData.partnerAName}
                </p>
              )}
              <div className="bg-rose-50 rounded-lg p-3">
                <p className="text-gray-800 text-sm italic">"{disputeData.disputeDescription}"</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{getCategoryLabel(disputeData.category)}</span>
                <span className="bg-rose-100 px-2 py-1 rounded-full text-rose-700 text-xs">
                  {getHeatEmoji(disputeData.intensity)} {getHeatLabel(disputeData.intensity)}
                </span>
              </div>
            </div>
          </div>

          {/* Partner B Summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 space-y-3">
            <h3 className="text-lg font-bold text-pink-600 flex items-center gap-2">
              👤 Partner B
            </h3>
            
            <div className="space-y-2">
              {disputeData.partnerBName && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Name:</span> {disputeData.partnerBName}
                </p>
              )}
              <div className="bg-pink-50 rounded-lg p-3">
                <p className="text-gray-800 text-sm italic">"{disputeData.theirSide}"</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {disputeData.agree === true ? "👍 Agreed" : disputeData.agree === false ? "👎 Disagreed" : "—"}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  disputeData.agree === true ? "bg-green-100 text-green-700" : 
                  disputeData.agree === false ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {disputeData.agree === true ? "Agreed" : disputeData.agree === false ? "Disagreed" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Start New Case Button */}
        <button
          onClick={handleStartNewCase}
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 
                     text-xl font-bold text-white bg-rose-500 rounded-full shadow-lg 
                     hover:bg-rose-600 hover:scale-105 active:scale-95 
                     transition-all duration-200 ease-out
                     focus:outline-none focus:ring-4 focus:ring-rose-300"
        >
          <span className="text-2xl" role="img" aria-label="gavel">🔨</span>
          Start New Case
          <span className="text-2xl" role="img" aria-label="sparkle">✨</span>
        </button>

        {/* Footer */}
        <p className="text-sm text-rose-400">
          Love Court — Where Love Gets Its Day ❤️
        </p>
      </main>
    </div>
  );
}