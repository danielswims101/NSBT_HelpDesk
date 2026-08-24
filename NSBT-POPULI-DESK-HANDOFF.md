# HANDOFF — NSBT Populi AI Help Desk → nsbt.org website builder

Copy everything below this line into the Grok Build chat that is rebuilding nsbt.org (currently nsbt2.grok.me).

---

## TO THE NSBT.ORG WEBSITE BUILDER (GROK BUILD)

You are folding in an existing **staff-only Populi help desk**. Do not invent a second desk. Do not put this on any public page of nsbt.org / nsbt2.grok.me.

### What this is

**NSBT Populi AI Help Desk** — a signed-in tool for named NSBT administrators. It talks to the live Populi campus at `https://nsbt.populiweb.com` through Populi’s REST API (`https://nsbt.populiweb.com/api2/`) using one stored API key. It pulls school-wide lists onto the desk and emails a cover note to Angela White.

Intended production URL: **https://desk.nsbt.org**  
Until DNS exists, it may live at a **staff-only path** on the new site, e.g. `https://nsbt2.grok.me/desk` — never in the public header, footer, sitemap, or student pages.

Populi itself stays at `https://nsbt.populiweb.com`. This desk does not replace Populi. It reads it.

### What this is NOT

- Not a public website section.
- Not a student portal.
- Not a how-to / click-path manual. Administrators already work in Populi. **No instruction dumps.** Buttons that run API pulls. Chat that **runs** pulls. Numbers on the page. Send to Angela.
- Not Gemini’s “Zapier + AI connectors” story. Populi has **no native AI button**. Zapier is invite-only (email support@populi.co). Webhooks need a URL + POST + signature. Heavy work is custom REST.
- Not a tribunal. Do not mention Randy being late, tickets he filed, or personnel history. Randy is the primary operator. Four other admins also use it.

### FERPA / access (non-negotiable)

Google Workspace sign-in only. Allow only these `@nsbt.org` accounts (plus the silent website-manager Gmail, never printed on Sign-in):

1. `jlim@nsbt.org`
2. `it@nsbt.org` — Randy Whittaker, Director of IT **and** Office of Student Records and Accounts. This mailbox is the only one that lands on his work page.
3. `dirvin@nsbt.org`
4. `ochaparro@nsbt.org`
5. `awhite20@nsbt.org` — Angela White (admissions coordination / partner on worksheet). Pulls are sent **to her**, not as if she is the institutional lead.
6. `dbtagoe@nsbt.org`
7. `studentservices@nsbt.org` — office mailbox. May sign in. Does not replace Randy’s work page.

Anyone else: refuse. Students, faculty, public: refuse.

**Sign-in screen (exact wording required):**

- Top: `NSBT Populi AI Help Desk`
- Under that: `Administrators Sign-In`
- Heading: `Sign in`
- Body: `This NSBT Populi AI Help Desk holds confidential information and records. Only Administrators are allowed to sign in with the official @nsbt.org Google accounts. If you are not an official NSBT administrator, accessing this page constitutes FERPA Federal Law violations with full enforcement of laws.`
- One button: Continue with Google. No password signup.

### Who the people are (school facts)

- School: New School of Biblical Theology (NSBT), 100% online.
- Campus SIS: Populi — `https://nsbt.populiweb.com`
- Public site (being rebuilt): nsbt.org / temporary nsbt2.grok.me
- Phone: 844-377-1900
- Address: 111 North Orange Avenue, Suite 800, Orlando, FL 32801
- **Registrar (Jacqueline Boswell) and Bursar (Dawn Bruce-Tagoe) positions were eliminated and consolidated** into the **Office of Student Records and Accounts**. Do not list Boswell or Bruce-Tagoe as contacts or sources.
- Office email (students): `studentservices@nsbt.org`
- Office is run by Randy (IT director) as of late July 2026. He is not new to NSBT; he is new to owning records/accounts **and** to operating Populi data pulls at this depth.
- The person commissioning this is **not Angela**. He remains nameless. He is the institutional lead behind the curtain. Worksheet answers go to the **institutional lead**; copy Angela on admissions cards. The desk’s “Send to Angela” is the operational send for pulls (`awhite20@nsbt.org`).
- Deans and Director of Strategic will also use the desk (they are on the allowlist).

### After login — two homes

