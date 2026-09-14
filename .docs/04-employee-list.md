# 従業員テーブル表示

## 目的

公式 CRUD Dashboard の `#/`（従業員一覧）相当を再現する。
表示だけに限定し、操作系は後続ブランチで扱う。

## 対象外

- Reload
- 行クリックでの詳細遷移
- 編集
- 列ごとのフィルタ
- ソート / ページネーション

## データ

- モックは JSON Server の `src/data/db.json` で管理する
- 読み出しは `useEmployees()`（`useQuery` + `getEmployees()` / `GET /api/employees`）
- 表示列は `src/data/employees.ts` の `employeeColumns` で一括管理する
- データ上のキー増減への自動追随はしない
- 公式テンプレートと同じ項目を持つ

| 項目 | 型 |
| --- | --- |
| id | number |
| name | string |
| age | number |
| joinDate | ISO 8601 文字列 |
| role | `Market` / `Finance` / `Development` |
| isFullTime | boolean |

## 画面

- `/` と `/employees` の両方で同じ一覧を表示する（公式は `#/` と `/employees`）
- 見出しは `Employees`
- 見出し横に `Create` を置く（追加処理は [05-employee-create.md](./05-employee-create.md)）
- 各行の削除は [10-employee-delete.md](./10-employee-delete.md)（確認は [11-employee-delete-confirm.md](./11-employee-delete-confirm.md)）
- 追加ライブラリは使わず、既存の MUI `Table` で描画する
- テーブルと検索は `employeeColumns` を参照する
- 既知の表示名は ID / Name / Age / Join date / Department / Full-time
- Join date は日付部分 `YYYY-MM-DD` を表示する
- Full-time は `Yes` / `No`
- テーブル上に検索対象列の `Select`（`Column`）と `Search` 入力を置く
- `Select` の選択肢は `employeeColumns` の表示名とする
- 初期選択は Name
- 検索は選択した列の表示値に対する部分一致（大文字小文字を区別しない）
- 空文字のときは全件を表示する
- 取得失敗時は [09-api-error.md](./09-api-error.md) のエラーコンポーネントを出す

## 受け入れ条件

- `/` と `/employees` で従業員テーブルが表示される
- JSON の全件が行として描画される
- 検索対象列を切り替えて検索できる
- 選択列以外の値では絞り込まれない
- `employeeColumns` を増減すると表示列と検索対象の選択肢が変わる
- Reload は置かない
- `npm run lint` / `npm run test` / `npm run build` が成功する
