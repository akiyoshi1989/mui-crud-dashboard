# サイドバーとヘッダー

## 目的

公式 CRUD Dashboard のシェル（ヘッダー + サイドバー）を再現する。
従業員 CRUD や Reports / Integrations の画面は作らない。

## 配置

`AppLayout` がヘッダー・サイドバー・`Outlet` を組み合わせる。

```
┌─────────────────────────────────────┐
│ Header（メニュー、タイトル）          │
├──────────┬──────────────────────────┤
│ Sidebar  │ ページ内容（Outlet）       │
│          │                          │
└──────────┴──────────────────────────┘
```

## ヘッダー

- 固定の `AppBar`
- メニューボタンでサイドバーの開閉を切り替える
- タイトルは `Dashboard`

## サイドバー

公式テンプレートと同じ項目を置く。画面未実装のパスは 404 になる。

| グループ | 項目 | パス |
| --- | --- | --- |
| Main items | Employees | `/employees` |
| Example items | Reports | `/reports` |
| Example items | Sales | `/reports/sales` |
| Example items | Traffic | `/reports/traffic` |
| Example items | Integrations | `/integrations` |

選択状態:

- Employees は `/` と `/employees` 配下で選択する
- それ以外は自身のパス配下で選択する

## レスポンシブ

| 幅 | サイドバー |
| --- | --- |
| `md` 未満 | 一時的な Drawer。初期は閉じ、メニューで開く |
| `md` 以上 | 常設 Drawer。幅は 240px |

## 受け入れ条件

- `/` でヘッダーとサイドバーが表示される
- Employees がホームで選択状態になる
- `md` 未満でメニューボタンからサイドバーを開閉できる
- ナビ項目の選択判定が UT で検証される
- `npm run lint` / `npm run test` / `npm run build` が成功する
