# 従業員追加

## 目的

公式 CRUD Dashboard の `#/employees/new` 相当として、従業員の追加を再現する。

## 対象外

- 編集
- 削除
- 行クリックでの詳細遷移
- Reload
- 通知トースト

## パス

公式に合わせて Hash Router を使う。追加画面の URL は `/#/employees/new`。

| 定数 | パス（ハッシュ） |
| --- | --- |
| `appPaths.employeeNew` | `/#/employees/new` |

内部のルート定義は `/employees/new`。

## データ

- 初期データは `src/data/db.json`
- 読み書きは `src/data/employees.ts` の `getEmployees()` / `createEmployee()`（`GET` / `POST /api/employees`）
- `id` は JSON Server が採番する
- フォーム項目は `employeeColumns` から `id` を除いた列とする

## 画面

- 一覧の `Create` から `/#/employees/new` へ遷移する
- 見出しは `Create`
- 項目は Name / Age / Join date / Department / Full-time
- Join date は `type="date"`（追加ライブラリは使わない）
- Department は `Market` / `Finance` / `Development`
- Full-time はチェックボックス
- 送信は `Create`、入力クリアは `Reset`
- 送信値は `FormData` から読み取る（`FormEvent` は使わない）
- FormData の型付けと項目エラーは Zod スキーマで行う
- 未入力・不正値は項目ごとにエラーを出す
- 作成成功後は `/#/employees` の一覧へ戻り、追加した行が見える

## 受け入れ条件

- `/#/employees/new` で作成フォームが表示される
- 一覧の Create から追加画面へ遷移できる
- バリデーションエラーでは追加しない
- 作成した従業員が一覧に表示される
- `npm run lint` / `npm run test` / `npm run build` が成功する
