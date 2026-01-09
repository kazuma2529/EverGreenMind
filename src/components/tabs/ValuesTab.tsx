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
import { VariableBlock } from '@/components/ui/VariableBlock';
import { ListItem } from '@/components/ui/ListItem';
import { AddButton } from '@/components/ui/AddButton';
import { Loading } from '@/components/ui/Loading';
import { Error } from '@/components/ui/Error';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { MESSAGES, TAB_CONFIG } from '@/lib/constants';

export function ValuesTab() {
  const { isLoading, error, data } = db.useQuery({
    happinessDefinition: {},
    roleModels: {
      $: { order: { order: 'asc' } },
    },
  });

  const sensors = useDragAndDropSensors();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  const happinessDefinition = data?.happinessDefinition?.[0];
  const roleModels = data?.roleModels || [];

  // 幸せの定義の更新
  const handleUpdateHappiness = (content: string) => {
    if (happinessDefinition) {
      db.transact(
        db.tx.happinessDefinition[happinessDefinition.id].update({
          content,
          updatedAt: Date.now(),
        })
      );
    } else {
      // 初回作成
      db.transact(
        db.tx.happinessDefinition[id()].update({
          content,
          updatedAt: Date.now(),
        })
      );
    }
  };

  // なりたい人物像の操作
  const handleAddRoleModel = (title: string) => {
    const now = Date.now();
    const newOrder = roleModels.length;

    db.transact(
      db.tx.roleModels[id()].update({
        title,
        order: newOrder,
        createdAt: now,
        updatedAt: now,
      })
    );
  };

  const handleDeleteRoleModel = (itemId: string) => {
    db.transact(db.tx.roleModels[itemId].delete());
  };

  const handleUpdateRoleModel = (itemId: string, title: string) => {
    db.transact(
      db.tx.roleModels[itemId].update({
        title,
        updatedAt: Date.now(),
      })
    );
  };

  const handleReorderRoleModels = (reorderedItems: Array<{ id: string; order: number }>) => {
    const txs = reorderedItems.map((item) =>
      db.tx.roleModels[item.id].update({ order: item.order })
    );
    db.transact(txs);
  };

  const handleDragEnd = createHandleDragEnd(
    roleModels as Array<{ id: string; order: number }>,
    handleReorderRoleModels
  );

  return (
    <div className="space-y-8">
      {/* 幸せの定義 - 可変ブロック */}
      <section>
        <VariableBlock
          title="幸せの定義"
          content={happinessDefinition?.content || ''}
          onUpdate={handleUpdateHappiness}
          placeholder="あなたにとっての幸せとは何ですか？"
          accentColor={TAB_CONFIG.values.color}
          gradient={TAB_CONFIG.values.gradient}
          icon="🌳"
        />
      </section>

      {/* なりたい人物像 - ドラッグ可能リスト */}
      <section className="space-y-4">
        <SectionTitle gradient={TAB_CONFIG.values.gradient}>
          ✨ なりたい人物像
        </SectionTitle>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={roleModels.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            {roleModels.map((model) => (
              <ListItem
                key={model.id}
                id={model.id}
                title={model.title}
                onDelete={() => handleDeleteRoleModel(model.id)}
                onUpdate={(title) => handleUpdateRoleModel(model.id, title)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {roleModels.length === 0 && (
          <div className="py-12 text-center text-[var(--text-muted)]">
            {MESSAGES.empty.roleModels.main}<br />
            {MESSAGES.empty.roleModels.action}
          </div>
        )}

        <AddButton onAdd={handleAddRoleModel} placeholder="なりたい人物像..." />
      </section>
    </div>
  );
}
