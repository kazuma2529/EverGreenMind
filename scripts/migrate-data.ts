/**
 * データ移行スクリプト
 * 既存のデータに null 値があるため、必須フィールドを追加する前に
 * 既存データを削除または更新します。
 * 
 * 実行方法: npm run migrate-data
 */

import { config } from "dotenv";
import { resolve } from "path";
import { init } from "@instantdb/admin";
import schema from "../src/instant.schema";

// .env.local ファイルを読み込む
config({ path: resolve(process.cwd(), ".env.local") });

const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
// INSTANT_ADMIN_TOKEN または INSTANT_APP_ADMIN_TOKEN のどちらかを使用
const adminToken = process.env.INSTANT_ADMIN_TOKEN || process.env.INSTANT_APP_ADMIN_TOKEN;

if (!appId || !adminToken) {
  console.error("エラー: 環境変数が設定されていません");
  console.error("NEXT_PUBLIC_INSTANT_APP_ID:", appId ? "設定済み" : "未設定");
  console.error("INSTANT_ADMIN_TOKEN または INSTANT_APP_ADMIN_TOKEN:", adminToken ? "設定済み" : "未設定");
  console.error("\n.env.local ファイルに以下を設定してください:");
  console.error("NEXT_PUBLIC_INSTANT_APP_ID=your-app-id");
  console.error("INSTANT_ADMIN_TOKEN=your-admin-token");
  process.exit(1);
}

const adminDb = init({
  appId,
  adminToken,
  schema,
});

async function migrateData() {
  console.log("データ移行を開始します...\n");

  try {
    // 既存のデータを取得
    const { challenges, happinessDefinition } = await adminDb.query({
      challenges: {},
      happinessDefinition: {},
    });

    console.log(`既存の challenges: ${challenges.length} 件`);
    console.log(`既存の happinessDefinition: ${happinessDefinition.length} 件\n`);

    // 既存データを削除（認証前のデータなので userId が設定されていない）
    const deleteTxs = [
      ...challenges.map((c) => adminDb.tx.challenges[c.id].delete()),
      ...happinessDefinition.map((h) => adminDb.tx.happinessDefinition[h.id].delete()),
    ];

    if (deleteTxs.length > 0) {
      console.log(`${deleteTxs.length} 件のデータを削除します...`);
      adminDb.transact(deleteTxs);
      console.log("✓ データ削除が完了しました\n");
    } else {
      console.log("削除するデータはありません\n");
    }

    console.log("✓ データ移行が完了しました");
    console.log("\n次のステップ:");
    console.log("1. スキーマをプッシュ: npx instant-cli push schema --app <APP_ID> --token <ADMIN_TOKEN> --yes");
    console.log("2. 開発サーバーを起動: npm run dev");
  } catch (error) {
    console.error("エラーが発生しました:", error);
    process.exit(1);
  }
}

migrateData();
