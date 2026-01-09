'use client';

import { useState } from 'react';
import { db } from '@/lib/db';
import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await db.auth.sendMagicCode({ email });
      setStep('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'コードの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await db.auth.signInWithMagicCode({ email, code });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'コードの確認に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setCode('');
    setError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--forest-green-100)] bg-gradient-to-br from-[var(--glass-bg)] to-transparent p-8 backdrop-blur-lg shadow-2xl shadow-[var(--forest-green-100)]/20">
          {/* 装飾要素 */}
          <div className="absolute right-0 top-0 h-40 w-40 opacity-20"
            style={{
              background: 'radial-gradient(circle, var(--forest-green-100) 0%, transparent 70%)'
            }}
          />

          <div className="relative">
            {/* ヘッダー */}
            <div className="mb-8 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="mb-4 inline-block"
              >
                <Sparkles className="h-12 w-12 text-[var(--forest-green-100)]" />
              </motion.div>
              <h1 
                className="text-3xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(135deg, var(--forest-green-100) 0%, var(--forest-green-200) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                EverGreenMind
              </h1>
              <p className="text-[var(--text-secondary)]">
                {step === 'email' ? 'メールアドレスでログイン' : '認証コードを入力'}
              </p>
            </div>

            {/* エラー表示 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3"
              >
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* フォーム */}
            {step === 'email' ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                    メールアドレス
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className={cn(
                        'w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] py-3 pl-10 pr-4',
                        'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
                        'focus:border-[var(--forest-green-100)] focus:outline-none focus:ring-2 focus:ring-[var(--forest-green-100)]/20',
                        'transition-all duration-200'
                      )}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'w-full rounded-lg py-3 font-semibold text-[var(--forest-bg-dark)]',
                    'bg-[var(--forest-green-100)] shadow-lg shadow-[var(--forest-green-100)]/20',
                    'transition-all duration-200',
                    'hover:shadow-xl hover:shadow-[var(--forest-green-100)]/30',
                    isLoading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isLoading ? '送信中...' : '認証コードを送信'}
                </motion.button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label htmlFor="code" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                    認証コード（6桁）
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    required
                    maxLength={6}
                    className={cn(
                      'w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] py-3 px-4 text-center',
                      'text-2xl font-mono tracking-widest text-[var(--text-primary)]',
                      'focus:border-[var(--forest-green-100)] focus:outline-none focus:ring-2 focus:ring-[var(--forest-green-100)]/20',
                      'transition-all duration-200'
                    )}
                  />
                  <p className="mt-2 text-xs text-[var(--text-muted)] text-center">
                    {email} に送信されたコードを入力してください
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex-1 rounded-lg border-2 border-[var(--glass-border)] py-3 font-semibold',
                      'text-[var(--text-secondary)] transition-all duration-200',
                      'hover:border-[var(--forest-green-200)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    戻る
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex-1 rounded-lg py-3 font-semibold text-[var(--forest-bg-dark)]',
                      'bg-[var(--forest-green-100)] shadow-lg shadow-[var(--forest-green-100)]/20',
                      'transition-all duration-200',
                      'hover:shadow-xl hover:shadow-[var(--forest-green-100)]/30',
                      (isLoading || code.length !== 6) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isLoading ? '確認中...' : 'ログイン'}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
