'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export function YearSelector({ selectedYear, onYearChange }: YearSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 現在の年から+10年分を生成
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 120; // 1年分のボタン幅
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* 左スクロールボタン */}
      <button
        onClick={() => scroll('left')}
        className="p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--forest-green-200)] transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
      </button>

      {/* 年ボタンのスクロール可能コンテナ */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {years.map(year => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={`
              px-6 py-2 rounded-lg font-semibold whitespace-nowrap snap-center
              transition-all duration-200
              ${selectedYear === year
                ? 'bg-[var(--forest-green-100)] text-[var(--forest-bg-dark)] scale-110'
                : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--forest-green-200)]'
              }
            `}
          >
            {year}
          </button>
        ))}
      </div>

      {/* 右スクロールボタン */}
      <button
        onClick={() => scroll('right')}
        className="p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--forest-green-200)] transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
      </button>
    </div>
  );
}
