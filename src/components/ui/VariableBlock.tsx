'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Sparkles } from 'lucide-react';

interface VariableBlockProps {
  title: string;
  content: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
  accentColor?: string;
  gradient?: string;
  icon?: React.ReactNode;
}

export function VariableBlock({
  title,
  content,
  onUpdate,
  placeholder = 'クリックして入力...',
  accentColor = '--tab3-primary',
  gradient = 'linear-gradient(135deg, var(--tab3-primary) 0%, var(--tab3-secondary) 100%)',
  icon
}: VariableBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setText(content);
  }, [content]);

  const handleSave = () => {
    if (text !== content) {
      onUpdate(text);
    }
    setIsEditing(false);
  };

  // テキスト量に応じた高さ調整 (文字数 × 0.5px, 最小120px, 最大400px)
  const calculatedHeight = Math.max(120, Math.min(400, text.length * 0.5 + 100));

  return (
    <motion.div
      animate={{ minHeight: calculatedHeight }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      {/* 背景グロー効果 */}
      <motion.div
        className="absolute -inset-2 rounded-2xl opacity-0 blur-2xl"
        style={{ background: gradient }}
        animate={{ opacity: isHovered ? 0.5 : 0.2 }}
        transition={{ duration: 0.3 }}
      />

      {/* メインカード */}
      <motion.div
        className={cn(
          'relative overflow-hidden rounded-2xl border-2 p-6 backdrop-blur-lg shadow-2xl',
          !isEditing && 'cursor-pointer'
        )}
        style={{
          background: `linear-gradient(135deg, ${accentColor.startsWith('--') ? `var(${accentColor})` : accentColor}25 0%, ${accentColor.startsWith('--') ? `var(${accentColor})` : accentColor}10 50%, rgba(20, 40, 32, 0.8) 100%)`,
          borderColor: accentColor.startsWith('--') ? `var(${accentColor})` : accentColor,
          borderWidth: '2px',
          boxShadow: `0 8px 32px ${accentColor.startsWith('--') ? `var(${accentColor})` : accentColor}30, 0 0 0 1px ${accentColor.startsWith('--') ? `var(${accentColor})` : accentColor}40`,
        }}
        onClick={() => !isEditing && setIsEditing(true)}
        whileHover={{ scale: 1.02, boxShadow: `0 12px 48px ${accentColor.startsWith('--') ? `var(${accentColor})` : accentColor}50, 0 0 0 1px ${accentColor.startsWith('--') ? `var(${accentColor})` : accentColor}60` }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* デコレーション要素 - 強化 */}
        <div className="absolute right-0 top-0 h-40 w-40 opacity-30"
          style={{
            background: `radial-gradient(circle, var(${accentColor}) 0%, transparent 60%)`
          }}
        />
        <div className="absolute left-0 bottom-0 h-32 w-32 opacity-20"
          style={{
            background: `radial-gradient(circle, var(${accentColor}) 0%, transparent 70%)`
          }}
        />
        
        {/* ヘッダー */}
        <div className="relative mb-4 flex items-center gap-3">
          {icon && (
            <motion.div
              animate={{ rotate: isHovered ? [0, -10, 10, -10, 0] : 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl"
            >
              {icon}
            </motion.div>
          )}
          <h3 
            className="text-2xl font-bold"
            style={{
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h3>
          {!isEditing && (
            <motion.div
              animate={{ 
                scale: isHovered ? [1, 1.2, 1] : 1,
                opacity: isHovered ? 1 : 0.5 
              }}
              transition={{ repeat: isHovered ? Infinity : 0, duration: 2 }}
            >
              <Sparkles className="h-5 w-5" style={{ color: `var(${accentColor})` }} />
            </motion.div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="relative">
          {isEditing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleSave}
              className="w-full resize-none bg-transparent text-lg text-[var(--text-primary)] outline-none"
              style={{ minHeight: '100px' }}
              autoFocus
              placeholder={placeholder}
            />
          ) : (
            <motion.p 
              className="whitespace-pre-wrap text-lg text-[var(--text-secondary)]"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0.8 }}
            >
              {text || (
                <span className="italic opacity-50">{placeholder}</span>
              )}
            </motion.p>
          )}
        </div>

        {/* ボトム装飾 */}
        {!isEditing && text && (
          <motion.div
            className="mt-4 h-1 rounded-full"
            style={{ background: gradient }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
