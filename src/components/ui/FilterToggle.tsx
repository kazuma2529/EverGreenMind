'use client';

import type { FilterOption } from '@/lib/types';
import { FILTER_OPTIONS } from '@/lib/constants';

interface FilterToggleProps {
  selected: FilterOption;
  onChange: (filter: FilterOption) => void;
}

export function FilterToggle({ selected, onChange }: FilterToggleProps) {

  return (
    <div className="flex justify-center gap-2 p-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
      {FILTER_OPTIONS.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            sm:flex-none sm:px-4
            ${selected === option.value
              ? 'bg-[var(--forest-green-100)] text-[var(--forest-bg-dark)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
