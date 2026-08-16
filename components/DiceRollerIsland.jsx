"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { rollDice, saveConfig, loadConfig } from "@/lib/calculations/dice";
import styles from "./DiceRollerIsland.module.css";

/* ──────────────────────────────────────────────────────────────
   Inline SVG faces for d6 — six small SVGs, no external requests
   ────────────────────────────────────────────────────────────── */
const D6_FACES = {
  1: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#3B3564" />
      <circle cx="32" cy="32" r="6" fill="#fff" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#3B3564" />
      <circle cx="20" cy="20" r="5.5" fill="#fff" />
      <circle cx="44" cy="44" r="5.5" fill="#fff" />
    </svg>
  ),
  3: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#3B3564" />
      <circle cx="20" cy="20" r="5.5" fill="#fff" />
      <circle cx="32" cy="32" r="5.5" fill="#fff" />
      <circle cx="44" cy="44" r="5.5" fill="#fff" />
    </svg>
  ),
  4: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#3B3564" />
      <circle cx="20" cy="20" r="5.5" fill="#fff" />
      <circle cx="44" cy="20" r="5.5" fill="#fff" />
      <circle cx="20" cy="44" r="5.5" fill="#fff" />
      <circle cx="44" cy="44" r="5.5" fill="#fff" />
    </svg>
  ),
  5: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#3B3564" />
      <circle cx="20" cy="20" r="5.5" fill="#fff" />
      <circle cx="44" cy="20" r="5.5" fill="#fff" />
      <circle cx="32" cy="32" r="5.5" fill="#fff" />
      <circle cx="20" cy="44" r="5.5" fill="#fff" />
      <circle cx="44" cy="44" r="5.5" fill="#fff" />
    </svg>
  ),
  6: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#3B3564" />
      <circle cx="20" cy="18" r="5.5" fill="#fff" />
      <circle cx="44" cy="18" r="5.5" fill="#fff" />
      <circle cx="20" cy="32" r="5.5" fill="#fff" />
      <circle cx="44" cy="32" r="5.5" fill="#fff" />
      <circle cx="20" cy="46" r="5.5" fill="#fff" />
      <circle cx="44" cy="46" r="5.5" fill="#fff" />
    </svg>
  ),
};

const POLYHEDRAL_PRESETS = [
  { label: "d4", sides: 4 },
  { label: "d6", sides: 6 },
  { label: "d8", sides: 8 },
  { label: "d10", sides: 10 },
  { label: "d12", sides: 12 },
  { label: "d20", sides: 20 },
];

/* ──────────────────────────────────────────────────────────────
   Main Island Component
   ────────────────────────────────────────────────────────────── */
