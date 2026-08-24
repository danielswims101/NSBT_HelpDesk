export const serviceStandards = [
  { item: "Official transcript", target: "5 business days (unless a lock or unfinalized grade blocks)" },
  { item: "Student inquiry", target: "Acknowledge within 2 business days" },
  { item: "Graduation audit", target: "Complete before commencement" },
  { item: "Grade posting", target: "Per the academic calendar — finalization date is the post date" },
  { item: "FERPA access request", target: "Within the published policy window; identity first" },
  { item: "Record correction", target: "After required approvals are in the file" },
];

export const sessionCadence = [
  { when: "Each academic session", what: "Registration open/close · Add/Drop · Grade submission · Academic standing review · Enrollment census · Registration summary · Grade distribution" },
  { when: "After grade deadline", what: "Calculate GPAs · Apply standing · Notify · Dual-review any graduation audit in flight" },
  { when: "Quarterly", what: "Student-record audit · FERPA / access review · Data validation · External-drive backup confirmation (76j)" },
  { when: "Annually", what: "Graduation certification · Retention / persistence / achievement · DEAC support pack · SOP and form review · Registrar annual report to the Dean of IE" },
];

export const authoritySplit = [
  {
    who: "You (this Office)",
    can: "Routine registration adjustments, transcript issuance, enrollment verification, documented demographic updates, clerical corrections, Populi data, graduation audits (then forward), institutional reports from official data.",
  },
  {
    who: "Academic Dean",
    can: "Grade changes, academic appeals, transfer-credit determinations, academic probation decisions, graduation certification, degree-completion exceptions, curriculum and grading authority.",
  },
  {
    who: "Executive Vice President / President",
    can: "Policy revisions, retention-schedule changes, major technology, emergency actions that change institutional operations. Accreditation correspondence is the EVP.",
  },
];

export const sopIndex: { code: string; title: string; runbook?: string; article?: string }[] = [
  { code: "REG-SOP-002", title: "Student record creation", runbook: "provision-student", article: "provisioning-accounts" },
  { code: "REG-SOP-010", title: "Initial registration", runbook: "open-session", article: "session-registration" },
  { code: "REG-SOP-012", title: "Add/Drop processing", runbook: "withdraw-refund", article: "add-drop-withdraw" },
  { code: "REG-SOP-013", title: "Course withdrawal", runbook: "withdraw-refund", article: "add-drop-withdraw" },
  { code: "REG-SOP-014", title: "Leave of absence", article: "leave-of-absence" },
  { code: "REG-SOP-023", title: "FERPA requests", article: "ferpa-records" },
  { code: "REG-SOP-030", title: "Grade posting", runbook: "close-session-grades", article: "grades-finalization" },
  { code: "REG-SOP-033", title: "Degree audit", article: "degree-audit" },
  { code: "REG-SOP-040", title: "Graduation certification", article: "transcripts" },
  { code: "REG-SOP-050", title: "Transcript requests", runbook: "official-transcript", article: "transcript-requests" },
  { code: "REG-SOP-051", title: "Enrollment verification", runbook: "official-transcript", article: "ferpa-records" },
  { code: "REG-SOP-060", title: "Enrollment reporting", article: "data-pulls" },
  { code: "REG-SOP-063", title: "DEAC / IE reporting", article: "data-pulls" },
];

export const reportingCalendar = [
  { activity: "Enrollment census", when: "Each session", source: "Populi — session Students export" },
  { activity: "Registration summary", when: "Each session", source: "Session Courses + Students" },
  { activity: "Grade distribution", when: "Each session", source: "After finalization" },
  { activity: "Academic standing", when: "Each session", source: "GPA + Catalog threshold (item 74)" },
  { activity: "Graduation report", when: "Annually", source: "Conferral list — items 71, 77, 78" },
  { activity: "Retention & persistence", when: "Annually", source: "Item 71 saved report / dashboard" },
  { activity: "Student achievement", when: "Annually", source: "You + Institutional Effectiveness" },
  { activity: "DEAC annual", when: "As required", source: "You + Dean of IE — official data only" },
];

export const ferpaChecks = {
  access: [
    "Written request received",
    "Identity verified",
    "Request reviewed",
    "Access scheduled",
    "Inspection documented",
    "File updated",
  ],
  disclosure: [
    "Request received",
    "FERPA exception or written consent verified",
    "Recipient identity confirmed",
    "Information reviewed",
    "Disclosure documented when required",
    "Student notified if applicable",
  ],
};
