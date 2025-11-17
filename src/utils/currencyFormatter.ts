/**
 * Format a number as Indian Rupee currency with comma separators
 * @param value - The number to format
 * @returns Formatted string with ₹ symbol and comma separators (e.g., "₹ 1,50,000")
 */
export const formatCurrency = (value: number | string): string => {
  if (value === '' || value === undefined || value === null) {
    return '₹ 0';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '₹ 0';
  }

  // Convert to integer for formatting (removing decimals if any)
  const intValue = Math.floor(numValue);

  // Use Indian locale formatting
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(intValue);

  return `₹ ${formatted}`;
};

/**
 * Format a number as Indian Rupee currency for display purposes only
 * @param value - The number to format
 * @returns Formatted string with ₹ symbol and comma separators
 */
export const displayCurrency = (value: number | string | undefined): string => {
  if (value === '' || value === undefined || value === null) {
    return '₹ 0';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '₹ 0';
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(numValue);

  return `₹ ${formatted}`;
};
