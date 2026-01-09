// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  // チャレンジ: ユーザーごとにデータを分離
  challenges: {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.userId"],
  },
  // 意識: ユーザーごとにデータを分離
  consciousness: {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.userId"],
  },
  // 幸せの定義: ユーザーごとにデータを分離
  happinessDefinition: {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.userId"],
  },
  // ロールモデル: ユーザーごとにデータを分離
  roleModels: {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.userId"],
  },
  // 3年後の目標: ユーザーごとにデータを分離
  threeYearGoals: {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.userId"],
  },
  // 今月の目標: ユーザーごとにデータを分離
  monthlyGoals: {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.userId"],
  },
  // アクションアイテム: ユーザーごとにデータを分離
  actionItems: {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.userId"],
  },
} satisfies InstantRules;

export default rules;
