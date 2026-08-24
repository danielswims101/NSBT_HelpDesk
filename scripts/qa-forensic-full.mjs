import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const base = "http://127.0.0.1:8080";
const findings = [];

const allow = readFileSync("/workspace/src/lib/admin-allowlist.ts", "utf8");
const listed = [...allow.matchAll(/"([a-z0-9.]+@nsbt\.org)"/g)].map((m) => m[1]);
if (listed.includes("studentservices@nsbt.org")) findings.push("allowlist still has studentservices");
if (listed.length !== 5) findings.push(`allowlist is not five emails: ${listed.join(",")}`);

const nav = [
  "/",
  "/ask",
  "/worksheet",
  "/connectors",
  "/reports",
  "/leadership",
  "/it-work",
  "/knowledge",
  "/runbooks",
  "/ops",
  "/office",
  "/staff",
  "/tickets",
  "/tickets/new",
  "/configure",
  "/escalate",
  "/desk/it",
  "/desk/records",
  "/learn",
];

const articles = [
  "when-not-to-ticket",
  "login-lockouts",
  "provisioning-accounts",
  "user-roles-permissions",
  "two-factor-security",
  "email-notifications",
  "course-access-lms",
  "dtl-library-access",
  "backups-account-settings",
  "escalate-populi",
  "session-registration",
  "add-drop-withdraw",
  "leave-of-absence",
  "transcripts",
  "grades-finalization",
  "degree-audit",
  "tuition-billing",
  "bursar-holds",
  "refunds",
  "ferpa-records",
  "duplicate-profiles",
  "student-status",
  "data-pulls",
  "current-term-trap",
  "weekly-rhythm",
  "office-osra",
  "automations",
  "communication-plans",
  "enrollment-agreements",
  "transcript-requests",
  "five-session-calendar",
  "populi-modules",
];

const runbooks = [
  "password-reset",
  "provision-student",
  "provision-faculty",
  "open-session",
  "close-session-grades",
  "official-transcript",
  "withdraw-refund",
  "lift-hold",
  "merge-profiles",
  "platform-incident",
];

async function session(page, email) {
  await page.route("**/api/auth/**", async (route) => {
    if (route.request().url().includes("get-session")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: email, name: email.startsWith("it@") ? "Randy Whittaker" : "Jimmy Lim", email, image: null },
          session: { id: "qa", userId: email },
        }),
      });
      return;
    }
    await route.continue();
  });
}

async function visit(email, path, { shot, viewport } = {}) {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: viewport ?? { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(`${path}: ${e}`));
  page.on("console", (msg) => {
    if (msg.type() === "error" && !msg.text().includes("Failed to load resource")) {
      errors.push(`console ${path}: ${msg.text().slice(0, 180)}`);
    }
  });
  if (email) await session(page, email);
  try {
    const res = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.locator("h1").first().waitFor({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(500);
    const status = res?.status() ?? 0;
    const body = (await page.locator("body").innerText().catch(() => "")).trim();
    const title = (await page.locator("h1").first().textContent().catch(() => "")) ?? "";
    const overlay = await page.locator("text=Transform failed").count();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    const buttons = await page.getByRole("link", { name: /See Director of IT Work Page/i }).count();
    if (shot) await page.screenshot({ path: `/workspace/screenshots/${shot}`, fullPage: true });
    await browser.close();
    return { path, status, title, body, bodyLen: body.length, overlay, overflow, errors, buttons };
  } catch (err) {
    await browser.close();
    return {
      path,
      status: 0,
      title: "",
      body: "",
      bodyLen: 0,
      overlay: 0,
      overflow: false,
      errors: [`goto ${path}: ${err instanceof Error ? err.message : String(err)}`],
      buttons: 0,
    };
  }
}

// Login
const login = await visit(null, "/login", { shot: "audit-login.png" });
if (!login.body.includes("NSBT Populi AI Help Desk")) findings.push("LOGIN missing title");
if (!login.body.includes("FERPA")) findings.push("LOGIN missing FERPA");
if (!login.body.includes("Continue with")) findings.push("LOGIN missing Google");
if (login.body.includes("Need an account")) findings.push("LOGIN still has password signup");
if (login.errors.length) findings.push(...login.errors);

const bounced = await visit(null, "/worksheet");
if (!/sign in/i.test(bounced.body)) findings.push("AUTH: unsigned visitor not sent to sign-in");

// IT home
const itHome = await visit("it@nsbt.org", "/", { shot: "audit-it-home.png" });
if (!/start here|today/i.test(itHome.title)) findings.push(`IT home title: ${itHome.title}`);
if (!itHome.body.toLowerCase().includes("pull every term")) findings.push("IT home missing pull every term");
if (!itHome.body.includes("Angela")) findings.push("IT home missing send-to-Angela copy");
if (itHome.buttons > 0) findings.push("IT home should not show See Director button");
if (itHome.errors.length) findings.push(...itHome.errors);

// Admin home
const adminHome = await visit("jlim@nsbt.org", "/", { shot: "audit-admin-home.png" });
if (!/desk is for you/i.test(adminHome.title)) findings.push(`Admin home title: ${adminHome.title}`);
if (adminHome.buttons !== 1) findings.push(`Admin home IT button count ${adminHome.buttons}`);
if (adminHome.body.toLowerCase().includes("press these in order")) findings.push("Admin home shows IT process");
if (adminHome.errors.length) findings.push(...adminHome.errors);

// All pages as IT
for (const path of nav) {
  const r = await visit("it@nsbt.org", path);
  if (r.status >= 400) findings.push(`HTTP ${r.status} ${path}`);
  if (r.bodyLen < 40) findings.push(`BLANK ${path}`);
  if (r.overlay) findings.push(`OVERLAY ${path}`);
  if (r.errors.length) findings.push(...r.errors);
}

for (const slug of articles) {
  const r = await visit("it@nsbt.org", `/knowledge/${slug}`);
  if (/not found/i.test(r.title) || /not found/i.test(r.body.slice(0, 80))) findings.push(`MISSING ARTICLE ${slug}`);
  if (r.bodyLen < 40) findings.push(`BLANK ARTICLE ${slug}`);
  if (r.errors.length) findings.push(...r.errors);
}
for (const slug of runbooks) {
  const r = await visit("it@nsbt.org", `/runbooks/${slug}`);
  if (/not found/i.test(r.title)) findings.push(`MISSING RUNBOOK ${slug}`);
  if (r.bodyLen < 40) findings.push(`BLANK RUNBOOK ${slug}`);
  if (r.errors.length) findings.push(...r.errors);
}

// Mobile
for (const path of ["/", "/login", "/worksheet", "/connectors", "/it-work"]) {
  const r = await visit(path === "/login" ? null : "it@nsbt.org", path, { viewport: { width: 390, height: 844 } });
  if (r.overflow) findings.push(`OVERFLOW ${path} @390`);
}

// Webhook endpoint
const hook = await fetch(`${base}/api/populi/webhook`, { method: "POST", body: "{}" });
if (![200, 400, 401, 403, 405].includes(hook.status) && hook.status >= 500) {
  findings.push(`webhook POST ${hook.status}`);
}

console.log(JSON.stringify({ findings, itTitle: itHome.title, adminTitle: adminHome.title }, null, 2));
if (findings.length) process.exit(1);
