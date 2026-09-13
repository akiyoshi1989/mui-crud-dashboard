# ルーティング導入

## 目的

公式 CRUD Dashboard 再現の前提となる `react-router` を導入する。
個別画面（一覧・詳細・作成・編集、ダッシュボードレイアウト）は作らない。

## 採用

| 項目 | 内容 |
| --- | --- |
| パッケージ | `react-router` |
| API | Data Router（`createHashRouter` + `RouterProvider`） |
| テスト | `createMemoryRouter` |

公式テンプレートと同じく `createHashRouter` を使う。
追加画面の URL は `/#/employees/new` になる。

## ルート

この段階で実装するルートは次のみ。

| パス | 画面 |
| --- | --- |
| `/` | 土台確認用のホーム |
| `*` | 未定義パスの 404 |

公式テンプレートの従業員 CRUD パスは定数として定義し、画面実装は別ブランチで行う。

| 定数 | パス |
| --- | --- |
| `appPaths.employees` | `/employees` |
| `appPaths.employeeNew` | `/employees/new`（URL は `/#/employees/new`） |
| `appPaths.employee(id)` | `/employees/:employeeId` |
| `appPaths.employeeEdit(id)` | `/employees/:employeeId/edit` |

ルート定義は `src/routes.tsx` に集約する。
後から `AppLayout` の中身や `children` を足せるように、レイアウト配下にページを置く。

## 受け入れ条件

- `react-router` が依存関係に入っている。
- `/` でホーム画面を表示する。
- 未定義パスで 404 を表示し、ホームへ戻れる。
- 従業員 CRUD のパス定数が UT で検証される。
- `npm run lint` / `npm run test` / `npm run build` が成功する。