- If email is **`it@nsbt.org`**: land on **Randy’s work page** (operator home). One navy button: **Pull the worksheet from Populi**. Cards fill with live numbers. **Send to Angela White**. Optional single-list buttons: every term, all degrees granted, 2024+2025+now, home addresses. **No step-by-step lecture. No 20-card instruction list.**
- Everyone else: generic administrator home — Pull from Populi, Review a file, Ask the desk. **One** quiet button: `See Director of IT Work Page` (Angela will use it). Do **not** put that button twice.

### Menu (five items only)

Home · Ask the desk · Worksheet · Review a file · Who can sign in

Open Populi campus is a side link to `https://nsbt.populiweb.com`. Do not rebuild How-to guides, Step by step, Learn later, webhook essays, golden-rules novels, or Data Slicer click recipes as the product. Those were tried and rejected.

### Chat (“Ask the desk”)

The chat must **execute** Populi pulls, not dump articles.

If the user says things like: pull the worksheet / pull home addresses / pull every term / pull headcount / pull degrees — **call the API and return the numbers**. Put tables on Home/Worksheet. Do not paste student lists into chat. Do not ask for SSNs.

Prompts on the chat: `Pull the worksheet from Populi` · `Pull home addresses` · `Pull every term` · `Pull headcount`

### Live Populi API (this is the product)

Base: `https://nsbt.populiweb.com/api2/`  
Auth: `Authorization: Bearer sk_…` (store encrypted on the server; never in the browser).  
Docs: `https://populi.co/api` — **do not rely on 2020 help articles**; NSBT’s Account UI has a dedicated **API** item (Keys tab) between Domains and Invoices/Payments.

Create key in Populi: Photo → Account & Settings → Account → left column **API** → **Keys** → Create an API Key. Name `NSBT desk`. Environment **Live**. Edit Roles: **Academic Auditor** and **Financial Auditor** only. Leave off Account Admin, Academic Admin, and Populi Account Administrator Permissions. Auditors can pull and slice; they cannot change the campus.

**Rate limits (official):**  
3 a.m.–7 p.m. Pacific: **50 req/min per key**.  
7 p.m.–3 a.m. Pacific: **100 req/min**.  
Heavy calls (e.g. Data Slicer) not concurrent. Over limit = HTTP **429**. Wait just over one minute. Paginate (max 200/page). Throttle multi-page pulls (~1.3s between pages). Do not fire five full worksheet pulls at once.

GET list endpoints often take JSON body: `{ page, limit, expand, filter }`.

### What the “Pull the worksheet from Populi” button must fill

Master worksheet items **0, 71–78, 76a–76l**. **Every year / every cohort — never the term that happens to be open.** Randy previously pulled one academic year; that is a failed pull.

| Code | Answer the desk must produce | API (current REST) | CHECK |
|---|---|---|---|
| 0 | Every academic term (name, start, end, earliest–latest year) | `GET /academicterms` | More than one year. One year = failed. |
| 71 | Graduation/persistence **by each entering class** | `GET /students` (`entrance_term_id`, `last_academic_term_id`) + `GET /degrees` + `GET /degrees/{id}/students` | Every start term. **46 graduates** across four conferral dates (40 on first three). One year = failed. |
| 72 | Headcount **now AND 2024 AND 2025** (three views) | `GET /academicterms/current` + `GET /academicterms/{id}/students` for each term, roll up by year | Three views. Last reported anchor was 48 total / 17 MAGL (as-of). One year = failed. |
| 73 | Catalog course codes + duplicates | `GET /catalogcourses` (`abbrv`) | Whole catalog, not this session’s schedule. MCM/MGL next-year codes are future — they settle nothing. |
| 74 | Grade-average threshold | `GET /gradescales` (read only) | **API does not expose catalog pass-bar.** One line: cannot finish from API. **Never edit an old scale** (changes issued transcripts). New settings only. |
| 75 | Degree abbreviation must read **MAGL** | `GET /degrees` (`abbrv`, `name`) | Canonical: Master of Arts in Global Christian Leadership, MAGL. Every issued record yes/no. Not this year only. |
| 77 | June **2026** split MACM vs MAGL | conferred `graduation_date` month `2026-06` | Two counts **must add to 6**. |
| 78 | June **2025** graduate count vs career-services “5” | conferred month `2025-06` | Locked June 2025 count is **9**. Career-services appointments are **not in the API** — set that number beside the 9. |
| 76a | 19-row exception table | none | **Not in API.** Custom admissions field. Angela attaches reasons. 19 against 52-row all-years export. |
| 76b | Honesty acknowledgment | none | Form/custom field. Not a standard API list. |
| 76c | Payment plans / 4+ installments | `GET /invoices` (`on_payment_plan` in report_data) + `GET /paymentplans` | Not current session only. Angela may have an 11 Aug file — confirm live. |
| 76d | Denied-applicant papers location + retention | none | Policy, not a list. |
| 76e | Who holds which role | `GET /roles` + `GET /roles/{id}/members` | Operator should appear as Account Admin; at least one backup Account Admin. |
| 76f | Grades posted within one week | offerings via `GET /courseofferings` (`academic_term_id` required) | Finalization **date** is not reliable on the offering object. Say so in one line if missing. |
| 76g | Transcript request turnaround | `GET /transcriptrequests` (`added_at` / `completed_at`; status construction/active/deleted/closed) | Median vs **5 business days**. No guesses. |
| 76h | Advisor roster | students + advisors if expanded | Every active student. Blanks stay as blanks. |
| 76i | Aged receivables | invoices `balance` + due date → 30/60/90/120 | Totals tie to ledger. |
| 76j | Quarterly external-drive backups | none | Office backup log, not Populi. |
| 76k | Accommodation file who-can-see | none | Named roles on the folder, not “staff”. |
| 76l | Course offerings for two faculty, **every term they taught** | courseofferings per term + faculty | Both people, all terms, not current session. |

