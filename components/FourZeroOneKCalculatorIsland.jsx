"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculate401k, formatCurrency, formatCurrencyCents } from "@/lib/calculations/fourZeroOneK";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./FourZeroOneKCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_401k_history";

export default function FourZeroOneKCalculatorIsland() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSalary, setCurrentSalary] = useState(75000);
  const [currentBalance, setCurrentBalance] = useState(35000);
  const [contributionPct, setContributionPct] = useState(10);
  const [employerMatchPct, setEmployerMatchPct] = useState(50);
  const [employerMatchLimitPct, setEmployerMatchLimitPct] = useState(6);
  const [annualSalaryIncreasePct, setAnnualSalaryIncreasePct] = useState(3.0);
  const [investmentReturnPct, setInvestmentReturnPct] = useState(7.0);
  const [inflationPct, setInflationPct] = useState(2.5);

  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load params from URL & local storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("age")) setCurrentAge(parseInt(params.get("age"), 10) || 30);
    if (params.has("retAge")) setRetirementAge(parseInt(params.get("retAge"), 10) || 65);
    if (params.has("salary")) setCurrentSalary(parseFloat(params.get("salary")) || 75000);
    if (params.has("balance")) setCurrentBalance(parseFloat(params.get("balance")) || 35000);
    if (params.has("contrib")) setContributionPct(parseFloat(params.get("contrib")) || 10);
    if (params.has("match")) setEmployerMatchPct(parseFloat(params.get("match")) || 50);
    if (params.has("matchLimit")) setEmployerMatchLimitPct(parseFloat(params.get("matchLimit")) || 6);
    if (params.has("return")) setInvestmentReturnPct(parseFloat(params.get("return")) || 7.0);

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        age: currentAge,
        retAge: retirementAge,
        salary: currentSalary,
        balance: currentBalance,
        contrib: contributionPct,
        match: employerMatchPct,
        matchLimit: employerMatchLimitPct,
        return: investmentReturnPct,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [
    currentAge,
    retirementAge,
    currentSalary,
    currentBalance,
    contributionPct,
    employerMatchPct,
    employerMatchLimitPct,
    annualSalaryIncreasePct,
    investmentReturnPct,
    inflationPct,
  ]);

  // Live calculation
  const result = useMemo(() => {
    return calculate401k({
      currentAge,
      retirementAge,
      currentSalary,
      currentBalance,
      contributionPct,
      employerMatchPct,
      employerMatchLimitPct,
      annualSalaryIncreasePct,
      investmentReturnPct,
      inflationPct,
    });
  }, [
    currentAge,
    retirementAge,
    currentSalary,
    currentBalance,
    contributionPct,
    employerMatchPct,
    employerMatchLimitPct,
    annualSalaryIncreasePct,
    investmentReturnPct,
    inflationPct,
  ]);

  // History save
  useEffect(() => {
    if (!result || typeof window === "undefined" || currentSalary <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      salary: currentSalary,
      balance: result.finalBalance,
      monthly: Math.round(result.monthlyRetirementIncomeNominal),
      retAge: retirementAge,
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "salary");
    setHistory(updated);
  }, [result?.finalBalance]);

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

  const totalPie = result.finalBalance || 1;
  const initialPct = Math.round((result.initialBalance / totalPie) * 100);
  const employeePct = Math.round((result.totalEmployeeContrib / totalPie) * 100);
  const employerPct = Math.round((result.totalEmployerMatch / totalPie) * 100);
  const growthPct = Math.max(0, 100 - initialPct - employeePct - employerPct);

  return (
    <div className={styles.islandContainer}>
      {toastMessage && <div className={styles.toastNotice}>{toastMessage}</div>}

      <div className={styles.calcGrid}>
        {/* INPUT CARD */}
        <div className={styles.inputCard}>
          <h2 className={styles.cardHeader}>Personal &amp; 401(k) Inputs</h2>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="currentAge" className={styles.label}>
                  Current Age
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="currentAge"
                  type="number"
                  min="18"
                  max="80"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Math.max(18, parseInt(e.target.value, 10) || 18))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>yrs</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="retirementAge" className={styles.label}>
                  Retirement Age
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="retirementAge"
                  type="number"
                  min="50"
                  max="90"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Math.max(50, parseInt(e.target.value, 10) || 65))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>yrs</span>
              </div>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="currentSalary" className={styles.label}>
                  Annual Salary
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="currentSalary"
                  type="number"
                  min="10000"
                  step="5000"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="currentBalance" className={styles.label}>
                  Current 401(k)
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="currentBalance"
                  type="number"
                  min="0"
                  step="5000"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="contributionPct" className={styles.label}>
                Your Contribution (% of Salary)
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <input
                id="contributionPct"
                type="number"
                min="0"
                max="80"
                step="1"
                value={contributionPct}
                onChange={(e) => setContributionPct(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
              <span className={styles.suffix}>%</span>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="employerMatchPct" className={styles.label}>
                  Company Match
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="employerMatchPct"
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={employerMatchPct}
                  onChange={(e) => setEmployerMatchPct(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>% match</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="employerMatchLimitPct" className={styles.label}>
                  Up to Salary %
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="employerMatchLimitPct"
                  type="number"
                  min="0"
                  max="20"
                  step="1"
                  value={employerMatchLimitPct}
                  onChange={(e) => setEmployerMatchLimitPct(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>% max</span>
              </div>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="investmentReturnPct" className={styles.label}>
                  Expected Return
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="investmentReturnPct"
                  type="number"
                  min="1"
                  max="15"
                  step="0.5"
                  value={investmentReturnPct}
                  onChange={(e) => setInvestmentReturnPct(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>%/yr</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="inflationPct" className={styles.label}>
                  Inflation Rate
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="inflationPct"
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={inflationPct}
                  onChange={(e) => setInflationPct(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>%/yr</span>
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
              Share Projection
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Retirement Nest Egg</h2>

          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Projected Balance at Age {retirementAge}</div>
            <div className={styles.heroValue}>{formatCurrency(result.finalBalance)}</div>
            <div className={styles.heroSub}>
              Equals ~<strong>{formatCurrency(result.realBalanceTodayDollars)}</strong> in today&apos;s purchasing power
            </div>
          </div>

          <div className={styles.incomeCard}>
            <div className={styles.incomeLabel}>Estimated Monthly Retirement Income (4% Rule)</div>
            <div className={styles.incomeValue}>
              {formatCurrency(result.monthlyRetirementIncomeNominal)} <span className={styles.incomeSub}>/ month</span>
            </div>
            <div className={styles.incomeReal}>
              ~{formatCurrency(result.monthlyRetirementIncomeReal)} / mo in inflation-adjusted dollars
            </div>
          </div>

          {/* Progress bar breakdown */}
          <div className={styles.breakdownBar}>
            <div className={styles.barGrowth} style={{ width: `${growthPct}%` }} title={`Investment Growth: ${growthPct}%`} />
            <div className={styles.barEmployee} style={{ width: `${employeePct}%` }} title={`Your Contributions: ${employeePct}%`} />
            <div className={styles.barEmployer} style={{ width: `${employerPct}%` }} title={`Employer Match: ${employerPct}%`} />
            <div className={styles.barInitial} style={{ width: `${initialPct}%` }} title={`Starting Balance: ${initialPct}%`} />
          </div>

          <div className={styles.statList}>
            <div className={styles.statRow}>
              <span className={styles.dotGrowth}></span>
              <span className={styles.statLabel}>Investment Compound Growth</span>
              <span className={styles.statVal}>{formatCurrency(result.totalGrowth)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.dotEmployee}></span>
              <span className={styles.statLabel}>Your Total Contributions</span>
              <span className={styles.statVal}>{formatCurrency(result.totalEmployeeContrib)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.dotEmployer}></span>
              <span className={styles.statLabel}>Company Matching Funds</span>
              <span className={styles.statVal}>{formatCurrency(result.totalEmployerMatch)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.dotInitial}></span>
              <span className={styles.statLabel}>Starting Balance</span>
              <span className={styles.statVal}>{formatCurrency(result.initialBalance)}</span>
            </div>
          </div>

          <YmylDisclaimer type="financial" />
        </div>
      </div>

      {/* SCHEDULE TABLE */}
      {result.yearlySchedule.length > 0 && (
        <div className={styles.scheduleSection}>
          <div className={styles.scheduleHeader}>
            <div>
              <h3 className={styles.scheduleTitle}>Annual 401(k) Growth Schedule</h3>
              <p className={styles.scheduleSubtitle}>
                Yearly trajectory tracking salary growth, contributions, employer match, and compounding returns.
              </p>
            </div>
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
            >
              {isScheduleExpanded ? "Collapse Schedule" : "View Full Timeline"}
            </button>
          </div>

          <div className={`${styles.tableWrapper} ${isScheduleExpanded ? styles.expanded : ""}`}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>Age</th>
                  <th>Salary</th>
                  <th>Your Contrib</th>
                  <th>Match</th>
                  <th>Growth</th>
                  <th>Ending Balance</th>
                  <th>Today&apos;s $</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlySchedule.map((row) => (
                  <tr key={row.year}>
                    <td>
                      <strong>Age {row.age}</strong>
                    </td>
                    <td>{formatCurrency(row.salary)}</td>
                    <td>{formatCurrency(row.employeeContrib)}</td>
                    <td>{formatCurrency(row.employerContrib)}</td>
                    <td>{formatCurrency(row.growth)}</td>
                    <td className={styles.balanceCell}>{formatCurrency(row.endingBalance)}</td>
                    <td>{formatCurrency(row.realEndingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECENT CALCULATIONS */}
      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyTitle}>Recent Projections</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  setCurrentSalary(item.salary);
                  if (item.retAge) setRetirementAge(item.retAge);
                }}
              >
                <div className={styles.historyAmount}>{formatCurrency(item.balance)}</div>
                <div className={styles.historyMeta}>
                  ${item.salary?.toLocaleString()}/yr salary • Retire age {item.retAge || 65}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
