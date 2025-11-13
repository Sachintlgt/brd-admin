"use client"

export default function FullScreenLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900"
    >
      <div className="flex flex-col items-center space-y-4 px-6">
        {/* Animated ring + logo */}
        <div className="relative flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse"
            style={{
              background:
                "radial-gradient(closest-side, rgba(99,102,241,0.25), transparent 60%)",
            }}
          />
          <div className="rounded-full bg-white/6 backdrop-blur p-4 flex items-center justify-center shadow-lg">
            {/* spinner ring */}
            <svg
              className="animate-spin h-14 w-14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="4"
              />
              <path
                d="M22 12a10 10 0 00-10-10"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.9"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white">Loading…</h3>
          <p className="mt-1 text-sm text-slate-200/80 max-w-md">
            Preparing the app — this should only take a moment. If it takes
            longer than expected try refreshing.
          </p>
        </div>

        {/* subtle skeleton bar */}
        <div className="mt-4 w-64 h-2 rounded-full bg-white/6 overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-white/12 animate-[shimmer_1.6s_infinite]"></div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-120%);
            }
            100% {
              transform: translateX(220%);
            }
          }
          .animate-[shimmer_1.6s_infinite] {
            animation: shimmer 1.6s infinite;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.08),
              transparent
            );
          }
        `}</style>
      </div>
    </div>
  );
}
