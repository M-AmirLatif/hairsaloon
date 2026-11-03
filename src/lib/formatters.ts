/**
 * Currency and text formatting utilities
 */

/**
 * Format amounts in Pakistani Rupees (PKR)
 * e.g. 700 -> "Rs. 700"
 */
export function formatPKR(amount: number, from: boolean = false): string {
  const formatted = new Intl.NumberFormat('en-PK', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount);

  return from ? `From Rs. ${formatted}` : `Rs. ${formatted}`;
}
