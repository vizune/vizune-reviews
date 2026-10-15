const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** e.g. "12 Apr 2025" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : dateFormat.format(d);
}

/** Two-digit card number, e.g. 1 → "01" */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
