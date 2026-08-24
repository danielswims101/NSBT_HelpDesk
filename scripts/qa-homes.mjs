import { chromium } from "playwright";

const base = "http://127.0.0.1:8080";

async function openAs(email) {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route("**/api/auth/**", async (route) => {
    if (route.request().url().includes("get-session")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: email, name: email.split("@")[0], email, image: null },
          session: { id: "qa", userId: email },
        }),
      });
      return;
    }
    await route.continue();
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await page.locator("h1").first().waitFor({ timeout: 10000 });
  const title = (await page.locator("h1").first().textContent()) ?? "";
  const body = await page.locator("body").innerText();
  const shot = email.startsWith("it@") ? "home-operator.png" : "home-admin.png";
  await page.screenshot({ path: `/workspace/screenshots/${shot}`, fullPage: true });
  await browser.close();
  return { email, title, hasChat: body.includes("Ask the desk"), errors };
}

const op = await openAs("it@nsbt.org");
const ad = await openAs("dirvin@nsbt.org");
const findings = [];
if (!/today|list|Hello/i.test(op.title)) findings.push(`operator title: ${op.title}`);
if (!/Hello|desk is for you/i.test(ad.title)) findings.push(`admin title: ${ad.title}`);
if (!op.hasChat || !ad.hasChat) findings.push("missing Ask the desk");
if (op.errors.length) findings.push(...op.errors);
if (ad.errors.length) findings.push(...ad.errors);
console.log(JSON.stringify({ op, ad, findings }, null, 2));
if (findings.length) process.exit(1);
