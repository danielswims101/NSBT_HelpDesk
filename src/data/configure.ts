export type ConfigItem = {
  id: string;
  title: string;
  why: string;
  ask: string;
  youDoFirst: string;
  populiMustBuild: boolean;
};

export const configureItems: ConfigItem[] = [
  {
    id: "session-dashboards",
    title: "Session-close enrollment, retention, graduation dashboards",
    why: "Closes worksheet items 71 and 72 forever. Already on NSBT planning docs. Free on the Monday screen-share.",
    ask: "Build and save session-close enrollment, retention, and graduation dashboards on nsbt.populiweb.com.",
    youDoFirst: "Run this weekend’s saved-report pulls for 71 and 72 so you have the CHECK numbers (46 graduates / 40 on first three dates; last anchor 48 / 17 MAGL) before they build.",
    populiMustBuild: true,
  },
  {
    id: "catalog-recon",
    title: "Course-code catalog-reconciliation view",
    why: "Closes item 73’s upkeep. Do not deactivate codes until Angela has the faculty decision.",
    ask: "Build the catalog-reconciliation view. Mark duplicates. Do not deactivate anything in this session.",
    youDoFirst: "Export Academics → Catalog this weekend. Mark duplicates and practicum / orientation codes.",
    populiMustBuild: true,
  },
  {
    id: "exception-register",
    title: "Exception-admission register field and report",
    why: "Closes 76a. Priority. Exactly 19 rows against the 52-row export.",
    ask: "Build the exception-admission register field and a saved report. Filter on entrance credential.",
    youDoFirst: "Attempt the saved-report filter this weekend. Bring the 52-row export to the share.",
    populiMustBuild: true,
  },
  {
    id: "degree-audit-templates",
    title: "Degree-audit templates",
    why: "Makes item 77 and every future conferral a one-click check.",
    ask: "Install degree-audit templates for MACM and MAGL.",
    youDoFirst: "Pull the June 2026 split yourself (must add to 6) so the template can be verified on known conferrals.",
    populiMustBuild: true,
  },
  {
    id: "automations-registration",
    title: "Registration confirmation plan",
    why: "When enrollment status becomes Enrolled, the student should get the email at once and the formal letter should drop into the print queue. The office inbox is notified. Tuition posts from the schedule — you do not type charges.",
    ask: "On student course enrollment status → Enrolled: apply the registration communication plan; notify studentservices@nsbt.org.",
    youDoFirst: "Write the email template and the letter template in Communications. Name the plan. Then ask Populi to hook the event.",
    populiMustBuild: true,
  },
  {
    id: "automations-billing",
    title: "Invoice, receipt, and past-due sequence",
    why: "Invoice posted → statement email + printed statement. Payment received → receipt. Aging 30 / 60 / 90 → escalating plan. A lock at the threshold NSBT sets; lock off when the account clears.",
    ask: "On invoice posted / payment received / aging thresholds: apply the matching communication plan; add or remove the billing lock at NSBT’s threshold.",
    youDoFirst: "Decide the lock threshold with the Comptroller. Draft the three past-due letters. Do not ask Populi to invent NSBT policy.",
    populiMustBuild: true,
  },
  {
    id: "automations-agreements",
    title: "Enrollment agreements on registration",
    why: "Distance-education students must sign. Populi can create the agreement from registration, email signing instructions, and release a registration lock when it is signed.",
    ask: "On enrollment agreement created: email signing instructions and hold registration behind the signature. On signed: notify the office and release the lock.",
    youDoFirst: "Get the current NSBT enrollment-agreement text from the Dean. You cannot invent the legal language.",
    populiMustBuild: true,
  },
  {
    id: "automations-transcripts",
    title: "Transcript-request acknowledgment",
    why: "A request should acknowledge the requester and put a work item on this office. Fulfillment is still you — print queue or encrypted PDF.",
    ask: "On transcript request created: acknowledgment email to the requester; notify studentservices@nsbt.org.",
    youDoFirst: "Turn on Transcript Requests and decide fee / no fee. Official copies still wait on holds and finalization.",
    populiMustBuild: true,
  },
  {
    id: "transcript-layout",
    title: "Official transcript layout",
    why: "Populi Support builds a custom layout (fields, margins, fonts) and installs it under print layouts. That is a request, not a how-to ticket.",
    ask: "Build NSBT’s official transcript layout to the attached specification and install it on nsbt.populiweb.com.",
    youDoFirst: "Collect a marked-up sample of the current official transcript. One packet. Not three follow-up tickets about fonts.",
    populiMustBuild: true,
  },
  {
    id: "public-transcript-form",
    title: "Public transcript request form",
    why: "Alumni and former students need a public form that can live on nsbt.org, with optional fee, print/mail or encrypted email, and an optional always-current web transcript.",
    ask: "Enable the public Transcript Requests form, document the embed, and confirm encrypted-email delivery.",
    youDoFirst: "Decide the fee and whether a web-transcript link is allowed under NSBT policy.",
    populiMustBuild: true,
  },
  {
    id: "zapier",
    title: "Zapier feature invite",
    why: "Zapier is the no-code door to outside tools. Access is by invite from Populi. One line in the packet.",
    ask: "Enable Zapier for the NSBT account.",
    youDoFirst: "Do not build Zaps that dump education records into an unapproved AI tool.",
    populiMustBuild: true,
  },
  {
    id: "webhooks-api",
    title: "Current API and webhooks — not the legacy API",
    why: "Populi switched off the legacy API on August 1, 2026. Built-in integrations, Zapier, SSO, and LTI were unaffected. Anything still talking to the old API is already dead.",
    ask: "Confirm nothing on NSBT’s account still pointed at the legacy API. Rate-limit guidance for any webhook we stand up.",
    youDoFirst: "Do not write a new integration against a remembered old endpoint. Current docs only: populi.co/api.",
    populiMustBuild: false,
  },
  {
    id: "accounting-export",
    title: "Period lock and accounting export",
    why: "Reconcile a period, lock its transactions, export summary entries for the Comptroller’s books.",
    ask: "Recommended export / summary-entry setup for NSBT’s external accounting and period-lock discipline.",
    youDoFirst: "Ask the Comptroller which columns the books need. Then one question to Populi — not a weekly ‘can you export this for us.’",
    populiMustBuild: false,
  },
  {
    id: "mfa",
    title: "Multi-factor on Populi logins",
    why: "NSBT already enforces MFA on Google Workspace. Student and staff Populi logins are a separate posture. Worth confirming with Holloway.",
    ask: "What MFA options exist for staff and for students on nsbt.populiweb.com, and what is recommended for a consolidated records-and-accounts office.",
    youDoFirst: "Do not disable 2FA campus-wide to unblock one person.",
    populiMustBuild: false,
  },
  {
    id: "training",
    title: "OSRA training track",
    why: "Training and support are included. Ask for a focus session on automations, communication plans, billing, and transcript requests — not a ticket per screen.",
    ask: "Schedule a staff training track for the Office of Student Records and Accounts: automations, communication plans, locks, transcript requests, Data Slicer.",
    youDoFirst: "Finish the 30-day path on this desk first. Training is not a substitute for doing the clicks.",
    populiMustBuild: false,
  },
];
