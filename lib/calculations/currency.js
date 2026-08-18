/**
 * currency.js — Pure currency conversion math and currency definitions
 */

export const POPULAR_CURRENCIES = [
  { code: "USD", name: "USD - US Dollar", symbol: "$" },
  { code: "EUR", name: "EUR - Euro", symbol: "€" },
  { code: "GBP", name: "GBP - British Pound", symbol: "£" },
  { code: "JPY", name: "JPY - Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "AUD - Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "CAD - Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "CHF - Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "CNY - Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "INR - Indian Rupee", symbol: "₹" },
  { code: "BRL", name: "BRL - Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "MXN - Mexican Peso", symbol: "Mex$" },
  { code: "SGD", name: "SGD - Singapore Dollar", symbol: "S$" },
  { code: "NZD", name: "NZD - New Zealand Dollar", symbol: "NZ$" },
  { code: "ZAR", name: "ZAR - South African Rand", symbol: "R" },
  { code: "HKD", name: "HKD - Hong Kong Dollar", symbol: "HK$" },
];

export const ALL_CURRENCIES = [
  ...POPULAR_CURRENCIES,
  { code: "AED", name: "AED - UAE Dirham", symbol: "د.إ" },
  { code: "ARS", name: "ARS - Argentine Peso", symbol: "$" },
  { code: "CLP", name: "CLP - Chilean Peso", symbol: "$" },
  { code: "COP", name: "COP - Colombian Peso", symbol: "$" },
  { code: "CZK", name: "CZK - Czech Koruna", symbol: "Kč" },
  { code: "DKK", name: "DKK - Danish Krone", symbol: "kr" },
  { code: "EGP", name: "EGP - Egyptian Pound", symbol: "E£" },
  { code: "IDR", name: "IDR - Indonesian Rupiah", symbol: "Rp" },
  { code: "ILS", name: "ILS - Israeli Shekel", symbol: "₪" },
  { code: "KRW", name: "KRW - South Korean Won", symbol: "₩" },
  { code: "MYR", name: "MYR - Malaysian Ringgit", symbol: "RM" },
  { code: "NOK", name: "NOK - Norwegian Krone", symbol: "kr" },
  { code: "PHP", name: "PHP - Philippine Peso", symbol: "₱" },
  { code: "PLN", name: "PLN - Polish Zloty", symbol: "zł" },
  { code: "RON", name: "RON - Romanian Leu", symbol: "lei" },
  { code: "SAR", name: "SAR - Saudi Riyal", symbol: "﷼" },
  { code: "SEK", name: "SEK - Swedish Krona", symbol: "kr" },
  { code: "THB", name: "THB - Thai Baht", symbol: "฿" },
  { code: "TRY", name: "TRY - Turkish Lira", symbol: "₺" },
  { code: "TWD", name: "TWD - New Taiwan Dollar", symbol: "NT$" },
  { code: "VND", name: "VND - Vietnamese Dong", symbol: "₫" },
];

/**
 * Convert Currency using rates table (base USD)
 */
export function convertCurrency(amountStr, fromCode, toCode, rates) {
  const amt = parseFloat(amountStr);
  if (isNaN(amt) || !rates) return null;

  if (fromCode === toCode) return amt;

  const rateFrom = rates[fromCode];
  const rateTo = rates[toCode];

  if (!rateFrom || !rateTo) return null;

  // Convert fromCode to USD, then USD to toCode
  const usdVal = amt / rateFrom;
  const result = usdVal * rateTo;

  return Math.round(result * 100) / 100;
}

/**
 * Custom Rate Conversion
 */
export function convertCustomRate(amountStr, rateStr) {
  const amt = parseFloat(amountStr);
  const rate = parseFloat(rateStr);

  if (isNaN(amt) || isNaN(rate)) return null;

  return Math.round(amt * rate * 100) / 100;
}
