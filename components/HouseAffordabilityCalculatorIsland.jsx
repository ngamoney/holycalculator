"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateHouseAffordability, formatCurrency, formatCurrencyCents } from "@/lib/calculations/houseAffordability";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./HouseAffordabilityCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_affordability_history";

export default function HouseAffordabilityCalculatorIsland() {
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [downPaymentType, setDownPaymentType] = useState("amount"); // 'amount' | 'percent'
  const [interestRate, setInterestRate] = useState(6.75);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [underwritingRule, setUnderwritingRule] = useState("conventional");

  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL & LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("income")) setAnnualIncome(parseFloat(params.get("income")) || 120000);
    if (params.has("debts")) setMonthlyDebts(parseFloat(params.get("debts")) || 500);
    if (params.has("down")) setDownPayment(parseFloat(params.get("down")) || 60000);
    if (params.has("rate")) setInterestRate(parseFloat(params.get("rate")) || 6.75);
    if (params.has("rule")) setUnderwritingRule(params.get("rule"));

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        income: annualIncome,
        debts: monthlyDebts,
        down: downPayment,
        rate: interestRate,
        rule: underwritingRule,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [annualIncome, monthlyDebts, downPayment, interestRate, underwritingRule]);

  // Live calculation
  const result = useMemo(() => {
    return calculateHouseAffordability({
      annualIncome,
      monthlyDebts,
      downPayment,
      downPaymentType,
      interestRate,
      loanTermYears,
      underwritingRule,
    });
  }, [
    annualIncome,
    monthlyDebts,
    downPayment,
    downPaymentType,
    interestRate,
    loanTermYears,
    underwritingRule,
  ]);

  // Save history
  useEffect(() => {
    if (!result || typeof window === "undefined" || annualIncome <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      income: annualIncome,
      maxPrice: result.maxHomePrice,
      monthly: Math.round(result.totalMonthlyPayment),
      down: downPayment,
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "income");
    setHistory(updated);
  }, [result?.maxHomePrice]);

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
          <h2 className={styles.cardHeader}>Income &amp; Financial Profile</h2>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="annualIncome" className={styles.label}>
                Annual Household Income (Before Tax)
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="annualIncome"
                type="number"
                min="10000"
                step="5000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
              <span className={styles.suffix}>/year</span>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="monthlyDebts" className={styles.label}>
                  Monthly Debt Obligations
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="monthlyDebts"
                  type="number"
                  min="0"
                  step="50"
                  value={monthlyDebts}
                  onChange={(e) => setMonthlyDebts(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>/mo</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="downPayment" className={styles.label}>
                  Down Payment Funds
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="downPayment"
                  type="number"
                  min="0"
                  step="5000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="mortRate" className={styles.label}>
                  Mortgage Interest Rate
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="mortRate"
                  type="number"
                  step="0.05"
                  min="0"
                  max="20"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="loanTerm" className={styles.label}>
                  Loan Term
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <select
                  id="loanTerm"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(parseInt(e.target.value, 10))}
                  className={styles.selectInput}
                >
                  <option value={30}>30 Years (Standard)</option>
                  <option value={20}>20 Years</option>
                  <option value={15}>15 Years</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Underwriting Budget Rule</label>
            </div>
            <div className={styles.tabContainer}>
              <button
                type="button"
                className={`${styles.tabBtn} ${underwritingRule === "conservative" ? styles.activeTab : ""}`}
                onClick={() => setUnderwritingRule("conservative")}
              >
                Conservative (25%)
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${underwritingRule === "conventional" ? styles.activeTab : ""}`}
                onClick={() => setUnderwritingRule("conventional")}
              >
                Standard (28/36)
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${underwritingRule === "aggressive" ? styles.activeTab : ""}`}
                onClick={() => setUnderwritingRule("aggressive")}
              >
                Aggressive (45%)
              </button>
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
              Share Affordability Estimate
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Estimated Purchasing Power</h2>

          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Maximum Affordable Home Price</div>
            <div className={styles.heroValue}>{formatCurrency(result.maxHomePrice)}</div>
            <div className={styles.heroSub}>
              Est. Monthly Payment (PITI + HOA): <strong>{formatCurrencyCents(result.totalMonthlyPayment)}/mo</strong>
            </div>
          </div>

          {/* Affordability Tier Spectrum */}
          <div className={styles.tierContainer}>
            <div className={styles.tierTitle}>Affordability Budget Spectrum</div>
            <div className={styles.tierGrid}>
              {result.tiers.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.tierCard} ${underwritingRule === t.rule ? styles.activeTierCard : ""}`}
                  onClick={() => setUnderwritingRule(t.rule)}
                >
                  <div className={styles.tierName}>{t.name}</div>
                  <div className={styles.tierPrice}>{formatCurrency(t.maxPrice)}</div>
                  <div className={styles.tierMonthly}>{formatCurrency(t.monthlyHousing)}/mo</div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.statList}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Down Payment ({result.downPaymentPct}%)</span>
              <span className={styles.statVal}>{formatCurrency(result.actualDownPayment)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Mortgage Principal Loan Amount</span>
              <span className={styles.statVal}>{formatCurrency(result.maxLoanAmount)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Monthly Principal &amp; Interest</span>
              <span className={styles.statVal}>{formatCurrencyCents(result.monthlyPI)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Monthly Property Tax &amp; Insurance</span>
              <span className={styles.statVal}>{formatCurrencyCents(result.monthlyTax + result.monthlyInsurance)}</span>
            </div>
            {result.monthlyPmi > 0 && (
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Estimated Monthly PMI</span>
                <span className={styles.statVal}>{formatCurrencyCents(result.monthlyPmi)}</span>
              </div>
            )}
            <div className={`${styles.statRow} ${styles.statTotal}`}>
              <span>DTI Qualification Ratios</span>
              <span>
                {result.frontEndDti}% Front / {result.backEndDti}% Back
              </span>
            </div>
          </div>

          <YmylDisclaimer type="mortgage" />
        </div>
      </div>

      {/* RECENT CALCULATIONS */}
      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyTitle}>Recent Affordability Queries</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  setAnnualIncome(item.income);
                }}
              >
                <div className={styles.historyAmount}>{formatCurrency(item.maxPrice)} Home</div>
                <div className={styles.historyMeta}>
                  ${item.income?.toLocaleString()}/yr Income • ${item.monthly}/mo
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
