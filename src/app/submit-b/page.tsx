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
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingSubmit(true);

    if (!validate()) {
      setIsLoadingSubmit(false);
      return;
    }

    if (!partnerAData) return;

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 300));

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
    setIsLoadingSubmit(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center">
        <div className="text-[#1e3a5f] text-lg flex items-center gap-2">
          <span className="loading-shimmer w-4 h-4 rounded-full"></span>
          Loading case file...
        </div>
      </div>
    );
  }

  if (!partnerAData) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#1e3a5f]">No Case Found</h1>
          <p className="text-[#4a4a4a]">
            No case has been filed yet.
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

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f]" style={{ fontFamily: 'Georgia, serif' }}>
            ⚖️ Respondent — Your Reply
          </h1>
          <p className="text-[#4a4a4a]">
            Review the case, then present your defense
          </p>
        </div>

        {/* Petitioner Summary Card */}
        <div className="w-full bg-white rounded-sm shadow-md p-6 space-y-4 border-t-4 border-[#c9a227]">
          <h2 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
            📋 Petitioner's Case
          </h2>
          
          <div className="space-y-3">
            {partnerAData.partnerAName && (
              <div className="flex items-center gap-2">
                <span className="text-[#8b7355]">Petitioner:</span>
                <span className="font-medium text-[#1a1a1a]">{partnerAData.partnerAName}</span>
              </div>
            )}
            
            <div className="space-y-1">
              <span className="text-[#8b7355] text-sm">Their Dispute:</span>
              <p className="text-[#1a1a1a] bg-[#f5f0e6] rounded-sm p-3 italic font-serif">
                "{partnerAData.disputeDescription}"
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#8b7355]">Category:</span>
                <span className="font-medium text-[#1a1a1a]">
                  {getCategoryLabel(partnerAData.category)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 bg-[#1e3a5f] text-white px-3 py-1 rounded-sm">
                <span className="text-lg">{getHeatEmoji(partnerAData.intensity)}</span>
                <span className="text-sm font-medium">
                  {getHeatLabel(partnerAData.intensity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Respondent Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-sm shadow-md p-6 sm:p-8 space-y-6 border-t-4 border-[#c9a227]"
        >
          {/* Respondent Name (Optional) */}
          <div className="space-y-2">
            <label htmlFor="partnerBName" className="block text-sm font-semibold text-[#1e3a5f]">
              Your Name <span className="text-[#8b7355] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="partnerBName"
              name="partnerBName"
              value={formData.partnerBName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-sm border-2 border-[#e0e0e0] focus:border-[#c9a227] 
                         focus:ring-2 focus:ring-[#c9a227]/30 outline-none transition-all
                         placeholder:text-[#8b7355] bg-white"
            />
          </div>

          {/* Their Side of the Story (Required) */}
          <div className="space-y-2">
            <label htmlFor="theirSide" className="block text-sm font-semibold text-[#1e3a5f]">
              Your Statement in Defense <span className="text-red-700">*</span>
            </label>
            <textarea
              id="theirSide"
              name="theirSide"
              value={formData.theirSide}
              onChange={handleChange}
              placeholder="Present your side of the argument..."
              rows={4}
              className={`w-full px-4 py-3 rounded-sm border-2 focus:ring-2 focus:ring-[#c9a227]/30 outline-none transition-all
                        placeholder:text-[#8b7355] resize-none bg-white ${
                          errors.theirSide
                            ? "border-red-400 focus:border-red-600"
                            : "border-[#e0e0e0] focus:border-[#c9a227]"
                        }`}
            />
            {errors.theirSide && (
              <p className="text-red-700 text-sm">{errors.theirSide}</p>
            )}
          </div>

          {/* Agree/Disagree Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#1e3a5f]">
              Do You Accept the Petition? <span className="text-red-700">*</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleAgreeToggle(true)}
                className={`flex-1 px-6 py-4 rounded-sm border-2 text-lg font-medium transition-all
                          ${
                            formData.agree === true
                              ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                              : "border-[#e0e0e0] hover:border-[#c9a227] text-[#4a4a4a]"
                          }`}
              >
                👍 Concede
              </button>
              <button
                type="button"
                onClick={() => handleAgreeToggle(false)}
                className={`flex-1 px-6 py-4 rounded-sm border-2 text-lg font-medium transition-all
                          ${
                            formData.agree === false
                              ? "border-[#8b7355] bg-[#8b7355] text-white"
                              : "border-[#e0e0e0] hover:border-[#c9a227] text-[#4a4a4a]"
                          }`}
              >
                👎 Contend
              </button>
            </div>
            {errors.agree && (
              <p className="text-red-700 text-sm">{errors.agree}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/submit-a"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 
                         text-lg font-medium text-[#1e3a5f] bg-[#f5f0e6] rounded-sm
                         hover:bg-[#e0d8c8] transition-all"
            >
              ← Return to Petitioner
            </Link>
            <button
              type="submit"
              disabled={isLoadingSubmit}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 
                         text-lg font-bold text-white bg-[#1e3a5f] rounded-sm shadow-md
                         hover:bg-[#0f2744] hover:scale-[1.02] active:scale-[0.98]
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         border-2 border-[#c9a227]"
            >
              {isLoadingSubmit ? (
                <>
                  <span className="loading-shimmer px-4 h-5 inline-block rounded-sm"></span>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Reply →
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-sm text-[#8b7355]">
          Love Court — Where Justice Meets Love ⚖️
        </p>
      </main>
    </div>
  );
}