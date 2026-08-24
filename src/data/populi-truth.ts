/**
 * Verified 15 Aug 2026 against support.populiweb.com and populi.co/api.
 * If a label is not in here, do not invent a click path.
 */
export const POPULI_NOW = {
  apiKeys: "Photo → Account & Settings → Account → left: API → tab Keys → Create an API Key",
  webhooks: "Same Account left column → Webhooks → Add Webhook",
  automations: "Same Account left column → Automations (view only — custom automations are a Support request)",
  communicationPlans: "Communications → Communication Plans → Add a communication plan",
  templates: "Communications → Templates",
  dataSlicer: "Academics → Reporting → Data Slicer",
  saveReport: "Actions → Save Report / Save As New Report",
  enrollmentsReport: "Academics → Reporting → Enrollments",
  academicTerm: "Academics — term selector (defaults to the current term or Academics → Settings default)",
  academicYears: "Academics → Settings → Academic Years (terms are generated from Term Types)",
  gradesAttendance: "Academics → Settings → Grades & Attendance",
  addLock: "Student profile, left column under the photo → Add a lock",
  bulkLocks: "Academics → Reporting → Data Slicer → Actions → Manage Student Locks",
  customLockTypes: "Support request — lock types are not a staff settings screen",
  transcriptExport: "Profile → Student → Transcript Actions → Export Transcript (Unofficial or Official)",
  billingCurrent: "Billing → Current (Pending Charges, Student Balances, Invoices, Unapplied Payments/Credits)",
  billingAging: "Billing → Aging",
  billingPayments: "Billing → Payments/Refunds",
  financialProfile: "Profile → Financial → Dashboard or By Term",
  people: "Contacts → People",
  accountSettings: "Photo → Account & Settings → Account (left column listed on campus 15 Aug 2026)",
  accountSettingsDoc:
    "https://support.populiweb.com/hc/en-us/articles/114094181214-Managing-settings-for-your-school-s-Populi-account",
} as const;

export const POPULI_LOCKS = [
  "Registration",
  "Grades/Transcript",
  "Financial Lock",
  "Course",
] as const;

export const POPULI_DOCS = {
  webhooks: "https://support.populiweb.com/hc/en-us/articles/19210274936731-Webhooks",
  automations: "https://support.populiweb.com/hc/en-us/articles/4403539179675-Automations",
  communicationPlans: "https://support.populiweb.com/hc/en-us/articles/223789187-Communication-Plans",
  dataSlicer: "https://support.populiweb.com/hc/en-us/articles/223789987-Academic-Reporting-The-Data-Slicer",
  locks: "https://support.populiweb.com/hc/en-us/articles/25905344017179-Student-account-locks",
  addLock: "https://support.populiweb.com/hc/en-us/articles/223790147-Adding-locks-to-students",
  academicTerm: "https://support.populiweb.com/hc/en-us/articles/223790067-The-academic-term",
  grades: "https://support.populiweb.com/hc/en-us/articles/223790387-Academic-Settings-Grades-Attendance",
  transcripts: "https://support.populiweb.com/hc/en-us/articles/223790087-How-to-view-and-export-student-transcripts",
  billing: "https://support.populiweb.com/hc/en-us/articles/223795907-Billing",
  api: "https://populi.co/api",
  legacySunset: "https://support.populiweb.com/hc/en-us/articles/38725081265691-Legacy-API-to-be-sunsetted-August-1-2026",
  zapier: "https://support.populiweb.com/hc/en-us/articles/29757878384667-Using-Zapier-to-keep-MailChimp-updated-with-emails-from-Populi",
} as const;
