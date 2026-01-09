'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ListItemProps {
  id: string;
  title: string;
  onDelete: () => void;
  onUpdate?: (title: string) => void;
  completed?: boolean;
  onToggleComplete?: () => void;
}

export function ListItem({
  id,
  title,
  onDelete,
  onUpdate,
  completed = false,
  onToggleComplete,
}: ListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (onUpdate && text !== title) {
      onUpdate(text);
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        scale: isDragging ? 1.05 : 1,
        x: 0
      }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 40px rgba(45, 212, 191, 0.2)'
      }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 25
      }}
      className={cn(
        'group relative flex items-center gap-3 overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 backdrop-blur-lg',
        'transition-all duration-200',
        'hover:border-[var(--forest-green-200)]',
        isDragging && 'shadow-2xl ring-2 ring-[var(--forest-green-100)]'
      )}
    >
      {/* ホバー時の光の効果 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--forest-green-100)] to-transparent opacity-0"
        whileHover={{ 
          opacity: 0.1,
          x: ['-100%', '100%']
        }}
        transition={{ duration: 0.6 }}
      />
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-[var(--text-muted)] opacity-0 transition-opacity hover:text-[var(--forest-green-100)] group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Checkbox (optional) */}
      {onToggleComplete !== undefined && (
        <button
          onClick={onToggleComplete}
          className={cn(
            'h-5 w-5 rounded border-2 transition-all',
            completed
              ? 'border-[var(--forest-green-100)] bg-[var(--forest-green-100)]'
              : 'border-[var(--glass-border)]'
          )}
        >
          {completed && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-[var(--forest-bg-dark)]"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
          )}
        </button>
      )}

      {/* Title */}
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') {
                setText(title);
                setIsEditing(false);
              }
            }}
            className="w-full bg-transparent text-[var(--text-primary)] outline-none"
            autoFocus
          />
        ) : (
          <p
            onDoubleClick={() => onUpdate && setIsEditing(true)}
            className={cn(
              'text-[var(--text-primary)]',
              completed && 'opacity-50',
              onUpdate && 'cursor-text'
            )}
          >
            {title}
          </p>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="text-[var(--text-muted)] opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
