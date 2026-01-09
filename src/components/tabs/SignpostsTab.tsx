'use client';

import { useState, useMemo } from 'react';
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
import { FilterToggle } from '@/components/ui/FilterToggle';
import { Loading } from '@/components/ui/Loading';
import { Error } from '@/components/ui/Error';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useFilter } from '@/lib/hooks/useFilter';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import type { FilterOption, ActionItem } from '@/lib/types';
import { MESSAGES, TAB_CONFIG } from '@/lib/constants';

export function SignpostsTab() {
  const [actionItemsFilter, setActionItemsFilter] = useState<FilterOption>('all');

  const { isLoading, error, data } = db.useQuery({
    threeYearGoals: {},
    monthlyGoals: {},
    actionItems: {
      $: { order: { order: 'asc' } },
    },
  });

  const sensors = useDragAndDropSensors();
  const userId = useCurrentUser();

  // データを取得（早期リターンの前で定義）
  const allActionItems = (data?.actionItems || []) as ActionItem[];

  // フィルター適用（早期リターンの前に配置）
  const actionItems = useFilter(allActionItems, actionItemsFilter);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  const threeYearGoals = data?.threeYearGoals?.[0];
  const monthlyGoals = data?.monthlyGoals?.[0];

  // 3年後の目標の更新
  const handleUpdateThreeYearGoals = (content: string) => {
    if (!userId) return;
    if (threeYearGoals) {
      db.transact(
        db.tx.threeYearGoals[threeYearGoals.id].update({
          content,
          updatedAt: Date.now(),
        })
      );
    } else {
      db.transact(
        db.tx.threeYearGoals[id()].update({
          content,
          userId,
          updatedAt: Date.now(),
        })
      );
    }
  };

  // 今月の目標の更新
  const handleUpdateMonthlyGoals = (content: string) => {
    if (!userId) return;
    if (monthlyGoals) {
      db.transact(
        db.tx.monthlyGoals[monthlyGoals.id].update({
          content,
          updatedAt: Date.now(),
        })
      );
    } else {
      db.transact(
        db.tx.monthlyGoals[id()].update({
          content,
          userId,
          updatedAt: Date.now(),
        })
      );
    }
  };

  // やるべきことの操作
  const handleAddActionItem = (title: string) => {
    if (!userId) return;
    const now = Date.now();
    const newOrder = allActionItems.length;

    db.transact(
      db.tx.actionItems[id()].update({
        title,
        completed: false,
        order: newOrder,
        userId,
        createdAt: now,
        updatedAt: now,
      })
    );
  };

  const handleDeleteActionItem = (itemId: string) => {
    db.transact(db.tx.actionItems[itemId].delete());
  };

  const handleUpdateActionItem = (itemId: string, title: string) => {
    db.transact(
      db.tx.actionItems[itemId].update({
        title,
        updatedAt: Date.now(),
      })
    );
  };

  const handleToggleComplete = (itemId: string, completed: boolean) => {
    db.transact(
      db.tx.actionItems[itemId].update({
        completed: !completed,
        updatedAt: Date.now(),
      })
    );
  };

  const handleReorderActionItems = (reorderedItems: typeof allActionItems) => {
    const txs = reorderedItems.map((item) =>
      db.tx.actionItems[item.id].update({ order: item.order })
    );
    db.transact(txs);
  };

  const handleDragEnd = createHandleDragEnd(allActionItems, handleReorderActionItems);

  return (
    <div className="space-y-8">
      {/* 3年後の目標 - 可変ブロック */}
      <section>
        <VariableBlock
          title="3年後の目標"
          content={threeYearGoals?.content || ''}
          onUpdate={handleUpdateThreeYearGoals}
          placeholder="3年後、どんな自分になっていたいですか？"
          accentColor={TAB_CONFIG.signposts.color}
          gradient={TAB_CONFIG.signposts.gradient}
          icon="🏔️"
        />
      </section>

      {/* 今月の目標 - 可変ブロック */}
      <section>
        <VariableBlock
          title="今月の目標"
          content={monthlyGoals?.content || ''}
          onUpdate={handleUpdateMonthlyGoals}
          placeholder="今月達成したい目標は何ですか？"
          accentColor={TAB_CONFIG.signposts.secondaryColor}
          gradient={`linear-gradient(135deg, var(${TAB_CONFIG.signposts.secondaryColor}) 0%, var(${TAB_CONFIG.signposts.color}) 100%)`}
          icon="🎯"
        />
      </section>

      {/* やるべきこと - チェックボックス付きリスト */}
      <section className="space-y-4">
        <SectionTitle gradient={TAB_CONFIG.signposts.gradient}>
          📋 やるべきこと
        </SectionTitle>

        {/* フィルター */}
        <FilterToggle selected={actionItemsFilter} onChange={setActionItemsFilter} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={allActionItems.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {actionItems.map((item) => (
              <ListItem
                key={item.id}
                id={item.id}
                title={item.title}
                completed={item.completed}
                onToggleComplete={() => handleToggleComplete(item.id, item.completed)}
                onDelete={() => handleDeleteActionItem(item.id)}
                onUpdate={(title) => handleUpdateActionItem(item.id, title)}
              />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {actionItems.length === 0 && (
          <div className="py-12 text-center text-[var(--text-muted)]">
            {allActionItems.length === 0
              ? (
                <>
                  {MESSAGES.empty.actionItems.main}<br />
                  {MESSAGES.empty.actionItems.action}
                </>
              )
              : MESSAGES.empty.noFilterMatch}
          </div>
        )}

        <AddButton onAdd={handleAddActionItem} placeholder="やるべきこと..." />
      </section>
    </div>
  );
}
