import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

export { DndContext, SortableContext, verticalListSortingStrategy };
export type { DragEndEvent };

export function useDragAndDropSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px移動で開始 (誤操作防止)
      },
    })
  );
}

export function createHandleDragEnd<T extends { id: string; order: number }>(
  items: T[],
  onReorder: (newItems: T[]) => void
) {
  return (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const reorderedItems = arrayMove(items, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        order: index,
      })
    );

    onReorder(reorderedItems);
  };
}

export { closestCenter };
