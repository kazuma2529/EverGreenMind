'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, Star, TreePine, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { TAB_CONFIG } from '@/lib/constants';

const tabs = [
  {
    name: TAB_CONFIG.challenges.name,
    href: TAB_CONFIG.challenges.href,
    icon: Sprout,
    color: TAB_CONFIG.challenges.color,
    gradient: TAB_CONFIG.challenges.gradient,
  },
  {
    name: TAB_CONFIG.consciousness.name,
    href: TAB_CONFIG.consciousness.href,
    icon: Star,
    color: TAB_CONFIG.consciousness.color,
    gradient: TAB_CONFIG.consciousness.gradient,
  },
  {
    name: TAB_CONFIG.values.name,
    href: TAB_CONFIG.values.href,
    icon: TreePine,
    color: TAB_CONFIG.values.color,
    gradient: TAB_CONFIG.values.gradient,
  },
  {
    name: TAB_CONFIG.signposts.name,
    href: TAB_CONFIG.signposts.href,
    icon: Mountain,
    color: TAB_CONFIG.signposts.color,
    gradient: TAB_CONFIG.signposts.gradient,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-lg">
      <div className="mx-auto flex max-w-md">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="group relative flex flex-1 flex-col items-center justify-center gap-1 py-3"
            >
              {/* アクティブ時の背景グロー */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0"
                  style={{
                    background: tab.gradient,
                    opacity: 0.1,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* アイコン */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Icon
                  className={cn(
                    'h-6 w-6 transition-all',
                    isActive && 'drop-shadow-lg'
                  )}
                  style={{
                    color: isActive ? `var(${tab.color})` : 'var(--text-muted)',
                    filter: isActive ? `drop-shadow(0 0 8px var(${tab.color}))` : 'none',
                  }}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>

              {/* ラベル */}
              <span 
                className={cn(
                  'relative text-xs font-medium transition-all',
                  isActive && 'font-semibold'
                )}
                style={{
                  color: isActive ? `var(${tab.color})` : 'var(--text-muted)',
                }}
              >
                {tab.name}
              </span>

              {/* アクティブインジケーター */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full"
                  style={{ background: tab.gradient }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
