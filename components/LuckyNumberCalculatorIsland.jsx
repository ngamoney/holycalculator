"use client";

import { useState, useEffect } from "react";
import styles from "./LuckyNumberCalculatorIsland.module.css";
import { generateLuckyNumbers } from "@/lib/calculations/luckyNumber";

const GAMES = [
  { id: "powerball", label: "🇺🇸 Powerball" },
  { id: "megamillions", label: "🇺🇸 Mega Millions" },
  { id: "cash4life", label: "🇺🇸 Cash4Life" },
  { id: "pick3", label: "Pick 3" },
  { id: "pick4", label: "Pick 4" },
  { id: "pick5", label: "Pick 5" },
  { id: "dob", label: "Birthday Numerology" },
];

export default function LuckyNumberCalculatorIsland() {
  const [game, setGame] = useState("powerball");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const g = params.get("game");
    if (g && GAMES.some((item) => item.id === g)) {
      setGame(g);
    }
  }, []);

  const handleGenerate = () => {
    const res = generateLuckyNumbers(game);
    setResult(res);
  };

  useEffect(() => {
    handleGenerate();
  }, [game]);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("game", game);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={styles.islandContainer}>
      <div className={styles.gameTabs}>
        {GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`${styles.gameBtn} ${game === g.id ? styles.gameBtnActive : ""}`}
            onClick={() => setGame(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {result && (
        <div className={styles.resultCard}>
          <div className={styles.gameTitle}>{result.gameName} Lucky Numbers</div>
          <div className={styles.ballsContainer}>
            {result.mainNumbers.map((num, idx) => (
              <div key={`${game}-${idx}-${num}`} className={styles.lottoBall}>
                {num}
              </div>
            ))}
            {result.bonusNumber !== undefined && (
              <div className={`${styles.lottoBall} ${styles.bonusBall}`} title={result.bonusLabel}>
                {result.bonusNumber}
              </div>
            )}
          </div>

          <button type="button" className={styles.generateBtn} onClick={handleGenerate}>
            🎲 Generate New {result.gameName} Numbers
          </button>
        </div>
      )}

      <div className={styles.actionRow}>
        <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
          {copied ? "✓ Link Copied!" : "🔗 Share Generator URL"}
        </button>
      </div>
    </div>
  );
}
