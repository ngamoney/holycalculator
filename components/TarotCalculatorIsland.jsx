"use client";

import { useState, useEffect } from "react";
import styles from "./TarotCalculatorIsland.module.css";
import { drawTarotSpread } from "@/lib/calculations/tarot";

export default function TarotCalculatorIsland() {
  const [spread, setSpread] = useState("threeCard");
  const [reading, setReading] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const s = params.get("spread");
    if (s && ["threeCard", "singleCard", "yesNo"].includes(s)) {
      setSpread(s);
    }
  }, []);

  const handleDraw = () => {
    const res = drawTarotSpread(spread);
    setReading(res);
  };

  useEffect(() => {
    handleDraw();
  }, [spread]);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("spread", spread);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={styles.islandContainer}>
      <div className={styles.spreadTabs}>
        <button
          type="button"
          className={`${styles.spreadBtn} ${spread === "threeCard" ? styles.spreadBtnActive : ""}`}
          onClick={() => setSpread("threeCard")}
        >
          3-Card Spread (Past, Present, Future)
        </button>
        <button
          type="button"
          className={`${styles.spreadBtn} ${spread === "singleCard" ? styles.spreadBtnActive : ""}`}
          onClick={() => setSpread("singleCard")}
        >
          Daily Single Card
        </button>
        <button
          type="button"
          className={`${styles.spreadBtn} ${spread === "yesNo" ? styles.spreadBtnActive : ""}`}
          onClick={() => setSpread("yesNo")}
        >
          Yes / No Tarot
        </button>
      </div>

      <div className={styles.drawControls}>
        <button type="button" className={styles.drawBtn} onClick={handleDraw}>
          🃏 Draw {spread === "threeCard" ? "3 Cards" : "New Card"} Now
        </button>
      </div>

      {reading && reading.type === "yesNo" && (
        <div className={styles.yesNoBanner}>
          Tarot Oracle Answer: {reading.answer}
        </div>
      )}

      {reading && (
        <div className={styles.cardsGrid}>
          {reading.cards.map((item, idx) => (
            <div key={`${spread}-${idx}-${item.card.id}`} className={styles.tarotCard}>
              <div className={styles.cardPos}>{item.position}</div>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>🔮</span>
                <h3 className={styles.cardName}>
                  {item.card.id}. {item.card.name}
                </h3>
              </div>
              <div className={styles.keywordsBar}>
                {item.card.keywords.map((kw) => (
                  <span key={kw} className={styles.keywordChip}>
                    {kw}
                  </span>
                ))}
              </div>
              <div className={styles.cardMeaning}>{item.card.uprightMeaning}</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actionRow}>
        <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
          {copied ? "✓ Link Copied!" : "🔗 Share Tarot Reading URL"}
        </button>
      </div>
    </div>
  );
}