export default function DiceRollerIsland() {
  // Standard d6 roller state
  const [stdCount, setStdCount] = useState(2);
  const [stdResult, setStdResult] = useState(null);
  const [stdRolling, setStdRolling] = useState(false);

  // Custom dice roller state
  const [customSides, setCustomSides] = useState(20);
  const [customCount, setCustomCount] = useState(1);
  const [customResult, setCustomResult] = useState(null);
  const [customRolling, setCustomRolling] = useState(false);
  const [activePreset, setActivePreset] = useState(20);

  // Load last-used custom config from localStorage
  useEffect(() => {
    const saved = loadConfig();
    if (saved) {
      setCustomSides(saved.sides);
      setCustomCount(saved.count);
      setActivePreset(saved.sides);
    }
  }, []);

  /* Roll standard d6 */
  const handleRollStd = useCallback(() => {
    if (stdRolling) return;
    setStdRolling(true);
    setStdResult(null);
    // Brief delay to let CSS class trigger re-apply
    setTimeout(() => {
      const result = rollDice(stdCount, 6);
      setStdResult(result);
      setStdRolling(false);
    }, 20);
  }, [stdCount, stdRolling]);

  /* Roll custom dice */
  const handleRollCustom = useCallback(() => {
    if (customRolling) return;
    setCustomRolling(true);
    setCustomResult(null);
    setTimeout(() => {
      const result = rollDice(customCount, customSides);
      setCustomResult(result);
      saveConfig(customCount, customSides);
      setCustomRolling(false);
    }, 20);
  }, [customCount, customSides, customRolling]);

  const handlePreset = (sides) => {
    setActivePreset(sides);
    setCustomSides(sides);
    setCustomResult(null);
  };

  /* Keyboard shortcut: Enter on the page rolls the focused card's dice */
  return (
    <div className={styles.calcMain}>

      {/* ── Section A: Standard 6-Sided Dice Roller ─────────── */}
      <div className={styles.calcCard}>
        <div className={styles.calcCardHeader}>
          <div className={styles.calcBadgeIcon}>⚄</div>
          <span className={styles.calcCardTitle}>Standard Dice Roller</span>
        </div>

        <div className={styles.formSection}>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="std-count" className={styles.inputLabel}>
                Number of Dice (d6)
              </label>
              <input
                id="std-count"
                type="number"
                min="1"
                max="20"
                className={styles.numInput}
                value={stdCount}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                  setStdCount(v);
                  setStdResult(null);
                }}
              />
            </div>
            <button
              type="button"
              className={styles.rollBtn}
              onClick={handleRollStd}
              disabled={stdRolling}
              aria-label="Roll standard dice"
            >
              <span>🎲</span>
              <span>Roll</span>
            </button>
          </div>
        </div>

        {/* Result display */}
        {stdResult ? (
          <div className={styles.diceResultSection}>
            <div className={styles.diceRow}>
              {stdResult.rolls.map((value, i) => (
                <div
                  key={i}
                  className={`${styles.diceFace} ${styles.rolling}`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {D6_FACES[value]}
                </div>
              ))}
            </div>
            <div className={styles.totalBadge}>
              <div className={styles.totalLabel}>Total</div>
              <div className={styles.totalValue}>{stdResult.total}</div>
              {stdResult.count > 1 && (
                <div className={styles.rollsBreakdown}>
                  {stdResult.rolls.join(" + ")} = {stdResult.total}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyStateIcon}>🎲</span>
            Set number of dice and click Roll
          </div>
        )}
      </div>

      {/* ── Section B: Non-Conventional Dice Roller ─────────── */}
      <div className={styles.calcCard}>
        <div className={styles.calcCardHeader}>
          <div className={styles.calcBadgeIcon}>⬡</div>
          <span className={styles.calcCardTitle}>Custom Dice Roller</span>
        </div>

        <div className={styles.formSection}>
          {/* Quick preset buttons */}
          <div>
            <div className={styles.inputLabel} style={{ marginBottom: "10px" }}>
              Quick Select
            </div>
            <div className={styles.presetRow}>
              {POLYHEDRAL_PRESETS.map(({ label, sides }) => (
                <button
                  key={sides}
                  type="button"
                  className={`${styles.presetBtn} ${activePreset === sides ? styles.active : ""}`}
                  onClick={() => handlePreset(sides)}
                  aria-label={`Select ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="custom-sides" className={styles.inputLabel}>
                Sides on Dice
              </label>
              <input
                id="custom-sides"
                type="number"
                min="2"
                max="10000"
                className={styles.numInput}
                value={customSides}
                onChange={(e) => {
                  const v = Math.max(2, parseInt(e.target.value) || 2);
                  setCustomSides(v);
                  setActivePreset(v);
                  setCustomResult(null);
                }}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="custom-count" className={styles.inputLabel}>
                Number of Dice
              </label>
              <input
                id="custom-count"
                type="number"
                min="1"
                max="100"
                className={styles.numInput}
                value={customCount}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(100, parseInt(e.target.value) || 1));
                  setCustomCount(v);
                  setCustomResult(null);
                }}
              />
            </div>
            <button
              type="button"
              className={styles.rollBtn}
              onClick={handleRollCustom}
              disabled={customRolling}
              aria-label="Roll custom dice"
            >
              <span>🎲</span>
              <span>Roll</span>
            </button>
          </div>
        </div>

        {/* Numeric result grid for non-d6 dice */}
        {customResult ? (
          <div className={styles.diceResultSection}>
            <div className={styles.numericDiceRow}>
              {customResult.rolls.slice(0, 30).map((value, i) => (
                <div
                  key={i}
                  className={`${styles.numericDie} ${styles.rolling}`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {value}
                </div>
              ))}
              {customResult.count > 30 && (
                <div
                  className={styles.numericDie}
                  style={{ background: "var(--ink-60)", fontSize: "12px" }}
                >
                  +{customResult.count - 30}
                </div>
              )}
            </div>
            <div className={styles.totalBadge}>
              <div className={styles.totalLabel}>
                {customResult.count}d{customResult.sides} Total
              </div>
              <div className={styles.totalValue}>{customResult.total}</div>
              {customResult.count > 1 && customResult.count <= 12 && (
                <div className={styles.rollsBreakdown}>
                  {customResult.rolls.join(" + ")} = {customResult.total}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyStateIcon}>⬡</span>
            Select a die type and click Roll
          </div>
        )}
      </div>
    </div>
  );
}
