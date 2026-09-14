# API エラー画面

## 目的

従業員一覧の GET 失敗、従業員詳細の GET 失敗、従業員追加の POST 失敗、従業員削除の DELETE 失敗で、共通のエラーコンポーネントを表示する。

## 対象外

- フォームの項目バリデーション
- 404
- 編集

## 画面

`ErrorPage` を使う。レイアウト（ヘッダー / サイドバー）は残す。

- 見出しは `getErrorPageMessage()` が組み立てた表示文だけを出す
- `Error.message` はユーザーに出さない
- データ層は `EmployeeApiError` のコードだけを投げる
- `トップ画面へ戻る` で `/` へ遷移する
- 戻るときに query キャッシュをリセットし、一覧の再取得が走る

| 失敗 | コード | 表示文 |
| --- | --- | --- |
| GET `/api/employees` | `load-employees` | 従業員一覧を取得できませんでした |
| GET `/api/employees/:id` | `load-employee` | 従業員を取得できませんでした |
| POST `/api/employees` | `create-employee` | 従業員を追加できませんでした |
| DELETE `/api/employees/:id` | `delete-employee` | 従業員を削除できませんでした |
| 上記以外 | — | 処理に失敗しました |

GET 失敗時は一覧（検索・テーブル）を出さない。
詳細の GET 失敗時は詳細項目を出さない。
POST 失敗時は作成フォームを出さない。項目エラーは従来どおりフォーム上に出す。
DELETE 失敗時は一覧（検索・テーブル）を出さない。

## 受け入れ条件

- 一覧の取得失敗で表示文とトップへのリンクが出る
- 詳細の取得失敗で表示文とトップへのリンクが出る
- 追加の送信失敗で表示文とトップへのリンクが出る
- 削除の送信失敗で表示文とトップへのリンクが出る
- `Error.message` は ErrorPage に渡さない
- リンクから `/` の一覧へ戻れる
- `npm run lint` / `npm run test` / `npm run build` が成功する
