/**
 * Date and Time utilities for local salon booking
 */

/**
 * Parses time string like "11:00 AM" or "11:30 PM" into minutes from midnight (0 - 1439).
 */
export function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Formats minutes from midnight to "hh:mm A" string
 */
export function formatMinutesToTime(minutesFromMidnight: number): string {
  const hours24 = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minPad = minutes.toString().padStart(2, '0');
  return `${hours12}:${minPad} ${period}`;
}

/**
 * Generates available appointment slots between open time and close time.
 * Cutoff is strictly before the closing time.
 */
export function generateTimeSlots(
  openTimeStr: string = '11:00 AM',
  closeTimeStr: string = '11:30 PM',
  intervalMinutes: number = 30
): string[] {
  const startMin = parseTimeToMinutes(openTimeStr);
  const closeMin = parseTimeToMinutes(closeTimeStr);

  const slots: string[] = [];
  // Slots must be strictly before close time
  for (let m = startMin; m < closeMin; m += intervalMinutes) {
    slots.push(formatMinutesToTime(m));
  }
  return slots;
}

/**
 * Validates that a requested time is strictly before closing time.
 */
export function isTimeBeforeClosing(timeStr: string, closingTimeStr: string = '11:30 PM'): boolean {
  const requestedMin = parseTimeToMinutes(timeStr);
  const closingMin = parseTimeToMinutes(closingTimeStr);
  return requestedMin < closingMin;
}

/**
 * Returns today's date in YYYY-MM-DD format for date input `min` attribute.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a date 30 days ahead for date input `max` attribute.
 */
export function getMaxBookingDateString(daysAhead: number = 30): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a YYYY-MM-DD date string into a friendly, readable format:
 * e.g. "2026-11-04" -> "Wednesday, November 4, 2026"
 */
export function formatHumanDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
