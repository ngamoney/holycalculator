"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./IdealWeightCalculatorIsland.module.css";
import { calculateIdealWeight, encodeIdealWeightState, decodeIdealWeightState } from "@/lib/calculations/idealWeight";

const STORAGE_KEY = "holycalc_idealweight_history";

export default function IdealWeightCalculatorIsland() {
  const [unit, setUnit] = useState("us"); // "us" | "metric" | "other"
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("male");

  // US fields
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("10");

  // Metric fields
  const [heightCm, setHeightCm] = useState("178");

  // Other units fields
  const [customHeight, setCustomHeight] = useState("178");
  const [heightUnit, setHeightUnit] = useState("cm");

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Parse URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlState = decodeIdealWeightState(window.location.search);
    if (urlState) {
      if (urlState.unit) setUnit(urlState.unit);
      if (urlState.gender) setGender(urlState.gender);
      if (urlState.age) setAge(urlState.age);
      if (urlState.heightFt) setHeightFt(urlState.heightFt);
      if (urlState.heightIn) setHeightIn(urlState.heightIn);
      if (urlState.heightCm) setHeightCm(urlState.heightCm);
    }

    // Load history
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Compute Ideal Weight
  const runCalculation = useCallback(() => {
    let calcParams = {
      unit,
      age,
      gender,
    };

    if (unit === "us") {
      calcParams.heightFt = heightFt;
      calcParams.heightIn = heightIn;
    } else if (unit === "metric") {
      calcParams.heightCm = heightCm;
    } else {
      let cm = parseFloat(customHeight) || 0;
      if (heightUnit === "m") cm = cm * 100;
      if (heightUnit === "in") cm = cm * 2.54;
      if (heightUnit === "ft") cm = cm * 30.48;
      calcParams.heightCm = cm;
    }

    const res = calculateIdealWeight(calcParams);
    setResult(res);

    // Save history
    if (res && !res.isPediatric && typeof window !== "undefined") {
      const devineRow = res.formulaRows.find((r) => r.id === "devine");
      const item = {
        id: Date.now(),
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        devineVal: devineRow ? devineRow.valueText : "",
        bmiRange: res.healthyBmiRange ? res.healthyBmiRange.text : "",
        heightText: unit === "metric" ? `${res.heightCm} cm` : `${heightFt}'${heightIn}"`,
      };

      setHistory((prev) => {
        const filtered = prev.filter((h) => h.heightText !== item.heightText || h.devineVal !== item.devineVal);
        const updated = [item, ...filtered].slice(0, 5);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }
  }, [unit, age, gender, heightFt, heightIn, heightCm, customHeight, heightUnit]);

  // Debounce
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runCalculation();
    }, 200);
    return () => clearTimeout(timerRef.current);
  }, [runCalculation]);

  const handleTabChange = (newUnit) => {
    setUnit(newUnit);
    if (newUnit === "metric" && heightFt) {
      const totalIn = parseFloat(heightFt) * 12 + (parseFloat(heightIn) || 0);
      setHeightCm(Math.round(totalIn * 2.54).toString());
    } else if (newUnit === "us" && heightCm) {
      const totalIn = (parseFloat(heightCm) || 0) / 2.54;
      setHeightFt(Math.floor(totalIn / 12).toString());
      setHeightIn(Math.round(totalIn % 12).toString());
    }
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const search = encodeIdealWeightState({
      unit,
      gender,
      age,
      heightFt,
      heightIn,
      heightCm,
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${search}`;
    window.history.replaceState(null, "", `?${search}`);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className={styles.islandCard}>
      {/* Unit Selector Tabs */}
      <div className={styles.tabGroup} role="tablist" aria-label="Ideal Weight Unit Systems">
        <button
          role="tab"
          aria-selected={unit === "us"}
          className={`${styles.tabBtn} ${unit === "us" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("us")}
        >
          US Customary (ft/in)
        </button>
        <button
          role="tab"
          aria-selected={unit === "metric"}
          className={`${styles.tabBtn} ${unit === "metric" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("metric")}
        >
          Metric (cm)
        </button>
        <button
          role="tab"
          aria-selected={unit === "other"}
          className={`${styles.tabBtn} ${unit === "other" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("other")}
        >
          Other Units
        </button>
      </div>

      {/* Input Form */}
      <div className={styles.formGrid}>
        {/* Gender selector */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Biological Sex</label>
          <div className={styles.genderSelector}>
            <button
              type="button"
              className={`${styles.genderBtn} ${gender === "male" ? styles.genderBtnActive : ""}`}
              onClick={() => setGender("male")}
            >
              ♂ Male
            </button>
            <button
              type="button"
              className={`${styles.genderBtn} ${gender === "female" ? styles.genderBtnActive : ""}`}
              onClick={() => setGender("female")}
            >
              ♀ Female
            </button>
          </div>
        </div>

        {/* Age field */}
        <div className={styles.fieldGroup}>
          <label htmlFor="iw-age-input" className={styles.fieldLabel}>
            Age <span className={styles.subText}>(2–80 years)</span>
          </label>
          <input
            id="iw-age-input"
            type="number"
            min="2"
            max="80"
            className={styles.inputControl}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        {/* Height fields */}
        {unit === "us" && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Height</label>
            <div className={styles.twoInputs}>
              <input
                id="iw-height-ft"
                type="number"
                min="3"
                max="8"
                placeholder="Feet"
                aria-label="Height in feet"
                className={styles.inputControl}
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
              />
              <input
                id="iw-height-in"
                type="number"
                min="0"
                max="11"
                placeholder="Inches"
                aria-label="Height in inches"
                className={styles.inputControl}
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
              />
            </div>
          </div>
        )}

        {unit === "metric" && (
          <div className={styles.fieldGroup}>
            <label htmlFor="iw-height-cm" className={styles.fieldLabel}>Height (cm)</label>
            <input
              id="iw-height-cm"
              type="number"
              min="100"
              max="275"
              className={styles.inputControl}
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />
          </div>
        )}

        {unit === "other" && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Height</label>
            <div className={styles.twoInputs}>
              <input
                type="number"
                step="any"
                className={styles.inputControl}
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
              />
              <select
                className={styles.inputControl}
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
              >
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="in">in</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <div className={styles.resultBox}>
          <div className={styles.resultTitle}>
            <span>
              Calculated Results for {gender === "male" ? "Male" : "Female"}, Age {result.age} (
              {unit === "metric" ? `${result.heightCm} cm` : `${heightFt}'${heightIn}"`})
            </span>
          </div>

          {result.isPediatric ? (
            <div className={styles.pediatricNotice}>
              <span style={{ fontSize: "20px" }}>ℹ️</span>
              <div>
                <strong>Pediatric CDC Growth Percentile Note (Age {result.age}):</strong> Linear Ideal Body Weight (IBW) formulas are calibrated for adults aged 18+. For children and adolescents under 18, body mass is evaluated using sex- and age-adjusted CDC growth chart percentiles. Consult a pediatrician to evaluate growth trajectories.
              </div>
            </div>
          ) : (
            <div className={styles.comparisonTableContainer}>
              <table className={styles.compTable}>
                <thead>
                  <tr>
                    <th>Formula / Reference Standard</th>
                    <th style={{ textAlign: "right" }}>Calculated Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {result.formulaRows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className={styles.formulaName}>{row.name}</div>
                        <div className={styles.formulaNote}>{row.note}</div>
                      </td>
                      <td className={styles.weightVal}>{row.valueText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Clinical YMYL Disclaimer */}
          <div className={styles.disclaimerNotice}>
            <strong>Medical &amp; Clinical Disclaimer:</strong> These formulas were originally developed for medical drug dosage estimation in clinical settings, not as aesthetic or personal fitness targets. They account only for height and biological sex and do not measure body composition, muscle mass, or bone density. Consult a healthcare provider for personalized medical evaluation.
          </div>

          {/* Actions Bar */}
          <div className={styles.actionsBar}>
            <button type="button" className={styles.shareBtn} onClick={handleShare}>
              🔗 {copied ? "Link Copied!" : "Share Results"}
            </button>
            <span style={{ fontSize: "12px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>
              Instant Auto-Calculated
            </span>
          </div>
        </div>
      )}

      {/* History Log */}
      {history.length > 0 && (
        <div className={styles.historyBox}>
          <div className={styles.historyTitle}>
            <span>Recent Calculations (localStorage)</span>
            <button type="button" className={styles.clearBtn} onClick={clearHistory}>
              Clear History
            </button>
          </div>
          <ul className={styles.historyList}>
            {history.map((h) => (
              <li key={h.id} className={styles.historyItem}>
                <span>{h.date} — Height {h.heightText}: Devine <strong>{h.devineVal}</strong> (BMI Range: {h.bmiRange})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
