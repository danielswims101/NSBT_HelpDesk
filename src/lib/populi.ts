export const POPULI = {
  campusUrl: "https://nsbt.populiweb.com",
  campusHome: "https://nsbt.populiweb.com/router/home",
  apiBase: "https://nsbt.populiweb.com/api2/",
  apiDocs: "https://populi.co/api",
  features: "https://www.populi.co/features",
  webhooksDoc: "https://support.populiweb.com/hc/en-us/articles/19210274936731-Webhooks",
  automationsDoc: "https://support.populiweb.com/hc/en-us/articles/4403539179675-Automations",
  zapierDoc:
    "https://support.populiweb.com/hc/en-us/articles/29757878384667-Using-Zapier-to-keep-MailChimp-updated-with-emails-from-Populi",
  dataSlicerDoc: "https://support.populiweb.com/hc/en-us/articles/223789987-Academic-Reporting-The-Data-Slicer",
  locksDoc: "https://support.populiweb.com/hc/en-us/articles/25905344017179-Student-account-locks",
  commPlansDoc: "https://support.populiweb.com/hc/en-us/articles/223789187-Communication-Plans",
  gradesDoc: "https://support.populiweb.com/hc/en-us/articles/223790387-Academic-Settings-Grades-Attendance",
  transcriptsDoc: "https://support.populiweb.com/hc/en-us/articles/223790087-How-to-view-and-export-student-transcripts",
  billingDoc: "https://support.populiweb.com/hc/en-us/articles/223795907-Billing",
  termDoc: "https://support.populiweb.com/hc/en-us/articles/223790067-The-academic-term",
  supportEmail: "support@populiweb.com",
  supportPhone: "877-476-7854",
  supportForm: "https://support.populiweb.com/hc/en-us/requests/new",
  knowledgeBase: "https://support.populiweb.com/hc/en-us",
  accountSettingsDoc:
    "https://support.populiweb.com/hc/en-us/articles/114094181214-Managing-settings-for-your-school-s-Populi-account",
  hours: "Monday–Friday, 6:00 a.m.–5:00 p.m. Pacific",
  hoursNote: "Excluding U.S. holidays. Students are not supported directly.",
  accountContact: "Nick Holloway",
  accountEmail: "nick@populi.co",
  accountPhone: "877-476-7854 x103",
  accountRole: "Populi Account Manager",
  outageNote:
    "Populi scheduled downtime Saturday 8/15 starting 9:45 p.m. Pacific, about two hours. Create the API key before that window.",
};

export const NSBT = {
  name: "New School of Biblical Theology",
  short: "NSBT",
  site: "https://www.nsbt.org",
  deskUrl: "https://desk.nsbt.org",
  phone: "844-377-1900",
  address: "111 North Orange Avenue, Suite 800, Orlando, FL 32801",
  office: "Office of Student Records and Accounts",
  officeEmail: "studentservices@nsbt.org",
  /** @deprecated Use officeEmail — the office is the only student-service address. */
  registrarEmail: "studentservices@nsbt.org",
  admissionsEmail: "ochaparro@nsbt.org",
  angelaEmail: "awhite20@nsbt.org",
  angelaName: "Angela White",
  handbook: "https://www.nsbt.org/student-handbook",
  onlineLearning: "https://www.nsbt.org/online-learning",
  operator: "Office of Student Records and Accounts",
  partner: "Admissions",
  lead: "Institutional lead",
  leadNote:
    "Worksheet answers go to the institutional lead. Admissions coordinates admissions records.",
  deanIE: "Dean of Institutional Effectiveness and Academic Programs",
  academicDean: "Academic Dean and Director of Admissions",
  evp: "Executive Vice President",
  strategic: "Director of Strategic Planning",
  comptroller: "Comptroller",
};

/** Populi staff support window: weekdays 6:00–17:00 America/Los_Angeles. */
export function populiSupportStatus(now = new Date()): {
  open: boolean;
  label: string;
  detail: string;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const mins = hour * 60 + minute;
  const weekend = weekday === "Sat" || weekday === "Sun";
  const open = !weekend && mins >= 6 * 60 && mins < 17 * 60;

  if (open) {
    return {
      open: true,
      label: "Populi Support is open",
      detail: "Staff/faculty line 877-476-7854 · typical reply 1–2 hours",
    };
  }
  if (weekend) {
    return {
      open: false,
      label: "Populi Support is closed (weekend)",
      detail: "Opens Monday 6:00 a.m. PT · email still accepted",
    };
  }
  if (mins < 6 * 60) {
    return {
      open: false,
      label: "Populi Support opens at 6:00 a.m. PT",
      detail: "Leave voicemail or email support@populiweb.com",
    };
  }
  return {
    open: false,
    label: "Populi Support closed for the day",
    detail: "Reopens 6:00 a.m. PT on the next weekday",
  };
}

export function formatTicketId(n: number) {
  return `NSBT-${String(n).padStart(4, "0")}`;
}
