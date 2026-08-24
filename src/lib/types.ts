export type Desk = "it" | "records" | "shared";
export type DeskView = "it" | "records" | "combined";

export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_populi"
  | "waiting_requester"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "normal" | "high" | "urgent";

export type RequesterRole = "student" | "faculty" | "staff" | "alumni" | "applicant";

export type Ticket = {
  id: string;
  title: string;
  description: string;
  desk: Desk;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  requesterName: string;
  requesterEmail: string;
  requesterRole: RequesterRole;
  studentRef: string | null;
  populiModule: string | null;
  ferpa: boolean;
  createdBy: string;
  createdByName: string;
  assignedTo: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TicketComment = {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type Article = {
  slug: string;
  title: string;
  desk: Desk;
  category: string;
  summary: string;
  minutes: number;
  tags: string[];
  populiPath?: string;
  related: string[];
  steps?: { title: string; body: string }[];
  body: string[];
  watchouts?: string[];
  escalateWhen?: string[];
};

export type Runbook = {
  slug: string;
  title: string;
  desk: Desk;
  when: string;
  sla: string;
  owner: string;
  steps: { action: string; detail: string; verify?: string }[];
  escalate: string;
};

export type DirectoryPerson = {
  name: string;
  title: string;
  desk: Desk | "external";
  email?: string;
  phone?: string;
  notes: string;
};
