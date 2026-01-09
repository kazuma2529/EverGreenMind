/**
 * ローディング表示コンポーネント
 */
export function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-[var(--text-secondary)]">読み込み中...</div>
    </div>
  );
}
