# 従業員削除

## 目的

公式 CRUD Dashboard の一覧行アクション相当として、従業員の削除を追加する。

## 対象外

- 編集
- 行クリックでの詳細遷移
- Reload
- 楽観的更新

## データ

- `DELETE /api/employees/:id` を使う
- 呼び出しは `useDeleteEmployee()`（`useMutation` + `deleteEmployee()`）
- 成功後は `employeesQuery` を invalidate し、一覧から行が消える
- 送信は `mutate` を使う（`mutateAsync` は使わない）
- 失敗時は [09-api-error.md](./09-api-error.md) のエラーコンポーネントを出す

| 失敗 | コード | 表示文 |
| --- | --- | --- |
| DELETE `/api/employees/:id` | `delete-employee` | 従業員を削除できませんでした |

## 画面

- 各行に `Delete {name}` の削除ボタンを置く
- データ列（`employeeColumns`）とは別に Actions 列を置く
- 削除の実行は確認後（[11-employee-delete-confirm.md](./11-employee-delete-confirm.md)）
- 削除中はその行のボタンを無効化する
- 失敗時は一覧（検索・テーブル）を出さない

## 受け入れ条件

- 各行から該当従業員を削除できる
- 削除成功後、その行が一覧から消える
- 削除失敗で表示文とトップへのリンクが出る
- `npm run lint` / `npm run test` / `npm run build` が成功する
