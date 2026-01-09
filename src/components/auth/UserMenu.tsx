'use client';

import { useState } from 'react';
import { db } from '@/lib/db';
import { LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export function UserMenu() {
  const { user } = db.useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await db.auth.signOut();
    setIsOpen(false);
  };

  if (!user) return null;

  const userEmail = user.email || 'ユーザー';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2',
          'text-sm text-[var(--text-secondary)] transition-all duration-200',
          'hover:border-[var(--forest-green-200)] hover:text-[var(--text-primary)]'
        )}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{userEmail}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* オーバーレイ */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* メニュー */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 backdrop-blur-lg shadow-xl"
            >
              <div className="mb-2 border-b border-[var(--glass-border)] px-3 py-2">
                <p className="text-xs text-[var(--text-muted)]">ログイン中</p>
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {userEmail}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm',
                  'text-[var(--text-secondary)] transition-all duration-200',
                  'hover:bg-red-500/10 hover:text-red-400'
                )}
              >
                <LogOut className="h-4 w-4" />
                ログアウト
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
