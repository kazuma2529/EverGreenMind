/**
 * エラー表示コンポーネント
 */
interface ErrorProps {
  message: string;
}

export function Error({ message }: ErrorProps) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
      <p className="text-red-400">エラー: {message}</p>
    </div>
  );
}
