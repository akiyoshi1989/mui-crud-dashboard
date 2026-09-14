# TanStack Query 導入

## 目的

一覧の `GET` と追加の `POST` を TanStack Query で扱う。画面側の `useEffect` による取得と、作成後の手動再取得をやめる。

## 対象外

- React Query Devtools
- 楽観的更新
- ページネーション / infinite query
- 編集の query

## 構成

- ライブラリは `@tanstack/react-query`
- `QueryClientProvider` は `App` で包む
- 一覧は `useEmployees()`（`useQuery` + `getEmployees()`）
- 詳細は `useEmployee(id)`（`useQuery` + `getEmployee()`）
- 追加は `useCreateEmployee()`（`useMutation` + `createEmployee()`）
- 削除は `useDeleteEmployee()`（`useMutation` + `deleteEmployee()`）
- 送信は `mutate` を使う（`mutateAsync` は使わない）。成功時に一覧へ遷移し、失敗時はエラーを出す
- 作成成功後は `employeesQuery` を invalidate し、一覧へ戻ったときに追加行が見える
- query の key と fn は `queryOptions` でセット管理する（`employeesQuery` / `employeeQuery(id)`）
- 通信失敗時の再試行はしない（現行の 1 回取得と同じ）

## 画面

- 一覧の読み込み中はプログレスを出す
- 詳細の読み込み中はプログレスを出す
- 一覧の取得失敗・追加の送信失敗・削除の送信失敗・詳細の取得失敗は [09-api-error.md](./09-api-error.md) のエラーコンポーネントを出す

## 受け入れ条件

- 一覧は `useQuery` で従業員を表示する
- 詳細は `useQuery` で 1 件を表示する
- 追加は `useMutation` で POST し、成功後に一覧キャッシュを無効化する
- 削除は `useMutation` で DELETE し、成功後に一覧キャッシュを無効化する
- UT は JSON Server を起動せず、`fetch` モックで通る
- `npm run lint` / `npm run test` / `npm run build` が成功する
