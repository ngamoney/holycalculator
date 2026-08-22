"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateRentVsBuy, formatCurrency } from "@/lib/calculations/rentVsBuy";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./RentVsBuyCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_rentvsbuy_history";

export default function RentVsBuyCalculatorIsland() {
  const [homePrice, setHomePrice] = useState(500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(6.75);
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [stayDurationYears, setStayDurationYears] = useState(7);

  // Advanced toggles
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState(1800);
  const [homeAppreciationRate, setHomeAppreciationRate] = useState(3.5);
  const [rentIncreaseRate, setRentIncreaseRate] = useState(3.0);
  const [investmentReturnRate, setInvestmentReturnRate] = useState(6.0);

  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL & LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("price")) setHomePrice(parseFloat(params.get("price")) || 500000);
    if (params.has("down")) setDownPaymentPercent(parseFloat(params.get("down")) || 20);
    if (params.has("rate")) setMortgageRate(parseFloat(params.get("rate")) || 6.75);
    if (params.has("rent")) setMonthlyRent(parseFloat(params.get("rent")) || 2500);
    if (params.has("stay")) setStayDurationYears(parseFloat(params.get("stay")) || 7);

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        price: homePrice,
        down: downPaymentPercent,
        rate: mortgageRate,
        rent: monthlyRent,
        stay: stayDurationYears,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [homePrice, downPaymentPercent, mortgageRate, monthlyRent, stayDurationYears]);

  // Live calculation
  const result = useMemo(() => {
    return calculateRentVsBuy({
      homePrice,
      downPaymentPercent,
      mortgageRate,
      propertyTaxRate,
      homeInsuranceAnnual,
      homeAppreciationRate,
      monthlyRent,
      rentIncreaseRate,
      investmentReturnRate,
      stayDurationYears,
    });
  }, [
    homePrice,
    downPaymentPercent,
    mortgageRate,
    propertyTaxRate,
    homeInsuranceAnnual,
    homeAppreciationRate,
    monthlyRent,
    rentIncreaseRate,
    investmentReturnRate,
    stayDurationYears,
  ]);

  // Save history
  useEffect(() => {
    if (!result || typeof window === "undefined" || homePrice <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      price: homePrice,
      rent: monthlyRent,
      better: result.isBuyBetter ? "Buy" : "Rent",
      adv: Math.round(result.buyingAdvantage),
      duration: stayDurationYears,
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "price");
    setHistory(updated);
  }, [result?.isBuyBetter, result?.buyingAdvantage]);

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
          <h2 className={styles.cardHeader}>Home Purchase &amp; Rental Inputs</h2>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="homePrice" className={styles.label}>
                  Home Purchase Price
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="homePrice"
                  type="number"
                  min="50000"
                  step="10000"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="monthlyRent" className={styles.label}>
                  Equivalent Monthly Rent
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="monthlyRent"
                  type="number"
                  min="500"
                  step="100"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>/mo</span>
              </div>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="downPct" className={styles.label}>
                  Down Payment (%)
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="downPct"
                  type="number"
                  min="0"
                  max="100"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="mortRate" className={styles.label}>
                  Mortgage Rate (APR)
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="mortRate"
                  type="number"
                  step="0.05"
                  min="0"
                  max="20"
                  value={mortgageRate}
                  onChange={(e) => setMortgageRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="stayDuration" className={styles.label}>
                Planned Stay Duration: {stayDurationYears} Years
              </label>
            </div>
            <input
              id="stayDuration"
              type="range"
              min="1"
              max="25"
              step="1"
              value={stayDurationYears}
              onChange={(e) => setStayDurationYears(parseInt(e.target.value, 10))}
              className={styles.rangeSlider}
            />
          </div>

          {/* ADVANCED TOGGLE */}
          <div className={styles.toggleSection}>
            <button
              type="button"
              className={styles.extraToggleBtn}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>{showAdvanced ? "− Hide Growth & Tax Assumptions" : "+ Edit Growth & Tax Assumptions"}</span>
            </button>

            {showAdvanced && (
              <div className={styles.extraInputsWrap}>
                <div className={styles.dualInputs}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Home Appreciation / yr</label>
                    <div className={styles.inputPrefixWrap}>
                      <input
                        type="number"
                        step="0.5"
                        value={homeAppreciationRate}
                        onChange={(e) => setHomeAppreciationRate(parseFloat(e.target.value) || 0)}
                        className={styles.numInput}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Rent Growth / yr</label>
                    <div className={styles.inputPrefixWrap}>
                      <input
                        type="number"
                        step="0.5"
                        value={rentIncreaseRate}
                        onChange={(e) => setRentIncreaseRate(parseFloat(e.target.value) || 0)}
                        className={styles.numInput}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>
                </div>

                <div className={styles.dualInputs}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Investment Return / yr</label>
                    <div className={styles.inputPrefixWrap}>
                      <input
                        type="number"
                        step="0.5"
                        value={investmentReturnRate}
                        onChange={(e) => setInvestmentReturnRate(parseFloat(e.target.value) || 0)}
                        className={styles.numInput}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Property Tax Rate</label>
                    <div className={styles.inputPrefixWrap}>
                      <input
                        type="number"
                        step="0.1"
                        value={propertyTaxRate}
                        onChange={(e) => setPropertyTaxRate(parseFloat(e.target.value) || 0)}
                        className={styles.numInput}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              Share Rent vs Buy Model
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Financial Verdict</h2>

          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Over a {stayDurationYears}-Year Horizon</div>
            <div
              className={styles.heroValue}
              style={{ color: result.isBuyBetter ? "#4f7a5b" : "#3b3564" }}
            >
              {result.isBuyBetter ? "Buying is Cheaper" : "Renting is Cheaper"}
            </div>
            <div className={styles.heroSub}>
              Advantage: <strong>{formatCurrency(result.buyingAdvantage)}</strong> in net accumulated wealth
            </div>
          </div>

          {/* Breakeven Banner */}
          <div className={styles.breakevenCard}>
            <div className={styles.breakevenTitle}>Breakeven Year</div>
            <div className={styles.breakevenVal}>
              {result.breakevenYear ? `Year ${result.breakevenYear}` : "Renting outperforms over 30 yrs"}
            </div>
            <div className={styles.breakevenSub}>
              {result.breakevenYear
                ? `Buying overcomes transaction costs and becomes financially superior after ${result.breakevenYear} years.`
                : "Due to high borrowing rates and lower rent, investing market returns outperforms home equity."}
            </div>
          </div>

          {/* Net Wealth Comparison */}
          <div className={styles.statList}>
            <div className={styles.statRow}>
              <span className={styles.statDotBuy}></span>
              <span className={styles.statLabel}>Net Home Equity (After Selling Fees)</span>
              <span className={styles.statVal}>{formatCurrency(result.homeEquityAtDuration)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statDotRent}></span>
              <span className={styles.statLabel}>Renter Investment Portfolio Value</span>
              <span className={styles.statVal}>{formatCurrency(result.renterPortfolioAtDuration)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Initial Monthly Outlay (Buy / Rent)</span>
              <span className={styles.statVal}>
                {formatCurrency(result.initialMonthlyBuy)} / {formatCurrency(result.initialMonthlyRent)}
              </span>
            </div>
          </div>

          <YmylDisclaimer type="mortgage" />
        </div>
      </div>

      {/* 30-YEAR TIMELINE TABLE */}
      {result.yearlyData.length > 0 && (
        <div className={styles.scheduleSection}>
          <div className={styles.scheduleHeader}>
            <div>
              <h3 className={styles.scheduleTitle}>Year-by-Year Net Worth Projection</h3>
              <p className={styles.scheduleSubtitle}>
                Tracking home equity accumulation versus renting and investing the difference.
              </p>
            </div>
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
            >
              {isScheduleExpanded ? "Collapse Timeline" : "View Full 30-Year Table"}
            </button>
          </div>

          <div className={`${styles.tableWrapper} ${isScheduleExpanded ? styles.expanded : ""}`}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Home Value</th>
                  <th>Mortgage Balance</th>
                  <th>Net Home Equity</th>
                  <th>Renter Portfolio</th>
                  <th>Financial Advantage</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyData.map((row) => (
                  <tr key={row.year} className={row.year === stayDurationYears ? styles.highlightRow : ""}>
                    <td>Year {row.year}</td>
                    <td>{formatCurrency(row.homeValue)}</td>
                    <td>{formatCurrency(row.mortgageBalance)}</td>
                    <td className={styles.equityCell}>{formatCurrency(row.homeEquity)}</td>
                    <td className={styles.portfolioCell}>{formatCurrency(row.renterPortfolio)}</td>
                    <td
                      style={{
                        fontWeight: "700",
                        color: row.buyingAdvantage >= 0 ? "#4f7a5b" : "#3b3564",
                      }}
                    >
                      {row.buyingAdvantage >= 0 ? `Buy +${formatCurrency(row.buyingAdvantage)}` : `Rent +${formatCurrency(Math.abs(row.buyingAdvantage))}`}
                    </td>
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
          <div className={styles.historyTitle}>Recent Rent vs Buy Comparisons</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  setHomePrice(item.price);
                  setMonthlyRent(item.rent);
                  if (item.duration) setStayDurationYears(item.duration);
                }}
              >
                <div className={styles.historyAmount}>
                  {item.better} +{formatCurrency(item.adv)}
                </div>
                <div className={styles.historyMeta}>
                  ${item.price?.toLocaleString()} Home vs ${item.rent}/mo Rent • {item.duration} yrs
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
