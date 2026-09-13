# MUI CRUD Dashboard

[MUI CRUD Dashboard](https://mui.com/material-ui/getting-started/templates/crud-dashboard/) を再現するためのプロジェクトです。

## スタック

- React
- Vite
- MUI
- Biome
- React Router
- Vitest
- JSON Server

## セットアップ

```bash
npm install
```

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run server` | JSON Server 起動（`http://localhost:3001`） |
| `npm run dev` | 開発サーバ起動（`/api` を JSON Server へプロキシ） |
| `npm run build` | 本番ビルド |
| `npm run preview` | ビルド結果の確認 |
| `npm run lint` | Biome による lint / format チェック |
| `npm run format` | Biome による format |
| `npm run test` | 単体テスト |

## 設計

実装方針は `.docs` 配下の設計書を参照してください。
