import { chromium } from "playwright";

const base = "http://127.0.0.1:8080";
const sessionUser = {
  user: { id: "qa-jlim", name: "Jimmy Lim", email: "jlim@nsbt.org", image: null },
  session: { id: "qa-session", userId: "qa-jlim" },
};

const pages = [
  "/",
  "/worksheet",
  "/leadership",
  "/connectors",
  "/staff",
  "/office",
  "/ops",
  "/reports",
  "/configure",
  "/knowledge",
  "/runbooks",
  "/tickets",
  "/desk/it",
  "/desk/records",
  "/learn",
  "/escalate",
];

const forbidden = [
  /Randy was asked/i,
  /filed tickets instead/i,
  /silver platter/i,
  /public tribunal/i,
  /failure mode/i,
  /Gemini walked it back/i,
  /He filed tickets/i,
  /July’s assignment/i,
  /Randy — Populi/i,
  /Randy starts/i,
  /cards he is working/i,
];

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const findings = [];

for (const path of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.route("**/api/auth/**", async (route) => {
    if (route.request().url().includes("get-session")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(sessionUser) });
      return;
    }
    await route.continue();
  });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 25000 });
  await page.locator("h1").first().waitFor({ timeout: 8000 }).catch(() => {});
  const body = await page.locator("body").innerText();
  const purpose = await page.getByText("This page is for:").count();
  if (path !== "/" && purpose === 0) findings.push(`NO PURPOSE ${path}`);
  // Home has purpose too
  if (path === "/" && purpose === 0) findings.push("NO PURPOSE /");
  for (const re of forbidden) {
    if (re.test(body)) findings.push(`FORBIDDEN ${path}: ${re}`);
  }
  if (body.includes("Transform failed")) findings.push(`OVERLAY ${path}`);
  if (errors.length) findings.push(...errors.map((e) => `${path} ${e}`));
  if (path === "/connectors") {
    await page.screenshot({ path: "/workspace/screenshots/copy-connectors.png", fullPage: true });
  }
  if (path === "/") {
    await page.screenshot({ path: "/workspace/screenshots/copy-home.png", fullPage: true });
  }
  await page.close();
}

await browser.close();
console.log(JSON.stringify({ findings }, null, 2));
if (findings.length) process.exit(1);
