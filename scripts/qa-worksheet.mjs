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
await page.waitForTimeout(500);
if (await page.getByRole("heading", { name: "Sign in" }).count()) {
  await page.getByRole("button", { name: /need an account/i }).click();
  await page.locator("#name").fill("Randy Whittaker");
  await page.locator("#email").fill(`randy.${Date.now()}@nsbt.org`);
  await page.locator("#password").fill("NSBTdesk-2026!");
  await page.getByRole("button", { name: /create staff account/i }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20000 });
  await page.waitForTimeout(900);
}

const nav = page.getByRole("navigation");
await page.getByRole("heading", { name: /worksheet is late/i }).waitFor({ timeout: 8000 });
await page.screenshot({ path: shot("command.png"), fullPage: true });

await nav.getByRole("link", { name: "Worksheet 71–78", exact: true }).click();
await page.getByRole("heading", { name: /not eight tickets/i }).waitFor();
const body = await page.evaluate(() => document.body.innerText);
if (/Boswell|Bruce-Tagoe/i.test(body)) throw new Error("Banned names on worksheet");
if (!/76a/.test(body) || !/Angela/.test(body)) throw new Error("Worksheet missing 76a or Angela");
await page.screenshot({ path: shot("worksheet.png"), fullPage: true });

await nav.getByRole("link", { name: "Cadence", exact: true }).click();
await page.getByRole("heading", { name: /how this office keeps time/i }).waitFor();
await page.screenshot({ path: shot("ops.png"), fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/worksheet`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: shot("mobile-worksheet.png"), fullPage: true });
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);

console.log(JSON.stringify({ errors, overflow, url: page.url() }, null, 2));
await browser.close();
if (errors.length || overflow) process.exit(1);
