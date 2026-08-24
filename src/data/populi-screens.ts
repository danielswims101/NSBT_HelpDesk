/**
 * Ground truth = NSBT campus screenshots 15 Aug 2026
 * (Account left nav, Add API Key, API Keys card, Edit Roles)
 * plus populi.co/api and support.populiweb.com.
 */

export const accountLeftNav = [
  "General Settings",
  "Customizations",
  "Security",
  "Appearance",
  "Integrations",
  "Localization",
  "Text Messaging",
  "Backups",
  "Files",
  "Automations",
  "Webhooks",
  "Reporting",
  "Domains",
  "API",
  "Invoices/Payments",
] as const;

export const populiApiKeyScreen = {
  path: "Photo (top right) → Account & Settings → Account. Left column: API. Tab: Keys. Button: Create an API Key.",
  heading: "API Keys",
  tabs: ["Logs", "Keys"] as const,
  button: "Create an API Key",
  dialogTitle: "Add API Key",
  empty: "You have not created any API keys yet.",
  steps: [
    "Create an API Key. Add API Key: Name = NSBT desk. Environment = Live. Save.",
    "On the NSBT desk card, open ⋮ → Edit Roles.",
    "Check only: Academic Auditor and Financial Auditor.",
    "Leave off: Account Admin, Academic Admin, and Populi Account Administrator Permissions. Auditors can pull and slice; they cannot change the campus.",
    "Save. The red Roles warning must be gone.",
    "Copy Primary Token (sk_…). Paste on this desk → Store key → Test link.",
    "Do this before tonight’s outage (Saturday 8/15, 9:45 p.m. Pacific, about two hours).",
  ],
};

export const populiWebhookScreen = {
  path: "Same Account left column → Webhooks (directly under Automations, above Reporting) → Add Webhook.",
  screen1: [
    "Event — pick from the dropdown. Do not leave Academic Term Updated.",
    "Name — type the exact name from the table below.",
    "Description — one line: NSBT desk live link.",
    "Save. The URL is not on this first box.",
  ],
  screen2: [
    "Conditions — only on the enrollment webhook: status is Enrolled. Leave Invoice Paid and Transcript Request Created with no conditions.",
    "URL — paste the published desk address + /api/populi/webhook. Never the long grok-sandbox preview URL.",
    "HTTP method — change from GET to POST.",
    "Expanded properties — leave empty for now.",
    "Save again.",
  ],
};

export const populiWebhookEvents = [
  {
    event: "Student Course Enrollment Status Changed",
    name: "NSBT desk — Enrolled",
    condition: "Status is Enrolled",
    why: "Roster add. This is the enrollment trigger. Not Enrollment Updated (that fires on every field).",
  },
  {
    event: "Invoice Paid",
    name: "NSBT desk — Invoice Paid",
    condition: "None",
    why: "Payment posted. Do not also add Payment Received — you will double-fire.",
  },
  {
    event: "Transcript Request Created",
    name: "NSBT desk — Transcript request",
    condition: "None",
    why: "Official request landed. Academic Term Updated is the wrong event — close that box.",
  },
];
