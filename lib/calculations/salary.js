/**
 * Pure calculation logic for Salary & Wage Conversion Calculator.
 * Converts any wage amount and frequency into Hourly, Daily, Weekly,
 * Bi-Weekly (26), Semi-Monthly (24), Monthly (12), Quarterly (4), and Annual.
 * Computes both Unadjusted and Adjusted (accounting for paid holidays & vacation days).
 */

export function calculateSalary({
  amount = 50,
  unit = "hour", // 'hour' | 'day' | 'week' | 'biweek' | 'semimonth' | 'month' | 'quarter' | 'year'
  hoursPerWeek = 40,
  daysPerWeek = 5,
  holidaysPerYear = 10,
  vacationDaysPerYear = 15,
}) {
  const rawAmount = Math.max(0, Number(amount) || 0);
  const hpw = Math.max(1, Number(hoursPerWeek) || 40);
  const dpw = Math.max(1, Number(daysPerWeek) || 5);
  const hoursPerDay = hpw / dpw;

  const holidays = Math.max(0, Number(holidaysPerYear) || 0);
  const vacation = Math.max(0, Number(vacationDaysPerYear) || 0);

  // Standard work weeks per year = 52, work days per year = 52 * dpw = 260
  const totalWorkDays = 52 * dpw;
  const totalWorkHours = 52 * hpw;

  // Actual working days after taking off holidays + vacation
  const actualWorkDays = Math.max(1, totalWorkDays - holidays - vacation);
  const actualWorkHours = actualWorkDays * hoursPerDay;

  // Convert input amount to base annual amount (unadjusted)
  let annualUnadjusted = 0;

  switch (unit) {
    case "hour":
      annualUnadjusted = rawAmount * totalWorkHours;
      break;
    case "day":
      annualUnadjusted = rawAmount * totalWorkDays;
      break;
    case "week":
      annualUnadjusted = rawAmount * 52;
      break;
    case "biweek":
      annualUnadjusted = rawAmount * 26;
      break;
    case "semimonth":
      annualUnadjusted = rawAmount * 24;
      break;
    case "month":
      annualUnadjusted = rawAmount * 12;
      break;
    case "quarter":
      annualUnadjusted = rawAmount * 4;
      break;
    case "year":
    default:
      annualUnadjusted = rawAmount;
      break;
  }

  // Unadjusted rates across frequencies
  const unadjusted = {
    hourly: annualUnadjusted / totalWorkHours,
    daily: annualUnadjusted / totalWorkDays,
    weekly: annualUnadjusted / 52,
    biweekly: annualUnadjusted / 26,
    semimonthly: annualUnadjusted / 24,
    monthly: annualUnadjusted / 12,
    quarterly: annualUnadjusted / 4,
    annual: annualUnadjusted,
  };

  // Adjusted rates (Effective hourly value when accounting for paid time off)
  const adjusted = {
    hourly: annualUnadjusted / actualWorkHours,
    daily: annualUnadjusted / actualWorkDays,
    weekly: (annualUnadjusted / totalWorkDays) * (actualWorkDays / 52),
    biweekly: (annualUnadjusted / 26) * (actualWorkDays / totalWorkDays),
    semimonthly: (annualUnadjusted / 24) * (actualWorkDays / totalWorkDays),
    monthly: (annualUnadjusted / 12) * (actualWorkDays / totalWorkDays),
    quarterly: (annualUnadjusted / 4) * (actualWorkDays / totalWorkDays),
    annual: annualUnadjusted * (actualWorkDays / totalWorkDays),
  };

  // Overtime pay rates (based on unadjusted hourly rate)
  const overtime15x = unadjusted.hourly * 1.5;
  const overtime20x = unadjusted.hourly * 2.0;

  return {
    rawAmount,
    unit,
    unadjusted,
    adjusted,
    overtime15x,
    overtime20x,
    totalWorkHours,
    actualWorkHours,
    totalWorkDays,
    actualWorkDays,
    ptoDaysTotal: holidays + vacation,
  };
}

export function formatCurrency(val) {
  if (isNaN(val) || !isFinite(val)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatCurrencyCents(val) {
  if (isNaN(val) || !isFinite(val)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}
