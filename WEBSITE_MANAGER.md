# Website manager — NSBT Populi AI Help Desk

You are taking this app from a **zip file** to GitHub, then Vercel, then **desk.nsbt.org**.

Grok has **no “Publish to GitHub” button**. Do not wait for one. The code is in the zip. You upload it.

Repo: https://github.com/danielswims101/NSBT_HelpDesk

This is **not** the public school website. Public site stays **nsbt.org**. Campus SIS stays **nsbt.populiweb.com**.

---

## What you are shipping

A signed-in staff desk that **reads** Populi with one API key (Academic Auditor + Financial Auditor). Read-only.

Everyone who is allowed in gets the **same Home**. Press a button. Numbers land on the page. Staff work here. **No email packets. No worksheet page.**

Menu: **Home · Ask the desk · Meet · Who can sign in**

Pulls on Home: every term, degrees granted, enrollment by year, students, home addresses, catalog courses, course offerings, invoices, roles, transcript requests, test the link.

Ask the desk runs those same pulls if someone types the request.

**Meet** is a video-call page. It opens Google Meet in a new tab (everyone signs in with their @nsbt.org Google account, so there is nothing new to install): start an instant call, open the shared "desk room," join a link someone sent, or send a Calendar invite to another administrator. Google Meet does its own video — this desk only opens it.

This desk is **private**. It carries a `noindex` tag and a `robots.txt` that blocks all crawlers, so it never shows up in Google beside the public site. That is on purpose — leave it in place.

---

## Who may sign in

Official @nsbt.org Google accounts (Continue with Google):

- it@nsbt.org (Randy, Director of IT)
- jlim@nsbt.org
- dirvin@nsbt.org
- ochaparro@nsbt.org
- awhite20@nsbt.org
- dbtagoe@nsbt.org
- studentservices@nsbt.org

Everyone on that list gets the same Home.

You sign in with **Continue with Google** and the Gmail the institutional lead already allowlisted. That Gmail is **not** printed on the Sign-in page. That is intentional.

Random Gmail, students, public: refused.

---

## Never put in GitHub

- `.env.local` or any `sk_…` API key
- `node_modules/`
- `screenshots/` and `attachments/`
- Student lists or CSVs

The zip already excludes those. Do not add them later.

---

## Step 1 — Unzip on your computer

1. Save `NSBT_HelpDesk.zip`.
2. Unzip it to a folder named `NSBT_HelpDesk`.
3. Open that folder. You should see `package.json`, `src`, `migrations`, `vite.config.ts`, this file (`WEBSITE_MANAGER.md`).
4. You should **not** see `.env.local`.

---

## Step 2 — GitHub repo (private)

1. Open https://github.com/danielswims101/NSBT_HelpDesk while signed into GitHub.
2. Settings → General → Danger zone → **Change repository visibility** → **Private**. Confirm.
3. If the repo already has a README or old files, leave them. You will replace with the zip contents.

---

## Step 3 — Put the code on GitHub (no command line)

**Easiest: GitHub Desktop**

1. Install [GitHub Desktop](https://desktop.github.com) and sign in as the account that owns the repo.
2. File → Add local repository → choose the unzipped `NSBT_HelpDesk` folder. If it says it is not a git repository: Repository → Create repository? Use **File → Add existing repository** after initializing, **or**:
3. File → Clone repository → `danielswims101/NSBT_HelpDesk` to a new empty folder, then **copy the unzipped files into that clone** (do not copy a `.git` from anywhere else).
4. GitHub Desktop shows changed files. Confirm `.env.local` is **not** listed.
5. Commit message: `NSBT Populi AI Help Desk`
6. Publish / Push to origin, branch `main`.

**If you only have a browser**

1. On the empty private repo, click **uploading an existing file**.
2. Drag **all files and folders** from the unzipped directory (package.json, src, migrations, public, scripts, server, etc.).
3. Commit to `main`.
4. If GitHub will not take a nested folder in one drag, use GitHub Desktop instead. Browser upload is clumsy for this many files.

After push, the repo file list must include `package.json` and `src/`. It must **not** include `.env.local`.

---

## Step 4 — Database (Neon)

Vercel needs Postgres. The preview copy used a throwaway database. Production does not.

1. Go to https://neon.tech and sign in (or use Vercel’s Neon integration later).
2. New project. Name: `nsbt-helpdesk`.
3. Copy the connection string. That is `DATABASE_URL`.
4. Paste it **only** into Vercel in the next step. Never into GitHub.

---

## Step 5 — Vercel

1. Sign in to https://vercel.com with the GitHub account that can see the private repo.
2. Add New → Project → import `NSBT_HelpDesk`.
3. Framework: leave detected. Build command: `npm run build`.
4. **Before** the first production deploy, Settings → Environment Variables. Add for **Production**:

| Name | What to paste |
|---|---|
| `POPULI_API_KEY` | Live Populi key from the institutional lead (`sk_…`). Do not create a new key unless the lead says the current one is dead. |
| `BETTER_AUTH_URL` | `https://desk.nsbt.org` |
| `BETTER_AUTH_SECRET` | A long random string. Generate once and keep it. Changing it later signs everyone out. |
| `DATABASE_URL` | The Neon string from Step 4 |
| `GROK_AUTH_ISSUER` | From the institutional lead. Do not guess. |
| `GROK_AUTH_CLIENT_ID` | Same |
| `GROK_AUTH_CLIENT_SECRET` | Same |

Do **not** set `VITE_AUTH_ENABLED=false`.

If the three `GROK_AUTH_*` values are missing, **stop**. Google sign-in will not work on desk.nsbt.org. Ask the institutional lead. Do not invent Google Cloud credentials.

5. Deploy Production. Wait for green.

---

## Step 6 — DNS last (`desk.nsbt.org`)

Do this only after Vercel is green.

1. Vercel → Project → Settings → Domains → add `desk.nsbt.org`.
2. At the DNS host for nsbt.org, create: **CNAME** name `desk` → the hostname Vercel shows (often `cname.vercel-dns.com`).
3. Wait until Vercel marks the domain **Valid**.
4. Open https://desk.nsbt.org. You must see **NSBT Populi AI Help Desk** / **Administrators Sign-In**.

Do not point `www` or the apex `nsbt.org` at this project.

---

## Step 7 — Prove it works

Private / incognito window.

1. FERPA warning. **Continue with Google**. Your Gmail is not printed on that page.
2. You sign in. Home has pull buttons. Not a worksheet. Nothing about emailing Angela.
3. Who can sign in lists the seven `@nsbt.org` accounts.
4. A random Gmail is refused.
5. Randy (`it@nsbt.org`) sees the **same** Home.
6. Optional: press **Test the link** or **Every term**. Results stay on the page. Do not paste student lists into GitHub or Slack.

---

## If it fails

| What you see | What to do |
|---|---|
| 404 on desk.nsbt.org | Domain not attached, or wrong Vercel project |
| “not an authorized administrator” | That Google account is not on the list. Do not add people yourself |
| Google never comes back | `BETTER_AUTH_URL` is not `https://desk.nsbt.org`, or Grok auth vars missing |
| Pull says not linked / 401 | `POPULI_API_KEY` missing or deleted in Populi |
| Rate limit | Wait one minute. 50 calls/min Pacific daytime. Do not mash the button |

Populi Support is not for this website.

---

## Public nsbt.org

Do not rebuild this desk on the public site. Optional hidden staff link only: Administrators → https://desk.nsbt.org

---

## Tell the institutional lead when done

- https://desk.nsbt.org is live
- Vercel project name
- You and Randy can sign in
- A random Gmail is refused
- The API key was not committed to GitHub
