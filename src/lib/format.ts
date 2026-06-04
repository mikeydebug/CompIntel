export function formatTC(amountLPA: number): string {
  if (amountLPA < 0) return '₹0';
  
  if (amountLPA >= 100) {
    const cr = amountLPA / 100;
    // Format to 1 decimal place, e.g., 1.2Cr
    return `₹${Number.isInteger(cr) ? cr : cr.toFixed(1)}Cr`;
  }
  
  // Format to 1 decimal place, e.g., 12.5L
  return `₹${Number.isInteger(amountLPA) ? amountLPA : amountLPA.toFixed(1)}L`;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
