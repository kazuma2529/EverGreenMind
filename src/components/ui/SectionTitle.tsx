/**
 * セクションタイトルコンポーネント
 * グラデーションテキストで統一された見出しを表示
 */
interface SectionTitleProps {
  children: React.ReactNode;
  gradient: string;
  className?: string;
}

export function SectionTitle({ children, gradient, className = '' }: SectionTitleProps) {
  return (
    <h2 
      className={`text-3xl font-bold ${className}`}
      style={{
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </h2>
  );
}
