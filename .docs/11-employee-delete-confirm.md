# 従業員削除の確認

## 目的

公式 CRUD Dashboard の削除確認相当として、削除ボタン押下時に確認モーダルを出す。確定するまで `DELETE` しない。

## 対象外

- 通知トースト
- 楽観的更新
- Toolpad の `useDialogs`（追加ライブラリは使わない）

## 画面

- 既存の MUI `Dialog` を使う
- タイトルは `Delete item?`
- 本文は `Do you wish to delete this item?`
- `Cancel` はモーダルを閉じ、削除しない
- `Delete` で [10-employee-delete.md](./10-employee-delete.md) の削除を実行する
- 背景クリックと Escape は `Cancel` と同じ
- 削除中はモーダルのボタンを無効化する
- 失敗時は [09-api-error.md](./09-api-error.md) のエラーコンポーネントを出す

## 受け入れ条件

- 削除ボタンだけでは従業員は消えない
- `Cancel` 後もその行が一覧に残る
- 確認の `Delete` 後にその行が一覧から消える
- `npm run lint` / `npm run test` / `npm run build` が成功する
