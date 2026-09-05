import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
}

export default function TeamYearDial({
  years,
  selectedYear,
  onChange,
}: Props) {
  const currentIndex = years.indexOf(selectedYear);

  const previousYear =
    currentIndex > 0 ? years[currentIndex - 1] : null;

  const nextYear =
    currentIndex < years.length - 1
      ? years[currentIndex + 1]
      : null;

  const goPrevious = () => {
    if (previousYear !== null) {
      onChange(previousYear);
    }
  };

  const goNext = () => {
    if (nextYear !== null) {
      onChange(nextYear);
    }
  };

  return (
    <div className="w-full flex items-center justify-center gap-3 sm:gap-8 py-8">
      {/* Previous */}
      <button
        type="button"
        onClick={goPrevious}
        disabled={previousYear === null}
        aria-label="Previous batch"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-white hover:border-green-500/40 hover:bg-green-500/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Year Dial */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 min-w-0">
        {/* Previous Year */}
        <button
          type="button"
          disabled={previousYear === null}
          onClick={() =>
            previousYear !== null &&
            onChange(previousYear)
          }
          className="w-20 sm:w-28 text-center text-sm sm:text-base font-semibold text-gray-600 hover:text-gray-300 transition-all duration-500 disabled:opacity-0"
        >
          {previousYear ?? ""}
        </button>

        {/* Selected Year */}
        <button
          type="button"
          onClick={() => onChange(selectedYear)}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shrink-0 group"
        >
          {/* Outer rotating ring */}
          <span className="absolute inset-0 rounded-full border border-green-500/20" />

          <span className="absolute -inset-1 rounded-full border border-green-500/10 group-hover:border-green-500/30 transition-all duration-500" />

          {/* Circular glow */}
          <span className="absolute inset-2 rounded-full bg-green-500/[0.08] group-hover:bg-green-500/[0.13] transition-all duration-500" />

          {/* Year */}
          <span className="relative z-10 text-xl sm:text-2xl font-black text-green-400 tracking-tight">
            {selectedYear}
          </span>
        </button>

        {/* Next Year */}
        <button
          type="button"
          disabled={nextYear === null}
          onClick={() =>
            nextYear !== null &&
            onChange(nextYear)
          }
          className="w-20 sm:w-28 text-center text-sm sm:text-base font-semibold text-gray-600 hover:text-gray-300 transition-all duration-500 disabled:opacity-0"
        >
          {nextYear ?? ""}
        </button>
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={goNext}
        disabled={nextYear === null}
        aria-label="Next batch"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-white hover:border-green-500/40 hover:bg-green-500/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}