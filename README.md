# xmoj-bbs-v2

Modern Nitro-based rewrite of the XMOJ BBS backend targeting Cloudflare Workers. This repo ports the legacy Workers server to Nitro with parity in routes, utilities, and behavior.

## Highlights

- Nitro (Cloudflare Module preset) with unified error handling and middleware
- Cloudflare D1 + KV + Analytics Engine + Workers AI integrations
- Parity routes for posts, replies, moderation, mentions, boards, mail, std, badges, images, analytics
- Centralized auth + request logging; scheduled cleanup tasks

## Requirements

- Node.js 18+
- Cloudflare account with:
  - D1 database binding
  - KV namespace binding (if used)
  - Analytics Engine dataset
  - Workers AI (optional, for badge moderation)
- Environment secrets set (via `wrangler.toml` or Cloudflare dashboard):
  - `ACCOUNT_ID`, `API_TOKEN`
  - `GithubImagePAT`, `GithubImageOwner`, `GithubImageRepo`
  - `xssmseetee_v1_key`, `CaptchaSecretKey`

## Install

```bash
pnpm install
# or
npm install
```

## Develop

```bash
pnpm dev
# or
npm run dev
```

Nitro runs locally; routes live under `server/routes`. Middleware is in `server/middleware`. Utilities live under `server/utils`.

## Deploy (Cloudflare Workers)

This project uses Nitro’s `cloudflare-module` preset. Ensure bindings in `wrangler.toml` match your environment.

```bash
pnpm build
pnpm preview
# Deploy using your Cloudflare workflow (e.g., pages/functions or workers)
```

## Routes Overview

- Public
  - `GET /` → GetNotice
  - `GET /GetNotice`
  - `GET /GetAddOnScript`
  - `GET /GetImage?id=...` or `path=...`
- BBS Core
  - `POST /NewPost`, `POST /NewReply`
  - `POST /GetPosts`, `POST /GetPost`
- Moderation
  - `POST /LockPost`, `POST /UnlockPost`
  - `POST /EditReply`, `POST /DeletePost`, `POST /DeleteReply`
- Mentions
  - `POST /GetBBSMentionList`, `POST /ReadBBSMention`
- Boards
  - `POST /GetBoards`
- Mail
  - `POST /GetMailList`, `POST /GetMail`, `POST /SendMail`
- Std (standard code)
  - `POST /UploadStd`, `POST /GetStd`, `POST /GetStdList`
- Badges
  - `POST /NewBadge`, `POST /EditBadge`, `POST /GetBadge`, `POST /DeleteBadge`
- Images
  - `POST /UploadImage`, `GET /GetImage`
- Analytics
  - `POST /GetAnalytics`, `POST /LastOnline`
- Misc
  - `POST /SendData`

All non-public endpoints expect JSON `{ Authentication, Data, Version?, DebugMode? }`. Authentication is validated by `server/middleware/1.auth.ts`.

## Project Structure

- `server/routes/*` — Endpoint handlers
- `server/middleware/1.auth.ts` — Auth + analytics logging
- `server/error.ts` — Unified error handler returning `Result`
- `server/utils/*` — DB, auth, captcha, xmoj, mentions, std processing, results, output
- `old/*` — Legacy Cloudflare Workers server (reference)

## Configuration

- `nitro.config.ts` sets preset and error handler
- `wrangler.toml` defines Cloudflare bindings (D1, KV, datasets)
- `tsconfig.json` standard TypeScript configuration

## Notes

- Ensure your Analytics Engine dataset name (`AnalyticsDataset`) matches what you provisioned.
- GitHub image routes require a private repo and `GithubImagePAT` with `repo` scope.
- Badge moderation may use Workers AI; if disabled, the route bypasses AI checks.

## License

See `LICENSE`.
