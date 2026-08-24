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
await page.waitForTimeout(600);

if (await page.getByRole("heading", { name: "Sign in" }).count()) {
  const email = `operator.${Date.now()}@nsbt.org`;
  const password = "NSBTdesk-2026!";
  await page.getByRole("button", { name: /need an account/i }).click();
  await page.locator("#name").fill("Campus Operator");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: /create staff account/i }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20000 });
  await page.waitForTimeout(1000);
}

const nav = page.getByRole("navigation");
async function visit(name, label, heading) {
  await nav.getByRole("link", { name: label, exact: true }).click();
  await page.waitForTimeout(700);
  if (heading) await page.getByRole("heading", { name: heading }).waitFor({ timeout: 8000 });
  await page.screenshot({ path: shot(name), fullPage: true });
  return { name, heading, url: page.url() };
}

const seen = [];
seen.push(await visit("command.png", "Today", "Stop. Don’t email Populi yet."));
seen.push(await visit("office.png", "The office", "One office. You run it."));

const banned = await page.evaluate(() => document.body.innerText);
if (/Boswell|Bruce-Tagoe|Bumgardner|rdept20/i.test(banned)) {
  throw new Error("Banned names still on The office page");
}
if (!/studentservices@nsbt\.org/i.test(banned)) {
  throw new Error("studentservices@nsbt.org missing on The office page");
}

seen.push(await visit("configure.png", "Automate", "One packet. Not thirty tickets."));
seen.push(await visit("learn.png", "First 30 days", "You run the school on Populi now"));
seen.push(await visit("reports.png", "Data pulls", "Export it yourself"));

await nav.getByRole("link", { name: "Escalate", exact: true }).click();
await page.waitForTimeout(600);
await page.locator("#topic").selectOption("configure");
await page.waitForTimeout(400);
const locked = await page.getByText("Do not ticket Populi").count();
if (!locked) throw new Error("Configure topic should lock the vendor gate");
await page.screenshot({ path: shot("escalate-configure.png"), fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/office`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.screenshot({ path: shot("mobile-office.png"), fullPage: true });
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);

console.log(JSON.stringify({ errors, overflow, seen }, null, 2));
await browser.close();
if (errors.length || overflow) process.exit(1);
