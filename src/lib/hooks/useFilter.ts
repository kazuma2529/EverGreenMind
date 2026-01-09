import { useMemo } from 'react';
import type { FilterOption, FilterableItem } from '@/lib/types';

/**
 * フィルター機能を提供するカスタムフック
 */
export function useFilter<T extends FilterableItem>(
  items: T[],
  filter: FilterOption
): T[] {
  return useMemo(() => {
    switch (filter) {
      case 'completed':
        return items.filter(item => item.completed);
      case 'uncompleted':
        return items.filter(item => !item.completed);
      case 'all':
      default:
        return items;
    }
  }, [items, filter]);
}
