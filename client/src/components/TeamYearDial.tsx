import { useEffect, useRef, useState } from "react";

interface TeamYearDialProps {
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
}

// Roughly how many pill tabs fit before we cap the width and switch to scrolling
const MAX_VISIBLE_TABS = 3;

export default function TeamYearDial({
  years,
  selectedYear,
  onChange,
}: TeamYearDialProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isOverflowing = years.length > MAX_VISIBLE_TABS;

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 4
    );
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () =>
      window.removeEventListener("resize", updateScrollState);
  }, [years]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -160 : 160,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex justify-center mb-10">
      <div className="relative flex items-center">
        {/* LEFT ARROW */}
        {isOverflowing && (
          <button
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            className={`
              flex items-center justify-center
              w-7 h-7 mr-1 rounded-full
              text-[#888] transition-opacity duration-200
              ${
                canScrollLeft
                  ? "opacity-60 hover:opacity-100"
                  : "opacity-20 cursor-default"
              }
            `}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* TABS */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className={`
            flex bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl p-1 gap-0.5
            overflow-x-auto scroll-smooth
            [&::-webkit-scrollbar]:hidden
          `}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            maxWidth: isOverflowing ? "340px" : undefined,
          }}
        >
          {years.map((year) => {
            const isActive = selectedYear === year;

            return (
              <button
                key={year}
                onClick={() => onChange(year)}
                className={`
                  shrink-0 px-6 py-2.5 rounded-xl
                  text-[11px] font-bold uppercase tracking-widest
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#16a34a] text-black shadow-[0_0_20px_rgba(22,163,74,0.2)]"
                      : "text-[#555] hover:text-[#f0f0f0] hover:bg-[#1a1a1a]"
                  }
                `}
              >
                {year}
              </button>
            );
          })}
        </div>

        {/* RIGHT ARROW */}
        {isOverflowing && (
          <button
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            className={`
              flex items-center justify-center
              w-7 h-7 ml-1 rounded-full
              text-[#888] transition-opacity duration-200
              ${
                canScrollRight
                  ? "opacity-60 hover:opacity-100"
                  : "opacity-20 cursor-default"
              }
            `}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}