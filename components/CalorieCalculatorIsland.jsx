"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  calculateCalories,
  ftInToCm,
  lbToKg,
  cmToFtIn,
  kgToLb,
  convertEnergy,
  ACTIVITY_LEVELS,
  RESULT_TIERS,
  encodeCalorieState,
  decodeCalorieState,
} from "@/lib/calculations/calorie";
import styles from "./CalorieCalculatorIsland.module.css";

const LS_UNIT_KEY = "holy_calorie_unit_v1";
const LS_INPUTS_KEY = "holy_calorie_inputs_v1";

const DEFAULT_STATE = {
  unit: "us",
  gender: "male",
  age: "30",
  heightFt: "5",
  heightIn: "10",
  heightCm: "178",
  weight: "170",     // lb when US, kg when metric
  activityId: "moderate",
  formula: "mifflin",
  bodyFatPct: "",
  resultUnit: "cal",
};

// Gear / Settings SVG icon
function GearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default function CalorieCalculatorIsland() {
  const [unit, setUnit] = useState(DEFAULT_STATE.unit);
  const [gender, setGender] = useState(DEFAULT_STATE.gender);
  const [age, setAge] = useState(DEFAULT_STATE.age);
  const [heightFt, setHeightFt] = useState(DEFAULT_STATE.heightFt);
  const [heightIn, setHeightIn] = useState(DEFAULT_STATE.heightIn);
  const [heightCm, setHeightCm] = useState(DEFAULT_STATE.heightCm);
  const [weight, setWeight] = useState(DEFAULT_STATE.weight);
  const [activityId, setActivityId] = useState(DEFAULT_STATE.activityId);
  const [formula, setFormula] = useState(DEFAULT_STATE.formula);
  const [bodyFatPct, setBodyFatPct] = useState(DEFAULT_STATE.bodyFatPct);
  const [resultUnit, setResultUnit] = useState(DEFAULT_STATE.resultUnit);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Food Energy Converter state
  const [converterValue, setConverterValue] = useState("500");
  const [converterFrom, setConverterFrom] = useState("cal");

  const urlSyncTimer = useRef(null);

  // -------------------------------------------------------------------------
  // Mount: restore from URL params, then localStorage
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. URL params (shareable link takes priority)
    const decoded = decodeCalorieState(window.location.search);
    if (decoded) {
      if (decoded.unit) setUnit(decoded.unit);
      if (decoded.gender) setGender(decoded.gender);
      if (decoded.age) setAge(decoded.age);
      if (decoded.heightFt) setHeightFt(decoded.heightFt);
      if (decoded.heightIn) setHeightIn(decoded.heightIn);
      if (decoded.heightCm) setHeightCm(decoded.heightCm);
      if (decoded.weight) setWeight(decoded.weight);
      if (decoded.activityId) setActivityId(decoded.activityId);
      if (decoded.formula) setFormula(decoded.formula);
      if (decoded.bodyFatPct) setBodyFatPct(decoded.bodyFatPct);
      if (decoded.resultUnit) setResultUnit(decoded.resultUnit);
      return; // skip localStorage when URL has data
    } else if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    // 2. Restore unit preference from localStorage
    try {
      const savedUnit = localStorage.getItem(LS_UNIT_KEY);
      if (savedUnit === "us" || savedUnit === "metric") setUnit(savedUnit);

      const savedInputs = localStorage.getItem(LS_INPUTS_KEY);
      if (savedInputs) {
        const p = JSON.parse(savedInputs);
        if (p.gender) setGender(p.gender);
        if (p.age) setAge(p.age);
        if (p.heightFt) setHeightFt(p.heightFt);
        if (p.heightIn) setHeightIn(p.heightIn);
        if (p.heightCm) setHeightCm(p.heightCm);
        if (p.weight) setWeight(p.weight);
        if (p.activityId) setActivityId(p.activityId);
      }
    } catch { /* ignore */ }
  }, []);

  // -------------------------------------------------------------------------
  // Persist unit to localStorage
  // -------------------------------------------------------------------------
  useEffect(() => {
    try { localStorage.setItem(LS_UNIT_KEY, unit); } catch { /* ignore */ }
  }, [unit]);

  // Persist last-used inputs (NOT a health log — just pre-fill convenience)
  useEffect(() => {
    try {
      localStorage.setItem(LS_INPUTS_KEY, JSON.stringify({
        gender, age, heightFt, heightIn, heightCm, weight, activityId,
      }));
    } catch { /* ignore */ }
  }, [gender, age, heightFt, heightIn, heightCm, weight, activityId]);

  // -------------------------------------------------------------------------
  // Unit toggle: convert existing values when switching systems
  // -------------------------------------------------------------------------
  const handleUnitToggle = useCallback((newUnit) => {
    if (newUnit === unit) return;
    if (newUnit === "metric") {
      // Convert US → metric
      const cm = ftInToCm(heightFt, heightIn);
      const kg = lbToKg(weight);
      setHeightCm(cm > 0 ? cm.toFixed(1) : "");
      setWeight(kg > 0 ? kg.toFixed(1) : "");
    } else {
      // Convert metric → US
      const { feet, inches } = cmToFtIn(heightCm);
      const lb = kgToLb(weight);
      setHeightFt(feet > 0 ? String(feet) : "");
      setHeightIn(inches >= 0 ? String(inches) : "");
      setWeight(lb > 0 ? lb.toFixed(1) : "");
    }
    setUnit(newUnit);
  }, [unit, heightFt, heightIn, heightCm, weight]);

  // -------------------------------------------------------------------------
  // URL sync (debounced 400ms)
  // -------------------------------------------------------------------------
  const syncToUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    if (urlSyncTimer.current) clearTimeout(urlSyncTimer.current);
    urlSyncTimer.current = setTimeout(() => {
      try {
        const query = encodeCalorieState({
          unit, gender, age, heightFt, heightIn, heightCm, weight,
          activityId, formula, bodyFatPct, resultUnit,
        });
        const newUrl = query
          ? `${window.location.pathname}?${query}`
          : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      } catch { /* ignore */ }
    }, 400);
  }, [unit, gender, age, heightFt, heightIn, heightCm, weight, activityId, formula, bodyFatPct, resultUnit]);

  useEffect(() => { syncToUrl(); }, [syncToUrl]);

  // -------------------------------------------------------------------------
  // Live calculation
  // -------------------------------------------------------------------------
  const result = useMemo(() => {
    const weightKg = unit === "metric" ? parseFloat(weight) : lbToKg(weight);
    const heightCmVal = unit === "metric" ? parseFloat(heightCm) : ftInToCm(heightFt, heightIn);

    return calculateCalories({
      gender,
      age,
      weightKg,
      heightCm: heightCmVal,
      activityId,
      formula,
      bodyFatPct,
      resultUnit,
    });
  }, [unit, gender, age, heightFt, heightIn, heightCm, weight, activityId, formula, bodyFatPct, resultUnit]);

  // -------------------------------------------------------------------------
  // Food Energy Converter
  // -------------------------------------------------------------------------
  const converterResult = useMemo(() => {
    return convertEnergy(converterValue, converterFrom);
  }, [converterValue, converterFrom]);

  // -------------------------------------------------------------------------
  // Share link
  // -------------------------------------------------------------------------
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setToast("Shareable link copied to clipboard!");
        setTimeout(() => setToast(null), 2800);
      });
    }
  };

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  const maintenanceTier = result?.tiers.find((t) => t.id === "maintenance");
  const lossTiers = result?.tiers.filter((t) => t.type === "loss") || [];
  const gainTiers = result?.tiers.filter((t) => t.type === "gain") || [];

  const formatValue = (tier) => {
    if (!tier) return "—";
    if (tier.belowFloor) return null; // render warning instead
    return `${tier.displayValue.toLocaleString()} ${tier.displayUnit}`;
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className={styles.islandRoot}>
      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}

      {/* ===== MAIN CALCULATOR CARD ===== */}
      <div className={styles.calcCard}>

        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleGroup}>
            <div className={styles.cardBadge}>Cal</div>
            <h2 className={styles.cardTitle}>Calorie Calculator</h2>
          </div>
          <div className={styles.cardControls}>
            {/* Unit Toggle */}
            <div className={styles.pillGroup} role="group" aria-label="Unit system">
              <button
                id="unit-us"
                className={`${styles.pill} ${unit === "us" ? styles.pillActive : ""}`}
                onClick={() => handleUnitToggle("us")}
                aria-pressed={unit === "us"}
              >
                US
              </button>
              <button
                id="unit-metric"
                className={`${styles.pill} ${unit === "metric" ? styles.pillActive : ""}`}
                onClick={() => handleUnitToggle("metric")}
                aria-pressed={unit === "metric"}
              >
                Metric
              </button>
            </div>
            {/* Settings button */}
            <button
              id="settings-toggle"
              className={styles.settingsBtn}
              onClick={() => setIsSettingsOpen((o) => !o)}
              aria-expanded={isSettingsOpen}
              aria-controls="settings-panel"
            >
              <GearIcon />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Settings Drawer */}
        {isSettingsOpen && (
          <div id="settings-panel" className={styles.settingsPanel}>
            {/* BMR Formula */}
            <div className={styles.settingsRow}>
              <div>
                <div className={styles.settingsLabel}>BMR Formula</div>
                <div className={styles.settingsDesc}>
                  Mifflin-St Jeor is recommended for most people. Katch-McArdle requires body fat %.
                </div>
              </div>
              <div className={styles.settingsControls}>
                {[
                  { id: "mifflin", label: "Mifflin-St Jeor" },
                  { id: "harris", label: "Revised Harris-Benedict" },
                  { id: "katch", label: "Katch-McArdle" },
                ].map((f) => (
                  <label key={f.id} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="formula"
                      value={f.id}
                      checked={formula === f.id}
                      onChange={() => setFormula(f.id)}
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Katch-McArdle Body Fat % (conditional) */}
            {formula === "katch" && (
              <div className={styles.settingsRow}>
                <div>
                  <div className={styles.settingsLabel}>Body Fat Percentage</div>
                  <div className={styles.settingsDesc}>Required for Katch-McArdle. Use DEXA, hydrostatic weighing, or a reliable estimate.</div>
                </div>
                <div className={styles.settingsControls}>
                  <div className={styles.inlineInputGroup}>
                    <input
                      id="body-fat-pct"
                      type="number"
                      min="1"
                      max="70"
                      step="0.1"
                      className={styles.settingsInput}
                      placeholder="e.g. 18"
                      value={bodyFatPct}
                      onChange={(e) => setBodyFatPct(e.target.value)}
                    />
                    <span className={styles.inputUnit}>%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Result Unit */}
            <div className={styles.settingsRow}>
              <div>
                <div className={styles.settingsLabel}>Results Unit</div>
                <div className={styles.settingsDesc}>Display calorie values in kcal or kilojoules.</div>
              </div>
              <div className={styles.settingsControls}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="resultUnit"
                    value="cal"
                    checked={resultUnit === "cal"}
                    onChange={() => setResultUnit("cal")}
                  />
                  Calories (kcal)
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="resultUnit"
                    value="kj"
                    checked={resultUnit === "kj"}
                    onChange={() => setResultUnit("kj")}
                  />
                  Kilojoules (kJ)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ---- Input Grid ---- */}
        <div className={styles.inputGrid}>
          {/* Age */}
          <div className={styles.fieldGroup}>
            <label htmlFor="input-age" className={styles.fieldLabel}>Age</label>
            <div className={styles.inputWithUnit}>
              <input
                id="input-age"
                type="number"
                min="1"
                max="120"
                step="1"
                className={styles.textInput}
                placeholder="e.g. 30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <span className={styles.inputUnit}>years</span>
            </div>
          </div>

          {/* Gender */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Biological Sex</label>
            <div className={styles.genderGroup} role="radiogroup" aria-label="Biological sex">
              <label className={`${styles.genderBtn} ${gender === "male" ? styles.genderBtnActive : ""}`}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                  className={styles.srOnly}
                />
                Male
              </label>
              <label className={`${styles.genderBtn} ${gender === "female" ? styles.genderBtnActive : ""}`}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className={styles.srOnly}
                />
                Female
              </label>
            </div>
            <p className={styles.fieldNote}>Used by BMR formulas — not a demographic field.</p>
          </div>

          {/* Height */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Height</label>
            {unit === "us" ? (
              <div className={styles.heightGroup}>
                <div className={styles.inputWithUnit}>
                  <input
                    id="input-height-ft"
                    type="number"
                    min="1"
                    max="8"
                    step="1"
                    className={styles.textInput}
                    placeholder="5"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    aria-label="Height feet"
                  />
                  <span className={styles.inputUnit}>ft</span>
                </div>
                <div className={styles.inputWithUnit}>
                  <input
                    id="input-height-in"
                    type="number"
                    min="0"
                    max="11"
                    step="0.5"
                    className={styles.textInput}
                    placeholder="10"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    aria-label="Height inches"
                  />
                  <span className={styles.inputUnit}>in</span>
                </div>
              </div>
            ) : (
              <div className={styles.inputWithUnit}>
                <input
                  id="input-height-cm"
                  type="number"
                  min="50"
                  max="300"
                  step="0.5"
                  className={styles.textInput}
                  placeholder="178"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  aria-label="Height in centimeters"
                />
                <span className={styles.inputUnit}>cm</span>
              </div>
            )}
          </div>

          {/* Weight */}
          <div className={styles.fieldGroup}>
            <label htmlFor="input-weight" className={styles.fieldLabel}>Weight</label>
            <div className={styles.inputWithUnit}>
              <input
                id="input-weight"
                type="number"
                min="10"
                max="700"
                step="0.1"
                className={styles.textInput}
                placeholder={unit === "metric" ? "70" : "154"}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className={styles.inputUnit}>{unit === "metric" ? "kg" : "lb"}</span>
            </div>
          </div>

          {/* Activity Level — full width */}
          <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
            <label htmlFor="input-activity" className={styles.fieldLabel}>Activity Level</label>
            <select
              id="input-activity"
              className={styles.selectInput}
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
            >
              {ACTIVITY_LEVELS.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.label} — {level.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---- Medical Disclaimer ---- */}
        <div className={styles.disclaimer} role="note" aria-label="Medical disclaimer">
          <InfoIcon />
          <p>
            This calculator provides <strong>estimates only</strong> — not personalized medical advice. Results can vary ±10–15% from measured values. If you have a health condition, are pregnant, have a history of disordered eating, or take medication that affects metabolism, please consult a doctor or registered dietitian before making significant changes to your diet.
          </p>
        </div>

        {/* ---- Results ---- */}
        {result ? (
          <div className={styles.resultsSection}>
            {/* BMR / TDEE summary */}
            <div className={styles.bmrRow}>
              <div className={styles.bmrStat}>
                <span className={styles.bmrLabel}>BMR</span>
                <span className={styles.bmrValue}>
                  {resultUnit === "kj"
                    ? `${Math.round(result.bmr * 4.184).toLocaleString()} kJ`
                    : `${result.bmr.toLocaleString()} kcal`}
                </span>
                <span className={styles.bmrNote}>at rest</span>
              </div>
              <div className={styles.bmrDivider}>×{result.activityMultiplier}</div>
              <div className={styles.bmrStat}>
                <span className={styles.bmrLabel}>TDEE</span>
                <span className={styles.bmrValue}>
                  {resultUnit === "kj"
                    ? `${Math.round(result.tdee * 4.184).toLocaleString()} kJ`
                    : `${result.tdee.toLocaleString()} kcal`}
                </span>
                <span className={styles.bmrNote}>maintenance</span>
              </div>
            </div>

            {/* Maintenance — hero display */}
            {maintenanceTier && (
              <div className={styles.maintenanceHero}>
                <div className={styles.maintenanceLabel}>Daily Maintenance Calories</div>
                <div className={styles.maintenanceValue}>
                  {maintenanceTier.displayValue.toLocaleString()}
                  <span className={styles.maintenanceUnit}>{maintenanceTier.displayUnit}/day</span>
                </div>
              </div>
            )}

            {/* Result tables */}
            <div className={styles.resultTablesGrid}>
              {/* Weight Loss */}
              <div className={styles.resultTable}>
                <div className={styles.resultTableHeader}>
                  <span className={styles.resultTableTitle}>Weight Loss</span>
                </div>
                {[...lossTiers].reverse().map((tier) => (
                  <div key={tier.id} className={styles.resultRow}>
                    <div className={styles.resultRowLeft}>
                      <span className={styles.resultTierLabel}>{tier.label}</span>
                      {tier.rate && <span className={styles.resultRate}>{tier.rate}</span>}
                    </div>
                    <div className={styles.resultRowRight}>
                      {tier.belowFloor ? (
                        <div className={styles.safetyWarning}>
                          <WarningIcon />
                          <span>Below safe minimum — consult a dietitian</span>
                        </div>
                      ) : (
                        <span className={styles.resultValue}>{tier.displayValue.toLocaleString()} {tier.displayUnit}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Weight Gain */}
              <div className={styles.resultTable}>
                <div className={styles.resultTableHeader}>
                  <span className={styles.resultTableTitle}>Weight Gain</span>
                </div>
                {gainTiers.map((tier) => (
                  <div key={tier.id} className={styles.resultRow}>
                    <div className={styles.resultRowLeft}>
                      <span className={styles.resultTierLabel}>{tier.label}</span>
                      {tier.rate && <span className={styles.resultRate}>{tier.rate}</span>}
                    </div>
                    <div className={styles.resultRowRight}>
                      <span className={styles.resultValue}>{tier.displayValue.toLocaleString()} {tier.displayUnit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delta column note */}
            <p className={styles.resultNote}>
              Deficit/surplus is relative to your TDEE. ~3,500 kcal ≈ 1 lb of body fat
              (<a href="https://www.ncbi.nlm.nih.gov/books/NBK499909/" target="_blank" rel="noopener noreferrer">NIH reference</a>).
              Individual results vary.
            </p>

            {/* Share */}
            <div className={styles.shareBar}>
              <button id="share-calorie-link" className={styles.shareBtn} onClick={handleShare}>
                <ShareIcon />
                <span>Share This Result</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            Fill in all fields above to see your daily calorie estimates.
          </div>
        )}
      </div>

      {/* ===== FOOD ENERGY CONVERTER CARD ===== */}
      <div className={styles.converterCard}>
        <div className={styles.converterHeader}>
          <span className={styles.converterBadge}>⚡</span>
          <h3 className={styles.converterTitle}>Food Energy Converter</h3>
        </div>
        <p className={styles.converterDesc}>
          Convert between Calories (kcal), kilojoules, and joules. All conversions use the fixed factor: 1 kcal = 4.184 kJ.
        </p>

        <div className={styles.converterGrid}>
          <div className={styles.converterInputGroup}>
            <input
              id="converter-input"
              type="number"
              min="0"
              className={styles.converterInput}
              value={converterValue}
              onChange={(e) => setConverterValue(e.target.value)}
              placeholder="Enter value"
            />
            <select
              id="converter-from-unit"
              className={styles.converterSelect}
              value={converterFrom}
              onChange={(e) => setConverterFrom(e.target.value)}
            >
              <option value="cal">Calories (kcal)</option>
              <option value="kcal">kcal</option>
              <option value="kj">Kilojoules (kJ)</option>
              <option value="j">Joules (J)</option>
            </select>
          </div>

          <div className={styles.converterResults}>
            {[
              { key: "cal", label: "Calories", unit: "kcal" },
              { key: "kj", label: "Kilojoules", unit: "kJ" },
              { key: "j", label: "Joules", unit: "J" },
            ].map(({ key, label, unit: u }) => (
              <div key={key} className={`${styles.converterResultRow} ${converterFrom === key || (converterFrom === "cal" && key === "kcal") ? styles.converterResultActive : ""}`}>
                <span className={styles.converterResultLabel}>{label}</span>
                <span className={styles.converterResultValue}>
                  {converterResult[key] !== "" ? Number(converterResult[key]).toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—"}
                  <span className={styles.converterResultUnit}> {u}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
