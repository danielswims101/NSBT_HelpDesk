import { formatDistanceToNowStrict, parseISO } from "date-fns";

export function relativeTime(value: string) {
  try {
    const d = value.includes("T") ? parseISO(value.replace(" ", "T")) : new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return `${formatDistanceToNowStrict(d)} ago`;
  } catch {
    return value;
  }
}

export function shortDate(value: string) {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  } catch {
    return value;
  }
}
