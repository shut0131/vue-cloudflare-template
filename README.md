# Vue + Cloudflare Workers Template

Vue 3 + TypeScript + Cloudflare Workers + D1 Database のフルスタックテンプレート

## 機能

- **Vue 3** (Composition API)
- **TypeScript** (厳密な型チェック)
- **Cloudflare Workers** (エッジデプロイメント)
- **D1 Database** (エッジSQLite)
- **HTTP-only Cookie認証**
- **MSW** (ローカルAPIモック)
- **Vitest** (ユニットテスト)
- **Playwright** (E2Eテスト)
- **pnpm** (パッケージマネージャー)

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# D1データベースの作成（任意）
npx wrangler d1 create your-database-name
# wrangler.tomlのdatabase_idを更新

# マイグレーション実行
npx wrangler d1 execute your-database-name --local --file=./migrations/0001_create_documents_table.sql
```

## 開発

```bash
# フロントエンド開発サーバー（MSWモック有効）
pnpm dev

# Workers開発サーバー（実API）
pnpm worker:dev
```

## テスト

```bash
# ユニットテスト
pnpm test
pnpm test:coverage

# E2Eテスト
pnpm test:e2e
```

## ビルド & デプロイ

```bash
# ビルド
pnpm build

# Cloudflare Workersへデプロイ
pnpm worker:deploy
```

## プロジェクト構成

```
├── functions/          # APIエンドポイント
│   ├── api/           # API実装
│   └── utils/         # ユーティリティ（Cookie等）
├── src/
│   ├── components/    # Vueコンポーネント
│   ├── composables/   # Vue Composables
│   ├── mocks/         # MSWモックハンドラー
│   ├── types/         # TypeScript型定義
│   └── tests/         # テストファイル
├── e2e/               # E2Eテスト
└── migrations/        # D1マイグレーション
```

## API開発

新しいAPIエンドポイントを追加:

```typescript
// functions/api/your-endpoint.ts
export async function onRequest(context: Context) {
  const { request, env } = context
  
  // D1データベースアクセス
  const result = await env.DB.prepare('SELECT * FROM table').all()
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

## 主要なコマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | プロダクションビルド |
| `pnpm test` | テスト実行 |
| `pnpm typecheck` | 型チェック |
| `pnpm worker:deploy` | Workersへデプロイ |

## 環境変数

Cloudflareの環境変数やシークレット:

```bash
npx wrangler secret put SECRET_NAME
```

## License

MIT