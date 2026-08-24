import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { formatTicketId } from "@/lib/populi";
import type {
  Desk,
  RequesterRole,
  Ticket,
  TicketComment,
  TicketPriority,
  TicketStatus,
} from "@/lib/types";

type TicketRow = {
  id: string;
  title: string;
  description: string;
  desk: string;
  category: string;
  priority: string;
  status: string;
  requester_name: string;
  requester_email: string;
  requester_role: string;
  student_ref: string | null;
  populi_module: string | null;
  ferpa: boolean;
  created_by: string;
  created_by_name: string;
  assigned_to: string | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
};

type CommentRow = {
  id: string;
  ticket_id: string;
  author_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

function mapTicket(row: TicketRow): Ticket {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    desk: row.desk as Desk,
    category: row.category,
    priority: row.priority as TicketPriority,
    status: row.status as TicketStatus,
    requesterName: row.requester_name,
    requesterEmail: row.requester_email,
    requesterRole: row.requester_role as RequesterRole,
    studentRef: row.student_ref,
    populiModule: row.populi_module,
    ferpa: Boolean(row.ferpa),
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    assignedTo: row.assigned_to,
    resolution: row.resolution,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapComment(row: CommentRow): TicketComment {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    authorId: row.author_id,
    authorName: row.author_name,
    body: row.body,
    createdAt: String(row.created_at),
  };
}

const ticketSelect = `
  id, title, description, desk, category, priority, status,
  requester_name, requester_email, requester_role, student_ref, populi_module,
  ferpa, created_by, created_by_name, assigned_to, resolution,
  created_at::text as created_at, updated_at::text as updated_at
`;

export const listTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const rows = await sql.query<TicketRow>(
      `select ${ticketSelect} from tickets order by updated_at desc`,
    );
    return rows.map(mapTicket);
  });

export const getTicket = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    const rows = await sql.query<TicketRow>(
      `select ${ticketSelect} from tickets where id = $1`,
      [id],
    );
    const ticket = rows[0] ? mapTicket(rows[0]) : null;
    if (!ticket) return { ticket: null, comments: [] as TicketComment[] };
    const comments = await sql.query<CommentRow>(
      `select id, ticket_id, author_id, author_name, body, created_at::text as created_at
       from ticket_comments where ticket_id = $1 order by created_at asc`,
      [id],
    );
    return { ticket, comments: comments.map(mapComment) };
  });

export type NewTicketInput = {
  title: string;
  description: string;
  desk: Desk;
  category: string;
  priority: TicketPriority;
  requesterName: string;
  requesterEmail: string;
  requesterRole: RequesterRole;
  studentRef?: string;
  populiModule?: string;
  ferpa: boolean;
  assignedTo?: string;
  authorName: string;
};

export const createTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: NewTicketInput) => input)
  .handler(async ({ context, data }) => {
    const title = data.title.trim();
    const description = data.description.trim();
    if (!title || !description) throw new Error("Title and description are required.");
    const sql = await getSql();
    const seq = await sql.query<{ value: number }>(
      `update ticket_seq set value = value + 1 where name = 'tickets' returning value`,
    );
    const n = Number(seq[0]?.value ?? Date.now() % 100000);
    const id = formatTicketId(n);
    await sql.query(
      `insert into tickets (
        id, title, description, desk, category, priority, status,
        requester_name, requester_email, requester_role, student_ref, populi_module,
        ferpa, created_by, created_by_name, assigned_to
      ) values ($1,$2,$3,$4,$5,$6,'open',$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        id,
        title,
        description,
        data.desk,
        data.category,
        data.priority,
        data.requesterName.trim(),
        data.requesterEmail.trim(),
        data.requesterRole,
        data.studentRef?.trim() || null,
        data.populiModule?.trim() || null,
        data.ferpa,
        context.userId,
        data.authorName.trim() || "Staff",
        data.assignedTo?.trim() || null,
      ],
    );
    return { id };
  });

export type UpdateTicketInput = {
  id: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string | null;
  resolution?: string | null;
  desk?: Desk;
};

export const updateTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: UpdateTicketInput) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const current = await sql.query<TicketRow>(
      `select ${ticketSelect} from tickets where id = $1`,
      [data.id],
    );
    if (!current[0]) throw new Error("Ticket not found.");
    const next = {
      status: data.status ?? current[0].status,
      priority: data.priority ?? current[0].priority,
      assignedTo:
        data.assignedTo === undefined ? current[0].assigned_to : data.assignedTo,
      resolution:
        data.resolution === undefined ? current[0].resolution : data.resolution,
      desk: data.desk ?? current[0].desk,
    };
    await sql.query(
      `update tickets set status = $2, priority = $3, assigned_to = $4, resolution = $5, desk = $6, updated_at = now()
       where id = $1`,
      [data.id, next.status, next.priority, next.assignedTo, next.resolution, next.desk],
    );
    return { ok: true };
  });

export const addComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { ticketId: string; body: string; authorName: string }) => input)
  .handler(async ({ context, data }) => {
    const body = data.body.trim();
    if (!body) throw new Error("Comment cannot be empty.");
    const sql = await getSql();
    const id = `cmt-${crypto.randomUUID()}`;
    await sql.query(
      `insert into ticket_comments (id, ticket_id, author_id, author_name, body)
       values ($1,$2,$3,$4,$5)`,
      [id, data.ticketId, context.userId, data.authorName.trim() || "Staff", body],
    );
    await sql.query(`update tickets set updated_at = now() where id = $1`, [data.ticketId]);
    return { id };
  });
