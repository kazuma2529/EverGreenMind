// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    // Tab 1: 今年挑戦したいこと (Things to challenge this year)
    challenges: i.entity({
      title: i.string(),
      year: i.number().indexed(),
      category: i.string().indexed(), // "yearly" | "lifetime"
      completed: i.boolean(),
      order: i.number().indexed(),
      userId: i.string().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number(),
    }),
    // Tab 2: 常に意識すること (Things to always be conscious of)
    consciousness: i.entity({
      title: i.string(),
      order: i.number().indexed(),
      userId: i.string().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number(),
    }),
    // Tab 3: 価値観と自分軸 - 幸せの定義 (Happiness Definition)
    happinessDefinition: i.entity({
      content: i.string(),
      userId: i.string().indexed(),
      updatedAt: i.number(),
    }),
    // Tab 3: 価値観と自分軸 - なりたい人物像 (Role Models)
    roleModels: i.entity({
      title: i.string(),
      order: i.number().indexed(),
      userId: i.string().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number(),
    }),
    // Tab 4: 未来への道標 - 3年後の目標 (Three Year Goals)
    threeYearGoals: i.entity({
      content: i.string(),
      userId: i.string().indexed(),
      updatedAt: i.number(),
    }),
    // Tab 4: 未来への道標 - 今月の目標 (Monthly Goals)
    monthlyGoals: i.entity({
      content: i.string(),
      userId: i.string().indexed(),
      updatedAt: i.number(),
    }),
    // Tab 4: 未来への道標 - やるべきこと (Action Items)
    actionItems: i.entity({
      title: i.string(),
      completed: i.boolean(),
      order: i.number().indexed(),
      userId: i.string().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number(),
    }),
  },
  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
