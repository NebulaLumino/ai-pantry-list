"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ACCENT = "bg-slate-500";
const ACCENT_TEXT = "text-slate-400";
const ACCENT_GLOW = "shadow-slate-500/20";

export default function PantryOptimizer() {
  const [householdSize, setHouseholdSize] = useState("");
  const [cuisineInterests, setCuisineInterests] = useState("");
  const [cookingFrequency, setCookingFrequency] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdSize || !cuisineInterests || !cookingFrequency || !budget) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ householdSize, cuisineInterests, cookingFrequency, budget }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result || "");
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center gap-3">
        <div className={`w-10 h-10 ${ACCENT} rounded-xl flex items-center justify-center text-xl`}>🫙</div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Pantry Essentials & Grocery Optimizer</h1>
          <p className="text-sm text-gray-400">Tiered grocery lists with cost-saving tips</p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Household Size</label>
            <select value={householdSize} onChange={e => setHouseholdSize(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-slate-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select household size...</option>
              <option value="1 person" className="bg-gray-900">1 Person</option>
              <option value="2 people" className="bg-gray-900">2 People</option>
              <option value="3-4 people" className="bg-gray-900">3–4 People</option>
              <option value="5+ people" className="bg-gray-900">5+ People</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Cuisine Interests</label>
            <input value={cuisineInterests} onChange={e => setCuisineInterests(e.target.value)} placeholder="e.g., Italian, Thai, Mexican, Japanese, Mediterranean..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-slate-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Cooking Frequency</label>
            <select value={cookingFrequency} onChange={e => setCookingFrequency(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-slate-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select cooking frequency...</option>
              <option value="daily (home cook)" className="bg-gray-900">Daily (home cook)</option>
              <option value="most days (4-5/week)" className="bg-gray-900">Most days (4–5/week)</option>
              <option value="weekends only" className="bg-gray-900">Weekends only</option>
              <option value="occasional" className="bg-gray-900">Occasional</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Budget</label>
            <select value={budget} onChange={e => setBudget(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-slate-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select budget...</option>
              <option value="tight ($50-75/week)" className="bg-gray-900">Tight ($50–75/week)</option>
              <option value="moderate ($75-125/week)" className="bg-gray-900">Moderate ($75–125/week)</option>
              <option value="comfortable ($125-200/week)" className="bg-gray-900">Comfortable ($125–200/week)</option>
              <option value="flexible ($200+/week)" className="bg-gray-900">Flexible ($200+/week)</option>
            </select>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${ACCENT} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${ACCENT_GLOW}`}>
            {loading ? "Generating Grocery List..." : "Generate Grocery List"}
          </button>
        </form>
        <div className="flex flex-col">
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${ACCENT_TEXT} mb-3`}>AI Output</h2>
          <div className="flex-1 bg-gray-800/40 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[600px]">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">Your grocery list will appear here...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
