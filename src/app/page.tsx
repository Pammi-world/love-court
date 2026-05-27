import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center text-center gap-8">
        {/* Court Emblem */}
        <div className="text-6xl sm:text-8xl animate-fade-in" role="img" aria-label="Court Scales">
          ⚖️⚖️
        </div>

        {/* Tagline */}
        <h1 className="text-3xl sm:text-5xl font-bold text-[#1e3a5f] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          The Court is Now in Session
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#4a4a4a] max-w-md" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Welcome to Love Court — where disputes are heard, evidence is weighed, 
          and fair judgments are rendered.
        </p>

        {/* Start Case Button */}
        <Link
          href="/submit-a"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                     text-xl font-bold text-white bg-[#1e3a5f] rounded-none shadow-md 
                     hover:bg-[#0f2744] hover:scale-[1.02] active:scale-[0.98] 
                     transition-all duration-200 ease-out border-2 border-[#c9a227]
                     focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
        >
          <span className="text-2xl" role="img" aria-label="gavel">🔨</span>
          File a Case
          <span className="text-2xl" role="img" aria-label="scroll">📜</span>
        </Link>

        {/* Decorative Court Elements */}
        <div className="flex gap-4 text-2xl mt-4">
          <span role="img" aria-label="scroll">📜</span>
          <span role="img" aria-label="books">📚</span>
          <span role="img" aria-label="balance">⚖️</span>
          <span role="img" aria-label="pen">✒️</span>
          <span role="img" aria-label="hammer">🔨</span>
        </div>

        {/* Footer */}
        <p className="text-sm text-[#8b7355] mt-8">
          Judicial Est. 2024 • All Rights Reserved ⚖️
        </p>
        
        {/* History link in footer */}
        <Link
          href="/history"
          className="text-sm text-[#8b7355] hover:text-[#c9a227] transition-colors underline-offset-2 hover:underline"
        >
          📜 View Case Records
        </Link>
      </main>
    </div>
  );
}