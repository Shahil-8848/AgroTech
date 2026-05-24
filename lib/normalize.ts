/** Map ASP.NET JSON (PascalCase or camelCase) to a consistent shape. */

export function pickString(
  raw: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const v = raw[key];
    if (typeof v === 'string') return v;
  }
  return '';
}

export function pickNumber(
  raw: Record<string, unknown>,
  ...keys: string[]
): number {
  for (const key of keys) {
    const v = raw[key];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string' && v !== '') {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function asRecordArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asRecord(item));
}
