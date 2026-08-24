import { Badge } from "@/components/ui/badge";
import type { TicketPriority, TicketStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const map: Record<TicketStatus, { label: string; tone: "neutral" | "ok" | "warn" | "danger" | "info" | "mute" }> = {
    open: { label: "Open", tone: "info" },
    in_progress: { label: "In progress", tone: "neutral" },
    waiting_populi: { label: "Waiting on Populi", tone: "warn" },
    waiting_requester: { label: "Waiting on requester", tone: "mute" },
    resolved: { label: "Resolved", tone: "ok" },
    closed: { label: "Closed", tone: "mute" },
  };
  const { label, tone } = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const map: Record<TicketPriority, { label: string; tone: "neutral" | "ok" | "warn" | "danger" | "info" | "mute" }> = {
    low: { label: "Low", tone: "mute" },
    normal: { label: "Normal", tone: "neutral" },
    high: { label: "High", tone: "warn" },
    urgent: { label: "Urgent", tone: "danger" },
  };
  const { label, tone } = map[priority];
  return <Badge tone={tone}>{label}</Badge>;
}
