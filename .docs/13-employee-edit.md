# 従業員更新

## 目的

公式 CRUD Dashboard の `#/employees/:employeeId/edit` 相当として、従業員の更新を追加する。

## 対象外

- 詳細画面からの更新導線
- Reload
- 楽観的更新
- 生年月日の編集（表示のみ。更新時は既存値を保持する）

## パス

公式に合わせて Hash Router を使う。更新画面の URL は `/#/employees/:employeeId/edit`。

| 定数 | パス（ハッシュ） |
| --- | --- |
| `appPaths.employeeEdit(id)` | `/#/employees/:employeeId/edit` |

内部のルート定義は `/employees/:employeeId/edit`。`/employees/:employeeId` より前に置かずとも、より具体的なパスが勝つ。

## データ

- `GET /api/employees/:id` で初期表示する（`useEmployee(id)`）
- `PUT /api/employees/:id` で更新する
- 呼び出しは `useUpdateEmployee()`（`useMutation` + `updateEmployee()`）
- 送信は `mutate` を使う（`mutateAsync` は使わない）
- 成功後は `employeesQuery` と `employeeQuery(id)` を invalidate する
- `employeeId` は `useParams<{ employeeId: string }>()` で受け取り、`parseEmployeeId()` で正の整数だけ通す
- 不正な ID では `useEmployee` を `skipToken` にし、API を呼ばない
- フォーム項目は `getEmployeeFormColumns()`（一覧列から `id` を除く）
- `id` と `birthDate` は詳細と同じく表示のみとする
- PUT 時は既存の `birthDate` を含めて送る

| 失敗 | コード | 表示文 |
| --- | --- | --- |
| GET `/api/employees/:id` | `load-employee` | 従業員を取得できませんでした |
| PUT `/api/employees/:id` | `update-employee` | 従業員を更新できませんでした |
| 不正な `employeeId` | — | 従業員 ID が無効です |

失敗時は [09-api-error.md](./09-api-error.md) のエラーコンポーネントを出す。

## 画面

- 一覧の Actions で、削除ボタンの左に `Edit {name}` の更新ボタンを置く
- 更新ボタンでは詳細へ遷移しない
- 基本 UI は [12-employee-detail.md](./12-employee-detail.md) と同じにする
  - 見出しは従業員の `name`
  - 表示項目は一覧列（ID / Name / Age / Join date / Department / Full-time）に Date of birth を足す
  - ラベルは `subtitle2` / `text.secondary` の定義リスト
- 編集できる項目だけ入力欄にする。ID と Date of birth は詳細と同じくテキスト表示
- Join date は `type="date"`（追加ライブラリは使わない）
- Department は `Market` / `Finance` / `Development`
- Full-time はチェックボックス
- 送信は `Save`
- 送信値は `FormData` から読み取る（`FormEvent` は使わない）
- 同じルートで `employeeId` だけ変わったときは `form` を `employee.id` で付け替え、`defaultValue` を残さない
- FormData の型付けと項目エラーは Zod スキーマで行う
- 未入力・不正値は項目ごとにエラーを出す
- 更新成功後は `/#/employees` の一覧へ戻り、更新した行が見える
- 読み込み中はプログレスを出す
- 取得失敗・更新失敗時は詳細項目とフォームを出さない

## 受け入れ条件

- 各行の削除ボタンの左から該当従業員の更新画面へ遷移できる
- 更新ボタンでは詳細へ遷移しない
- 更新画面の見出しと項目は詳細と同じである
- バリデーションエラーでは更新しない
- 更新した従業員が一覧に反映される
- 取得失敗・更新失敗で表示文とトップへのリンクが出る
- 不正な `employeeId` で表示文とトップへのリンクが出る
- `npm run lint` / `npm run test` / `npm run build` が成功する
