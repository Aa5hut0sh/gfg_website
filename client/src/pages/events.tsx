import { useState } from "react";
import UpcomingEvents from "../components/upcomingevent";
import PastEvents from "../components/pastevent";

const Events = () => {
  const [mode, setMode] = useState<"upcoming" | "past">("upcoming");

  return (
    // pushes content below fixed navbar
    <section className="min-h-screen w-full bg-black text-white pt-32 pb-24 relative overflow-hidden px-6">
      
      {/* Subtle ambient glow (black stays dominant) */}
      <div className="absolute w-[600px] h-[600px] bg-green-500/5 blur-[220px] rounded-full -top-48 -left-48" />
      <div className="absolute w-[600px] h-[600px] bg-green-500/5 blur-[220px] rounded-full -bottom-48 -right-48" />

      {/* Vignette overlay for deeper black edges */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-14">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-black mb-4">
            Our <span className="text-green-400">Events</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our upcoming workshops and past highlights conducted by GFG RGIPT.
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setMode("upcoming")}
            className={`
              group relative overflow-hidden px-7 py-2.5 rounded-full text-sm font-semibold 
              transition-all duration-300 active:scale-95
              ${
                mode === "upcoming"
                  ? "bg-green-500 text-black shadow-[0_0_25px_rgba(34,197,94,0.8)]"
                  : "border border-white/10 text-gray-300 hover:text-green-400 hover:border-green-500/40"
              }
            `}
          >
            <span className="relative z-15 flex items-center gap-2">
               Upcoming Events
            </span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-green-500/10 via-green-400/20 to-green-500/10" />
          </button>

          <button
            onClick={() => setMode("past")}
            className={`
              group relative overflow-hidden px-7 py-2.5 rounded-full text-sm font-semibold 
              transition-all duration-300 active:scale-95
              ${
                mode === "past"
                  ? "bg-green-500 text-black shadow-[0_0_25px_rgba(34,197,94,0.8)]"
                  : "border border-white/10 text-gray-300 hover:text-green-400 hover:border-green-500/40"
              }
            `}
          >
            <span className="relative z-15 flex items-center gap-2">
               Past Events
            </span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-green-500/10 via-green-400/20 to-green-500/10" />
          </button>
        </div>

        {/* Content */}
        <div className="pt-6">
          {mode === "upcoming" ? <UpcomingEvents /> : <PastEvents />}
        </div>

      </div>
    </section>
  );
};

export default Events;