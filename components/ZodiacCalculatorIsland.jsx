"use client";

import { useState, useEffect } from "react";
import styles from "./ZodiacCalculatorIsland.module.css";
import { ZODIAC_SIGNS, calculateZodiacCompatibility } from "@/lib/calculations/zodiac";

export default function ZodiacCalculatorIsland() {
  const [person1, setPerson1] = useState("leo");
  const [person2, setPerson2] = useState("aries");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p1 = params.get("p1");
    const p2 = params.get("p2");
    if (p1 && ZODIAC_SIGNS[p1.toLowerCase()]) setPerson1(p1.toLowerCase());
    if (p2 && ZODIAC_SIGNS[p2.toLowerCase()]) setPerson2(p2.toLowerCase());
  }, []);

  const res = calculateZodiacCompatibility(person1, person2);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("p1", person1);
    url.searchParams.set("p2", person2);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const signList = Object.values(ZODIAC_SIGNS);

  return (
    <div className={styles.islandContainer}>
      <div className={styles.selectorGrid}>
        <div className={styles.personBox}>
          <div className={styles.boxLabel}>Person 1 Zodiac Sign</div>
          <select
            className={styles.selectInput}
            value={person1}
            onChange={(e) => setPerson1(e.target.value)}
          >
            {signList.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.symbol} {s.name} ({s.element})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.personBox}>
          <div className={styles.boxLabel}>Person 2 Zodiac Sign</div>
          <select
            className={styles.selectInput}
            value={person2}
            onChange={(e) => setPerson2(e.target.value)}
          >
            {signList.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.symbol} {s.name} ({s.element})
              </option>
            ))}
          </select>
        </div>
      </div>

      {res && (
        <div className={styles.resultCard}>
          <div className={styles.matchHeader}>
            <div className={styles.signBadge}>
              {res.p1.symbol} {res.p1.name}
            </div>
            <div className={styles.heartDivider}>♥</div>
            <div className={styles.signBadge}>
              {res.p2.symbol} {res.p2.name}
            </div>
          </div>

          <div className={styles.scoreCircle}>
            <span className={styles.scoreVal}>{res.scores.overall}%</span>
            <span className={styles.scoreLabel}>Love Match</span>
          </div>

          <div className={styles.scoreGrid}>
            <div className={styles.scoreItem}>
              <div className={styles.scoreItemTitle}>Communication</div>
              <div className={styles.scoreItemVal}>{res.scores.communication}%</div>
            </div>
            <div className={styles.scoreItem}>
              <div className={styles.scoreItemTitle}>Passion</div>
              <div className={styles.scoreItemVal}>{res.scores.passion}%</div>
            </div>
            <div className={styles.scoreItem}>
              <div className={styles.scoreItemTitle}>Shared Values</div>
              <div className={styles.scoreItemVal}>{res.scores.values}%</div>
            </div>
          </div>

          <div className={styles.synergyText}>
            <strong>Element Synergy:</strong> {res.elementSynergy}<br />
            <span style={{ fontSize: "0.8125rem", color: "var(--ink-60)", marginTop: "4px", display: "block" }}>
              {res.modalitySynergy}
            </span>
          </div>
        </div>
      )}

      <div className={styles.actionRow}>
        <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
          {copied ? "✓ Link Copied!" : "🔗 Share Compatibility Match URL"}
        </button>
      </div>
    </div>
  );
}
