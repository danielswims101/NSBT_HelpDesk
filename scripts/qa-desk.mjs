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
await page.waitForTimeout(800);
await page.screenshot({ path: shot("login-desktop.png"), fullPage: true });

if (await page.getByRole("heading", { name: "Sign in" }).count()) {
  const email = `director.it.${Date.now()}@nsbt.org`;
  const password = "NSBTdesk-2026!";
  await page.getByRole("button", { name: /need an account/i }).click();
  await page.locator("#name").fill("Director of IT");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: /create staff account/i }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20000 });
  await page.waitForTimeout(1200);
}

await page.screenshot({ path: shot("command.png"), fullPage: true });

await page.getByRole("link", { name: "Queue", exact: true }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: shot("queue.png"), fullPage: true });

const firstTicket = page.getByRole("link", { name: /Alumnus locked out/i }).first();
if (await firstTicket.count()) {
  await firstTicket.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: shot("ticket.png"), fullPage: true });
}

await page.getByRole("link", { name: "Playbooks", exact: true }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: shot("playbooks.png"), fullPage: true });

const article = page.getByRole("link", { name: /cannot sign in/i }).first();
if (await article.count()) await article.click();
await page.waitForTimeout(600);
await page.screenshot({ path: shot("article.png"), fullPage: true });

await page.getByRole("link", { name: "Records", exact: true }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: shot("records-desk.png"), fullPage: true });

await page.getByRole("link", { name: "IT desk", exact: true }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: shot("it-desk.png"), fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: shot("mobile.png"), fullPage: true });

const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);

console.log(JSON.stringify({ errors, overflow, url: page.url() }, null, 2));
await browser.close();
if (errors.length) process.exit(1);
