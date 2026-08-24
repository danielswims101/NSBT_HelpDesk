import type { Runbook } from "@/lib/types";

export const runbooks: Runbook[] = [
  {
    slug: "password-reset",
    title: "Password or lockout in under fifteen minutes",
    desk: "it",
    when: "A named person cannot reach nsbt.populiweb.com",
    sla: "15 minutes to first useful action · 4 hours to close or escalate",
    owner: "You (Systems)",
    escalate:
      "Reset mail confirmed, private window fails, roles correct → escalate-populi with profile URL and timestamp.",
    steps: [
      {
        action: "Identify, do not interview the whole life story",
        detail:
          "Legal name, email they are typing, browser, and whether they ever signed in before. Search People for collisions.",
        verify: "Exactly one profile, or a documented duplicate parked for Records.",
      },
      {
        action: "Prove the account exists",
        detail:
          "Profile → Info → User account. If missing, this is provisioning, not a reset. If login approval is pending, approve if the person is expected.",
        verify: "User account Active.",
      },
      {
        action: "Send Populi’s reset, stay on the channel",
        detail:
          "Trigger the official reset to the address on file. Have them check spam. Do not invent a password.",
        verify: "They open the link and land on the dashboard.",
      },
      {
        action: "If they needed a course, not a login",
        detail:
          "Once in, confirm My Courses. If empty, hand to Records with the offering name — do not enroll from IT.",
      },
    ],
  },
  {
    slug: "provision-student",
    title: "Provision a newly admitted student",
    desk: "shared",
    when: "Admissions has accepted someone and they need the online campus",
    sla: "Same business day during session start · 2 business days otherwise",
    owner: "You — provision, confirm program, attach tuition",
    escalate: "DTL still dark after Information Literacy intake — library vendor, not Populi.",
    steps: [
      {
        action: "Search, then open the admissions profile",
        detail: "Never create a second person. Add NSBT email as an additional address once it exists.",
        verify: "One profile, legal name matches the acceptance letter.",
      },
      {
        action: "User account + Student role only",
        detail: "No Staff, no Faculty. Send the first-login mail.",
        verify: "They can sign in and see Profile → Student.",
      },
      {
        action: "Records: program, catalog year, student status",
        detail: "Active in the correct program. Note advisor if assigned.",
        verify: "Degree audit opens and is not an empty unknown program.",
      },
      {
        action: "Attach the tuition schedule",
        detail: "Confirm the schedule that should fire on enrollment. Do not wait until they owe a mystery balance. You own billing in this Office.",
        verify: "Financial tab exists; no stray charges from a previous inquiry.",
      },
      {
        action: "Point them at the Online Learning Tutorial",
        detail: "Lessons, discussions, assignment submit. Information Literacy handles DTL separately.",
      },
    ],
  },
  {
    slug: "provision-faculty",
    title: "Provision faculty on an offering",
    desk: "it",
    when: "A teacher cannot see the course they were hired to lead",
    sla: "4 hours during the two weeks around session start",
    owner: "You (Systems) with the Academic Dean’s roster",
    escalate: "They are on the offering, content is published, dashboard still empty.",
    steps: [
      {
        action: "Confirm the person, not the name on the syllabus",
        detail:
          "Faculty who are also students stay on one profile with both roles. Search before adding.",
      },
      {
        action: "Assign Faculty (and TA only if asked)",
        detail: "Account exists, Faculty role present. Then open the session offering and add them on the faculty tab.",
        verify: "They appear on the offering, not merely in the global Faculty list.",
      },
      {
        action: "Have them sign in and open the gradebook",
        detail: "If they see the course but cannot edit, check hidden/read-only listing and whether the offering is already finalized.",
      },
    ],
  },
  {
    slug: "open-session",
    title: "Open a session for registration",
    desk: "records",
    when: "Two weeks before a new NSBT session",
    sla: "Checklist complete 10 days before the first meeting",
    owner: "You (Records)",
    escalate: "Offerings will not open for registration after settings are correct — Populi Support.",
    steps: [
      {
        action: "Confirm the academic term/session exists",
        detail: "Dates, add/drop window (first two weeks), and that offerings are attached to this session — not last year’s copy with old faculty.",
        verify: "Public course schedule and Populi session dates match.",
      },
      {
        action: "Walk three test students in your head",
        detail:
          "Clear balance, billing lock, and advisor-assisted. Predict what each will see. Fix tuition schedules before anyone registers.",
      },
      {
        action: "Watch go-live yourself",
        detail: "Systems: login and mail. Records: the first ten enrollments for wrong charges.",
      },
      {
        action: "Publish the student-facing note",
        detail: "When registration opens, how to pay, and that Add/Drop is a form to studentservices@nsbt.org — not a message to faculty.",
      },
    ],
  },
  {
    slug: "close-session-grades",
    title: "Close a session: grades onto transcripts",
    desk: "records",
    when: "Faculty deadline has passed or a student needs a finalized transcript",
    sla: "All offerings finalized within 7 days of the published deadline",
    owner: "You (Records)",
    escalate: "Finalized offering grade missing from transcript — Populi, with offering URL.",
    steps: [
      {
        action: "List unfinalized offerings",
        detail: "Write faculty once. Copy Academic Dean on the second notice. Do not finalize over an incomplete that was granted in writing.",
      },
      {
        action: "Finalize, then spot-check transcripts",
        detail: "Three students per offering: a passing grade, a W, and an incomplete if any. Confirm degree audit moved.",
      },
      {
        action: "Only unfinalize with a reason",
        detail: "Faculty cannot unfinalize. If you do, say why on the work log and refinalize the same day.",
      },
    ],
  },
  {
    slug: "official-transcript",
    title: "Release an official transcript",
    desk: "records",
    when: "A student or alumnus files a transcript request with this Office",
    sla: "5 business days unless a lock or unfinalized grade blocks",
    owner: "You (Records)",
    escalate: "Identity confirmed, no hold, grades finalized, official export fails.",
    steps: [
      {
        action: "Match the request to a single profile",
        detail: "Name, dates of attendance, last four of SSN only if NSBT already stores it — do not ask for a full SSN over email.",
        verify: "No duplicate profile with a second transcript.",
      },
      {
        action: "Check holds and finalization",
        detail: "A billing lock stops official copies. Unfinalized current-session grades are disclosed to the requester before you send a partial.",
      },
      {
        action: "Send by the requested method only",
        detail: "Do not CC the student on an official copy meant for another registrar. Note the work log with destination and date.",
      },
    ],
  },
  {
    slug: "withdraw-refund",
    title: "Withdrawal with pro-rated refund",
    desk: "records",
    when: "Student leaves after the Add/Drop window",
    sla: "Roster + W same day · refund calculation next business day",
    owner: "You — roster, W, credit; Comptroller if money leaves",
    escalate: "Ledger will not accept the credit after status is W.",
    steps: [
      {
        action: "File the email, ignore the instructor-only notice",
        detail: "Withdrawal starts when studentservices@nsbt.org is emailed. Timestamp it. You are the office — do not wait for a Registrar who is not there.",
      },
      {
        action: "Roster to Withdrawn, grade W",
        detail: "Confirm what will print. Do not use Drop — that is week 1–2.",
        verify: "Student dashboard no longer treats the course as active.",
      },
      {
        action: "Calculate from the published table",
        detail: "Weeks remaining in the session. Post a credit, do not delete the original charge.",
      },
      {
        action: "Refund or leave credit",
        detail: "If they are sitting the rest of the year, a credit may be wiser than a card refund. Coordinate a cash refund with the Comptroller.",
      },
    ],
  },
  {
    slug: "lift-hold",
    title: "Lift or explain a billing lock",
    desk: "records",
    when: "Student cannot register or cannot get an official transcript",
    sla: "Same day explanation · lift only after payment or written plan",
    owner: "You (Records)",
    escalate: "Balance is zero, hold remains after a refresh — Populi Support.",
    steps: [
      {
        action: "Read the ledger aloud to yourself",
        detail: "Name the charges. Many ‘mystery holds’ are last session’s uncredited withdrawal.",
      },
      {
        action: "Give the student one number and one action",
        detail: "Current balance and the online pay path. Do not lift ‘so they can register tonight’ without Business Office approval.",
      },
      {
        action: "Lift, then watch registration",
        detail: "If they still cannot register, it is no longer a hold. Hand to the registration article.",
      },
    ],
  },
  {
    slug: "merge-profiles",
    title: "Merge duplicate people",
    desk: "shared",
    when: "Two profiles are the same human and both have history",
    sla: "Do not rush. Block 30 minutes. Export the transcript and the ledger first.",
    owner: "You (Systems) — Records watches transcript and ledger",
    escalate: "Merge control missing or merge fails mid-way — stop and call Populi before touching anything else.",
    steps: [
      {
        action: "Freeze new enrollments on both",
        detail: "Tell Admissions and faculty not to add more data. Export transcript and ledger from each.",
      },
      {
        action: "Choose the surviving profile",
        detail: "Usually the one with the working user account and the longer academic history. Document the losing URL.",
      },
      {
        action: "Merge as Account Admin",
        detail: "Follow Populi’s merge screen exactly. Do not refresh mid-job.",
      },
      {
        action: "Verify sign-in, transcript, ledger, current roster",
        detail: "Have the person sign in. Spot-check one payment and one grade. Close with both old identifiers.",
      },
    ],
  },
  {
    slug: "platform-incident",
    title: "Suspected Populi outage or campus-wide defect",
    desk: "it",
    when: "More than one unrelated person fails the same action in the same hour",
    sla: "15 minutes to declare · Populi ticket in the first 30 minutes if still down",
    owner: "You (Systems)",
    escalate: "Always. This runbook ends in a Populi ticket or a documented false alarm.",
    steps: [
      {
        action: "Reproduce on a second network",
        detail: "Your machine + a phone off campus Wi-Fi. Note HTTP errors, not vibes.",
      },
      {
        action: "Scope it",
        detail: "Login only, one offering, billing only, or everything? Write the first sentence of the Populi ticket now.",
      },
      {
        action: "Tell public-facing staff",
        detail: "You already wear Records. One sentence: what is broken, what students should wait on, what still works.",
      },
      {
        action: "File one Populi ticket",
        detail: "Use the Escalate screen. Phone if it is a live session night and hours are open. Reply on that thread only.",
      },
    ],
  },
];

export function runbookBySlug(slug: string) {
  return runbooks.find((r) => r.slug === slug);
}

export function runbooksForDesk(desk: "it" | "records" | "combined") {
  if (desk === "combined") return runbooks;
  return runbooks.filter((r) => r.desk === desk || r.desk === "shared");
}
