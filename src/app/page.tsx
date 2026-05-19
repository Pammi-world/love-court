import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-white flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center text-center gap-8">
        {/* Judge Character */}
        <div className="text-6xl sm:text-8xl animate-bounce" role="img" aria-label="Judge">
          ⚖️👩‍⚖️
        </div>

        {/* Tagline */}
        <h1 className="text-3xl sm:text-5xl font-bold text-rose-600 tracking-tight">
          The Court is Now in Session
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-rose-500 max-w-md">
          Welcome to Love Court — where hearts are judged, feelings are weighed, 
          and love gets its day in court. 💕
        </p>

        {/* Start Case Button */}
        <Link
          href="/submit-a"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                     text-xl font-bold text-white bg-rose-500 rounded-full shadow-lg 
                     hover:bg-rose-600 hover:scale-105 active:scale-95 
                     transition-all duration-200 ease-out
                     focus:outline-none focus:ring-4 focus:ring-rose-300"
        >
          <span className="text-2xl" role="img" aria-label="gavel">🔨</span>
          Start Case
          <span className="text-2xl" role="img" aria-label="sparkle">✨</span>
        </Link>

        {/* Decorative Court Elements */}
        <div className="flex gap-4 text-2xl mt-4">
          <span role="img" aria-label="heart">💗</span>
          <span role="img" aria-label="envelope">💌</span>
          <span role="img" aria-label="teddy bear">🧸</span>
          <span role="img" aria-label="ring">💍</span>
          <span role="img" aria-label="balloon">🎈</span>
        </div>

        {/* Fun footer */}
        <p className="text-sm text-rose-400 mt-8">
          Powered by love • Est. 2024 • All rights reserved ❤️
        </p>
      </main>
    </div>
  );
}