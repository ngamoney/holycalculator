"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateDownPayment, formatCurrency, formatCurrencyCents } from "@/lib/calculations/downPayment";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./DownPaymentCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_downpayment_history";

export default function DownPaymentCalculatorIsland() {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [closingCostsPct, setClosingCostsPct] = useState(3.0);
  const [interestRate, setInterestRate] = useState(6.75);
  const [loanTermYears, setLoanTermYears] = useState(30);

  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL & LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("price")) setHomePrice(parseFloat(params.get("price")) || 450000);
    if (params.has("down")) setDownPaymentPct(parseFloat(params.get("down")) || 20);
    if (params.has("closing")) setClosingCostsPct(parseFloat(params.get("closing")) || 3.0);
    if (params.has("rate")) setInterestRate(parseFloat(params.get("rate")) || 6.75);

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        price: homePrice,
        down: downPaymentPct,
        closing: closingCostsPct,
        rate: interestRate,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [homePrice, downPaymentPct, closingCostsPct, interestRate]);

  // Live calculation
  const result = useMemo(() => {
    return calculateDownPayment({
      homePrice,
      downPaymentPct,
      closingCostsPct,
      interestRate,
      loanTermYears,
    });
  }, [homePrice, downPaymentPct, closingCostsPct, interestRate, loanTermYears]);

  // Save history
  useEffect(() => {
    if (!result || typeof window === "undefined" || homePrice <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      price: homePrice,
      down: Math.round(result.downPaymentAmount),
      downPct: downPaymentPct,
      totalCash: Math.round(result.totalUpfrontCash),
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "price");
    setHistory(updated);
  }, [result?.downPaymentAmount, result?.totalUpfrontCash]);

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
          <h2 className={styles.cardHeader}>Home Price &amp; Down Payment</h2>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="homePrice" className={styles.label}>
                Target Home Price
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="homePrice"
                type="number"
                min="10000"
                step="10000"
                value={homePrice}
                onChange={(e) => setHomePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="downPct" className={styles.label}>
                Down Payment: {downPaymentPct}% ({formatCurrency(result.downPaymentAmount)})
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <input
                id="downPct"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                className={styles.numInput}
              />
              <span className={styles.suffix}>%</span>
            </div>
            <div className={styles.presetButtons}>
              <button type="button" className={styles.presetBtn} onClick={() => setDownPaymentPct(3.5)}>
                3.5% (FHA)
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => setDownPaymentPct(5)}>
                5% (Min Conv)
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => setDownPaymentPct(10)}>
                10%
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => setDownPaymentPct(20)}>
                20% (No PMI)
              </button>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="closingPct" className={styles.label}>
                  Estimated Closing Costs
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="closingPct"
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={closingCostsPct}
                  onChange={(e) => setClosingCostsPct(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="mortRate" className={styles.label}>
                  Interest Rate (APR)
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
              Share Down Payment Plan
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Upfront Cash Required</h2>

          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Total Cash Needed to Close</div>
            <div className={styles.heroValue}>{formatCurrency(result.totalUpfrontCash)}</div>
            <div className={styles.heroSub}>
              Includes <strong>{formatCurrency(result.downPaymentAmount)}</strong> Down Payment +{" "}
              {formatCurrency(result.closingCostsAmount)} Closing Costs
            </div>
          </div>

          {/* PMI Notice */}
          <div
            className={styles.pmiBanner}
            style={{
              borderColor: result.hasPMI ? "var(--gold)" : "#4f7a5b",
              background: result.hasPMI ? "rgba(201, 153, 47, 0.08)" : "rgba(79, 122, 91, 0.08)",
            }}
          >
            <div
              className={styles.pmiTitle}
              style={{ color: result.hasPMI ? "var(--gold-deep)" : "#4f7a5b" }}
            >
              {result.hasPMI ? "Private Mortgage Insurance (PMI) Required" : "No PMI Required (20%+ Down)"}
            </div>
            <div className={styles.pmiBody}>
              {result.hasPMI
                ? `Because your down payment is under 20%, estimated PMI adds ~${formatCurrencyCents(result.monthlyPMI)}/month to your payment.`
                : "You save an estimated $150–$300/month by avoiding Private Mortgage Insurance entirely!"}
            </div>
          </div>

          <div className={styles.statList}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Down Payment ({result.downPaymentPct}%)</span>
              <span className={styles.statVal}>{formatCurrency(result.downPaymentAmount)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Closing Costs ({closingCostsPct}%)</span>
              <span className={styles.statVal}>{formatCurrency(result.closingCostsAmount)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Resulting Mortgage Loan Amount</span>
              <span className={styles.statVal}>{formatCurrency(result.loanPrincipal)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Monthly Principal &amp; Interest</span>
              <span className={styles.statVal}>{formatCurrencyCents(result.monthlyPI)}</span>
            </div>
            <div className={`${styles.statRow} ${styles.statTotal}`}>
              <span>Total Monthly Mortgage + PMI</span>
              <span>{formatCurrencyCents(result.totalMonthlyPayment)}</span>
            </div>
          </div>

          <YmylDisclaimer type="mortgage" />
        </div>
      </div>

      {/* COMPARISON TIERS TABLE */}
      {result.tiers.length > 0 && (
        <div className={styles.tierSection}>
          <h3 className={styles.tierSectionTitle}>Down Payment Scenario Comparison</h3>
          <p className={styles.tierSectionSub}>
            Compare upfront savings required versus resulting monthly payments across common loan programs.
          </p>

          <div className={styles.tierGridTable}>
            <div className={styles.tierHeaderRow}>
              <span>Scenario</span>
              <span>Down Payment</span>
              <span>Total Cash Needed</span>
              <span>Loan Amount</span>
              <span>Est. Monthly P&amp;I</span>
              <span>PMI</span>
            </div>
            {result.tiers.map((t) => (
              <div
                key={t.percent}
                className={`${styles.tierDataRow} ${downPaymentPct === t.percent ? styles.activeTierRow : ""}`}
                onClick={() => setDownPaymentPct(t.percent)}
              >
                <strong>{t.percent}% Down</strong>
                <span>{formatCurrency(t.downPayment)}</span>
                <span>{formatCurrency(t.totalUpfront)}</span>
                <span>{formatCurrency(t.loanAmount)}</span>
                <span>{formatCurrencyCents(t.monthlyPI)}</span>
                <span style={{ color: t.hasPMI ? "var(--gold-deep)" : "#4f7a5b", fontWeight: "600" }}>
                  {t.hasPMI ? `+${formatCurrencyCents(t.monthlyPMI)}/mo` : "None"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECENT CALCULATIONS */}
      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyTitle}>Recent Down Payment Scenarios</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  setHomePrice(item.price);
                  setDownPaymentPct(item.downPct);
                }}
              >
                <div className={styles.historyAmount}>{formatCurrency(item.down)} Down</div>
                <div className={styles.historyMeta}>
                  {item.downPct}% on ${item.price?.toLocaleString()} Home • Total Cash: {formatCurrency(item.totalCash)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
