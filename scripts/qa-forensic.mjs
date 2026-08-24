import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const base = "http://127.0.0.1:8080";
mkdirSync("/workspace/screenshots", { recursive: true });

const nav = [
  "/",
  "/worksheet",
  "/leadership",
  "/ops",
  "/office",
  "/staff",
  "/configure",
  "/connectors",
  "/reports",
  "/knowledge",
  "/runbooks",
  "/tickets",
  "/tickets/new",
  "/desk/it",
  "/desk/records",
  "/learn",
  "/escalate",
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

const sessionUser = {
  user: { id: "qa-jlim", name: "Jimmy Lim", email: "jlim@nsbt.org", image: null },
  session: { id: "qa-session", userId: "qa-jlim" },
};

async function mockAuth(page) {
  await page.route("**/api/auth/**", async (route) => {
    const url = route.request().url();
    if (url.includes("get-session")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(sessionUser),
      });
      return;
    }
    await route.continue();
  });
}

const findings = [];
const browser = await chromium.launch({ args: ["--no-sandbox"] });

async function visit(path, { auth = true, viewport = { width: 1440, height: 900 }, shot } = {}) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror ${path}: ${e}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console ${path}: ${msg.text()}`);
  });
  if (auth) await mockAuth(page);
  try {
    const res = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(1200);
    await page.locator("h1").first().waitFor({ timeout: 8000 }).catch(() => {});
    const status = res?.status() ?? 0;
    const body = (await page.locator("body").innerText().catch(() => "")).trim();
    const title = await page.locator("h1").first().textContent().catch(() => "");
    const overlay = await page.locator("text=Transform failed").count();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    if (shot) await page.screenshot({ path: `/workspace/screenshots/${shot}`, fullPage: true });
    await page.close();
    return { path, status, title, body, bodyLen: body.length, bodyHead: body.slice(0, 160), overlay, overflow, errors };
  } catch (err) {
    await page.close().catch(() => {});
    return {
      path,
      status: 0,
      title: "",
      body: "",
      bodyLen: 0,
      bodyHead: "",
      overlay: 0,
      overflow: false,
      errors: [`goto ${path}: ${err instanceof Error ? err.message : String(err)}`],
    };
  }
}

// 1. Login (no auth)
const login = await visit("/login", { auth: false, shot: "forensic-login.png" });
if (!login.body.includes("NSBT Populi AI Help Desk")) findings.push("LOGIN: missing title");
if (!login.body.includes("Administrators Sign-In")) findings.push("LOGIN: missing Administrators Sign-In");
if (!login.body.includes("FERPA")) findings.push("LOGIN: missing FERPA warning");
if (!login.body.includes("Continue with")) findings.push("LOGIN: missing Google button");
if (login.body.toLowerCase().includes("password") && login.body.includes("Need an account")) {
  findings.push("LOGIN: email/password signup still visible");
}
if (login.errors.length) findings.push(...login.errors);
if (login.overlay) findings.push("LOGIN: vite overlay");

// 2. Signed-out protected page redirects to login
const bounced = await visit("/worksheet", { auth: false });
if (!bounced.body.includes("Sign in") && !bounced.body.includes("Administrators Sign-In")) {
  findings.push("AUTH: /worksheet did not bounce unsigned visitor to sign-in");
}

// 3. Every nav page while signed in
const pages = [];
for (const path of nav) {
  const r = await visit(path, { shot: path === "/" ? "forensic-home.png" : undefined });
  pages.push(r);
  if (r.status >= 400) findings.push(`HTTP ${r.status} ${path}`);
  if (r.bodyLen < 40) findings.push(`BLANK ${path}`);
  if (r.overlay) findings.push(`OVERLAY ${path}`);
  if (r.errors.length) findings.push(...r.errors);
  if (r.body.includes("Sign in") && r.body.includes("FERPA") && r.title === "Sign in" && path !== "/login") {
    findings.push(`AUTH-BOUNCE ${path} — mock session failed`);
  }
}

// 4. Every playbook + runbook
for (const slug of articles) {
  const r = await visit(`/knowledge/${slug}`);
  if (r.title === "Not found" || r.body.includes("Not found")) findings.push(`MISSING ARTICLE ${slug}`);
  if (r.bodyLen < 40) findings.push(`BLANK ARTICLE ${slug}`);
  if (r.errors.length) findings.push(...r.errors);
}
for (const slug of runbooks) {
  const r = await visit(`/runbooks/${slug}`);
  if (r.title === "Not found" || r.body.includes("Not found")) findings.push(`MISSING RUNBOOK ${slug}`);
  if (r.bodyLen < 40) findings.push(`BLANK RUNBOOK ${slug}`);
  if (r.errors.length) findings.push(...r.errors);
}

// 5. Mobile overflow on critical pages
for (const path of ["/", "/login", "/worksheet", "/connectors", "/staff", "/leadership"]) {
  const r = await visit(path, {
    auth: path !== "/login",
    viewport: { width: 390, height: 844 },
    shot: path === "/worksheet" ? "forensic-mobile-worksheet.png" : undefined,
  });
  if (r.overflow) findings.push(`OVERFLOW ${path} @390`);
  if (r.errors.length) findings.push(...r.errors);
}

await browser.close();

const report = { findings, pages: pages.map((p) => ({ path: p.path, status: p.status, title: p.title, bodyLen: p.bodyLen })) };
writeFileSync("/workspace/screenshots/forensic-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (findings.length) process.exit(1);
