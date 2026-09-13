# GitHub Actions CI

## 目的

pull request と `main` への push で、Biome（Lint とフォーマット）と UT を自動実行する。

## 対象外

- 本番デプロイ
- `npm run build`
- JSON Server の起動
- E2E

## 構成

- ワークフローは `.github/workflows/ci.yml`
- Node.js は 24（ローカルと同じ）
- 依存関係は `npm ci` で入れる
- Biome は `npm run lint`（`biome check .`）。Lint とフォーマットの両方を検証する。`--write` は使わない
- UT は `npm run test`（`vitest run`）

## 受け入れ条件

- pull request と `main` への push で CI が動く
- Biome の違反または UT 失敗でジョブが失敗する
- ワークフローが `npm run lint` と `npm run test` を呼ぶことが UT で検証される
- `npm run lint` / `npm run test` が成功する
