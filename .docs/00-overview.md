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
| 5 以降 | Create / 詳細 / 編集 / 削除 | 未作成。別ブランチで進める |

## 次の段階

画面実装は別ブランチで行う。公式テンプレートのパス定数は `src/app-paths.ts` を使う。
