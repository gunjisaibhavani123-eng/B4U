const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return '\u20B90';
  return formatter.format(amount);
};

export const formatCurrencyShort = (amount) => {
  if (amount == null || isNaN(amount)) return '\u20B90';
  if (amount >= 100000) return `\u20B9${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `\u20B9${(amount / 1000).toFixed(1)}K`;
  return formatCurrency(amount);
};
