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
await page.getByRole("heading", { name: "Sign in" }).waitFor();
const text = await page.evaluate(() => document.body.innerText);
const need = [
  "NSBT Populi AI Help Desk",
  "Administrators Sign-In",
  "official @nsbt.org Google accounts",
  "FERPA Federal Law violations",
];
for (const n of need) {
  if (!text.includes(n)) throw new Error(`missing copy: ${n}`);
}
if (/Create staff account|Need an account|Continue with X/i.test(text)) {
  throw new Error("old signup / X button still visible");
}
if (!(await page.getByRole("button", { name: /google/i }).count())) {
  throw new Error("missing Google button");
}

const signup = await page.request.post(`${base}/api/auth/sign-up/email`, {
  data: { name: "Intruder", email: "stranger@gmail.com", password: "not-allowed-1" },
});
if (signup.ok()) throw new Error("email signup still accepted");

const signupAdmin = await page.request.post(`${base}/api/auth/sign-up/email`, {
  data: { name: "Fake Randy", email: "it@nsbt.org", password: "not-allowed-1" },
});
if (signupAdmin.ok()) throw new Error("allowlisted email still accepted via password");

await page.screenshot({ path: "/workspace/screenshots/login.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/login`, { waitUntil: "networkidle" });
await page.screenshot({ path: "/workspace/screenshots/mobile-login.png", fullPage: true });
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);

console.log(JSON.stringify({ errors, overflow, signup: signup.status(), signupAdmin: signupAdmin.status() }, null, 2));
await browser.close();
if (errors.length || overflow) process.exit(1);
