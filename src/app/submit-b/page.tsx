"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DisputeData {
  partnerAName: string;
  disputeDescription: string;
  category: string;
  intensity: number;
  submittedAt?: string;
}

interface PartnerBData {
  partnerBName?: string;
  theirSide: string;
  agree: boolean | null;
}

export default function SubmitPartnerB() {
  const router = useRouter();
  const [partnerAData, setPartnerAData] = useState<DisputeData | null>(null);
  const [formData, setFormData] = useState<PartnerBData>({
    partnerBName: "",
    theirSide: "",
    agree: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PartnerBData, string>>>({});
  const [loading, setLoading] = useState(true);

  // Load Partner A's data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("loveCourt_dispute");
    if (stored) {
      try {
        setPartnerAData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored dispute:", e);
      }
    }
    setLoading(false);
  }, []);

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

  const getHeatEmoji = (level: number) => {
    const flames = ["🥶", "😤", "🔥", "💢", "🤬"];
    return flames[level - 1];
  };

  const getHeatLabel = (level: number) => {
    const labels = ["Ice Cold", "Chilly", "Warm", "Hot", "Explosive"];
    return labels[level - 1];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PartnerBData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAgreeToggle = (value: boolean) => {
    setFormData((prev) => ({ ...prev, agree: value }));
    setErrors((prev) => ({ ...prev, agree: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PartnerBData, string>> = {};

    if (!formData.theirSide.trim()) {
      newErrors.theirSide = "Please share your side of the story";
    }
    if (formData.agree === null) {
      newErrors.agree = "Please select Agree or Disagree";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!partnerAData) return;

    // Combine both submissions
    const combinedData = {
      ...partnerAData,
      partnerBName: formData.partnerBName,
      theirSide: formData.theirSide,
      agree: formData.agree,
      partnerBSubmittedAt: new Date().toISOString(),
    };

    // Store combined data
    localStorage.setItem("loveCourt_dispute", JSON.stringify(combinedData));

    // Navigate to verdict page
    router.push("/verdict");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex items-center justify-center">
        <div className="text-rose-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (!partnerAData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-rose-600">No Dispute Found</h1>
          <p className="text-rose-500">
            Partner A hasn't submitted their case yet.
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-600">
            ⚖️ Partner B — Your Response
          </h1>
          <p className="text-rose-500">
            Hear the case, then tell your side
          </p>
        </div>

        {/* Partner A Summary Card */}
        <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            📋 Partner A's Case
          </h2>
          
          <div className="space-y-3">
            {partnerAData.partnerAName && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium text-gray-800">{partnerAData.partnerAName}</span>
              </div>
            )}
            
            <div className="space-y-1">
              <span className="text-gray-500 text-sm">Their Dispute:</span>
              <p className="text-gray-800 bg-rose-50 rounded-lg p-3 italic">
                "{partnerAData.disputeDescription}"
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium text-gray-800">
                  {getCategoryLabel(partnerAData.category)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 bg-rose-100 px-3 py-1 rounded-full">
                <span className="text-lg">{getHeatEmoji(partnerAData.intensity)}</span>
                <span className="text-sm font-medium text-rose-700">
                  {getHeatLabel(partnerAData.intensity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Partner B Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
        >
          {/* Partner B Name (Optional) */}
          <div className="space-y-2">
            <label htmlFor="partnerBName" className="block text-sm font-semibold text-gray-700">
              Your Name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="partnerBName"
              name="partnerBName"
              value={formData.partnerBName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-500 
                         focus:ring-2 focus:ring-rose-200 outline-none transition-all
                         placeholder:text-gray-400"
            />
          </div>

          {/* Their Side of the Story (Required) */}
          <div className="space-y-2">
            <label htmlFor="theirSide" className="block text-sm font-semibold text-gray-700">
              Your Side of the Story <span className="text-red-500">*</span>
            </label>
            <textarea
              id="theirSide"
              name="theirSide"
              value={formData.theirSide}
              onChange={handleChange}
              placeholder="What's your perspective on this?"
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-rose-200 outline-none transition-all
                        placeholder:text-gray-400 resize-none ${
                          errors.theirSide
                            ? "border-red-400 focus:border-red-500"
                            : "border-rose-200 focus:border-rose-500"
                        }`}
            />
            {errors.theirSide && (
              <p className="text-red-500 text-sm">{errors.theirSide}</p>
            )}
          </div>

          {/* Agree/Disagree Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Do You Agree with Partner A? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleAgreeToggle(true)}
                className={`flex-1 px-6 py-4 rounded-xl border-2 text-lg font-medium transition-all
                          ${
                            formData.agree === true
                              ? "border-green-500 bg-green-100 text-green-700"
                              : "border-rose-200 hover:border-rose-300 text-gray-600"
                          }`}
              >
                👍 Agree
              </button>
              <button
                type="button"
                onClick={() => handleAgreeToggle(false)}
                className={`flex-1 px-6 py-4 rounded-xl border-2 text-lg font-medium transition-all
                          ${
                            formData.agree === false
                              ? "border-red-500 bg-red-100 text-red-700"
                              : "border-rose-200 hover:border-rose-300 text-gray-600"
                          }`}
              >
                👎 Disagree
              </button>
            </div>
            {errors.agree && (
              <p className="text-red-500 text-sm">{errors.agree}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/submit-a"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 
                         text-lg font-medium text-rose-600 bg-rose-100 rounded-full
                         hover:bg-rose-200 transition-all"
            >
              ← Back to Partner A
            </Link>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 
                         text-lg font-bold text-white bg-rose-500 rounded-full shadow-lg
                         hover:bg-rose-600 hover:scale-[1.02] active:scale-[0.98]
                         transition-all"
            >
              Submit Response →
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-sm text-rose-400">
          Love Court — Where Love Gets Its Day ❤️
        </p>
      </main>
    </div>
  );
}