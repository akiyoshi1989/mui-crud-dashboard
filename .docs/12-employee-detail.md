# 従業員詳細

## 目的

公式 CRUD Dashboard の `#/employees/:employeeId` 相当として、従業員の詳細取得と表示を追加する。

## 対象外

- 編集
- 詳細画面からの削除
- Reload
- 楽観的更新
- 生年月日の作成・編集フォーム

## パス

公式に合わせて Hash Router を使う。詳細の URL は `/#/employees/:employeeId`。

| 定数 | パス（ハッシュ） |
| --- | --- |
| `appPaths.employee(id)` | `/#/employees/:employeeId` |

内部のルート定義は `/employees/:employeeId`。`/employees/new` より後に置かず、静的な `new` が勝つようにする。

## データ

- `GET /api/employees/:id` を使う
- 呼び出しは `useEmployee(id)`（`useQuery` + `getEmployee()`）
- query の key と fn は `queryOptions` でセット管理する（`employeeQuery(id)`、key は `['employees', id]`）
- `employeeId` は `useParams<{ employeeId: string }>()` で受け取り、`parseEmployeeId()` で正の整数だけ通す
- 不正な ID では `useEmployee` を `skipToken` にし、API を呼ばない
- 一覧と同じ項目に加え、生年月日 `birthDate` を API から取得する
- `birthDate` は ISO 8601 文字列とする
- 一覧の `employeeColumns` には生年月日を含めない

| 失敗 | コード | 表示文 |
| --- | --- | --- |
| GET `/api/employees/:id` | `load-employee` | 従業員を取得できませんでした |
| 不正な `employeeId` | — | 従業員 ID が無効です |

失敗時は [09-api-error.md](./09-api-error.md) のエラーコンポーネントを出す。

## 画面

- 一覧の Actions 以外の行をクリックすると詳細へ遷移する
- Actions の削除ボタン・更新ボタンでは遷移しない
- 見出しは従業員の `name`
- 表示項目は一覧列（ID / Name / Age / Join date / Department / Full-time）に Date of birth を足す
- Join date と Date of birth は日付部分 `YYYY-MM-DD` を表示する
- Full-time は `Yes` / `No`
- 読み込み中はプログレスを出す
- 取得失敗時は一覧・詳細項目を出さない
- 不正な `employeeId` では API を呼ばずエラーコンポーネントを出す

## 受け入れ条件

- 行（Actions 以外）のクリックで該当従業員の詳細を表示する
- 削除ボタン・更新ボタンでは詳細へ遷移しない
- 詳細に一覧項目と生年月日が出る
- 一覧テーブルに生年月日列は出ない
- 取得失敗で表示文とトップへのリンクが出る
- 不正な `employeeId` で表示文とトップへのリンクが出る
- `npm run lint` / `npm run test` / `npm run build` が成功する
