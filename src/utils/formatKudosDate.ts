/**
 * Format an ISO-8601 date string to "HH:mm - MM/DD/YYYY" format (FR-012).
 */
export function formatKudosDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} - ${month}/${day}/${year}`;
}
