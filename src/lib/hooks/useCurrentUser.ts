import { db } from '@/lib/db';

/**
 * 現在のユーザーIDを取得するカスタムフック
 */
export function useCurrentUser() {
  const { user } = db.useAuth();
  return user?.id || null;
}
