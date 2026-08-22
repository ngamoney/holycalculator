"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateCreditCardPayoff, formatCurrency, formatCurrencyCents } from "@/lib/calculations/creditCardPayoff";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./CreditCardPayoffCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_creditcardpayoff_history";

export default function CreditCardPayoffCalculatorIsland() {
  const [monthlyBudget, setMonthlyBudget] = useState(500);
  const [strategy, setStrategy] = useState("avalanche"); // 'avalanche' | 'snowball'
  const [cards, setCards] = useState([
    { id: 1, name: "Card 1", balance: 4600, minPayment: 100, interestRate: 18.99 },
    { id: 2, name: "Card 2", balance: 3900, minPayment: 90, interestRate: 19.99 },
    { id: 3, name: "Card 3", balance: 6000, minPayment: 120, interestRate: 15.99 },
  ]);

  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL and LocalStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("budget")) setMonthlyBudget(parseFloat(params.get("budget")) || 500);
    if (params.has("strat")) setStrategy(params.get("strat"));
    if (params.has("cards")) {
      try {
        const parsed = JSON.parse(decodeURIComponent(params.get("cards")));
        if (Array.isArray(parsed) && parsed.length > 0) setCards(parsed);
      } catch {
        // Use default cards
      }
    }

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        budget: monthlyBudget,
        strat: strategy,
        cards: encodeURIComponent(JSON.stringify(cards)),
      });
    }, 300);
    return () => clearTimeout(syncTimerRef.current);
  }, [monthlyBudget, strategy, cards]);

  // Handle Card Edits
  const handleCardChange = (id, field, value) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleAddCard = () => {
    if (cards.length >= 8) return;
    const nextId = cards.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1;
    setCards((prev) => [
      ...prev,
      { id: nextId, name: `Card ${nextId}`, balance: 2500, minPayment: 60, interestRate: 19.99 },
    ]);
  };

  const handleRemoveCard = (id) => {
    if (cards.length <= 1) return;
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  // Live calculation
  const result = useMemo(() => {
    return calculateCreditCardPayoff({
      monthlyBudget,
      strategy,
      cards,
    });
  }, [monthlyBudget, strategy, cards]);

  // Save history
  useEffect(() => {
    if (!result || result.error || typeof window === "undefined" || result.totalStartingBalance <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      budget: monthlyBudget,
      strategy,
      totalDebt: Math.round(result.totalStartingBalance),
      time: result.timeFormatted,
      saved: Math.round(result.interestSaved),
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "totalDebt");
    setHistory(updated);
  }, [result?.totalStartingBalance, result?.totalMonths]);

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

  const totalPaid = result.totalPaid || 1;
  const principalPct = Math.round((result.totalStartingBalance / totalPaid) * 100);
  const interestPct = Math.max(0, 100 - principalPct);

  return (
    <div className={styles.islandContainer}>
      {toastMessage && <div className={styles.toastNotice}>{toastMessage}</div>}

      <div className={styles.calcGrid}>
        {/* INPUT CARD */}
        <div className={styles.inputCard}>
          <h2 className={styles.cardHeader}>Credit Card Payoff Plan</h2>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="monthlyBudget" className={styles.label}>
                Monthly Budget for All Cards
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="monthlyBudget"
                type="number"
                min="50"
                step="50"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
              <span className={styles.suffix}>/month</span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Payoff Acceleration Strategy</label>
            </div>
            <div className={styles.tabContainer}>
              <button
                type="button"
                className={`${styles.tabBtn} ${strategy === "avalanche" ? styles.activeTab : ""}`}
                onClick={() => setStrategy("avalanche")}
              >
                Avalanche (Highest APR)
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${strategy === "snowball" ? styles.activeTab : ""}`}
                onClick={() => setStrategy("snowball")}
              >
                Snowball (Lowest Balance)
              </button>
            </div>
          </div>

          {/* CARDS LIST TABLE */}
          <div className={styles.cardsTableWrap}>
            <div className={styles.cardsTableHeader}>
              <span>Card Name</span>
              <span>Balance</span>
              <span>Min Pay</span>
              <span>APR %</span>
              <span></span>
            </div>

            <div className={styles.cardsList}>
              {cards.map((card) => (
                <div key={card.id} className={styles.cardRow}>
                  <input
                    type="text"
                    value={card.name}
                    onChange={(e) => handleCardChange(card.id, "name", e.target.value)}
                    className={styles.cardNameInput}
                    placeholder="Card Name"
                  />
                  <div className={styles.miniInputWrap}>
                    <span className={styles.miniPrefix}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={card.balance}
                      onChange={(e) => handleCardChange(card.id, "balance", parseFloat(e.target.value) || 0)}
                      className={styles.miniInput}
                    />
                  </div>
                  <div className={styles.miniInputWrap}>
                    <span className={styles.miniPrefix}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={card.minPayment}
                      onChange={(e) => handleCardChange(card.id, "minPayment", parseFloat(e.target.value) || 0)}
                      className={styles.miniInput}
                    />
                  </div>
                  <div className={styles.miniInputWrap}>
                    <input
                      type="number"
                      min="0"
                      max="45"
                      step="0.1"
                      value={card.interestRate}
                      onChange={(e) => handleCardChange(card.id, "interestRate", parseFloat(e.target.value) || 0)}
                      className={styles.miniInput}
                    />
                    <span className={styles.miniSuffix}>%</span>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleRemoveCard(card.id)}
                    title="Remove Card"
                    disabled={cards.length <= 1}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {cards.length < 8 && (
              <button type="button" className={styles.addCardBtn} onClick={handleAddCard}>
                + Add Another Credit Card
              </button>
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
              Share Payoff Plan
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Payoff Strategy Results</h2>

          {result.error ? (
            <div className={styles.errorAlert}>{result.error}</div>
          ) : (
            <>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>Total Time to Debt-Free</div>
                <div className={styles.heroValue}>{result.timeFormatted}</div>
                <div className={styles.heroSub}>
                  Total starting debt: <strong>{formatCurrency(result.totalStartingBalance)}</strong> across {cards.length} cards
                </div>
              </div>

              {/* Savings callout banner */}
              {result.interestSaved > 0 && (
                <div className={styles.savingsCallout}>
                  <div className={styles.savingsCalloutTitle}>
                    {strategy === "avalanche" ? "Debt Avalanche Advantage" : "Debt Snowball Advantage"}
                  </div>
                  <div className={styles.savingsCalloutBody}>
                    You will save <strong>{formatCurrencyCents(result.interestSaved)}</strong> in interest and become debt-free{" "}
                    <strong>{Math.floor(result.monthsSaved / 12)} years {result.monthsSaved % 12} months earlier</strong> compared to paying only card minimums!
                  </div>
                </div>
              )}

              {/* Individual Card Milestones */}
              {Object.keys(result.cardPayoffDates).length > 0 && (
                <div className={styles.milestoneSection}>
                  <div className={styles.milestoneTitle}>Estimated Debt-Free Milestones</div>
                  <div className={styles.milestoneList}>
                    {Object.entries(result.cardPayoffDates).map(([cardName, month]) => (
                      <div key={cardName} className={styles.milestoneItem}>
                        <span>{cardName} Paid Off:</span>
                        <strong>Month {month} (~{(month / 12).toFixed(1)} yrs)</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Breakdown Bar */}
              <div className={styles.breakdownBar}>
                <div className={styles.barPrincipal} style={{ width: `${principalPct}%` }} title={`Debt Principal: ${principalPct}%`} />
                <div className={styles.barInterest} style={{ width: `${interestPct}%` }} title={`Interest: ${interestPct}%`} />
              </div>

              <div className={styles.statList}>
                <div className={styles.statRow}>
                  <span className={styles.statDotPrincipal}></span>
                  <span className={styles.statLabel}>Total Principal Owed</span>
                  <span className={styles.statVal}>{formatCurrency(result.totalStartingBalance)}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statDotInterest}></span>
                  <span className={styles.statLabel}>Total Interest Paid</span>
                  <span className={styles.statVal}>{formatCurrencyCents(result.totalInterest)}</span>
                </div>
                <div className={`${styles.statRow} ${styles.statTotal}`}>
                  <span>Total Amount Paid</span>
                  <span>{formatCurrencyCents(result.totalPaid)}</span>
                </div>
              </div>

              <YmylDisclaimer type="debt" />
            </>
          )}
        </div>
      </div>

      {/* DETAILED SCHEDULE */}
      {!result.error && result.schedule.length > 0 && (
        <div className={styles.scheduleSection}>
          <div className={styles.scheduleHeader}>
            <div>
              <h3 className={styles.scheduleTitle}>Multi-Card Payoff Timeline</h3>
              <p className={styles.scheduleSubtitle}>
                Month-by-month tracking of rollover payments and individual card balance reductions.
              </p>
            </div>
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
            >
              {isScheduleExpanded ? "Collapse Timeline" : "View Full Timeline"}
            </button>
          </div>

          <div className={`${styles.tableWrapper} ${isScheduleExpanded ? styles.expanded : ""}`}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Monthly Payment</th>
                  <th>Interest Charge</th>
                  {cards.map((c) => (
                    <th key={c.id}>{c.name} Balance</th>
                  ))}
                  <th>Total Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month}>
                    <td>Month {row.month}</td>
                    <td>{formatCurrencyCents(row.totalPayment)}</td>
                    <td>{formatCurrencyCents(row.totalInterest)}</td>
                    {row.cardsState.map((cardSt, i) => (
                      <td key={i}>
                        {cardSt.balance <= 0 ? (
                          <span className={styles.paidOffTag}>PAID OFF</span>
                        ) : (
                          formatCurrency(cardSt.balance)
                        )}
                      </td>
                    ))}
                    <td className={styles.balanceCell}>{formatCurrency(row.remainingBalance)}</td>
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
          <div className={styles.historyTitle}>Recent Payoff Plans</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  if (item.budget) setMonthlyBudget(item.budget);
                  if (item.strategy) setStrategy(item.strategy);
                }}
              >
                <div className={styles.historyAmount}>{formatCurrency(item.totalDebt)} Debt</div>
                <div className={styles.historyMeta}>
                  ${item.budget}/mo • {item.strategy === "avalanche" ? "Avalanche" : "Snowball"} • {item.time}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
