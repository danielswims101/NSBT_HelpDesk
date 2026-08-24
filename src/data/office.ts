import { NSBT } from "@/lib/populi";

export const officeFunctions: {
  id: string;
  letter: string;
  title: string;
  items: string[];
}[] = [
  {
    id: "academic-records",
    letter: "A",
    title: "Student academic records",
    items: [
      "Custody, accuracy, integrity, and privacy of every academic record.",
      "You are the FERPA compliance officer for student records.",
      "Transcripts, enrollment verifications, degree audits, graduation clearance, conferral, alumni academic records.",
    ],
  },
  {
    id: "enrollment",
    letter: "B",
    title: "Enrollment and admissions records",
    items: [
      "Process and maintain admissions and enrollment records with the Academic Dean and Director of Admissions.",
      "Monitor and report registration holds (Populi locks) that block enrollment.",
    ],
  },
  {
    id: "calendar",
    letter: "C",
    title: "Academic calendar and course records",
    items: [
      "Build and maintain NSBT’s five-session academic calendar in Populi.",
      "Course, section, and grade records stay current on the offering — not in a side spreadsheet.",
    ],
  },
  {
    id: "accounts",
    letter: "D",
    title: "Student accounts",
    items: [
      "Billing, tuition, and payment records in Populi. Tuition schedules fire from registration.",
      "Reconcile the payment platform against the Populi ledger.",
      "Unapplied funds, partial payments, and session-to-session credits follow the Student Handbook.",
      "Refunds with the Comptroller. Monitor and report billing holds that block enrollment.",
    ],
  },
  {
    id: "financial-data",
    letter: "E",
    title: "Financial data and reporting",
    items: [
      "Answer the Comptroller and the Executive Vice President promptly and completely.",
      "Supporting schedules for annual statements and audit support. Export them yourself.",
    ],
  },
  {
    id: "governance",
    letter: "F",
    title: "Data governance and institutional reporting",
    items: [
      "Program enrollment statistics. Compliance reporting to leadership.",
      "Student records live only in institutional systems. No personal Drive, no laptop folder as the record.",
    ],
  },
];

export const officeFacts = {
  name: NSBT.office,
  channel: NSBT.officeEmail,
  system: "Populi is the system of record for enrollment, grades, transcripts, conferral, and accounts.",
  authority:
    "You execute every function of the Office with full authority, under co-supervision of the Dean of Institutional Effectiveness and Academic Programs and the Academic Dean and Director of Admissions.",
  oversight: "The Executive Vice President retains oversight for compliance and governance and may issue directives on those matters.",
  supportStaff:
    "Assigned administrative support works at your direction. Support has no delegated authority, no custody of records, and no discretion of the Office.",
  accreditation:
    "You have no standing authorization to represent NSBT to an accreditor. Forward accrediting-body mail to the Executive Vice President.",
};
