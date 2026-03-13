/**
 * Format a number as Philippine Peso currency
 * @param amount - The numeric amount to format
 * @param decimals - Number of decimal places (default: 0 for whole pesos)
 * @returns Formatted string like ₱420,000
 */
export function formatCurrency(amount: number, decimals = 0): string {
    return `₱${amount.toLocaleString('en-PH', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
}

/**
 * Format a number as Philippine Peso with 2 decimal places
 */
export function formatCurrencyDetailed(amount: number): string {
    return formatCurrency(amount, 2);
}

/**
 * Parse a currency string back to a number
 */
export function parseCurrency(value: string): number {
    return parseFloat(value.replace(/[₱,]/g, '')) || 0;
}
