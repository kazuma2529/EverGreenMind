// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  // チャレンジ: 全員がアクセス可能
  challenges: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "true",
    },
  },
  // 意識: 全員がアクセス可能
  consciousness: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "true",
    },
  },
  // 幸せの定義: 全員がアクセス可能
  happinessDefinition: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "true",
    },
  },
  // ロールモデル: 全員がアクセス可能
  roleModels: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "true",
    },
  },
  // 3年後の目標: 全員がアクセス可能
  threeYearGoals: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "true",
    },
  },
  // 今月の目標: 全員がアクセス可能
  monthlyGoals: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "true",
    },
  },
  // アクションアイテム: 全員がアクセス可能
  actionItems: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "true",
    },
  },
} satisfies InstantRules;

export default rules;