Also wire a dedicated pull: **home addresses since founding** — `GET /students` or `/people` with `expand: ["addresses"]`. Address `type` enum includes `home` (not “residence”). Columns: name, street, city, state, ZIP, country. CSV download on the desk. Email to Angela is a **cover note + counts only** (mailto cannot hold the whole file). FERPA: do not paste the list into chat.

**Send to Angela:** `mailto:awhite20@nsbt.org` with subject like `NSBT Populi pull — worksheet 71–78 — YYYY-MM-DD`. Cover note of summaries. Full tables stay on the desk.

### Populi API resources already used (do not hallucinate extra “AI connectors”)

`/academicterms`, `/academicterms/current`, `/academicterms/{id}/students`, `/academicterms/{id}/courseofferings`, `/degrees`, `/degrees/{id}/students`, `/students`, `/people`, `/people/{id}` expand `addresses, phone_numbers, tags`, `/people/{id}/addresses`, `/catalogcourses`, `/courseofferings`, `/invoices`, `/paymentplans`, `/transcriptrequests`, `/roles`, `/roles/{id}/members`, `/gradescales`.

Address model `type`: `home | work | other | main | billing | shipping | school`.

Webhook receiver may exist at `/api/populi/webhook` (POST only). Verify `Populi-RSA-SHA256-Signature`. **Do not show raw webhook pings as “results” to send Angela.** Webhook events ≠ data pulls.

### UI rules (hard)

- API + automation + short answers. **Never** SAY/CLICK/DO novels, golden rules lists, webhook 15-step essays, “do not skip” process cards, or outdated support.populiweb.com click paths as the product.
- If Populi cannot do it, **one sentence** “Not in the API.” Stop.
- Large readable type. Five users, late 50s–70s, not tech-fluent except Randy as IT (still not Populi-fluent).
- No “Need an account?” password forms.
- Do not put “See Director of IT Work Page” twice.
- Review a file (deans): show the **live pull tables** (CHECK passed / send back if one year). Not a lecture on completeness.

### School CHECK numbers (do not invent replacements)

- 46 graduates total; 40 on first three conferral dates.
- June 2026 split must total **6**.
- June 2025 graduates locked at **9**.
- Headcount last reported anchor: 48 total, 17 MAGL (as-of) — a clean live pull **wins** if different; still send all three year-views.
- MAGL = Master of Arts in Global Christian Leadership.

### Public nsbt.org / nsbt2.grok.me

- Public site: programs, admissions, handbook, donate, etc.
- **Zero public links** to the desk except possibly a non-indexed staff bookmark after login.
- Do not scrape or display student records on public pages.
- Do not tell students to use this desk.

### Stack that already works in the other sandbox (rebuild equivalent)

React 19, TypeScript, Vite, TanStack Start/Router, Tailwind, Better Auth Google OAuth with allowlist, server functions for Populi (never call Populi from the browser), encrypted key vault, persist pull results, mailto packet to Angela.

### Success looks like

A named admin signs in with Google. Randy sees the pull button. He presses it once. School-wide numbers (every year) appear on the page. He sends Angela a cover note. Deans open Review a file and see the same numbers. Chat “pull home addresses” actually pulls them. No click-path manual. No public access.

If anything in this handoff conflicts with a 2020 Populi help article, **trust `https://populi.co/api` and NSBT’s live Account UI**.

---

End of handoff.
