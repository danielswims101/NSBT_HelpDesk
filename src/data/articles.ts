import type { Article } from "@/lib/types";

export const articles: Article[] = [
  {
    slug: "when-not-to-ticket",
    title: "When you must not ticket Populi Support",
    desk: "shared",
    category: "Escalation",
    summary:
      "You run the school. Populi Support is for defects. Almost everything that feels like an emergency is a local how-to.",
    minutes: 6,
    tags: ["escalation", "new operator"],
    related: ["escalate-populi", "data-pulls", "weekly-rhythm"],
    body: [
      "You may be covering systems, records, and student accounts. That is a lot. Look up the how-to on this desk first. Write Support only when the software itself is broken.",
      "Do not ticket Populi to: reset a login, explain a hold, interpret NSBT add/drop or refund policy, build a headcount, add a faculty member to an offering, lift a billing lock, tell you whether a parent may see a transcript, or walk you through Data Slicer. Those are this Office.",
      "Do ticket Populi — once, on one thread — when: the same action fails for several unrelated people after you reproduced it off campus Wi-Fi; a finalized grade never appears on the transcript; a control that should exist on an Account Admin screen is actually missing; or the campus is down.",
      "If you are about to write ‘quick question’ to support@populiweb.com, stop. Open triage on this desk. Do the runbook. Log the work here. If it is still a defect, the Escalate screen will make you check the boxes before it will even copy a packet.",
    ],
    watchouts: [
      "One incident, one vendor thread. Never open three tickets because you are anxious.",
      "Students are not allowed to call Populi. If they did, take it back.",
    ],
    escalateWhen: [
      "You reproduced a platform error after the local playbook. Then — and only then — one ticket.",
    ],
  },
  {
    slug: "login-lockouts",
    title: "Student or faculty cannot sign in to Populi",
    desk: "it",
    category: "Access",
    summary:
      "Diagnose lockouts, password resets, approval holds, and browser issues before escalating to Populi Support.",
    minutes: 6,
    tags: ["login", "password", "2FA", "lockout"],
    populiPath: "Profile → Info → User account",
    related: ["provisioning-accounts", "two-factor-security", "email-notifications"],
    steps: [
      {
        title: "Confirm the person and the site",
        body: "They must use https://nsbt.populiweb.com — not the public nsbt.org site, not a bookmark to an old session, and not a faculty site from a previous school. Ask them to try a private window first.",
      },
      {
        title: "Find the profile, then the user account",
        body: "Search People for legal name and the email they believe they use. Open Profile → Info. Confirm a User account exists. Applicants sometimes have a profile with no account; students sometimes have two emails and are typing the wrong one.",
      },
      {
        title: "Check login approval and status",
        body: "If Academic Admin privileges include login approval, a new or reset account may be waiting for approval. Confirm the person is Active, not Archived, and that the Student / Faculty / Staff role they need is actually assigned.",
      },
      {
        title: "Reset from the profile, never a shared password",
        body: "Use the profile’s user-account reset so Populi emails a one-time link to the address on file. Do not invent a temporary password and send it over SMS. If the email never arrives, see Email & notifications — do not keep resending blindly.",
      },
    ],
    body: [
      "Most NSBT lockouts are not outages. They are a wrong URL, a stale bookmark, an email the person no longer reads, a login-approval hold, or a second profile created during admissions.",
      "You own the account and you own whether they should have a Student role. If they can sign in but cannot see a course, that is enrollment — not a password issue, and not a vendor ticket.",
    ],
    watchouts: [
      "Never confirm a student’s existence, enrollment, or grades to a third party. FERPA applies even on the phone.",
      "Do not merge profiles to ‘fix login’ until you have compared transcripts and billing. Merges are permanent.",
      "Faculty locked out during a live session: reset first, then stay on the line until they reach the course dashboard.",
    ],
    escalateWhen: [
      "Reset email is confirmed delivered and the link still fails after a private window.",
      "Account exists, roles are correct, and Populi returns a platform error.",
    ],
  },
  {
    slug: "provisioning-accounts",
    title: "Provisioning: applicant to student to faculty",
    desk: "it",
    category: "Access",
    summary:
      "How NSBT creates people, user accounts, and roles so records, billing, and the LMS stay on one profile.",
    minutes: 8,
    tags: ["provisioning", "roles", "admissions", "email"],
    populiPath: "Contacts → People → Add person → User account → Roles",
    related: ["user-roles-permissions", "dtl-library-access", "session-registration"],
    steps: [
      {
        title: "Search before you create",
        body: "Search legal name, previous name, personal email, and any old NSBT address. Admissions often already created the profile from an inquiry or application.",
      },
      {
        title: "Create or complete the profile",
        body: "Use legal name as it should appear on the transcript. Add the personal email first. The NSBT address is assigned after enrollment and should be added as an additional email, not as a second person.",
      },
      {
        title: "Grant a user account only when they must log in",
        body: "Leads do not need accounts. Applicants need one to complete the application. Students, faculty, and staff need one. Assign the minimum roles — Student is enough for a newly matriculated student.",
      },
      {
        title: "Then confirm program and tuition",
        body: "You also wear the records hat. After the account works, confirm program, student status, and that a tuition schedule will fire before they register.",
      },
    ],
    body: [
      "Populi is one system. A second profile created ‘just to get them into the course’ will split the transcript, the bill, and the degree audit. Always extend the existing person.",
      "NSBT is entirely online. Provisioning is complete only when the person can open Populi, see the correct roles, receive mail at the address on file, and — for students — reach the Digital Theological Library instructions from the Director of Information Literacy.",
    ],
    watchouts: [
      "Do not assign Academic Admin or Account Admin to solve a one-off access request.",
      "Faculty who are also students need both roles on the same profile.",
    ],
    escalateWhen: [
      "A person appears twice with academic history on both profiles — stop and use the merge runbook.",
    ],
  },
  {
    slug: "user-roles-permissions",
    title: "Populi roles that matter at NSBT",
    desk: "it",
    category: "Security",
    summary:
      "A practical map of Account Admin, Academic Admin, the Populi Registrar role, Financial, Faculty, and Student — and who may assign what.",
    minutes: 7,
    tags: ["roles", "permissions", "admin", "security"],
    populiPath: "Profile → Info → Roles",
    related: ["provisioning-accounts", "two-factor-security", "ferpa-records"],
    body: [
      "Roles are not tags. Only Staff can change roles, and no one can grant a role above their own. Account Admin is the only role that can create another Account Admin. Populi requires at least two Account Admins — keep a named backup even if you do the daily work alone.",
      "You typically need Account Admin + the Populi Registrar role + Student Billing (or Financial Admin) + Staff. That is enough to run the school. Do not stack extra admin roles ‘just in case.’",
      "The Populi Registrar role can edit academic records and course information but not Account Settings. Financial Admin owns billing. Faculty see only their own courses. The Student role is what creates academic history. Never assign Student to a staff member who is not actually enrolled. NSBT no longer has a separate Registrar or Bursar job — you hold those functions in this Office.",
    ],
    watchouts: [
      "Academic Auditor is read-only for academics — it is not how a student audits a course.",
      "Staff alone cannot see transcripts or bills. That is by design.",
    ],
    escalateWhen: [
      "A needed permission does not exist on any standard role — that is a Populi product question, not a local setting.",
    ],
  },
  {
    slug: "two-factor-security",
    title: "Security settings, 2FA, and lost devices",
    desk: "it",
    category: "Security",
    summary:
      "Account security, two-factor recovery, and what only an Account Admin can change.",
    minutes: 5,
    tags: ["2FA", "security", "account admin"],
    populiPath: "Your name → Account & Settings → Account → Security",
    related: ["login-lockouts", "user-roles-permissions"],
    steps: [
      {
        title: "Confirm identity out of band",
        body: "Call the number on the profile or use the NSBT address already on file. Do not reset 2FA from a chat message that only knows a student ID.",
      },
      {
        title: "Recover from the user account, then watch the next login",
        body: "Account Admins can clear or reset two-factor for a user. Stay with them through the next successful sign-in.",
      },
      {
        title: "Review active sessions if compromise is suspected",
        body: "Force a password reset, reset 2FA, and note the work log as a security event.",
      },
    ],
    body: [
      "Security settings for the whole campus live under Account Admin. Treat that screen as production.",
    ],
    watchouts: ["Do not disable 2FA campus-wide to unblock one person."],
    escalateWhen: [
      "You cannot locate a 2FA reset control on a current Account Admin screen — file with Populi Support with a cropped screenshot (no extra PII).",
    ],
  },
  {
    slug: "email-notifications",
    title: "Populi mail is not arriving",
    desk: "it",
    category: "Communications",
    summary:
      "Separate ‘wrong address on the profile’ from spam filtering, notification preferences, and a true mail outage.",
    minutes: 5,
    tags: ["email", "notifications", "spam"],
    populiPath: "Profile → Info → Email · Communications → Templates / Communication Plans",
    related: ["login-lockouts", "provisioning-accounts"],
    body: [
      "Start with the address on the profile, not the address the person recites. Students often give you a Gmail while Populi is sending to an old Yahoo or to an NSBT mailbox they have not opened.",
      "Have them search spam for ‘Populi’ and ‘nsbt’. Faculty ‘not getting assignment notifications’ is usually a course preference or they are not listed on the offering.",
      "If several unrelated people stop receiving mail in the same hour, treat it as a platform incident. One vendor ticket. Not three.",
    ],
    watchouts: [
      "Changing a student’s email can break password-reset delivery mid-incident. Add the new address, confirm it, then make it primary.",
    ],
    escalateWhen: [
      "Multiple roles report missing system mail and you have verified addresses on the profiles.",
    ],
  },
  {
    slug: "course-access-lms",
    title: "Course missing from My Courses or lessons will not open",
    desk: "shared",
    category: "Academics",
    summary:
      "Roster, offering status, faculty listing, and content visibility — the four reasons a course ‘isn’t in Populi.’",
    minutes: 6,
    tags: ["courses", "enrollment", "LMS", "faculty"],
    populiPath: "Academics → Courses → Offering → Roster / Lessons",
    related: ["session-registration", "grades-finalization", "provisioning-accounts"],
    steps: [
      {
        title: "Open the offering, not the catalog course",
        body: "NSBT runs sessions. Confirm you are on the current session’s offering. A student can be admitted and still have no offering enrollment.",
      },
      {
        title: "Read the roster status",
        body: "Enrolled, pending, dropped, withdrawn, and audit are different. Pending often means a balance hold. Dropped/withdrawn courses disappear from the student dashboard by design.",
      },
      {
        title: "Faculty: confirm they are on the offering",
        body: "A person with the Faculty role but not listed on that offering will not see it.",
      },
      {
        title: "Content visibility",
        body: "Lessons can be unpublished or dated in the future. If the roster is correct and the lesson is unpublished, coach the faculty. Do not publish for them unless the Dean asked you to.",
      },
    ],
    body: [
      "Account, enrollment, and lesson publishing are three different jobs that you happen to hold alone. Mixing them is how an afternoon disappears.",
    ],
    watchouts: [
      "Do not enroll a student to ‘just get them in’ when a billing hold (a Populi lock) exists. The lock is the message.",
    ],
    escalateWhen: [
      "Roster shows Enrolled and the lesson is published, but the student dashboard is empty — platform defect.",
    ],
  },
  {
    slug: "dtl-library-access",
    title: "Digital Theological Library and NSBT email",
    desk: "it",
    category: "Access",
    summary:
      "What you provision in Populi versus what Information Literacy and DTL handle after enrollment.",
    minutes: 4,
    tags: ["DTL", "library", "email"],
    related: ["provisioning-accounts", "login-lockouts"],
    body: [
      "Upon enrollment NSBT issues an institutional email and grants Populi plus Digital Theological Library access. Populi login does not automatically mean DTL login.",
      "If Populi works and DTL does not, confirm the student is fully matriculated. Then send them to the Director of Information Literacy. Do not invent DTL passwords, and do not ticket Populi about DTL.",
    ],
    escalateWhen: [
      "A matriculated student has waited through Information Literacy’s intake — that is a library vendor, not Populi Support.",
    ],
  },
  {
    slug: "backups-account-settings",
    title: "Account settings, backups, and appearance",
    desk: "it",
    category: "Administration",
    summary:
      "What lives behind Account Admin — and what never to click during a live session week.",
    minutes: 4,
    tags: ["account admin", "backups", "settings"],
    populiPath: "Photo → Account & Settings → Account. Left column: General Settings, Customizations, Security, Appearance, Integrations, Localization, Text Messaging, Backups, Files, Automations, Webhooks, Reporting, Domains, API, Invoices/Payments",
    related: ["two-factor-security", "user-roles-permissions"],
    body: [
      "Account is a dedicated left column. On this campus today it is: General Settings, Customizations, Security, Appearance, Integrations, Localization, Text Messaging, Backups, Files, Automations, Webhooks, Reporting, Domains, API, Invoices/Payments. API has Logs and Keys tabs. The 2020 help article omitted API, Webhooks, and Automations as their own items — ignore that list.",
      "Backups: Account → Backups → Request a Backup. One download every 24 hours. Populi emails when the CSVs are ready. Available one week. Disaster recovery only — not for undoing a single bad grade.",
      "Keep at least two Account Admins. If you are the daily operator, someone else must already have the role before you go on leave.",
      "Populi Account Manager on that screen: Nick Holloway, nick@populi.co, 877-476-7854 x103.",
    ],
    watchouts: [
      "Never apply a backup over the live site without a written plan and a Populi Support ticket already open.",
    ],
  },
  {
    slug: "escalate-populi",
    title: "How to write the rare Populi Support ticket",
    desk: "shared",
    category: "Escalation",
    summary:
      "Hours, channels, what they will not do, and the packet this desk will only copy after you pass the gate.",
    minutes: 5,
    tags: ["escalation", "support", "outage"],
    related: ["when-not-to-ticket", "login-lockouts", "course-access-lms"],
    body: [
      "Populi Support is for staff and faculty, not students. Hours are Monday–Friday, 6:00 a.m. to 5:00 p.m. Pacific. Email support@populiweb.com or use the request form. Phone 877-476-7854. NSBT’s Account Manager is Nick Holloway, nick@populi.co, ext. 103.",
      "They will help you use the product and look at a defect. They will not reset a student’s password, interpret NSBT policy, run your headcount, or speak to a student.",
      "A good ticket has: nsbt.populiweb.com, a profile URL not a full SSN, exact click path, timestamp in PT, browser, whether a private window was tried, what you already ruled out, and one question.",
      "Use this desk’s Escalate screen. It will refuse to copy a packet until you check the local steps. That is intentional.",
    ],
    watchouts: ["Do not open three tickets for one incident. Reply on the first thread."],
  },
  {
    slug: "session-registration",
    title: "Session registration at NSBT",
    desk: "records",
    category: "Registration",
    summary:
      "When students may register, what blocks them, and how advisors fit in.",
    minutes: 6,
    tags: ["registration", "sessions", "holds"],
    populiPath: "Academics → Registration / student Profile → Student",
    related: ["add-drop-withdraw", "bursar-holds", "tuition-billing"],
    body: [
      "NSBT students register online beginning two weeks before each session and may continue through the second week. After week two, the path is Withdraw.",
      "A student who ‘cannot register’ is usually missing a Student role, is not in an active program, has a billing lock, or is outside the window. You can check all four without Populi Support.",
      "Advisors can register advised students during open enrollment. They cannot override a financial hold.",
    ],
    watchouts: [
      "Do not manually force an enrollment to beat a lock. Document the lock and take the billing-hold path.",
    ],
    escalateWhen: [
      "Registration is open, no hold, roles correct, and Populi returns an unhandled error on submit.",
    ],
  },
  {
    slug: "add-drop-withdraw",
    title: "Add/Drop, withdrawal, and the W grade",
    desk: "records",
    category: "Registration",
    summary:
      "First two weeks versus after — forms, who must be emailed, and what hits the transcript.",
    minutes: 6,
    tags: ["add/drop", "withdrawal", "W grade"],
    related: ["session-registration", "refunds", "grades-finalization"],
    steps: [
      {
        title: "Week 1–2: Add/Drop",
        body: "Student files the electronic Add/Drop form and emails studentservices@nsbt.org. A Slack to the instructor is not official.",
      },
      {
        title: "After week 2: Withdraw",
        body: "Student emails studentservices@nsbt.org — not the instructor. A W posts. Refunds are pro-rated only after that email exists. You process it. There is no Bursar to hand it to.",
      },
      {
        title: "Update Populi in this order",
        body: "Roster status, confirm the W will print, then the credit on the ledger. Never reverse a W because work arrived late.",
      },
    ],
    body: [
      "Instructors do not drop students. ‘They never showed up’ is attendance, not an automatic drop.",
    ],
    watchouts: [
      "A refund conversation before the withdrawal email is on file will be wrong. Timestamp the email.",
    ],
  },
  {
    slug: "leave-of-absence",
    title: "Leave of Absence and continuous enrollment",
    desk: "records",
    category: "Records",
    summary:
      "When a student may sit out sessions, what the LOA form does, and how return works.",
    minutes: 5,
    tags: ["LOA", "enrollment", "status"],
    related: ["add-drop-withdraw", "session-registration", "student-status"],
    body: [
      "Students must remain continuously enrolled each academic year. They may sit out one or two sessions without an LOA. More than two successive sessions off requires a Leave of Absence form.",
      "An LOA suspends continuous-enrollment status and extends the maximum time to complete the degree when granted.",
      "A student who simply disappears is not on leave. They need the Dean’s permission to resume. Do not silently reactivate them to be kind.",
    ],
  },
  {
    slug: "transcripts",
    title: "Unofficial and official transcripts",
    desk: "records",
    category: "Records",
    summary:
      "What students can export themselves versus what you release, and how holds block official copies.",
    minutes: 5,
    tags: ["transcript", "alumni", "holds"],
    populiPath: "Profile → Student → Transcript Actions → Export Transcript",
    related: ["grades-finalization", "bursar-holds", "ferpa-records"],
    body: [
      "Students and alumni with working accounts can export an unofficial transcript themselves. Point them there before you print anything.",
      "Official transcripts are your job. Confirm identity, no billing lock, the name that should print, and the destination. Use Populi’s Transcript Requests workflow when it is on; until then, the inbox is studentservices@nsbt.org.",
      "Grades that are not finalized will not appear as expected. Fix finalization before you tell an alumnus Populi is missing a grade.",
    ],
    watchouts: [
      "A parent calling for a transcript is a FERPA no unless a current, specific release is on file.",
    ],
    escalateWhen: [
      "Finalized grades are on the offering but do not appear on the transcript after a refresh — Populi Support, with the offering URL.",
    ],
  },
  {
    slug: "grades-finalization",
    title: "Grades, finalization, and the transcript feed",
    desk: "records",
    category: "Academics",
    summary:
      "How offering grades become transcript lines, and who may unfinalize.",
    minutes: 6,
    tags: ["grades", "finalization", "transcript"],
    populiPath: "Offering → Gradebook / Finalize",
    related: ["transcripts", "course-access-lms", "degree-audit"],
    body: [
      "Faculty enter grades. Finalization locks the offering and pushes grades onto the transcript. Faculty cannot unfinalize. You can, and it should be rare.",
      "If a student sees a dash, check offering, published assignment, calculated course grade, and whether the offering is finalized.",
      "Incomplete grades are policy, not a software toggle.",
    ],
    watchouts: [
      "Unfinalizing during an active billing dispute can change what a 1098-T later implies.",
    ],
  },
  {
    slug: "degree-audit",
    title: "Degree audit and catalog year",
    desk: "records",
    category: "Academics",
    summary: "Why an audit looks ‘wrong,’ and who is allowed to edit it.",
    minutes: 5,
    tags: ["degree audit", "catalog", "advising"],
    populiPath: "Profile → Student → Degree Audit",
    related: ["grades-finalization", "session-registration"],
    body: [
      "The audit is only as good as the program, catalog year, and substitutions. Advisors may update audits for advised students. You own exceptions and transfer applications.",
      "A course that ‘should count’ but does not usually has the wrong course ID. Fix the mapping; do not tell the student to ignore the red X.",
    ],
  },
  {
    slug: "tuition-billing",
    title: "Tuition schedules, fees, and online payments",
    desk: "records",
    category: "Billing",
    summary:
      "How charges should generate from enrollment, and what to check when a balance looks invented.",
    minutes: 7,
    tags: ["tuition", "fees", "payments", "AR"],
    populiPath: "Billing · Profile → Financial → Dashboard or By Term",
    related: ["bursar-holds", "refunds", "session-registration"],
    body: [
      "Populi billing works when tuition schedules attach automatically from enrollment.",
      "When a balance is ‘wrong,’ read the ledger in date order. Most disputes are a withdrawn course that was never credited, or a payment on a duplicate profile.",
      "Students pay from Profile → Financial. If the pay button is missing, check online-payment setup and whether they have the Student role.",
    ],
    watchouts: [
      "Never delete a charge that already appears on a statement. Reverse it with a dated credit.",
    ],
  },
  {
    slug: "bursar-holds",
    title: "Billing holds and Populi locks",
    desk: "records",
    category: "Billing",
    summary:
      "NSBT calls them registration holds and billing holds. In Populi they are locks. You lift them — there is no Bursar.",
    minutes: 5,
    tags: ["holds", "locks", "registration", "billing"],
    populiPath: "Student profile, left column → Add a lock (Registration, Grades/Transcript, Financial Lock, Course)",
    related: ["tuition-billing", "session-registration", "refunds", "automations"],
    body: [
      "A lock is a message. Read the lock text and the ledger before you call it a glitch.",
      "Registration holds block enrollment. Billing holds block registration and official transcripts. Both are locks you control in this Office.",
      "Lift a lock after payment, a documented plan, or a written waiver. If a lock is stuck after the balance is truly zero, then it may be software.",
      "Automations can add or remove locks (for example at an aging threshold). That is a configuration request on the Automate screen — not a how-to ticket.",
    ],
    watchouts: [
      "Do not lift a lock ‘so they can register tonight’ without a payment or a written plan.",
    ],
    escalateWhen: [
      "Balance is zero, the lock remains after a refresh — then one Populi ticket.",
    ],
  },
  {
    slug: "refunds",
    title: "Refunds after withdrawal",
    desk: "records",
    category: "Billing",
    summary:
      "Pro-rated session refunds: the order of operations you run yourself, then coordinate with the Comptroller.",
    minutes: 5,
    tags: ["refunds", "withdrawal", "billing"],
    related: ["add-drop-withdraw", "tuition-billing", "bursar-holds"],
    body: [
      "Refunds are pro-rated by weeks remaining and only after the student has emailed studentservices@nsbt.org to withdraw.",
      "Order: timestamp the email, roster to Withdrawn + W, calculate from the published table, post a credit, refund or leave credit, note the work log. Money leaving the institution is coordinated with the Comptroller. There is no Bursar.",
    ],
    watchouts: [
      "Do not refund onto a card that is not the original tender without a second look.",
    ],
  },
  {
    slug: "ferpa-records",
    title: "FERPA at this desk",
    desk: "shared",
    category: "Compliance",
    summary:
      "What you may say, what the work log may store, and when to refuse a request.",
    minutes: 5,
    tags: ["FERPA", "privacy", "compliance"],
    related: ["transcripts", "login-lockouts", "duplicate-profiles"],
    body: [
      "You are the institution’s FERPA compliance officer for student records. Education records are not hallway facts. Every work-log item about a named student is FERPA-covered.",
      "Verify the caller. Do not confirm that someone is a student to a pastor, spouse, or employer without a current release.",
      "Keep SSNs, full account numbers, and medical notes out of comments.",
    ],
    watchouts: ["A forwarded email thread is not a release."],
  },
  {
    slug: "duplicate-profiles",
    title: "Duplicate people and when to merge",
    desk: "shared",
    category: "Data",
    summary:
      "How duplicates are born at admissions, and why you never merge in a hurry.",
    minutes: 5,
    tags: ["merge", "duplicates", "admissions"],
    populiPath: "Account Admin → merge profiles",
    related: ["provisioning-accounts", "transcripts", "tuition-billing"],
    body: [
      "Duplicates appear when Admissions creates a lead, the applicant starts a second application with a different email, and later someone adds ‘the student’ a third time. Search first.",
      "Before merge: export unofficial transcript and ledger from both. Merges are difficult to undo.",
    ],
    watchouts: [
      "Never merge a faculty profile into a student profile without checking course ownership.",
    ],
  },
  {
    slug: "student-status",
    title: "Student status, programs, and non-degree",
    desk: "records",
    category: "Records",
    summary:
      "Applicant, non-degree, active, withdrawn, alumni — and what each is allowed to see.",
    minutes: 4,
    tags: ["status", "programs", "alumni"],
    related: ["leave-of-absence", "session-registration", "provisioning-accounts"],
    body: [
      "Applicants see admissions, not the full LMS. Non-degree students still need a Student role for any academic history.",
      "Changing someone to Alumni because they ‘finished a class’ is wrong. Program completion is a conferral workflow.",
    ],
  },
  {
    slug: "data-pulls",
    title: "Data pulls you will be asked for",
    desk: "shared",
    category: "Reporting",
    summary:
      "Headcount, rosters, balances, payments. Export them. Do not ask the vendor to be your analyst.",
    minutes: 8,
    tags: ["reports", "data slicer", "CSV", "export"],
    populiPath: "Academics → Reporting → Data Slicer · term Students/Courses exports",
    related: ["weekly-rhythm", "when-not-to-ticket", "current-term-trap"],
    body: [
      "Populi already has the lists. Term → Students and Term → Courses export XLS/CSV. Billing has payments, refunds, and balances. Data Slicer is for ‘this report plus two columns.’ It will not give assignment-level grades.",
      "What you can see in the slicer depends on your roles. No financial columns usually means you are not Student Billing / Financial Admin.",
      "Use the Data pulls section of this desk. Each recipe now carries a year-scope badge. ALL YEARS means clear the term filter. THIS SESSION means keep it. Do not mix them.",
    ],
    watchouts: [
      "The current-term filter is the default. Leaving it on is how a comprehensive pull becomes one year.",
      "Do not leave an all-years CSV on a personal laptop as the record.",
    ],
  },
  {
    slug: "current-term-trap",
    title: "The current-term trap",
    desk: "shared",
    category: "Reporting",
    summary:
      "Populi opens on the session that is meeting. That is not ‘all years of NSBT operations.’ Clear the filter or the Deans will send the file back.",
    minutes: 4,
    tags: ["reports", "scope", "all years", "new operator"],
    populiPath: "Academics — term selector (defaults to current term) · then Data Slicer with no term filter or one saved report per term",
    related: ["data-pulls", "when-not-to-ticket", "office-osra"],
    body: [
      "The last time leadership asked for a comprehensive data pull on all years of NSBT operations, the file that came back was one academic year. Populi did that because the current term was already selected. The operator did not clear it.",
      "Two kinds of asks live on this desk. Operations: this session’s roster, this week’s unfinalized grades, this month’s payments. Institutional: every entering cohort, 2024 AND 2025 AND today, every conferral date, the whole catalog. The worksheet is mostly institutional.",
      "Card 0 is the term inventory. Export every academic term on nsbt.populiweb.com before you touch 71 or 72. Those terms are the spine. One saved report per start term. Three enrollment views, not one.",
      "If you are about to send a file and it only contains the year that was open when you signed in, mark CHECK failed. Do not send it. Do not open a Populi ticket about it. Clear the filter and export again.",
    ],
    watchouts: [
      "A screenshot of the current session is not an institutional report.",
      "Next year’s MCM/MGL codes are not the catalog.",
    ],
    escalateWhen: [
      "The Terms list itself will not export after you have Account Admin / Academic Admin — then one vendor thread, with the click path.",
    ],
  },
  {
    slug: "weekly-rhythm",
    title: "A week that does not become thirty vendor tickets",
    desk: "shared",
    category: "Operations",
    summary: "One person can run NSBT on Populi if the week has a shape.",
    minutes: 5,
    tags: ["rhythm", "operations", "new operator"],
    related: ["data-pulls", "when-not-to-ticket", "session-registration", "automations"],
    body: [
      "Morning: open studentservices@nsbt.org and the work log — not a vendor inbox. How-to goes through triage. A named student gets a work-log note, not a vendor email.",
      "Session weeks: watch registration locks and faculty who are not on their offering.",
      "Friday, thirty minutes: session headcount, unfinalized offerings, payments posted this week, aging, and the Automations / Scheduled Events reports.",
      "Ticket volume to Populi is not a measure of diligence. It is a measure of whether you used this desk.",
    ],
  },
  {
    slug: "office-osra",
    title: "The Office of Student Records and Accounts",
    desk: "shared",
    category: "The office",
    summary:
      "One office, one Director, one system. Records and accounts already live together in Populi. That is why they belong in one office.",
    minutes: 6,
    tags: ["office", "authority", "OSRA"],
    related: ["when-not-to-ticket", "automations", "ferpa-records", "data-pulls"],
    body: [
      "The Office of Student Records and Accounts is the single institutional home for every student record and every student account. You lead it with full authority under the Dean of Institutional Effectiveness and Academic Programs and the Academic Dean and Director of Admissions. The Executive Vice President oversees compliance.",
      "Populi is the system of record. Enrollment, grades, transcripts, conferral, invoices, and payments sit on one profile. There is no records system to reconcile against a billing system, and there is no separate Registrar or Bursar to ask.",
      "Student service is studentservices@nsbt.org. Assigned support staff work at your direction and hold no custody and no discretion.",
      "You are custodian of student records, you keep the backups, and you are the FERPA officer for those records. Accreditation mail is forwarded to the Executive Vice President. Financial schedules go to the Comptroller on request — you export them.",
    ],
    watchouts: [
      "Do not invent a second office in email (‘I’ll check with the Registrar’). You are the office.",
    ],
  },
  {
    slug: "automations",
    title: "Automations: events, actions, and what you request",
    desk: "shared",
    category: "Automations",
    summary:
      "Populi performs actions when events fire. Built-in automations exist now. Custom ones are configured by Populi on request, free. That is the Automate screen — not thirty how-to tickets.",
    minutes: 8,
    tags: ["automations", "triggers", "locks", "webhooks"],
    populiPath: "Account left column → Automations · Account → Reporting → Automations report",
    related: ["communication-plans", "enrollment-agreements", "when-not-to-ticket"],
    steps: [
      {
        title: "See what is already on",
        body: "Account Admins see every automation under Account. Open the Automations report: what fired, how often. Do not ask Support to tell you what is already installed.",
      },
      {
        title: "Know the actions",
        body: "An automation can add or remove a communication plan, send email or a system notification, send a text or push, assign a to-do, add or remove a tag, lock, or form request, or fire a webhook.",
      },
      {
        title: "Know the events this Office cares about",
        body: "Official event names: Student Course Enrollment Status Changed, Enrollment Agreement Created, Enrollment Agreement Signed, Invoice Posted, Invoice Paid, Payment Received, Credit Posted, Refund Posted, Recurring Payment Status Change, ACH Online Payment Failed, Financial Transaction Voided, Transcript Request Created, Lock Added To Person, Lock Removed From Person, Person Updated, Role Added/Reactivated.",
      },
      {
        title: "Request custom ones as one packet",
        body: "Name the event and the actions. Draft the templates first. Use the Automate screen. Do not open a new Populi ticket for each letter.",
      },
    ],
    body: [
      "This is the highest-value work after you can already search, reset a login, and export a list. The office should not remember to send a registration letter. The event should send it.",
      "Populi has no native generative AI. Maximum automation here is rule-based: defined trigger, defined action. External AI, if leadership ever approves it, goes through the current API, webhooks, or Zapier — never by dumping a CSV into an unapproved tool.",
    ],
    watchouts: [
      "The legacy API was switched off August 1, 2026. Do not point anything at an old endpoint.",
      "A broken automation is a configuration question if it never existed. It is a defect only if a configured automation stops firing for everyone.",
    ],
    escalateWhen: [
      "A custom automation Populi already installed has stopped firing for several people after you reproduced it — one ticket, with the automation name.",
    ],
  },
  {
    slug: "communication-plans",
    title: "Communication plans: letters, email, print queue",
    desk: "records",
    category: "Communications",
    summary:
      "A named sequence of email templates, letter templates, and to-dos. Applied to a person or a whole Data Slicer group. Automations can apply the plan the moment a registration or billing event occurs.",
    minutes: 7,
    tags: ["letters", "email", "print", "plans"],
    populiPath: "Communications → Communication Plans · Print queue",
    related: ["automations", "tuition-billing", "session-registration"],
    steps: [
      {
        title: "Build the templates first",
        body: "Email and printed-letter templates live in Communications. Mail merge and envelope printing run through print layouts and the print queue. Scheduled letters drop into the queue on their day.",
      },
      {
        title: "Name the plan",
        body: "A plan is a sequence spaced over time. Applied to a person, it starts that day. Scheduled emails go out on their scheduled calendar day. The Scheduled Events report shows everything queued.",
      },
      {
        title: "Apply individually or in bulk",
        body: "From a profile, or to a Data Slicer result set. Do not ask Populi to ‘send the billing letter to everyone who owes.’ You can apply the plan to that group.",
      },
      {
        title: "Let an automation apply it",
        body: "That combination is the core: registration, invoice posted, or payment received applies the plan with no staff touch. Request the hook on the Automate screen.",
      },
    ],
    body: [
      "Every email, printed letter, to-do, note, and file lands on the person’s activity feed, with role-based visibility. That feed is the Office’s correspondence record. Emails sent from outside Populi can be captured by BCC to the Populi dropbox address.",
    ],
    watchouts: [
      "Changing a plan does not always rewrite people already on it the way you hope. Ask Holloway for best practice before you edit a live plan mid-session.",
    ],
  },
  {
    slug: "enrollment-agreements",
    title: "Enrollment agreements as a registration gate",
    desk: "records",
    category: "Compliance",
    summary:
      "Agreements can trigger from registration and require a signature before the student continues. Creation and signature are automation events. Distance education needs this.",
    minutes: 5,
    tags: ["agreements", "signature", "registration", "accreditation"],
    populiPath: "Data Slicer → Actions → Generate enrollment agreements · events Enrollment Agreement Created / Signed",
    related: ["automations", "session-registration", "office-osra"],
    body: [
      "NSBT is entirely online. Distance-education students must sign an enrollment agreement. Populi can make that an automatic, enforced step of registration.",
      "You do not write the legal text. You get the current agreement from the Dean, then ask Populi to fire it on registration, email signing instructions, notify the Office when it is signed, and release the registration lock.",
      "The signed agreement sits on the profile as the compliance record. That is better than a PDF in a personal Drive.",
    ],
    watchouts: [
      "Do not waive the signature to be kind. That is a compliance hole, not customer service.",
    ],
  },
  {
    slug: "transcript-requests",
    title: "Transcript Requests workflow",
    desk: "records",
    category: "Records",
    summary:
      "Current students request from their profile. Alumni use a public form. Fees, print/mail, encrypted email, optional web transcript. You fulfill — Populi does not.",
    minutes: 6,
    tags: ["transcript", "requests", "alumni"],
    populiPath: "Profile → Student → Transcript Actions · Transcript Request Created webhook",
    related: ["transcripts", "ferpa-records", "bursar-holds", "automations"],
    steps: [
      {
        title: "Unofficial first",
        body: "Anyone with a working account can export unofficial themselves. Point them there before you print.",
      },
      {
        title: "Official: identity, lock, finalization, destination",
        body: "Confirm who they are. A billing lock stops official copies. Unfinalized current-session grades are disclosed before you send a partial. Send only to the requested destination.",
      },
      {
        title: "Use the request queue when it is on",
        body: "Fulfillment is print-and-mail through the print queue (envelope or label) or an emailed PDF with optional encryption and an optional always-current web transcript.",
      },
    ],
    body: [
      "Populi Support can enable the public request form, style it, and document the embed for nsbt.org. That is one line in the Automate packet. Custom transcript layouts are also a Populi-built request.",
    ],
    watchouts: [
      "A parent calling is a FERPA no unless a current, specific release is on file.",
    ],
  },
  {
    slug: "five-session-calendar",
    title: "The five-session academic calendar",
    desk: "records",
    category: "Academics",
    summary:
      "You build and maintain NSBT’s five-session calendar in Populi. Dates, add/drop windows, offerings, and tuition schedules have to match.",
    minutes: 5,
    tags: ["calendar", "sessions", "offerings"],
    populiPath: "Academics — term selector / Academic Years. Terms are generated from Term Types.",
    related: ["session-registration", "tuition-billing"],
    body: [
      "NSBT does not run a traditional semester grid. Five sessions. You own the dates in Populi. Public-facing dates and Populi dates must match before registration opens.",
      "Each session needs offerings attached — not last year’s copy with old faculty — and tuition schedules that will fire when someone enrolls.",
      "Add/Drop is the first two weeks. After that it is Withdraw via studentservices@nsbt.org.",
    ],
    watchouts: [
      "Do not open registration on a session whose offerings still have no faculty listed.",
    ],
  },
  {
    slug: "populi-modules",
    title: "What is in every Populi account",
    desk: "it",
    category: "Administration",
    summary:
      "Seven areas, no separately priced modules: Recruit, Admit, Teach, Administer, Aid, Account, Advance. NSBT already has all of them.",
    minutes: 4,
    tags: ["modules", "SIS", "LMS"],
    related: ["office-osra", "automations", "user-roles-permissions"],
    body: [
      "Recruit is admissions CRM. Admit is applications and fees. Teach is the LMS. Administer is the SIS — transcripts, degree audit, online registration, IPEDS and custom reporting. That is the records half of this Office.",
      "Aid is federal Title IV. NSBT does not participate today; the capability is built in if the institution ever pursues it. Account is automated billing, payment plans, enrollment agreements, aging, accounting exports — the accounts half of this Office. Advance is donors and alumni.",
      "They share one student profile. That is the consolidation thesis. You do not need a second system.",
    ],
  },
];

export function articleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function articlesForDesk(desk: "it" | "records" | "combined") {
  if (desk === "combined") return articles;
  return articles.filter((a) => a.desk === desk || a.desk === "shared");
}
