# 従業員テーブル表示

## 目的

公式 CRUD Dashboard の `#/`（従業員一覧）相当を再現する。
表示だけに限定し、操作系は後続ブランチで扱う。

## 対象外

- Reload
- Create
- 行クリックでの詳細遷移
- 編集
- 削除
- 列ごとのフィルタ
- ソート / ページネーション

## データ

- モックは JSON ファイル `src/data/employees.json` で管理する
- 読み出しは `src/data/employees.ts` の `getEmployees()` のみ
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
- 追加ライブラリは使わず、既存の MUI `Table` で描画する
- 列は ID / Name / Age / Join date / Department / Full-time
- Join date は日付部分 `YYYY-MM-DD` を表示する
- Full-time は `Yes` / `No`
- テーブル上に `Search` 入力を置く
- 検索は表示列の値に対する部分一致（大文字小文字を区別しない）
- 空文字のときは全件を表示する

## 受け入れ条件

- `/` と `/employees` で従業員テーブルが表示される
- JSON の全件が行として描画される
- 検索語で行が絞り込まれる
- Create / Reload / 行アクションは置かない
- `npm run lint` / `npm run test` / `npm run build` が成功する
