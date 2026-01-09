/**
 * 共通型定義
 */

// フィルターオプション
export type FilterOption = 'all' | 'uncompleted' | 'completed';

// チャレンジエンティティ
export type Challenge = {
  id: string;
  title: string;
  year: number;
  category: 'yearly' | 'lifetime';
  completed: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
};

// 意識エンティティ
export type Consciousness = {
  id: string;
  title: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

// ロールモデルエンティティ
export type RoleModel = {
  id: string;
  title: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

// アクションアイテムエンティティ
export type ActionItem = {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
};

// フィルター可能なアイテム（completedプロパティを持つ）
export type FilterableItem = {
  completed: boolean;
};
