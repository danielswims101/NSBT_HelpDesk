export type NextJob = {
  id: string;
  title: string;
  why: string;
  how: string;
  doneWhen: string;
};

/** What to finish now that the API key is on file. */
export const nextJobs: NextJob[] = [
  {
    id: "webhooks",
    title: "Add three notices in Populi",
    why: "When a student enrolls, pays, or asks for a transcript, this desk should hear about it automatically.",
    how: "In Populi: Account → Webhooks → Add Webhook. Add the three events listed on the Populi link page. First box is only the event name. The web address is on the next screen. Change GET to POST.",
    doneWhen: "All three notices exist and point at this desk’s webhook address.",
  },
  {
    id: "plans",
    title: "Write four standard emails",
    why: "Populi can send registration, invoice, enrollment-agreement, and transcript messages itself. You do not need a new system for that.",
    how: "In Populi: Communications → Templates, then Communications → Communication Plans. Ask the Academic Dean for the legal enrollment-agreement wording. Do not write that yourself.",
    doneWhen: "The four plans exist and use the school mailbox, not a personal Gmail.",
  },
  {
    id: "locks",
    title: "List the locks this office uses",
    why: "A lock stops registration, a transcript, or a course. We still sometimes call them holds. Name the ones we actually use before anyone asks Support to automate them.",
    how: "Open a student profile → Add a lock. The built-in types are Registration, Grades/Transcript, Financial Lock, and Course. Write down which ones we use and who may lift each.",
    doneWhen: "The list is written and the billing threshold is agreed.",
  },
  {
    id: "saved-reports",
    title: "Save the all-years reports",
    why: "If a report has no year filter, it cannot accidentally become “this term only.” Save it once so next month’s pull is the same pull.",
    how: "In Populi: Academics → Reporting → Data Slicer → Actions → Save Report. Save: NSBT Term Inventory, one report per entering class, NSBT Active Headcount, NSBT Conferrals All Years.",
    doneWhen: "Those saved names exist and a dean can open them.",
  },
];

export const commonMistakes = [
  {
    wrong: "Populi has a ChatGPT button inside it.",
    right: "It does not. Populi has automations, email plans, webhooks, and an API. This desk is how we use those.",
  },
  {
    wrong: "Send a student list to a public AI chatbot.",
    right: "That is a FERPA problem. Keep student rows on this desk or in Populi.",
  },
  {
    wrong: "Pull only the year that is open on screen.",
    right: "A school-wide pull means every year on campus. Start with “Pull every term.”",
  },
  {
    wrong: "Open a new Populi Support ticket for every how-to.",
    right: "Look it up here first. Use Ask Populi Support only for things staff cannot turn on alone.",
  },
];
