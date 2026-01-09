'use client';

import { db } from '@/lib/db';
import { id } from '@instantdb/react';
import {
  DndContext,
  SortableContext,
  verticalListSortingStrategy,
  closestCenter,
  useDragAndDropSensors,
  createHandleDragEnd,
} from '@/lib/hooks/useDragAndDrop';
import { ListItem } from '@/components/ui/ListItem';
import { AddButton } from '@/components/ui/AddButton';
import { Loading } from '@/components/ui/Loading';
import { Error } from '@/components/ui/Error';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { MESSAGES, TAB_CONFIG } from '@/lib/constants';

export function ConsciousnessList() {
  const { isLoading, error, data } = db.useQuery({
    consciousness: {
      $: { order: { order: 'asc' } },
    },
  });

  const sensors = useDragAndDropSensors();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  const consciousnessItems = data?.consciousness || [];

  const handleAdd = (title: string) => {
    const now = Date.now();
    db.transact(
      db.tx.consciousness[id()].create({
        title,
        order: consciousnessItems.length,
        createdAt: now,
        updatedAt: now,
      })
    );
  };

  const handleDelete = (itemId: string) => {
    db.transact(db.tx.consciousness[itemId].delete());
  };

  const handleUpdate = (itemId: string, title: string) => {
    db.transact(
      db.tx.consciousness[itemId].update({
        title,
        updatedAt: Date.now(),
      })
    );
  };

  const handleReorder = (reorderedItems: Array<{ id: string; order: number }>) => {
    const txs = reorderedItems.map((item) =>
      db.tx.consciousness[item.id].update({ order: item.order })
    );
    db.transact(txs);
  };

  const handleDragEnd = createHandleDragEnd(
    consciousnessItems as Array<{ id: string; order: number }>,
    handleReorder
  );

  return (
    <div className="space-y-4">
      <SectionTitle gradient={TAB_CONFIG.consciousness.gradient} className="mb-6">
        ⭐ 常に意識すること
      </SectionTitle>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={consciousnessItems.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {consciousnessItems.map((item) => (
            <ListItem
              key={item.id}
              id={item.id}
              title={item.title}
              onDelete={() => handleDelete(item.id)}
              onUpdate={(title) => handleUpdate(item.id, title)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {consciousnessItems.length === 0 && (
        <div className="py-12 text-center text-[var(--text-muted)]">
          {MESSAGES.empty.consciousness.main}<br />
          {MESSAGES.empty.consciousness.action}
        </div>
      )}

      <AddButton onAdd={handleAdd} placeholder="常に意識すること..." />
    </div>
  );
}
