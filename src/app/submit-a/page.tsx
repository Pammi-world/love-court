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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Store in localStorage
    const disputeData = {
      ...formData,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem("loveCourt_dispute", JSON.stringify(disputeData));

    // Navigate to Partner B form
    router.push("/submit-b");
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
    <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-600">
            ⚖️ Partner A — File Your Case
          </h1>
          <p className="text-rose-500">
            Present your side of the story to the court
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
        >
          {/* Partner A Name (Optional) */}
          <div className="space-y-2">
            <label htmlFor="partnerAName" className="block text-sm font-semibold text-gray-700">
              Your Name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="partnerAName"
              name="partnerAName"
              value={formData.partnerAName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-500 
                         focus:ring-2 focus:ring-rose-200 outline-none transition-all
                         placeholder:text-gray-400"
            />
          </div>

          {/* Dispute Description (Required) */}
          <div className="space-y-2">
            <label htmlFor="disputeDescription" className="block text-sm font-semibold text-gray-700">
              What are you arguing about? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="disputeDescription"
              name="disputeDescription"
              value={formData.disputeDescription}
              onChange={handleChange}
              placeholder="Explain the situation..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-rose-200 outline-none transition-all
                        placeholder:text-gray-400 resize-none ${
                          errors.disputeDescription
                            ? "border-red-400 focus:border-red-500"
                            : "border-rose-200 focus:border-rose-500"
                        }`}
            />
            {errors.disputeDescription && (
              <p className="text-red-500 text-sm">{errors.disputeDescription}</p>
            )}
          </div>

          {/* Dispute Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
              Dispute Category <span className="text-red-500">*</span>
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
                  className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
                            ${
                              formData.category === cat.value
                                ? "border-rose-500 bg-rose-100 text-rose-700"
                                : "border-rose-200 hover:border-rose-300 text-gray-600"
                            }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          {/* Intensity Slider */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              How heated is this? <span className="text-red-500">*</span>
            </label>
            <div className="bg-rose-50 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{getHeatEmoji(formData.intensity)}</span>
                <span className="text-lg font-bold text-rose-600">
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
                className="w-full h-3 bg-rose-200 rounded-lg appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6
                          [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-rose-500
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform
                          [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-xs text-gray-500 px-1">
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
                         text-lg font-medium text-rose-600 bg-rose-100 rounded-full
                         hover:bg-rose-200 transition-all"
            >
              ← Back to Home
            </Link>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 
                         text-lg font-bold text-white bg-rose-500 rounded-full shadow-lg
                         hover:bg-rose-600 hover:scale-[1.02] active:scale-[0.98]
                         transition-all"
            >
              Submit Case →
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