import { NSBT, POPULI } from "@/lib/populi";
import type { DirectoryPerson } from "@/lib/types";

export const directory: DirectoryPerson[] = [
  {
    name: NSBT.lead,
    title: "Nameless — the person the answers are for",
    desk: "shared",
    email: "jlim@nsbt.org",
    notes: NSBT.leadNote,
  },
  {
    name: "Randy Whittaker",
    title: "Director of IT · Director, Office of Student Records and Accounts",
    desk: "shared",
    email: "it@nsbt.org",
    notes:
      "You. You administer Populi. You are custodian of student records and the FERPA officer for those records. There is no Registrar and no Bursar. The master worksheet (71–78) is the emergency. One screen-share — not a ticket per line.",
  },
  {
    name: "Angela White",
    title: "Partner on every worksheet item",
    desk: "shared",
    email: "awhite20@nsbt.org",
    notes:
      "Talk each card through before and after he pulls it. She coordinates admissions records. She is not the person the answers are for.",
  },
  {
    name: NSBT.deanIE,
    title: "Co-supervisor of the Office",
    desk: "shared",
    email: "dirvin@nsbt.org",
    notes:
      "One of two people you report to. Academic exceptions, program questions, and all-years institutional data (71, persistence, achievement). A one-year file is not an answer.",
  },
  {
    name: NSBT.academicDean,
    title: "Co-supervisor · admissions and academics",
    desk: "shared",
    email: NSBT.admissionsEmail,
    notes:
      "Admissions records, faculty who will not finalize, silent stop-outs, time-to-degree exceptions. Search the admissions profile before you create a person.",
  },
  {
    name: NSBT.strategic,
    title: "Institutional planning — judges the all-years files",
    desk: "shared",
    notes:
      "Gets the term inventory, 71 (every cohort), and 72 (now + 2024 + 2025). A one-year file is sent back. Use the Deans & Strategic page for the send-back note.",
  },
  {
    name: NSBT.evp,
    title: "Institutional oversight — compliance and governance",
    desk: "shared",
    notes:
      "Accreditation correspondence is forwarded here. You have no standing authorization to represent NSBT to an accreditor. The EVP may issue directives on compliance.",
  },
  {
    name: NSBT.comptroller,
    title: "Refunds, bank rec, annual statements",
    desk: "records",
    notes:
      "You keep the Populi ledger. The Comptroller gets financial schedules on request and partners on refunds that leave the institution. Do not invent a card refund without that coordination.",
  },
  {
    name: "Director of Information Literacy",
    title: "Online learning orientation & DTL",
    desk: "it",
    notes:
      "DTL credentials and the student introduction to the online campus. Not a substitute for a Populi account. DTL problems are not Populi tickets.",
  },
  {
    name: POPULI.accountContact,
    title: POPULI.accountRole,
    desk: "external",
    email: POPULI.accountEmail,
    phone: POPULI.accountPhone,
    notes:
      "Custom automations, transcript layouts, Zapier invite, enrollment-agreement setup. One build-order packet from the Automate screen — never a new ticket for every letter you wish existed.",
  },
  {
    name: "Populi Support",
    title: "Vendor — defects and paid configuration only",
    desk: "external",
    email: POPULI.supportEmail,
    phone: POPULI.supportPhone,
    notes: `${POPULI.hours}. ${POPULI.hoursNote} Use the Escalation gate for defects. Use Automate for a configuration packet. Never a how-to. Never a second ticket for the same issue.`,
  },
  {
    name: "NSBT main line",
    title: "Institution",
    desk: "external",
    phone: NSBT.phone,
    notes: `${NSBT.address} · ${NSBT.site} · campus ${POPULI.campusUrl}`,
  },
];
