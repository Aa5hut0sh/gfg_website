import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Countdown from "react-countdown";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import type { FC } from "react";

// TSX-safe wrappers
const SafeConfetti = Confetti as unknown as FC<any>;
const SafeCountdown = Countdown as unknown as FC<any>;

// 🎇 Side cannons burst
const fireSideCannons = () => {
  const end = Date.now() + 1200;
  const colors = ["#22c55e", "#00ff88", "#34d399", "#a7f3d0"];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      startVelocity: 55,
      origin: { x: 0, y: 0.6 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      startVelocity: 55,
      origin: { x: 1, y: 0.6 },
      colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

const Launch: FC = () => {
  const [startCountdown, setStartCountdown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [targetTime, setTargetTime] = useState<number | null>(null);

  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,136,0.15),_transparent_45%)]" />

      {/* Confetti */}
      {showConfetti && <SafeConfetti recycle={false} numberOfPieces={900} />}

      {/* Initial Hero */}
      {!startCountdown && (
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          {/* Glow rings */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-2xl" />
          </div>

          {/* Glass card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full max-w-3xl rounded-3xl border border-emerald-400/30 bg-black/60 p-10 backdrop-blur-md shadow-[0_0_40px_rgba(0,255,136,0.25)]"
          >
            <span className="inline-block rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs uppercase tracking-widest text-emerald-300">
              RGIPT Student Chapter
            </span>

            {/* Headline like Home Page */}
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white">
                INTRODUCING
              </span>
              <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,136,0.8)]">
                GFG OFFICIAL WEBSITE
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm text-emerald-200/80 sm:text-base">
              Learn. Build. Compete. Connect with the developer community at RGIPT.
            </p>

            <div className="mt-10 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setTargetTime(Date.now() + 3000);
                  setStartCountdown(true);
                }}
                className="group relative overflow-hidden rounded-2xl bg-emerald-400 px-10 py-4 text-base font-semibold text-black shadow-[0_0_28px_rgba(0,255,136,0.6)]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center gap-2">
                   Launch Platform
                </span>
              </motion.button>
            </div>
          </motion.div>

          <div className="mt-6 text-xs tracking-widest text-emerald-300/60">
            Powered by GFG RGIPT
          </div>
        </div>
      )}

      {/* Countdown Overlay */}
      <AnimatePresence>
        {startCountdown && targetTime && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SafeCountdown
              date={targetTime}
              renderer={({ seconds, completed }: any) => {
                if (completed) {
                  navigate("/home");
                  return null;
                }

                if (seconds === 3 && !triggered) {
                  setTriggered(true);
                  setShowConfetti(true);
                  fireSideCannons();
                  setTimeout(() => setShowConfetti(false), 1200);
                }

                return (
                  <div className="relative flex flex-col items-center text-center">
                    <h1 className="mb-4 text-xl tracking-widest text-emerald-300">
                      GFG RGIPT STUDENT CHAPTER
                    </h1>

                    <div className="text-[140px] font-extrabold leading-none text-white drop-shadow-[0_0_40px_rgba(0,255,136,0.9)]">
                      {seconds}
                    </div>

                    <p className="mt-3 text-sm tracking-widest text-emerald-400 uppercase">
                      Redirecting to Home…
                    </p>
                  </div>
                );
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Launch;