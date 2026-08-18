"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./BodyFatCalculatorIsland.module.css";
import { calculateBodyFat } from "@/lib/calculations/bodyFat";

const STORAGE_KEY = "holycalc_bodyfat_history";

export default function BodyFatCalculatorIsland() {
  const [unit, setUnit] = useState("us"); // "us" | "metric"
  const [gender, setGender] = useState("male"); // "male" | "female"
  const [age, setAge] = useState("30");

  // US Customary inputs
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("10");
  const [weight, setWeight] = useState("175");
  const [neck, setNeck] = useState("15");
  const [waist, setWaist] = useState("34");
  const [hip, setHip] = useState("38");

  // Metric inputs
  const [heightCm, setHeightCm] = useState("178");

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Unit tab toggle handler with value conversion
  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return;
    setUnit(newUnit);

    if (newUnit === "metric") {
      const ft = parseFloat(heightFt) || 0;
      const inc = parseFloat(heightIn) || 0;
      const totalIn = ft * 12 + inc;
      if (totalIn > 0) setHeightCm((totalIn * 2.54).toFixed(1));

      const wLbs = parseFloat(weight) || 0;
      if (wLbs > 0) setWeight((wLbs * 0.45359237).toFixed(1));

      const nIn = parseFloat(neck) || 0;
      if (nIn > 0) setNeck((nIn * 2.54).toFixed(1));

      const wIn = parseFloat(waist) || 0;
      if (wIn > 0) setWaist((wIn * 2.54).toFixed(1));

      const hIn = parseFloat(hip) || 0;
      if (hIn > 0) setHip((hIn * 2.54).toFixed(1));
    } else {
      const cm = parseFloat(heightCm) || 0;
      if (cm > 0) {
        const totalIn = cm / 2.54;
        setHeightFt(Math.floor(totalIn / 12).toString());
        setHeightIn((totalIn % 12).toFixed(1));
      }

      const wKg = parseFloat(weight) || 0;
      if (wKg > 0) setWeight((wKg * 2.20462).toFixed(1));

      const nCm = parseFloat(neck) || 0;
      if (nCm > 0) setNeck((nCm / 2.54).toFixed(1));

      const wCm = parseFloat(waist) || 0;
      if (wCm > 0) setWaist((wCm / 2.54).toFixed(1));

      const hCm = parseFloat(hip) || 0;
      if (hCm > 0) setHip((hCm / 2.54).toFixed(1));
    }
  };

  // URL state & localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const paramUnit = params.get("unit");
    const paramGender = params.get("gender");
    const paramAge = params.get("age");
    const paramWeight = params.get("weight");
    const paramHeightFt = params.get("heightFt");
    const paramHeightIn = params.get("heightIn");
    const paramHeightCm = params.get("heightCm");
    const paramNeck = params.get("neck");
    const paramWaist = params.get("waist");
    const paramHip = params.get("hip");

    if (paramUnit && ["us", "metric"].includes(paramUnit)) setUnit(paramUnit);
    if (paramGender && ["male", "female"].includes(paramGender)) setGender(paramGender);
    if (paramAge) setAge(paramAge);
    if (paramWeight) setWeight(paramWeight);
    if (paramHeightFt) setHeightFt(paramHeightFt);
    if (paramHeightIn) setHeightIn(paramHeightIn);
    if (paramHeightCm) setHeightCm(paramHeightCm);
    if (paramNeck) setNeck(paramNeck);
    if (paramWaist) setWaist(paramWaist);
    if (paramHip) setHip(paramHip);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save history helper
  const saveToHistory = useCallback((res) => {
    if (!res || !res.isValid) return;

    const weightLabel = res.unit === "us" ? `${res.weightLbs} lbs` : `${res.weightKg} kg`;
    const item = {
      id: Date.now(),
      gender: res.gender,
      bfp: res.navy.bfpFormatted,
      categoryLabel: res.navy.category.label,
      weightLabel,
    };

    setHistory((prev) => {
      if (
        prev.length > 0 &&
        prev[0].bfp === item.bfp &&
        prev[0].gender === item.gender &&
        prev[0].weightLabel === item.weightLabel
      ) {
        return prev;
      }
      const updated = [item, ...prev.slice(0, 4)];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Debounced calculation
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const res = calculateBodyFat({
        unit,
        gender,
        age,
        weight,
        heightFt,
        heightIn,
        heightCm,
        neck,
        waist,
        hip,
      });

      setResult(res);
      if (res && res.isValid) {
        saveToHistory(res);
      }
    }, 150);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [unit, gender, age, weight, heightFt, heightIn, heightCm, neck, waist, hip, saveToHistory]);

  // Share URL creation
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("unit", unit);
    url.searchParams.set("gender", gender);
    url.searchParams.set("age", age);
    url.searchParams.set("weight", weight);
    if (unit === "us") {
      url.searchParams.set("heightFt", heightFt);
      url.searchParams.set("heightIn", heightIn);
    } else {
      url.searchParams.set("heightCm", heightCm);
    }
    url.searchParams.set("neck", neck);
    url.searchParams.set("waist", waist);
    if (gender === "female") url.searchParams.set("hip", hip);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={styles.islandContainer}>
      {/* Unit Tabs */}
      <div className={styles.unitTabs} role="tablist" aria-label="Measurement Units">
        <button
          type="button"
          className={`${styles.unitBtn} ${unit === "us" ? styles.unitBtnActive : ""}`}
          onClick={() => handleUnitChange("us")}
        >
          US Customary (lbs, ft, in)
        </button>
        <button
          type="button"
          className={`${styles.unitBtn} ${unit === "metric" ? styles.unitBtnActive : ""}`}
          onClick={() => handleUnitChange("metric")}
        >
          Metric (kg, cm)
        </button>
      </div>

      {/* Gender Selector */}
      <div className={styles.genderRow}>
        <button
          type="button"
          className={`${styles.genderBtn} ${gender === "male" ? styles.genderBtnActive : ""}`}
          onClick={() => setGender("male")}
        >
          👨 Male
        </button>
        <button
          type="button"
          className={`${styles.genderBtn} ${gender === "female" ? styles.genderBtnActive : ""}`}
          onClick={() => setGender("female")}
        >
          👩 Female
        </button>
      </div>

      <div className={styles.formGrid}>
        {/* Age Field */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="bf-age-input">
            Age (years)
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="bf-age-input"
              type="number"
              min="2"
              max="120"
              className={styles.inputField}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <span className={styles.suffixSymbol}>yrs</span>
          </div>
        </div>

        {/* Weight Field */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="bf-weight-input">
            Weight ({unit === "us" ? "lbs" : "kg"})
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="bf-weight-input"
              type="number"
              step="any"
              min="1"
              className={styles.inputField}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <span className={styles.suffixSymbol}>{unit === "us" ? "lbs" : "kg"}</span>
          </div>
        </div>

        {/* Height Field */}
        <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
          <label className={styles.fieldLabel} htmlFor="bf-height-input">
            Height ({unit === "us" ? "feet & inches" : "cm"})
          </label>
          {unit === "us" ? (
            <div className={styles.heightInputs}>
              <div className={styles.inputWrapper}>
                <input
                  id="bf-height-input"
                  type="number"
                  min="0"
                  max="8"
                  className={styles.inputField}
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                />
                <span className={styles.suffixSymbol}>ft</span>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  step="any"
                  min="0"
                  max="11.9"
                  className={styles.inputField}
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                />
                <span className={styles.suffixSymbol}>in</span>
              </div>
            </div>
          ) : (
            <div className={styles.inputWrapper}>
              <input
                id="bf-height-input"
                type="number"
                step="any"
                min="30"
                className={styles.inputField}
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
              <span className={styles.suffixSymbol}>cm</span>
            </div>
          )}
        </div>

        {/* Neck Circumference */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="bf-neck-input">
            Neck Circumference
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="bf-neck-input"
              type="number"
              step="any"
              min="0.1"
              className={styles.inputField}
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
            />
            <span className={styles.suffixSymbol}>{unit === "us" ? "in" : "cm"}</span>
          </div>
          <span className={styles.fieldHelpText}>Below larynx (adam&apos;s apple)</span>
        </div>

        {/* Waist Circumference */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="bf-waist-input">
            Waist Circumference
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="bf-waist-input"
              type="number"
              step="any"
              min="0.1"
              className={styles.inputField}
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
            />
            <span className={styles.suffixSymbol}>{unit === "us" ? "in" : "cm"}</span>
          </div>
          <span className={styles.fieldHelpText}>{gender === "male" ? "At navel level" : "Narrowest point"}</span>
        </div>

        {/* Hip Circumference (Conditionally rendered for female) */}
        {gender === "female" && (
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel} htmlFor="bf-hip-input">
              Hip Circumference (Female)
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="bf-hip-input"
                type="number"
                step="any"
                min="0.1"
                className={styles.inputField}
                value={hip}
                onChange={(e) => setHip(e.target.value)}
              />
              <span className={styles.suffixSymbol}>{unit === "us" ? "in" : "cm"}</span>
            </div>
            <span className={styles.fieldHelpText}>Widest point of hips / buttocks</span>
          </div>
        )}
      </div>

      {/* Error Message Banner */}
      {result && !result.isValid && (
        <div className={styles.errorBanner}>{result.error}</div>
      )}

      {/* Results Card */}
      {result && result.isValid && (
        <div className={styles.resultCard}>
          <div className={styles.resultTitle}>Body Fat Percentage (U.S. Navy Method)</div>

          <div className={styles.mainResultHeader}>
            <span className={styles.mainResultValue}>{result.navy.bfpFormatted}</span>
            <span
              className={styles.categoryBadge}
              style={{ backgroundColor: result.navy.category.color }}
            >
              {result.navy.category.label}
            </span>
          </div>

          {/* Fat Mass / Lean Mass Breakdown */}
          <div className={styles.breakdownGrid}>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Fat Mass</span>
              <span className={styles.breakdownValue}>
                {unit === "us" ? `${result.navy.fatMassLbs} lbs` : `${result.navy.fatMassKg} kg`}
              </span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Lean Body Mass</span>
              <span className={styles.breakdownValue}>
                {unit === "us" ? `${result.navy.leanMassLbs} lbs` : `${result.navy.leanMassKg} kg`}
              </span>
            </div>
          </div>

          {/* Supplementary BMI Method Result */}
          {result.bmiMethod && (
            <div className={styles.secondaryCard}>
              <span className={styles.secondaryLabel}>
                BMI-Based Estimate (BMI: {result.bmiMethod.bmi.toFixed(1)})
              </span>
              <span className={styles.secondaryValue}>{result.bmiMethod.bfpFormatted}</span>
            </div>
          )}
        </div>
      )}

      {/* YMYL Disclaimer Banner */}
      <div className={styles.disclaimerBox}>
        <span className={styles.disclaimerIcon}>ℹ️</span>
        <p className={styles.disclaimerText}>
          <strong>Estimation Notice:</strong> Circumference and BMI methods provide population-average estimates. They do not replace clinical measurements such as DEXA scans or hydrostatic testing. Individual results vary based on muscle mass, frame size, and hydration.
        </p>
      </div>

      {/* Action Bar */}
      <div className={styles.actionRow}>
        <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
          {copied ? "✓ Link Copied!" : "🔗 Share Body Fat URL"}
        </button>
      </div>

      {/* LocalStorage History */}
      {history.length > 0 && (
        <div className={styles.historyContainer}>
          <h4 className={styles.historyTitle}>Recent Calculations</h4>
          <ul className={styles.historyList}>
            {history.map((item) => (
              <li key={item.id} className={styles.historyItem}>
                <span>
                  {item.gender === "male" ? "👨" : "👩"} Body Fat: <strong>{item.bfp}</strong> ({item.categoryLabel})
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-60)" }}>
                  Weight: {item.weightLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
