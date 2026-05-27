"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DisputeData {
  partnerAName: string;
  disputeDescription: string;
  category: string;
  intensity: number;
}

const categories = [
  { value: "chores", label: "🧹 Chores" },
  { value: "dishes", label: "🍽️ Dishes" },
  { value: "tv-remote", label: "📺 TV Remote" },
  { value: "money", label: "💰 Money" },
  { value: "plans", label: "📅 Plans" },
  { value: "other", label: "🤷 Other" },
];

export default function SubmitPartnerA() {
  const router = useRouter();
  const [formData, setFormData] = useState<DisputeData>({
    partnerAName: "",
    disputeDescription: "",
    category: "",
    intensity: 3,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DisputeData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof DisputeData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleIntensityChange = (value: number) => {
    setFormData((prev) => ({ ...prev, intensity: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DisputeData, string>> = {};

    if (!formData.disputeDescription.trim()) {
      newErrors.disputeDescription = "Please describe your dispute";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      return;
    }

    // Simulate loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Store in localStorage
    const disputeData = {
      ...formData,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem("loveCourt_dispute", JSON.stringify(disputeData));

    // Navigate to Partner B form
    router.push("/submit-b");
    setIsLoading(false);
  };

  const getHeatEmoji = (level: number) => {
    const flames = ["🥶", "😤", "🔥", "💢", "🤬"];
    return flames[level - 1];
  };

  const getHeatLabel = (level: number) => {
    const labels = ["Ice Cold", "Chilly", "Warm", "Hot", "Explosive"];
    return labels[level - 1];
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f]" style={{ fontFamily: 'Georgia, serif' }}>
            ⚖️ Petitioner — File Your Case
          </h1>
          <p className="text-[#4a4a4a]">
            Present your side of the dispute to the court
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-sm shadow-md p-6 sm:p-8 space-y-6 border-t-4 border-[#c9a227]"
        >
          {/* Petitioner Name (Optional) */}
          <div className="space-y-2">
            <label htmlFor="partnerAName" className="block text-sm font-semibold text-[#1e3a5f]">
              Your Name <span className="text-[#8b7355] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="partnerAName"
              name="partnerAName"
              value={formData.partnerAName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-sm border-2 border-[#e0e0e0] focus:border-[#c9a227] 
                         focus:ring-2 focus:ring-[#c9a227]/30 outline-none transition-all
                         placeholder:text-[#8b7355] bg-white"
            />
          </div>

          {/* Dispute Description (Required) */}
          <div className="space-y-2">
            <label htmlFor="disputeDescription" className="block text-sm font-semibold text-[#1e3a5f]">
              What are you disputing? <span className="text-red-700">*</span>
            </label>
            <textarea
              id="disputeDescription"
              name="disputeDescription"
              value={formData.disputeDescription}
              onChange={handleChange}
              placeholder="Explain the situation in detail..."
              rows={4}
              className={`w-full px-4 py-3 rounded-sm border-2 focus:ring-2 focus:ring-[#c9a227]/30 outline-none transition-all
                        placeholder:text-[#8b7355] resize-none bg-white ${
                          errors.disputeDescription
                            ? "border-red-400 focus:border-red-600"
                            : "border-[#e0e0e0] focus:border-[#c9a227]"
                        }`}
            />
            {errors.disputeDescription && (
              <p className="text-red-700 text-sm">{errors.disputeDescription}</p>
            )}
          </div>

          {/* Dispute Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-semibold text-[#1e3a5f]">
              Dispute Category <span className="text-red-700">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, category: cat.value }));
                    if (errors.category) {
                      setErrors((prev) => ({ ...prev, category: "" }));
                    }
                  }}
                  className={`px-4 py-3 rounded-sm border-2 text-sm font-medium transition-all
                            ${
                              formData.category === cat.value
                                ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                                : "border-[#e0e0e0] hover:border-[#c9a227] text-[#4a4a4a]"
                            }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-red-700 text-sm">{errors.category}</p>
            )}
          </div>

          {/* Intensity Slider */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#1e3a5f]">
              Level of Dispute <span className="text-red-700">*</span>
            </label>
            <div className="bg-[#f5f0e6] rounded-sm p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{getHeatEmoji(formData.intensity)}</span>
                <span className="text-lg font-bold text-[#1e3a5f]">
                  Level {formData.intensity}: {getHeatLabel(formData.intensity)}
                </span>
                <span className="text-3xl">{getHeatEmoji(formData.intensity)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.intensity}
                onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                className="w-full h-3 bg-[#e0e0e0] rounded-lg appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6
                          [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#1e3a5f]
                          [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform
                          [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-xs text-[#8b7355] px-1">
                <span>🥶 Calm</span>
                <span>🤬 Explosive</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 
                         text-lg font-medium text-[#1e3a5f] bg-[#f5f0e6] rounded-sm
                         hover:bg-[#e0d8c8] transition-all"
            >
              ← Return to Court
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 
                         text-lg font-bold text-white bg-[#1e3a5f] rounded-sm shadow-md
                         hover:bg-[#0f2744] hover:scale-[1.02] active:scale-[0.98]
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         border-2 border-[#c9a227]"
            >
              {isLoading ? (
                <>
                  <span className="loading-shimmer px-4 h-5 inline-block rounded-sm"></span>
                  Filing...
                </>
              ) : (
                <>
                  File Case →
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