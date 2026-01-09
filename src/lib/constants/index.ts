/**
 * アプリケーション定数
 */

// タブ設定
export const TAB_CONFIG = {
  challenges: {
    name: '挑戦',
    href: '/challenges',
    color: '--tab1-primary',
    secondaryColor: '--tab1-secondary',
    gradient: 'linear-gradient(135deg, var(--tab1-primary) 0%, var(--tab1-secondary) 100%)',
  },
  consciousness: {
    name: '意識',
    href: '/consciousness',
    color: '--tab2-primary',
    secondaryColor: '--tab2-secondary',
    gradient: 'linear-gradient(135deg, var(--tab2-primary) 0%, var(--tab2-secondary) 100%)',
  },
  values: {
    name: '価値観',
    href: '/values',
    color: '--tab3-primary',
    secondaryColor: '--tab3-secondary',
    gradient: 'linear-gradient(135deg, var(--tab3-primary) 0%, var(--tab3-secondary) 100%)',
  },
  signposts: {
    name: '道標',
    href: '/signposts',
    color: '--tab4-primary',
    secondaryColor: '--tab4-secondary',
    gradient: 'linear-gradient(135deg, var(--tab4-primary) 0%, var(--tab4-secondary) 100%)',
  },
} as const;

// フィルターオプション
export const FILTER_OPTIONS = [
  { value: 'all' as const, label: '全て' },
  { value: 'uncompleted' as const, label: '未完了' },
  { value: 'completed' as const, label: '完了済み' },
] as const;

// メッセージ
export const MESSAGES = {
  loading: '読み込み中...',
  error: 'エラー',
  empty: {
    challenges: {
      yearly: 'まだ挑戦したいことがありません。',
      lifetime: 'まだ死ぬまでに挑戦したいことがありません。',
      action: '下のボタンから追加してみましょう！',
    },
    consciousness: {
      main: 'まだ意識したいことがありません。',
      action: '下のボタンから追加してみましょう！',
    },
    roleModels: {
      main: 'まだなりたい人物像がありません。',
      action: '下のボタンから追加してみましょう！',
    },
    actionItems: {
      main: 'まだやるべきことがありません。',
      action: '下のボタンから追加してみましょう！',
    },
    noFilterMatch: 'フィルター条件に一致する項目がありません。',
  },
} as const;
