# MUI CRUD Dashboard 再現

## 目標

[MUI CRUD Dashboard](https://mui.com/material-ui/getting-started/templates/crud-dashboard/) を、このリポジトリで再現する。

公式テンプレートの README が求める依存関係は次のとおり。

- `@mui/material`
- `@mui/icons-material`
- `@emotion/styled`
- `@emotion/react`
- `react-router`

## 進め方

1 機能ずつ実装し、機能ごとに UT を追加する。実装は `.docs` 配下の設計書に従う。

| 段階 | 内容 | 設計書 |
| --- | --- | --- |
| 1 | React + Vite + MUI + Biome の土台 | [01-project-setup.md](./01-project-setup.md) |
| 2 | react-router 導入 | [02-routing.md](./02-routing.md) |
| 3 | サイドバーとヘッダー | [03-sidebar-header.md](./03-sidebar-header.md) |
| 4 | 従業員テーブル表示 | [04-employee-list.md](./04-employee-list.md) |
| 5 | 従業員追加 | [05-employee-create.md](./05-employee-create.md) |
| 6 | JSON Server へのモック移行 | [06-json-server.md](./06-json-server.md) |
| 7 | TanStack Query 導入 | [07-tanstack-query.md](./07-tanstack-query.md) |
| 8 | GitHub Actions CI | [08-github-actions-ci.md](./08-github-actions-ci.md) |
| 9 | API エラー画面 | [09-api-error.md](./09-api-error.md) |
| 10 | 従業員削除 | [10-employee-delete.md](./10-employee-delete.md) |
| 11 | 従業員削除の確認 | [11-employee-delete-confirm.md](./11-employee-delete-confirm.md) |
| 12 以降 | 詳細 / 編集 | 未作成。別ブランチで進める |

## 次の段階

画面実装は別ブランチで行う。公式テンプレートのパス定数は `src/app-paths.ts` を使う。
