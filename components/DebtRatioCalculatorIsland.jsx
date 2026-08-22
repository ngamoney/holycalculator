"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateDebtRatio, formatCurrency } from "@/lib/calculations/debtRatio";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./DebtRatioCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_debtratio_history";

export default function DebtRatioCalculatorIsland() {
  const [annualSalary, setAnnualSalary] = useState(80000);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState(0);
  const [housingCost, setHousingCost] = useState(1800);
  const [autoLoan, setAutoLoan] = useState(400);
  const [studentLoan, setStudentLoan] = useState(250);
  const [creditCardMin, setCreditCardMin] = useState(150);
  const [personalLoan, setPersonalLoan] = useState(0);
  const [otherDebt, setOtherDebt] = useState(0);

  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL & LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("salary")) setAnnualSalary(parseFloat(params.get("salary")) || 80000);
    if (params.has("housing")) setHousingCost(parseFloat(params.get("housing")) || 1800);
    if (params.has("auto")) setAutoLoan(parseFloat(params.get("auto")) || 400);
    if (params.has("student")) setStudentLoan(parseFloat(params.get("student")) || 250);
    if (params.has("cards")) setCreditCardMin(parseFloat(params.get("cards")) || 150);

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        salary: annualSalary,
        housing: housingCost,
        auto: autoLoan,
        student: studentLoan,
        cards: creditCardMin,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [annualSalary, housingCost, autoLoan, studentLoan, creditCardMin]);

  // Live calculation
  const result = useMemo(() => {
    return calculateDebtRatio({
      annualSalary,
      otherMonthlyIncome,
      housingCost,
      autoLoan,
      studentLoan,
      creditCardMin,
      personalLoan,
      otherDebt,
    });
  }, [
    annualSalary,
    otherMonthlyIncome,
    housingCost,
    autoLoan,
    studentLoan,
    creditCardMin,
    personalLoan,
    otherDebt,
  ]);

  // Save history
  useEffect(() => {
    if (!result || typeof window === "undefined" || annualSalary <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      salary: annualSalary,
      frontDti: result.frontEndDti,
      backDti: result.backEndDti,
      status: result.status,
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "salary");
    setHistory(updated);
  }, [result?.backEndDti]);

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
          <h2 className={styles.cardHeader}>Income &amp; Monthly Debts</h2>

          <div className={styles.sectionDivider}>
            <span>Gross Monthly Income</span>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="annualSalary" className={styles.label}>
                  Annual Salary
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="annualSalary"
                  type="number"
                  min="5000"
                  step="5000"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="otherIncome" className={styles.label}>
                  Other Monthly Income
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="otherIncome"
                  type="number"
                  min="0"
                  step="100"
                  value={otherMonthlyIncome}
                  onChange={(e) => setOtherMonthlyIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.sectionDivider}>
            <span>Housing Costs (Front-End)</span>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="housingCost" className={styles.label}>
                Monthly Rent or Mortgage (P&amp;I + Tax + Ins + HOA)
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="housingCost"
                type="number"
                min="0"
                step="50"
                value={housingCost}
                onChange={(e) => setHousingCost(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
              <span className={styles.suffix}>/mo</span>
            </div>
          </div>

          <div className={styles.sectionDivider}>
            <span>Recurring Non-Housing Debts (Back-End)</span>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="autoLoan" className={styles.label}>
                  Auto Loan Payments
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="autoLoan"
                  type="number"
                  min="0"
                  step="50"
                  value={autoLoan}
                  onChange={(e) => setAutoLoan(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="studentLoan" className={styles.label}>
                  Student Loans
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="studentLoan"
                  type="number"
                  min="0"
                  step="25"
                  value={studentLoan}
                  onChange={(e) => setStudentLoan(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="creditCards" className={styles.label}>
                  Credit Card Minimums
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="creditCards"
                  type="number"
                  min="0"
                  step="25"
                  value={creditCardMin}
                  onChange={(e) => setCreditCardMin(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="personalLoans" className={styles.label}>
                  Personal &amp; Other Debts
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="personalLoans"
                  type="number"
                  min="0"
                  step="50"
                  value={personalLoan}
                  onChange={(e) => setPersonalLoan(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
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
              Share DTI Assessment
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>DTI Assessment Results</h2>

          <div className={styles.dtiDualHero}>
            <div className={styles.dtiHeroBox}>
              <div className={styles.dtiHeroLabel}>Front-End DTI</div>
              <div className={styles.dtiHeroVal}>{result.frontEndDti}%</div>
              <div className={styles.dtiHeroSub}>Housing Only (Max: 28%)</div>
            </div>
            <div className={styles.dtiHeroBox}>
              <div className={styles.dtiHeroLabel}>Back-End DTI</div>
              <div className={styles.dtiHeroVal} style={{ color: result.statusColor }}>
                {result.backEndDti}%
              </div>
              <div className={styles.dtiHeroSub}>Total Debts (Max: 36%–43%)</div>
            </div>
          </div>

          <div className={styles.statusBanner} style={{ borderColor: result.statusColor }}>
            <div className={styles.statusTitle} style={{ color: result.statusColor }}>
              {result.status}
            </div>
            <div className={styles.statusFeedback}>{result.feedback}</div>
          </div>

          {/* Underwriting Benchmark Limits */}
          <div className={styles.benchmarkCard}>
            <div className={styles.benchmarkTitle}>28/36 Rule Underwriting Targets</div>
            <div className={styles.benchmarkRow}>
              <span>Gross Monthly Income:</span>
              <strong>{formatCurrency(result.grossMonthlyIncome)} / mo</strong>
            </div>
            <div className={styles.benchmarkRow}>
              <span>Max Recommended Housing (28%):</span>
              <strong>{formatCurrency(result.maxHousing28)} / mo</strong>
            </div>
            <div className={styles.benchmarkRow}>
              <span>Max Total Debt Payments (36%):</span>
              <strong>{formatCurrency(result.maxTotalDebt36)} / mo</strong>
            </div>
            <div className={styles.benchmarkRow}>
              <span>Qualified Mortgage Max Cap (43%):</span>
              <strong>{formatCurrency(result.maxTotalDebt43)} / mo</strong>
            </div>
          </div>

          <div className={styles.statList}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Current Monthly Housing</span>
              <span className={styles.statVal}>{formatCurrency(result.housingCost)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Current Monthly Non-Housing Debts</span>
              <span className={styles.statVal}>{formatCurrency(result.nonHousingDebt)}</span>
            </div>
            <div className={`${styles.statRow} ${styles.statTotal}`}>
              <span>Total Monthly Debt Obligation</span>
              <span>{formatCurrency(result.totalMonthlyDebt)}</span>
            </div>
          </div>

          <YmylDisclaimer type="mortgage" />
        </div>
      </div>

      {/* RECENT ASSESSMENTS */}
      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyTitle}>Recent DTI Assessments</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  setAnnualSalary(item.salary);
                }}
              >
                <div className={styles.historyAmount}>{item.backDti}% Back-End DTI</div>
                <div className={styles.historyMeta}>
                  ${item.salary?.toLocaleString()}/yr • Front: {item.frontDti}%
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
