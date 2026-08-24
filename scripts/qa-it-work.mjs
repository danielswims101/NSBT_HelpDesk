import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const base = "http://127.0.0.1:8080";
const findings = [];

const allow = readFileSync("/workspace/src/lib/admin-allowlist.ts", "utf8");
if (allow.includes("studentservices@nsbt.org")) findings.push("studentservices still on allowlist");
if (!allow.includes("it@nsbt.org")) findings.push("it@ missing from allowlist");

async function asUser(email, path, shot) {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.route("**/api/auth/**", async (route) => {
    if (route.request().url().includes("get-session")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: email, name: email === "it@nsbt.org" ? "Randy Whittaker" : "Dean", email, image: null },
          session: { id: "qa", userId: email },
        }),
      });
      return;
    }
    await route.continue();
  });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("h1").first().waitFor({ timeout: 10000 });
  const title = (await page.locator("h1").first().textContent()) ?? "";
  const body = await page.locator("body").innerText();
  if (shot) await page.screenshot({ path: `/workspace/screenshots/${shot}`, fullPage: true });
  await browser.close();
  return { email, path, title, body, errors };
}

const op = await asUser("it@nsbt.org", "/", "it-home.png");
for (const need of [
  "Pull every term first",
  "Every entering class",
  "Three headcounts",
  "1. Pull every term",
  "3. Pull 2024 + 2025 + now",
  "Card 0",
  "71",
  "72",
]) {
  if (!op.body.toLowerCase().includes(need.toLowerCase())) findings.push(`IT home missing: ${need}`);
}
if (op.errors.length) findings.push(...op.errors.map((e) => `IT ${e}`));

const ad = await asUser("dirvin@nsbt.org", "/", "dean-home.png");
if (!ad.body.includes("See Director of IT Work Page")) findings.push("Dean home missing IT work button");
if (ad.body.includes("Press these in order")) findings.push("Dean home should not be the IT process");
if (ad.errors.length) findings.push(...ad.errors.map((e) => `dean ${e}`));

const peek = await asUser("dirvin@nsbt.org", "/it-work", "dean-it-work.png");
if (!peek.body.includes("Director of IT work page")) findings.push("IT work guest title missing");
if (!peek.body.includes("Pull every term first")) findings.push("IT work missing process");
if (peek.errors.length) findings.push(...peek.errors.map((e) => `peek ${e}`));

const ws = await asUser("it@nsbt.org", "/worksheet", "it-worksheet.png");
for (const need of [
  "Term inventory",
  "Graduation and persistence",
  "Headcount now",
  "One clean course-code",
  "grade-average",
  "MAGL",
]) {
  if (!ws.body.includes(need)) findings.push(`Worksheet missing: ${need}`);
}

console.log(JSON.stringify({ findings, opTitle: op.title, adTitle: ad.title, peekTitle: peek.title }, null, 2));
if (findings.length) process.exit(1);
