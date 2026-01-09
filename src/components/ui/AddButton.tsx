'use client';

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface AddButtonProps {
  onAdd: (text: string) => void;
  placeholder?: string;
}

export function AddButton({
  onAdd,
  placeholder = '新しい項目を追加...',
}: AddButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <motion.form
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-xl border-2 border-[var(--forest-green-100)] bg-gradient-to-br from-[var(--glass-bg)] to-transparent p-4 backdrop-blur-lg shadow-lg shadow-[var(--forest-green-100)]/20"
      >
        {/* キラキラ背景効果 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--forest-green-100)]/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            if (!text.trim()) setIsAdding(false);
          }}
          placeholder={placeholder}
          className="relative z-10 w-full bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          autoFocus
        />
      </motion.form>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setIsAdding(true)}
      className={cn(
        'group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-[var(--glass-border)] p-4',
        'text-[var(--text-muted)] transition-all',
        'hover:border-[var(--forest-green-100)] hover:text-[var(--forest-green-100)] hover:shadow-lg hover:shadow-[var(--forest-green-100)]/20'
      )}
    >
      {/* ホバー時の背景グロー */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[var(--forest-green-100)]/0 via-[var(--forest-green-100)]/10 to-[var(--forest-green-100)]/0 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
      
      <motion.div
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="opacity-0 group-hover:opacity-100"
      >
        <Sparkles className="h-4 w-4" />
      </motion.div>
      
      <Plus className="relative z-10 h-5 w-5" />
      <span className="relative z-10 font-medium">追加</span>
    </motion.button>
  );
}
