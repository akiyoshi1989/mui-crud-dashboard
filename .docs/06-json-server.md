# JSON Server へのモック移行

## 目的

`src/data/employees.json` で直読みしていたモックを JSON Server に移し、一覧・追加を HTTP API 経由にする。

## 対象外

- 認証
- ページネーション API
- 編集 API の画面接続（エンドポイント自体は JSON Server が提供する）
- concurrently などの同時起動用ライブラリ追加

## 構成

- データファイルは `src/data/db.json`
- リソース名は `employees`
- JSON Server は `http://localhost:3001`
- Vite は `/api` を JSON Server へプロキシする
- アプリは `GET /api/employees` と `GET /api/employees/:id` と `POST /api/employees` と `DELETE /api/employees/:id` を使う
- `id` は JSON Server が採番する

## 起動

1. `npm run server` で JSON Server を起動する
2. `npm run dev` で Vite を起動する

## 受け入れ条件

- 一覧は API から取得した従業員を表示する
- 追加は API へ POST し、成功後に一覧へ戻る
- UT は JSON Server を起動せず、`fetch` モックで通る
- `npm run lint` / `npm run test` / `npm run build` が成功する
