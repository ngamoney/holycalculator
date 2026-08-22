"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateSalary, formatCurrency, formatCurrencyCents } from "@/lib/calculations/salary";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import styles from "./SalaryCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_salary_history";

export default function SalaryCalculatorIsland() {
  const [amount, setAmount] = useState(50);
  const [unit, setUnit] = useState("hour"); // 'hour' | 'day' | 'week' | 'biweek' | 'semimonth' | 'month' | 'quarter' | 'year'
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [holidaysPerYear, setHolidaysPerYear] = useState(10);
  const [vacationDaysPerYear, setVacationDaysPerYear] = useState(15);

  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL & LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("amount")) setAmount(parseFloat(params.get("amount")) || 50);
    if (params.has("unit")) setUnit(params.get("unit"));
    if (params.has("hpw")) setHoursPerWeek(parseFloat(params.get("hpw")) || 40);

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        amount,
        unit,
        hpw: hoursPerWeek !== 40 ? hoursPerWeek : undefined,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [amount, unit, hoursPerWeek]);

  // Live calculation
  const result = useMemo(() => {
    return calculateSalary({
      amount,
      unit,
      hoursPerWeek,
      daysPerWeek,
      holidaysPerYear,
      vacationDaysPerYear,
    });
  }, [amount, unit, hoursPerWeek, daysPerWeek, holidaysPerYear, vacationDaysPerYear]);

  // Save history
  useEffect(() => {
    if (!result || typeof window === "undefined" || amount <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      amount,
      unit,
      annual: Math.round(result.unadjusted.annual),
      hourly: result.unadjusted.hourly.toFixed(2),
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "amount");
    setHistory(updated);
  }, [result?.unadjusted?.annual]);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    copyToClipboard(
      window.location.href,
      () => {
        setToastMessage("Link copied to clipboard!");
        setTimeout(() => setToastMessage(null), 3000);
      },
      () => {
        setToastMessage("Could not copy link");
        setTimeout(() => setToastMessage(null), 3000);
      }
    );
  };

  return (
    <div className={styles.islandContainer}>
      {toastMessage && <div className={styles.toastNotice}>{toastMessage}</div>}

      <div className={styles.calcGrid}>
        {/* INPUT CARD */}
        <div className={styles.inputCard}>
          <h2 className={styles.cardHeader}>Salary &amp; Pay Frequency</h2>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="salaryAmount" className={styles.label}>
                Salary / Wage Amount
              </label>
            </div>
            <div className={styles.dualInputs}>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="salaryAmount"
                  type="number"
                  min="0"
                  step={unit === "hour" ? "1" : "1000"}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>

              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className={styles.selectInput}
              >
                <option value="hour">per Hour</option>
                <option value="day">per Day</option>
                <option value="week">per Week</option>
                <option value="biweek">per Bi-Week (26)</option>
                <option value="semimonth">per Semi-Month (24)</option>
                <option value="month">per Month (12)</option>
                <option value="quarter">per Quarter (4)</option>
                <option value="year">per Year</option>
              </select>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="hpw" className={styles.label}>
                  Hours Per Week
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="hpw"
                  type="number"
                  min="1"
                  max="100"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Math.max(1, parseFloat(e.target.value) || 1))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>hrs/wk</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="dpw" className={styles.label}>
                  Days Per Week
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="dpw"
                  type="number"
                  min="1"
                  max="7"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Math.max(1, parseFloat(e.target.value) || 1))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>days/wk</span>
              </div>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="holidays" className={styles.label}>
                  Paid Holidays / Year
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="holidays"
                  type="number"
                  min="0"
                  max="50"
                  value={holidaysPerYear}
                  onChange={(e) => setHolidaysPerYear(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>days</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="vacation" className={styles.label}>
                  Paid Vacation / PTO
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="vacation"
                  type="number"
                  min="0"
                  max="60"
                  value={vacationDaysPerYear}
                  onChange={(e) => setVacationDaysPerYear(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>days</span>
              </div>
            </div>
          </div>

          <div className={styles.actionRow}>
            <button type="button" className={styles.shareBtn} onClick={handleShare}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share Wage Breakdown
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Equivalent Earnings</h2>

          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Annual Equivalent Salary</div>
            <div className={styles.heroValue}>{formatCurrency(result.unadjusted.annual)}</div>
            <div className={styles.heroSub}>
              Equivalent to <strong>{formatCurrencyCents(result.unadjusted.hourly)}/hour</strong> ({hoursPerWeek} hrs/wk)
            </div>
          </div>

          {/* Overtime Box */}
          <div className={styles.overtimeBox}>
            <div className={styles.overtimeTitle}>Overtime Hourly Pay Rates</div>
            <div className={styles.overtimeGrid}>
              <div className={styles.overtimeItem}>
                <span>Time-and-a-Half (1.5x)</span>
                <strong>{formatCurrencyCents(result.overtime15x)}/hr</strong>
              </div>
              <div className={styles.overtimeItem}>
                <span>Double Time (2.0x)</span>
                <strong>{formatCurrencyCents(result.overtime20x)}/hr</strong>
              </div>
            </div>
          </div>

          <div className={styles.statList}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Monthly Gross Pay (12x/yr)</span>
              <span className={styles.statVal}>{formatCurrency(result.unadjusted.monthly)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Bi-Weekly Paycheck (26x/yr)</span>
              <span className={styles.statVal}>{formatCurrency(result.unadjusted.biweekly)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Semi-Monthly Paycheck (24x/yr)</span>
              <span className={styles.statVal}>{formatCurrency(result.unadjusted.semimonthly)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Weekly Gross Pay (52x/yr)</span>
              <span className={styles.statVal}>{formatCurrency(result.unadjusted.weekly)}</span>
            </div>
            <div className={`${styles.statRow} ${styles.statTotal}`}>
              <span>Effective Hourly Rate (Excl. PTO)</span>
              <span>{formatCurrencyCents(result.adjusted.hourly)}/hr</span>
            </div>
          </div>
        </div>
      </div>

      {/* FULL FREQUENCY CONVERSION TABLE */}
      <div className={styles.conversionSection}>
        <h3 className={styles.conversionTitle}>Full Salary Conversion Schedule</h3>
        <p className={styles.conversionSub}>
          Side-by-side comparison of standard gross earnings versus earnings adjusted for {result.ptoDaysTotal} paid days off ({holidaysPerYear} holidays + {vacationDaysPerYear} vacation days).
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.convTable}>
            <thead>
              <tr>
                <th>Payment Frequency</th>
                <th>Standard (Unadjusted)</th>
                <th>Effective (Adjusted for PTO)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Hourly</strong></td>
                <td>{formatCurrencyCents(result.unadjusted.hourly)}</td>
                <td>{formatCurrencyCents(result.adjusted.hourly)}</td>
              </tr>
              <tr>
                <td><strong>Daily ({daysPerWeek} days/wk)</strong></td>
                <td>{formatCurrencyCents(result.unadjusted.daily)}</td>
                <td>{formatCurrencyCents(result.adjusted.daily)}</td>
              </tr>
              <tr>
                <td><strong>Weekly (52 periods)</strong></td>
                <td>{formatCurrency(result.unadjusted.weekly)}</td>
                <td>{formatCurrency(result.adjusted.weekly)}</td>
              </tr>
              <tr>
                <td><strong>Bi-Weekly (26 paychecks)</strong></td>
                <td>{formatCurrency(result.unadjusted.biweekly)}</td>
                <td>{formatCurrency(result.adjusted.biweekly)}</td>
              </tr>
              <tr>
                <td><strong>Semi-Monthly (24 paychecks)</strong></td>
                <td>{formatCurrency(result.unadjusted.semimonthly)}</td>
                <td>{formatCurrency(result.adjusted.semimonthly)}</td>
              </tr>
              <tr>
                <td><strong>Monthly (12 paychecks)</strong></td>
                <td>{formatCurrency(result.unadjusted.monthly)}</td>
                <td>{formatCurrency(result.adjusted.monthly)}</td>
              </tr>
              <tr>
                <td><strong>Quarterly (4 quarters)</strong></td>
                <td>{formatCurrency(result.unadjusted.quarterly)}</td>
                <td>{formatCurrency(result.adjusted.quarterly)}</td>
              </tr>
              <tr className={styles.annualRow}>
                <td><strong>Annual Gross Total</strong></td>
                <td>{formatCurrency(result.unadjusted.annual)}</td>
                <td>{formatCurrency(result.adjusted.annual)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT CALCULATIONS */}
      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyTitle}>Recent Salary Conversions</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  setAmount(item.amount);
                  setUnit(item.unit);
                }}
              >
                <div className={styles.historyAmount}>{formatCurrency(item.annual)}/yr</div>
                <div className={styles.historyMeta}>
                  ${item.amount} / {item.unit} • ${item.hourly}/hr
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
