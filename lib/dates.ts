export function formatApiDateTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

/** ISO string for API booking payloads (UTC). */
export function toApiDateTime(date: Date): string {
  return date.toISOString();
}
