-- NSBT Populi Desk — shared ticket queue for IT and Student Records.

create table if not exists tickets (
  id text primary key,
  title text not null,
  description text not null,
  desk text not null,
  category text not null,
  priority text not null,
  status text not null,
  requester_name text not null,
  requester_email text not null,
  requester_role text not null,
  student_ref text,
  populi_module text,
  ferpa boolean not null default true,
  created_by text not null,
  created_by_name text not null,
  assigned_to text,
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tickets_status_idx on tickets (status);
create index if not exists tickets_desk_idx on tickets (desk);
create index if not exists tickets_updated_idx on tickets (updated_at desc);

create table if not exists ticket_comments (
  id text primary key,
  ticket_id text not null references tickets(id) on delete cascade,
  author_id text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists ticket_comments_ticket_idx on ticket_comments (ticket_id, created_at);

create table if not exists ticket_seq (
  name text primary key,
  value integer not null
);

insert into ticket_seq (name, value) values ('tickets', 1055)
on conflict (name) do nothing;

insert into tickets (
  id, title, description, desk, category, priority, status,
  requester_name, requester_email, requester_role, student_ref, populi_module,
  ferpa, created_by, created_by_name, assigned_to, resolution, created_at, updated_at
) values
(
  'NSBT-1048',
  'Alumnus locked out — unofficial transcript needed today',
  'M.Div. 2019 alumnus reports nsbt.populiweb.com rejects the password. Needs unofficial transcript for a chaplaincy board this afternoon. Personal Gmail on file may be stale; last login was 2022.',
  'it',
  'Access',
  'high',
  'in_progress',
  'Rev. Samuel Okoye',
  'sokoye@example.com',
  'alumni',
  'A-2019-084',
  'User account',
  true,
  'system',
  'Desk seed',
  'Director of IT',
  null,
  now() - interval '3 hours',
  now() - interval '25 minutes'
),
(
  'NSBT-1049',
  'Bursar hold blocking Fall Session 1 registration',
  'Student can sign in. Register button returns a financial hold. Ledger still shows last session’s course after a documented withdrawal email on 12 June. Possible missing credit.',
  'records',
  'Billing',
  'high',
  'open',
  'Hannah Ruiz',
  'hruiz@example.com',
  'student',
  'S-2024-117',
  'Financial → Billing',
  true,
  'system',
  'Desk seed',
  'Director of Student Records and Accounts',
  null,
  now() - interval '1 day',
  now() - interval '2 hours'
),
(
  'NSBT-1050',
  'Faculty cannot see THEO 510 offering',
  'Adjunct is listed in the global Faculty list and has the Faculty role. Current session offering THEO 510 does not appear under My Courses. Syllabus names her as instructor.',
  'it',
  'Academics',
  'urgent',
  'waiting_requester',
  'Dr. Miriam Chen',
  'mchen@nsbt.org',
  'faculty',
  null,
  'Academics → Offering → Faculty',
  false,
  'system',
  'Desk seed',
  'Director of IT',
  null,
  now() - interval '6 hours',
  now() - interval '40 minutes'
),
(
  'NSBT-1051',
  'Official transcript — sending church (FERPA release on file)',
  'Request form received. Destination: sending-church registrar. Confirm no hold and that Spring incomplete was resolved before release.',
  'records',
  'Records',
  'normal',
  'open',
  'Jonathan Hale',
  'jhale@example.com',
  'student',
  'S-2023-041',
  'Profile → Student → Transcript',
  true,
  'system',
  'Desk seed',
  null,
  null,
  now() - interval '2 days',
  now() - interval '2 days'
),
(
  'NSBT-1052',
  'Possible duplicate profile after second application',
  'Admissions created a new application under a maiden name. Existing student profile has two paid sessions. Do not enroll on the new profile.',
  'shared',
  'Data',
  'high',
  'waiting_populi',
  'Admissions desk',
  'ochaparro@nsbt.org',
  'staff',
  'S-2025-009',
  'People / merge',
  true,
  'system',
  'Desk seed',
  'Director of IT',
  null,
  now() - interval '5 hours',
  now() - interval '1 hour'
),
(
  'NSBT-1053',
  'Withdrawal email received — need W and refund calc',
  'Student emailed studentservices@nsbt.org at 09:14 ET to withdraw from PAST 620 after week 4. Instructor was already notified by the student; that does not start the clock. Need roster W + pro-rate.',
  'records',
  'Registration',
  'normal',
  'in_progress',
  'Caleb Wright',
  'cwright@example.com',
  'student',
  'S-2024-203',
  'Offering roster / Billing',
  true,
  'system',
  'Desk seed',
  'Director of Student Records and Accounts',
  null,
  now() - interval '4 hours',
  now() - interval '50 minutes'
),
(
  'NSBT-1054',
  'Reset mail not arriving — three students, same hour',
  'Three unrelated new students report no Populi mail since 13:40 ET. Spam checked. Addresses on profiles verified. Treating as possible campus-wide mail defect.',
  'it',
  'Communications',
  'urgent',
  'waiting_populi',
  'Director of IT',
  'it@nsbt.org',
  'staff',
  null,
  'Communications',
  false,
  'system',
  'Desk seed',
  'Director of IT',
  null,
  now() - interval '90 minutes',
  now() - interval '20 minutes'
),
(
  'NSBT-1055',
  'DTL access after Populi login works',
  'Student reaches Populi and the tutorial course. Digital Theological Library still rejects credentials. Matriculated this week. Needs Information Literacy handoff, not a second Populi account.',
  'it',
  'Access',
  'normal',
  'open',
  'Priya Raman',
  'praman@example.com',
  'student',
  'S-2026-014',
  'External — DTL',
  true,
  'system',
  'Desk seed',
  null,
  null,
  now() - interval '8 hours',
  now() - interval '8 hours'
)
on conflict (id) do nothing;

insert into ticket_comments (id, ticket_id, author_id, author_name, body, created_at) values
(
  'cmt-1048-1',
  'NSBT-1048',
  'system',
  'Desk seed',
  'Searched People — one profile. User account exists. Reset sent to the Gmail on file. Waiting for alumnus to check spam and reply.',
  now() - interval '25 minutes'
),
(
  'cmt-1050-1',
  'NSBT-1050',
  'system',
  'Desk seed',
  'Faculty role confirmed. She is not on the THEO 510 offering faculty tab. Asked Academic Dean to confirm the hire before adding her — do not guess the section.',
  now() - interval '40 minutes'
),
(
  'cmt-1054-1',
  'NSBT-1054',
  'system',
  'Desk seed',
  'Reproduced on a second network. Escalation packet drafted for Populi Support. Do not open a second vendor ticket.',
  now() - interval '20 minutes'
)
on conflict (id) do nothing;
