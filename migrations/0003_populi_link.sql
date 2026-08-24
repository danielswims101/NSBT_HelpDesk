-- Live Populi API link. The key is encrypted at rest. Never select it for the client.

create table if not exists populi_link (
  id text primary key default 'nsbt',
  key_cipher text,
  key_iv text,
  key_tag text,
  key_last4 text,
  key_set_at timestamptz,
  key_set_by text,
  last_ok_at timestamptz,
  last_error text,
  webhook_secret text
);

insert into populi_link (id) values ('nsbt') on conflict (id) do nothing;

create table if not exists populi_pulls (
  id text primary key,
  kind text not null,
  pulled_at timestamptz not null default now(),
  pulled_by text not null,
  summary text not null,
  payload jsonb not null,
  check_ok boolean
);

create index if not exists populi_pulls_kind_idx on populi_pulls (kind, pulled_at desc);
