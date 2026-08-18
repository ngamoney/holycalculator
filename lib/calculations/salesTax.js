/**
 * salesTax.js — Sales Tax Calculation Engine for Holy Calculator
 *
 * Provides:
 *  - 50-State + DC + US Territory Sales Tax Rate Dataset (General State Rate, Max Local Rate, Max Combined Rate)
 *  - Solver math: Calculate After-Tax Price, Before-Tax Price, or Sales Tax Rate
 *  - Input validation & formatting helpers
 */

export const STATE_SALES_TAX_RATES = [
  { code: "AL", name: "Alabama", stateRate: 4.00, maxLocalRate: 7.50, maxCombinedRate: 11.50 },
  { code: "AK", name: "Alaska", stateRate: 0.00, maxLocalRate: 7.50, maxCombinedRate: 7.50 },
  { code: "AZ", name: "Arizona", stateRate: 5.60, maxLocalRate: 5.60, maxCombinedRate: 11.20 },
  { code: "AR", name: "Arkansas", stateRate: 6.50, maxLocalRate: 6.125, maxCombinedRate: 12.625 },
  { code: "CA", name: "California", stateRate: 7.25, maxLocalRate: 3.50, maxCombinedRate: 10.75 },
  { code: "CO", name: "Colorado", stateRate: 2.90, maxLocalRate: 8.30, maxCombinedRate: 11.20 },
  { code: "CT", name: "Connecticut", stateRate: 6.35, maxLocalRate: 0.00, maxCombinedRate: 6.35 },
  { code: "DE", name: "Delaware", stateRate: 0.00, maxLocalRate: 0.00, maxCombinedRate: 0.00 },
  { code: "FL", name: "Florida", stateRate: 6.00, maxLocalRate: 2.00, maxCombinedRate: 8.00 },
  { code: "GA", name: "Georgia", stateRate: 4.00, maxLocalRate: 5.00, maxCombinedRate: 9.00 },
  { code: "HI", name: "Hawaii", stateRate: 4.00, maxLocalRate: 0.50, maxCombinedRate: 4.50 },
  { code: "ID", name: "Idaho", stateRate: 6.00, maxLocalRate: 3.00, maxCombinedRate: 9.00 },
  { code: "IL", name: "Illinois", stateRate: 6.25, maxLocalRate: 4.75, maxCombinedRate: 11.00 },
  { code: "IN", name: "Indiana", stateRate: 7.00, maxLocalRate: 0.00, maxCombinedRate: 7.00 },
  { code: "IA", name: "Iowa", stateRate: 6.00, maxLocalRate: 1.00, maxCombinedRate: 7.00 },
  { code: "KS", name: "Kansas", stateRate: 6.50, maxLocalRate: 4.00, maxCombinedRate: 10.50 },
  { code: "KY", name: "Kentucky", stateRate: 6.00, maxLocalRate: 0.00, maxCombinedRate: 6.00 },
  { code: "LA", name: "Louisiana", stateRate: 4.45, maxLocalRate: 7.00, maxCombinedRate: 11.45 },
  { code: "ME", name: "Maine", stateRate: 5.50, maxLocalRate: 0.00, maxCombinedRate: 5.50 },
  { code: "MD", name: "Maryland", stateRate: 6.00, maxLocalRate: 0.00, maxCombinedRate: 6.00 },
  { code: "MA", name: "Massachusetts", stateRate: 6.25, maxLocalRate: 0.00, maxCombinedRate: 6.25 },
  { code: "MI", name: "Michigan", stateRate: 6.00, maxLocalRate: 0.00, maxCombinedRate: 6.00 },
  { code: "MN", name: "Minnesota", stateRate: 6.875, maxLocalRate: 2.00, maxCombinedRate: 8.875 },
  { code: "MS", name: "Mississippi", stateRate: 7.00, maxLocalRate: 1.00, maxCombinedRate: 8.00 },
  { code: "MO", name: "Missouri", stateRate: 4.225, maxLocalRate: 5.763, maxCombinedRate: 9.988 },
  { code: "MT", name: "Montana", stateRate: 0.00, maxLocalRate: 3.00, maxCombinedRate: 3.00 },
  { code: "NE", name: "Nebraska", stateRate: 5.50, maxLocalRate: 2.50, maxCombinedRate: 8.00 },
  { code: "NV", name: "Nevada", stateRate: 6.85, maxLocalRate: 1.53, maxCombinedRate: 8.38 },
  { code: "NH", name: "New Hampshire", stateRate: 0.00, maxLocalRate: 0.00, maxCombinedRate: 0.00 },
  { code: "NJ", name: "New Jersey", stateRate: 6.625, maxLocalRate: 0.00, maxCombinedRate: 6.625 },
  { code: "NM", name: "New Mexico", stateRate: 5.125, maxLocalRate: 4.188, maxCombinedRate: 9.313 },
  { code: "NY", name: "New York", stateRate: 4.00, maxLocalRate: 4.875, maxCombinedRate: 8.875 },
  { code: "NC", name: "North Carolina", stateRate: 4.75, maxLocalRate: 2.75, maxCombinedRate: 7.50 },
  { code: "ND", name: "North Dakota", stateRate: 5.00, maxLocalRate: 3.50, maxCombinedRate: 8.50 },
  { code: "OH", name: "Ohio", stateRate: 5.75, maxLocalRate: 2.25, maxCombinedRate: 8.00 },
  { code: "OK", name: "Oklahoma", stateRate: 4.50, maxLocalRate: 7.00, maxCombinedRate: 11.50 },
  { code: "OR", name: "Oregon", stateRate: 0.00, maxLocalRate: 0.00, maxCombinedRate: 0.00 },
  { code: "PA", name: "Pennsylvania", stateRate: 6.00, maxLocalRate: 2.00, maxCombinedRate: 8.00 },
  { code: "RI", name: "Rhode Island", stateRate: 7.00, maxLocalRate: 0.00, maxCombinedRate: 7.00 },
  { code: "SC", name: "South Carolina", stateRate: 6.00, maxLocalRate: 3.00, maxCombinedRate: 9.00 },
  { code: "SD", name: "South Dakota", stateRate: 4.20, maxLocalRate: 4.50, maxCombinedRate: 8.70 },
  { code: "TN", name: "Tennessee", stateRate: 7.00, maxLocalRate: 2.75, maxCombinedRate: 9.75 },
  { code: "TX", name: "Texas", stateRate: 6.25, maxLocalRate: 2.00, maxCombinedRate: 8.25 },
  { code: "UT", name: "Utah", stateRate: 6.10, maxLocalRate: 3.00, maxCombinedRate: 9.10 },
  { code: "VT", name: "Vermont", stateRate: 6.00, maxLocalRate: 1.00, maxCombinedRate: 7.00 },
  { code: "VA", name: "Virginia", stateRate: 5.30, maxLocalRate: 1.70, maxCombinedRate: 7.00 },
  { code: "WA", name: "Washington", stateRate: 6.50, maxLocalRate: 4.10, maxCombinedRate: 10.60 },
  { code: "WV", name: "West Virginia", stateRate: 6.00, maxLocalRate: 1.00, maxCombinedRate: 7.00 },
  { code: "WI", name: "Wisconsin", stateRate: 5.00, maxLocalRate: 0.60, maxCombinedRate: 5.60 },
  { code: "WY", name: "Wyoming", stateRate: 4.00, maxLocalRate: 2.00, maxCombinedRate: 6.00 },
  { code: "DC", name: "District of Columbia", stateRate: 6.00, maxLocalRate: 0.00, maxCombinedRate: 6.00 },
  { code: "PR", name: "Puerto Rico", stateRate: 10.50, maxLocalRate: 1.00, maxCombinedRate: 11.50 },
  { code: "GU", name: "Guam", stateRate: 4.00, maxLocalRate: 0.00, maxCombinedRate: 4.00 },
];

