import { chromium } from "playwright";

const base = "http://127.0.0.1:8080";
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
  await page.locator("#name").fill("Institutional Lead");
  await page.locator("#email").fill(`lead.${Date.now()}@nsbt.org`);
  await page.locator("#password").fill("NSBTdesk-2026!");
  await page.getByRole("button", { name: /create staff account/i }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20000 });
}

const nav = page.getByRole("navigation");
await nav.getByRole("link", { name: "Staff access", exact: true }).click();
await page.getByRole("heading", { name: /not on nsbt\.org/i }).waitFor();
await page.screenshot({ path: "/workspace/screenshots/staff.png", fullPage: true });

await nav.getByRole("link", { name: "Connectors", exact: true }).click();
await page.getByRole("heading", { name: /does not have an AI button/i }).waitFor();
const body = await page.evaluate(() => document.body.innerText);
if (!/Element451/i.test(body)) throw new Error("missing Gemini correction");
if (!/api2/i.test(body)) throw new Error("missing API base");
await page.screenshot({ path: "/workspace/screenshots/connectors.png", fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/staff`, { waitUntil: "networkidle" });
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);
await page.screenshot({ path: "/workspace/screenshots/mobile-staff.png", fullPage: true });

console.log(JSON.stringify({ errors, overflow }, null, 2));
await browser.close();
if (errors.length || overflow) process.exit(1);
