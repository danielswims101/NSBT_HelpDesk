import { ADMIN_EMAILS } from "@/lib/admin-allowlist";

export const staffRoles = [
  {
    who: "it@nsbt.org",
    does: "Director of IT. Same desk as everyone else.",
    opens: "Home · Ask the desk",
  },
  {
    who: "jlim@nsbt.org",
    does: "Named NSBT administrator.",
    opens: "Home · Ask the desk",
  },
  {
    who: "dirvin@nsbt.org",
    does: "Named NSBT administrator.",
    opens: "Home · Ask the desk",
  },
  {
    who: "ochaparro@nsbt.org",
    does: "Academic Dean and Director of Admissions.",
    opens: "Home · Ask the desk",
  },
  {
    who: "awhite20@nsbt.org",
    does: "Admissions. Same desk as everyone else.",
    opens: "Home · Ask the desk",
  },
  {
    who: "dbtagoe@nsbt.org",
    does: "Named NSBT administrator.",
    opens: "Home · Ask the desk",
  },
  {
    who: "studentservices@nsbt.org",
    does: "Office mailbox. Same desk as everyone else.",
    opens: "Home · Ask the desk",
  },
];

export const staffRules = [
  "Sign in only with one of the official @nsbt.org Google accounts listed above.",
  "Everyone on this list gets the same Home: read-only Populi pulls.",
  "Any other Google account or personal Gmail is refused.",
  "Students never see this desk. It is not a page on nsbt.org.",
  "A file you download here is still a student record. Treat it that way.",
];

export { ADMIN_EMAILS };
