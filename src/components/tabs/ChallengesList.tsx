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
  DragEndEvent,
} from '@/lib/hooks/useDragAndDrop';
import { arrayMove } from '@dnd-kit/sortable';
import { ListItem } from '@/components/ui/ListItem';
import { AddButton } from '@/components/ui/AddButton';
import { YearSelector } from '@/components/ui/YearSelector';
import { FilterToggle } from '@/components/ui/FilterToggle';
import { Loading } from '@/components/ui/Loading';
import { Error } from '@/components/ui/Error';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useFilter } from '@/lib/hooks/useFilter';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import type { FilterOption, Challenge } from '@/lib/types';
import { MESSAGES, TAB_CONFIG } from '@/lib/constants';

export function ChallengesList() {
  const currentYear = new Date().getFullYear();
  const userId = useCurrentUser();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [yearlyFilter, setYearlyFilter] = useState<FilterOption>('all');
  const [lifetimeFilter, setLifetimeFilter] = useState<FilterOption>('all');

  const { isLoading, error, data } = db.useQuery({
    challenges: {
      $: { order: { order: 'asc' } },
    },
  });

  const sensors = useDragAndDropSensors();

  // データをカテゴリと年でフィルター
  const challenges = (data?.challenges || []) as Challenge[];

  const yearlyChallenges = useMemo(() => {
    return challenges.filter(
      c => c.category === 'yearly' && c.year === selectedYear
    );
  }, [challenges, selectedYear]);

  const lifetimeChallenges = useMemo(() => {
    return challenges.filter(c => c.category === 'lifetime');
  }, [challenges]);

  // フィルター適用
  const filteredYearlyChallenges = useFilter(yearlyChallenges, yearlyFilter);
  const filteredLifetimeChallenges = useFilter(lifetimeChallenges, lifetimeFilter);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  // 年ごとのチャレンジ追加
  const handleAddYearly = (title: string) => {
    if (!userId) return;
    const now = Date.now();
    const newOrder = yearlyChallenges.length;

    db.transact(
      db.tx.challenges[id()].update({
        title,
        year: selectedYear,
        category: 'yearly',
        completed: false,
        order: newOrder,
        userId,
        createdAt: now,
        updatedAt: now,
      })
    );
  };

  // 生涯チャレンジ追加
  const handleAddLifetime = (title: string) => {
    if (!userId) return;
    const now = Date.now();
    const newOrder = lifetimeChallenges.length;

    db.transact(
      db.tx.challenges[id()].update({
        title,
        year: 0, // lifetimeは年を持たない
        category: 'lifetime',
        completed: false,
        order: newOrder,
        userId,
        createdAt: now,
        updatedAt: now,
      })
    );
  };

  const handleDelete = (challengeId: string) => {
    db.transact(db.tx.challenges[challengeId].delete());
  };

  const handleUpdate = (challengeId: string, title: string) => {
    db.transact(
      db.tx.challenges[challengeId].update({
        title,
        updatedAt: Date.now(),
      })
    );
  };

  const handleToggleComplete = (challengeId: string, completed: boolean) => {
    db.transact(
      db.tx.challenges[challengeId].update({
        completed: !completed,
        updatedAt: Date.now(),
      })
    );
  };

  // ドラッグ&ドロップ処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeChallenge = challenges.find(c => c.id === active.id);
    if (!activeChallenge) return;

    const overChallenge = challenges.find(c => c.id === over.id);
    if (!overChallenge) return;

    const activeIsYearly = activeChallenge.category === 'yearly';
    const overIsYearly = overChallenge.category === 'yearly';

    // 同じリスト内での並び替え
    if (activeIsYearly === overIsYearly) {
      const list = activeIsYearly ? yearlyChallenges : lifetimeChallenges;
      const oldIndex = list.findIndex(item => item.id === active.id);
      const newIndex = list.findIndex(item => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedItems = arrayMove(list, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );

      const txs = reorderedItems.map(item =>
        db.tx.challenges[item.id].update({ order: item.order })
      );
      db.transact(txs);
    } else {
      // 別のリストへの移動（カテゴリ変更）
      const targetList = overIsYearly ? yearlyChallenges : lifetimeChallenges;
      const newIndex = targetList.findIndex(item => item.id === over.id);
      const newOrder = newIndex >= 0 ? newIndex : targetList.length;

      // 移動元のリストのorderを再計算
      const sourceList = activeIsYearly ? yearlyChallenges : lifetimeChallenges;
      const sourceTxs = sourceList
        .filter(item => item.id !== active.id)
        .map((item, index) =>
          db.tx.challenges[item.id].update({ order: index })
        );

      // 移動先のリストのorderを再計算
      const targetTxs = targetList
        .filter(item => item.id !== over.id)
        .map((item, index) =>
          db.tx.challenges[item.id].update({
            order: index < newOrder ? index : index + 1,
          })
        );

      // 移動するアイテムの更新
      const moveTx = db.tx.challenges[active.id].update({
        category: overIsYearly ? 'yearly' : 'lifetime',
        year: overIsYearly ? selectedYear : 0,
        order: newOrder,
        updatedAt: Date.now(),
      });

      db.transact([...sourceTxs, ...targetTxs, moveTx]);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        {/* セクション1: 今年挑戦したいこと */}
        <section className="space-y-4">
        <SectionTitle gradient={TAB_CONFIG.challenges.gradient}>
          🌱 今年挑戦したいこと
        </SectionTitle>

        {/* 年選択 */}
        <YearSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />

        {/* フィルター */}
        <FilterToggle selected={yearlyFilter} onChange={setYearlyFilter} />

        {/* リスト */}
        <SortableContext
          items={yearlyChallenges.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {filteredYearlyChallenges.map(challenge => (
              <ListItem
                key={challenge.id}
                id={challenge.id}
                title={challenge.title}
                completed={challenge.completed}
                onToggleComplete={() =>
                  handleToggleComplete(challenge.id, challenge.completed)
                }
                onDelete={() => handleDelete(challenge.id)}
                onUpdate={(title) => handleUpdate(challenge.id, title)}
              />
            ))}
          </div>
        </SortableContext>

        {filteredYearlyChallenges.length === 0 && (
          <div className="py-12 text-center text-[var(--text-muted)]">
            {yearlyChallenges.length === 0
              ? (
                <>
                  {MESSAGES.empty.challenges.yearly}<br />
                  {MESSAGES.empty.challenges.action}
                </>
              )
              : MESSAGES.empty.noFilterMatch}
          </div>
        )}

        <AddButton
          onAdd={handleAddYearly}
          placeholder={`${selectedYear}年に挑戦したいこと...`}
        />
      </section>

      {/* セクション2: 死ぬまでに挑戦したいこと */}
      <section className="space-y-4">
        <SectionTitle gradient={`linear-gradient(135deg, var(${TAB_CONFIG.challenges.secondaryColor}) 0%, var(--forest-green-200) 100%)`}>
          💫 死ぬまでに挑戦したいこと
        </SectionTitle>

        {/* フィルター */}
        <FilterToggle selected={lifetimeFilter} onChange={setLifetimeFilter} />

        {/* リスト */}
        <SortableContext
          items={lifetimeChallenges.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {filteredLifetimeChallenges.map(challenge => (
              <ListItem
                key={challenge.id}
                id={challenge.id}
                title={challenge.title}
                completed={challenge.completed}
                onToggleComplete={() =>
                  handleToggleComplete(challenge.id, challenge.completed)
                }
                onDelete={() => handleDelete(challenge.id)}
                onUpdate={(title) => handleUpdate(challenge.id, title)}
              />
            ))}
          </div>
        </SortableContext>

        {filteredLifetimeChallenges.length === 0 && (
          <div className="py-12 text-center text-[var(--text-muted)]">
            {lifetimeChallenges.length === 0
              ? (
                <>
                  {MESSAGES.empty.challenges.lifetime}<br />
                  {MESSAGES.empty.challenges.action}
                </>
              )
              : MESSAGES.empty.noFilterMatch}
          </div>
        )}

        <AddButton
          onAdd={handleAddLifetime}
          placeholder="死ぬまでに挑戦したいこと..."
        />
      </section>
      </div>
    </DndContext>
  );
}
