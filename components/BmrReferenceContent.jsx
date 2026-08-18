import Link from "next/link";
import styles from "./BmrReferenceContent.module.css";
import { BMR_FAQS } from "@/lib/data/bmrFaqs";

export default function BmrReferenceContent() {
  return (
    <article className={styles.referenceWrapper}>
      {/* 1. What BMR Is */}
      <section className={styles.contentBlock}>
        <h2>What is Basal Metabolic Rate (BMR)?</h2>
        <p>
          <strong>Basal Metabolic Rate (BMR)</strong> represents the minimum quantity of energy — measured in kilocalories (kcal) or kilojoules (kJ) — that a human body requires per day to maintain vital physiological life functions at rest. These baseline processes include respiration, cardiovascular blood circulation, central nervous system activity, cellular repair, kidney filtration, and internal temperature regulation.
        </p>
        <p>
          For most sedentary to moderately active individuals, BMR accounts for approximately <strong>60% to 75%</strong> of Total Daily Energy Expenditure (TDEE). The remaining portion of daily energy burn is divided between the Thermic Effect of Food (TEF, ~10%), which covers digestion and nutrient absorption, and Physical Activity Energy Expenditure (PAEE, ~15%–30%), which includes both deliberate exercise and Non-Exercise Activity Thermogenesis (NEAT).
        </p>
      </section>

      {/* 2. Three BMR Formulas Compared */}
      <section className={styles.contentBlock}>
        <h2>BMR Equations: Mifflin-St Jeor, Harris-Benedict &amp; Katch-McArdle</h2>
        <p>
          Medical researchers and clinical dietitians utilize several validated mathematical equations to estimate BMR based on body weight ($W$ in kg), height ($H$ in cm), age ($A$ in years), biological sex, and lean body mass.
        </p>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Formula</th>
                <th>Target Population</th>
                <th>Key Advantages</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "rgba(79, 122, 91, 0.08)" }}>
                <td><strong>Mifflin-St Jeor</strong></td>
                <td>General Adult Population (Consensus Default)</td>
                <td>Highest clinical accuracy rate (~82% within 10% of measured BMR).</td>
              </tr>
              <tr>
                <td><strong>Revised Harris-Benedict</strong></td>
                <td>Classic Historical Standard</td>
                <td>Widely published in medical literature; tends to slightly overestimate BMR.</td>
              </tr>
              <tr>
                <td><strong>Katch-McArdle</strong></td>
                <td>Athletes &amp; Tracked Body Composition</td>
                <td>Calculates BMR from lean body mass, preventing weight-skewed over/underestimates.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Mathematical Equations</h3>
        <div className={styles.formulaBox}>
          <strong>1. Mifflin-St Jeor Formula:</strong><br />
          {"Men: BMR = 10W + 6.25H - 5A + 5"}<br />
          {"Women: BMR = 10W + 6.25H - 5A - 161"}
          <br /><br />
          <strong>2. Revised Harris-Benedict Formula:</strong><br />
          {"Men: BMR = 13.397W + 4.799H - 5.677A + 88.362"}<br />
          {"Women: BMR = 9.247W + 3.098H - 4.330A + 447.593"}
          <br /><br />
          <strong>3. Katch-McArdle Formula:</strong><br />
          {"BMR = 370 + 21.6 × [Weight (kg) × (1 - Body Fat % / 100)]"}
        </div>
      </section>

      {/* 3. Physiological Variables Affecting BMR */}
      <section className={styles.contentBlock}>
        <h2>Key Physiological Factors Influencing BMR</h2>
        <p>
          Although online calculators use population-level formulas, an individual&apos;s actual metabolic rate is shaped by several dynamic biological and environmental factors:
        </p>

        <div className={styles.gridTwo}>
          <div className={styles.cardBox}>
            <h4>Key Determinants</h4>
            <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14px", lineHeight: "1.6" }}>
              <li><strong>Skeletal Muscle Mass:</strong> Muscle tissue burns ~13 kcal/kg daily at rest, compared to adipose tissue (~4.5 kcal/kg). Higher lean body mass elevates BMR.</li>
              <li><strong>Age &amp; Hormonal Balance:</strong> BMR decreases by ~1%–2% per decade after age 20 due to sarcopenia and declining growth hormone/thyroid levels.</li>
              <li><strong>Genetics &amp; Thyroid Function:</strong> Triiodothyronine (T3) and Thyroxine (T4) thyroid hormones directly control cellular oxygen consumption and basal metabolic speed.</li>
            </ul>
          </div>

          <div className={styles.cardBox}>
            <h4>Environmental &amp; Metabolic Adaptation</h4>
            <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14px", lineHeight: "1.6" }}>
              <li><strong>Ambient Temperature:</strong> Cold environments trigger thermogenesis (shivering and brown fat activity), temporarily increasing BMR to maintain core body temperature.</li>
              <li><strong>Caloric Restriction:</strong> Severe, long-term caloric deficits trigger adaptive thermogenesis, reducing baseline energy expenditure by up to 10%–15%.</li>
              <li><strong>Pregnancy &amp; Lactation:</strong> Fetal tissue development and milk production increase physiological energy demands by 300 to 500 kcal/day.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. BMR vs RMR */}
      <section className={styles.contentBlock}>
        <h2>BMR vs. Resting Metabolic Rate (RMR)</h2>
        <p>
          While the terms <strong>BMR</strong> and <strong>RMR (Resting Metabolic Rate)</strong> are frequently used interchangeably in fitness contexts, clinical exercise physiology draws a technical distinction between the two:
        </p>
        <div className={styles.cardBox} style={{ background: "var(--paper)" }}>
          <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14.5px", lineHeight: "1.7" }}>
            <li>
              <strong>BMR (Basal Metabolic Rate):</strong> Measured under strict clinical research conditions immediately upon waking following 8 hours of sleep, 12 hours of overnight fasting, and in a temperature-controlled dark laboratory without prior physical movement.
            </li>
            <li>
              <strong>RMR (Resting Metabolic Rate):</strong> Measured under less rigid conditions (e.g. resting quietly for 30 minutes in a sitting position without strict overnight fasting). RMR is typically <strong>3% to 10% higher</strong> than true BMR due to minor digestive activity and postural muscle tone.
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Limitations */}
      <section className={styles.contentBlock}>
        <h2>Limitations of Formula-Based BMR Estimates</h2>
        <p>
          Mathematical equations provide valuable population benchmarks, but they cannot measure individual cellular metabolic rates directly. Studies show a typical estimation variance of ±10% to ±15% between calculated BMR and indirect calorimetry measurements.
        </p>
        <p>
          For exact clinical measurements — such as diagnosing thyroid disorders or precision sports performance planning — healthcare providers perform <strong>Indirect Calorimetry</strong>, which calculates energy expenditure by measuring oxygen consumption ($VO_2$) and carbon dioxide production ($VCO_2$) via a metabolic cart.
        </p>
      </section>

      {/* 6. FAQ Section */}
      <section className={styles.contentBlock}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {BMR_FAQS.map((faq, index) => (
            <details key={index} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                <span>{faq.question}</span>
                <span style={{ fontSize: "18px", color: "var(--green)" }}>+</span>
              </summary>
              <div className={styles.faqAnswer}>{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* 7. Related Calculators */}
      <section className={styles.contentBlock}>
        <h2>Related Health &amp; Fitness Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/calorie-calculator" className={styles.relatedCard}>
            <div>
              <h4>Calorie (TDEE) Calculator</h4>
              <p>Build on your BMR result to calculate total daily energy burn, calorie deficits, and maintenance targets.</p>
            </div>
            <span className={styles.arrowLink}>Open Calorie Tool →</span>
          </Link>

          <Link href="/bmi-calculator" className={styles.relatedCard}>
            <div>
              <h4>BMI Calculator</h4>
              <p>Screen body mass index, WHO weight classifications, CDC growth percentiles, and healthy target weight ranges.</p>
            </div>
            <span className={styles.arrowLink}>Open BMI Tool →</span>
          </Link>

          <Link href="/pregnancy-calculator" className={styles.relatedCard}>
            <div>
              <h4>Pregnancy Due Date Calculator</h4>
              <p>Estimate due dates, gestational age in weeks and days, and trimester developmental milestones.</p>
            </div>
            <span className={styles.arrowLink}>Open Pregnancy Tool →</span>
          </Link>

          <Link href="/age-calculator" className={styles.relatedCard}>
            <div>
              <h4>Age Calculator</h4>
              <p>Calculate exact chronological age down to days, hours, and seconds from birth date.</p>
            </div>
            <span className={styles.arrowLink}>Open Age Tool →</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
