# プロジェクト初期構築

## 目的

[MUI CRUD Dashboard](https://mui.com/material-ui/getting-started/templates/crud-dashboard/) を再現するための土台を作る。

この段階ではテンプレート画面は実装せず、開発・検証できるスタックだけを整える。

## 技術スタック

| 用途 | 採用 |
| --- | --- |
| UI | React + TypeScript |
| バンドラ | Vite |
| コンポーネント | MUI (`@mui/material`) |
| スタイルエンジン | Emotion（MUI 既定） |
| アイコン | `@mui/icons-material` |
| Lint / Format | Biome |
| 単体テスト | Vitest + Testing Library |
| スキーマ / バリデーション | Zod |
| サーバ状態 | TanStack Query (`@tanstack/react-query`) |

## 方針

- Vite 公式の `react-ts` テンプレートを起点にする。
- ESLint / Oxlint は使わず、Biome に統一する。
- MUI は `ThemeProvider` と `CssBaseline` でアプリ全体に適用する。
- フォントは Roboto を HTML から読み込む。
- 実装は 1 機能単位とし、機能ごとに UT を追加する。
- フックや関数の戻り値は、使うものだけ分割代入で受け取る。オブジェクトごと受け取って毎回プロパティ参照しない。複数あるときはエイリアスで名前を分ける。

## この段階の受け入れ条件

- `npm run dev` で開発サーバが起動する。
- `npm run build` が成功する。
- `npm run lint`（Biome）が成功する。
- `npm run test` が成功し、トップ画面の見出しを検証する。
- トップ画面に MUI コンポーネントが表示される。

## 次の段階

ルーティング導入は [02-routing.md](./02-routing.md) を参照する。