/**
 * Solves sales tax equations based on the selected mode:
 *  - "afterTax": Given Before-Tax Price ($) and Rate (%), solve for After-Tax Price ($)
 *  - "beforeTax": Given After-Tax Price ($) and Rate (%), solve for Before-Tax Price ($)
 *  - "rate": Given Before-Tax Price ($) and After-Tax Price ($), solve for Tax Rate (%)
 */
export function calculateSalesTax({ mode = "afterTax", beforeTaxPrice, rate, afterTaxPrice }) {
  if (mode === "afterTax") {
    const b = parseFloat(beforeTaxPrice);
    const r = parseFloat(rate);

    if (isNaN(b) || b < 0) {
      return { isValid: false, error: "Please enter a valid before-tax price." };
    }
    if (isNaN(r) || r < 0) {
      return { isValid: false, error: "Please enter a valid tax rate percentage." };
    }

    const taxAmount = b * (r / 100);
    const finalPrice = b + taxAmount;

    return {
      isValid: true,
      mode: "afterTax",
      beforeTaxPrice: b,
      rate: r,
      taxAmount,
      afterTaxPrice: finalPrice,
    };
  }

  if (mode === "beforeTax") {
    const a = parseFloat(afterTaxPrice);
    const r = parseFloat(rate);

    if (isNaN(a) || a < 0) {
      return { isValid: false, error: "Please enter a valid final after-tax price." };
    }
    if (isNaN(r) || r < 0) {
      return { isValid: false, error: "Please enter a valid tax rate percentage." };
    }

    const origPrice = a / (1 + r / 100);
    const taxAmount = a - origPrice;

    return {
      isValid: true,
      mode: "beforeTax",
      beforeTaxPrice: origPrice,
      rate: r,
      taxAmount,
      afterTaxPrice: a,
    };
  }

  if (mode === "rate") {
    const b = parseFloat(beforeTaxPrice);
    const a = parseFloat(afterTaxPrice);

    if (isNaN(b) || b <= 0) {
      return { isValid: false, error: "Before-tax price must be greater than zero." };
    }
    if (isNaN(a) || a < 0) {
      return { isValid: false, error: "Please enter a valid final after-tax price." };
    }
    if (a < b) {
      return { isValid: false, error: "After-tax price cannot be less than before-tax price." };
    }

    const calcRate = ((a / b) - 1) * 100;
    const taxAmount = a - b;

    return {
      isValid: true,
      mode: "rate",
      beforeTaxPrice: b,
      rate: calcRate,
      taxAmount,
      afterTaxPrice: a,
    };
  }

  return { isValid: false, error: "Invalid calculation mode." };
}

/**
 * Currency formatter helper
 */
export function formatCurrency(num) {
  if (typeof num !== "number" || isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
