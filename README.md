# The Possible Woman — Member Directory

A Next.js app with four pieces:

1. **Public directory** — `/` — approved members, searchable and filterable.
2. **Submission form** — `/join?tier=launch|legacy|luxe` — the link sent to a member after they purchase membership.
3. **Self-edit form** — `/edit/[token]` — the private link emailed to a member once their listing is approved.
4. **Admin dashboard** — `/admin` — password-protected, for approving/rejecting submissions and managing live listings.

Member data is stored in `data/members.json` (created automatically on first run). Uploaded headshots/logos are saved to `public/uploads/`. Both are gitignored since they're runtime data, not source.

## Setup

```bash
npm install
```

Copy `.env.local.example` to `.env.local` and fill in:

- `ADMIN_PASSWORD` — the password for `/admin`. **A working dev value (`possiblewoman2026`) is already in `.env.local` — change it before sharing this app with anyone.**
- `ADMIN_EMAIL` — where submission/edit notifications go (defaults to sharon@impossiblewec.com).
- `SITE_URL` — the public URL of the deployed site, used to build links inside emails. Update this once deployed.
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` — SMTP credentials for sending real email via Nodemailer. **Left blank, the app still works** — it just logs what it would have emailed to the server console instead of sending it, so you can test the whole flow before wiring up real email.

Then:

```bash
npm run dev
```

## Sending members their link

After someone purchases a membership, send them a link in the form:

```
https://yoursite.com/join?tier=launch
https://yoursite.com/join?tier=legacy
https://yoursite.com/join?tier=luxe
```

The form only shows the fields for that tier. No login is required — the link itself is the access control, per the brief.

## Approving submissions

Every new submission emails `ADMIN_EMAIL` with a link straight into `/admin` with that submission highlighted. Log in with `ADMIN_PASSWORD` to approve or reject. Approving:

- Makes the listing live on `/` immediately.
- Emails the member (if they gave an email address) their private edit link.

Launch-tier members don't collect an email address, so there's no one to email — their edit link is shown directly on the confirmation screen right after they submit, so they can save it themselves.

## Editing a live listing

Members use their private `/edit/[token]` link at any time. Changes go live immediately (no re-approval step), and Sharon gets an email notification each time someone updates their listing.

## Admin dashboard

`/admin` lets Sharon:

- Approve or reject pending submissions.
- Edit any field on a live listing, including re-uploading a headshot/logo.
- Change a member's tier (e.g. for an upgrade).
- Remove a listing entirely.

## Notes for deployment

- Set `SITE_URL` to your real domain so email links point to the right place.
- `data/members.json` and `public/uploads/` need to persist across deploys — on platforms with an ephemeral filesystem (like Vercel's serverless functions), point these at a persistent volume or migrate to a real database/object storage before going live in production.
