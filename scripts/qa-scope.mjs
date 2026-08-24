import { chromium } from "playwright";

const base = "http://127.0.0.1:8080";
const shot = (name) => `/workspace/screenshots/${name}`;

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

await page.goto(`${base}/login`, { waitUntil: "networkidle" });
if (await page.getByRole("heading", { name: "Sign in" }).count()) {
  await page.getByRole("button", { name: /need an account/i }).click();
  await page.locator("#name").fill("Dean of IE");
  await page.locator("#email").fill(`dean.${Date.now()}@nsbt.org`);
  await page.locator("#password").fill("NSBTdesk-2026!");
  await page.getByRole("button", { name: /create staff account/i }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20000 });
  await page.waitForTimeout(800);
}

const nav = page.getByRole("navigation");
await page.getByRole("heading", { name: /all years/i }).waitFor({ timeout: 8000 });
await page.screenshot({ path: shot("command.png"), fullPage: true });

await nav.getByRole("link", { name: "Worksheet 71–78", exact: true }).click();
await page.getByRole("heading", { name: /all years/i }).waitFor();
const ws = await page.evaluate(() => document.body.innerText);
if (!/term inventory/i.test(ws)) throw new Error("missing term inventory");
if (!/EVERY entering class/i.test(ws) && !/every entering class/i.test(ws)) {
  throw new Error("71 missing every-cohort language");
}
if (!/sends it back/i.test(ws)) throw new Error("missing reject line");
await page.screenshot({ path: shot("worksheet.png"), fullPage: true });

await nav.getByRole("link", { name: "Deans & Strategic", exact: true }).click();
await page.getByRole("heading", { name: /send one year back/i }).waitFor();
await page.screenshot({ path: shot("leadership.png"), fullPage: true });

await nav.getByRole("link", { name: "Data pulls", exact: true }).click();
await page.getByRole("heading", { name: /two kinds of pulls/i }).waitFor();
await page.screenshot({ path: shot("reports.png"), fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/leadership`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: shot("mobile-leadership.png"), fullPage: true });
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);

console.log(JSON.stringify({ errors, overflow }, null, 2));
await browser.close();
if (errors.length || overflow) process.exit(1);
