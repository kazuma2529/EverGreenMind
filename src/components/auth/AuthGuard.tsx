'use client';

import { db } from '@/lib/db';
import { LoginForm } from './LoginForm';
import { Loading } from '@/components/ui/Loading';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 認証が必要なコンテンツを保護するコンポーネント
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-red-400">認証エラー: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
