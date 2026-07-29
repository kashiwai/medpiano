# MedPiano Official Site

謎の作詞作曲家 MedPiano のオフィシャルサイト。Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + next-intl による日英ハイブリッドサイト。

`medpiano-site-spec.zip` の仕様書一式（`01-design-system.md` 〜 `10-data-schema.md`）に基づいて実装。

## セットアップ

```bash
bun install
cp .env.example .env.local   # 値を編集
bun run dev
```

http://localhost:3000 にアクセスすると `/ja` にリダイレクトされます。

## 環境変数

`.env.example` を参照。

| 変数 | 用途 |
|---|---|
| `RESEND_API_KEY` | お問い合わせフォーム送信（[resend.com](https://resend.com)） |
| `CONTACT_TO_EMAIL` | フォーム送信先メールアドレス |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Cloudflare R2 の公開URL（MP3配信用） |
| `NEXT_PUBLIC_SITE_URL` | サイトの正規URL（OGP・sitemap用） |

未設定のままだと `bun run dev`/`build` はエラーになります。開発時は `.env.local` にダミー値（有効な形式のURL・メールアドレス）を入れてください。

## 楽曲データの追加・更新

1. `src/data/tracks.json` を開く
2. 該当楽曲（`slug` または `id` で検索）に `youtubeId` または `mp3Path` を設定
   ```json
   { "youtubeId": "dQw4w9WgXcQ", "mp3Path": "tracks/track-01.mp3" }
   ```
3. `mp3Path` は Cloudflare R2 にアップロード後のパス。サイト側で自動的に `${NEXT_PUBLIC_R2_PUBLIC_URL}/${mp3Path}` として展開される
4. コミット・プッシュで Vercel が自動デプロイ

## Cloudflare R2 セットアップ（MP3配信）

1. Cloudflare ダッシュボードで R2 を有効化し、バケット `medpiano-tracks` を作成
2. Settings → Public access → Allow Access（`r2.dev` ドメインで公開）
3. 発行された Public URL を `NEXT_PUBLIC_R2_PUBLIC_URL` に設定
4. CORS ポリシーに本番ドメインと `http://localhost:3000` を追加

詳細は仕様書 `10-data-schema.md` セクション8を参照。

## コンテンツ・実績データ

- `src/data/tracks.json` — 楽曲20曲（プレースホルダー、実データは上記手順で投入）
- `src/data/clients.json` — CM/実績提供先企業
- `src/data/talents.json` — 楽曲提供先タレントカテゴリ
- `src/data/news.json` — ニュース記事
- `src/data/profile.json` — プロフィールページの統計・タイムライン・マニフェスト

## i18n

- ロケール: `ja`（デフォルト）/ `en`
- URL: `/ja/...`, `/en/...`
- 翻訳キー: `src/messages/ja.json`, `src/messages/en.json`
- ページ本文の一部（曲名・実績カード等）は日英を常時併記するデザイン方針のため、データ側に `titleEn`/`titleJa` のように両言語を保持し、コンポーネント側で両方描画している

## お問い合わせフォーム

- バリデーション: Zod（`src/lib/schemas/contact.ts`）
- 送信: Resend（`src/app/api/contact/route.ts`）— `RESEND_API_KEY` 未設定/無効の場合は送信エラーになる
- スパム対策: ハニーポットフィールド（`website`）を実装済み。レート制限・Turnstileは未実装（導入する場合は `@upstash/ratelimit` 等の追加が必要）

## ビルド・デプロイ

```bash
bun run build   # warning 0 で成功することを確認済み
bun run lint
```

Vercel へのデプロイ時は上記環境変数をプロジェクト設定で登録してください。

## 技術スタック

Next.js 15 (App Router) / TypeScript (strict) / Tailwind CSS v4 / next-intl / Framer Motion / React Hook Form + Zod / Resend / Lucide React
