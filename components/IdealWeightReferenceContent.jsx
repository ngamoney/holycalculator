import Link from "next/link";
import styles from "./IdealWeightReferenceContent.module.css";
import { IDEAL_WEIGHT_FAQS } from "@/lib/data/idealWeightFaqs";

export default function IdealWeightReferenceContent() {
  return (
    <article className={styles.referenceWrapper}>
      {/* 1. Medical Origin & Context */}
      <section className={styles.contentBlock}>
        <h2>What is Ideal Body Weight (IBW)?</h2>
        <p>
          <strong>Ideal Body Weight (IBW)</strong> refers to a set of height-and-sex-based linear mathematical equations originally introduced in clinical pharmacology during the mid-20th century. Unlike modern body composition metrics (such as body fat percentage or waist circumference), IBW formulas were specifically created by medical researchers to estimate <strong>pharmacokinetic drug dosages</strong> for medications that distribute poorly into adipose (fat) tissue, such as cardiac glycosides, aminoglycosides, and neuromuscular blockers.
        </p>
        <p>
          Because these formulas were designed for medical dosing rather than aesthetic benchmarks, clinical organizations (including the WHO and CDC) emphasize that IBW equations represent population-level midpoints rather than rigid targets for individuals. Comparing multiple IBW formulas alongside the WHO Healthy BMI Weight Range provides a realistic, healthy perspective on natural body weight diversity.
        </p>
      </section>

      {/* 2. Body Frame Size Reference Tables */}
      <section className={styles.contentBlock}>
        <h2>Body Frame Size &amp; Wrist Circumference Reference</h2>
        <p>
          Bone structure and skeletal frame size significantly influence your healthy weight capacity. A person with a large bone frame naturally carries more skeletal and muscle weight than someone with a small bone frame at the exact same height.
        </p>
        <p>
          You can estimate your body frame size by measuring your wrist circumference at the narrowest point (just distal to the wrist joint):
        </p>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Biological Sex</th>
                <th>Height</th>
                <th>Small Frame (Subtract 10%)</th>
                <th>Medium Frame (Standard IBW)</th>
                <th>Large Frame (Add 10%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Women</strong></td>
                <td>Under 5&apos;2&quot; (&lt;157 cm)</td>
                <td className={styles.monoCell}>Wrist &lt; 5.5&quot; (13.9 cm)</td>
                <td className={styles.monoCell}>Wrist 5.5&quot;–5.75&quot; (13.9–14.6 cm)</td>
                <td className={styles.monoCell}>Wrist &gt; 5.75&quot; (14.6 cm)</td>
              </tr>
              <tr>
                <td><strong>Women</strong></td>
                <td>5&apos;2&quot; to 5&apos;5&quot; (157–165 cm)</td>
                <td className={styles.monoCell}>Wrist &lt; 6.0&quot; (15.2 cm)</td>
                <td className={styles.monoCell}>Wrist 6.0&quot;–6.25&quot; (15.2–15.9 cm)</td>
                <td className={styles.monoCell}>Wrist &gt; 6.25&quot; (15.9 cm)</td>
              </tr>
              <tr>
                <td><strong>Women</strong></td>
                <td>Over 5&apos;5&quot; (&gt;165 cm)</td>
                <td className={styles.monoCell}>Wrist &lt; 6.25&quot; (15.9 cm)</td>
                <td className={styles.monoCell}>Wrist 6.25&quot;–6.5&quot; (15.9–16.5 cm)</td>
                <td className={styles.monoCell}>Wrist &gt; 6.5&quot; (16.5 cm)</td>
              </tr>
              <tr style={{ background: "rgba(79, 122, 91, 0.08)" }}>
                <td><strong>Men</strong></td>
                <td>Over 5&apos;5&quot; (&gt;165 cm)</td>
                <td className={styles.monoCell}>Wrist 5.5&quot;–6.5&quot; (14.0–16.5 cm)</td>
                <td className={styles.monoCell}>Wrist 6.5&quot;–7.5&quot; (16.5–19.0 cm)</td>
                <td className={styles.monoCell}>Wrist &gt; 7.5&quot; (19.0 cm)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. The Four Formulas Explained */}
      <section className={styles.contentBlock}>
        <h2>The Four Clinical IBW Equations</h2>
        <p>
          Each of the four classic formulas starts with a baseline weight for a 5-foot (60-inch) height frame, adding a specific weight allowance for every additional inch over 5 feet:
        </p>

        <div className={styles.gridTwo}>
          <div className={styles.cardBox}>
            <h4>1. Devine Formula (1974)</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Introduced by Dr. BJ Devine for calculating renal creatinine clearance and medication dosages. It remains the most widely cited IBW formula in clinical medicine worldwide.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"Male: 50.0 kg + 2.3 kg / inch over 5ft"}<br />
              {"Female: 45.5 kg + 2.3 kg / inch over 5ft"}
            </div>
          </div>

          <div className={styles.cardBox}>
            <h4>2. Robinson Formula (1983)</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Developed by Dr. JD Robinson as a modification of the Devine equation, using updated empirical data to provide a lower rate of weight growth per inch.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"Male: 52.0 kg + 1.9 kg / inch over 5ft"}<br />
              {"Female: 49.0 kg + 1.7 kg / inch over 5ft"}
            </div>
          </div>

          <div className={styles.cardBox}>
            <h4>3. Miller Formula (1983)</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Formulated by Dr. DR Miller based on Metropolitan Life Insurance actuarial tables to reflect weight curves associated with maximum statistical life expectancy.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"Male: 56.2 kg + 1.41 kg / inch over 5ft"}<br />
              {"Female: 53.1 kg + 1.36 kg / inch over 5ft"}
            </div>
          </div>

          <div className={styles.cardBox}>
            <h4>4. Hamwi Formula (1964)</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Created by Dr. GJ Hamwi for quick clinical estimates in diabetic patient management. Known colloquially as the &quot;rule of thumb&quot; formula.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"Male: 48.0 kg + 2.7 kg / inch over 5ft"}<br />
              {"Female: 45.5 kg + 2.2 kg / inch over 5ft"}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Healthy BMI Range & CDC Pediatric Note */}
      <section className={styles.contentBlock}>
        <h2>Healthy BMI Range vs. Point-Estimate Formulas</h2>
        <p>
          While linear IBW formulas output single point estimates, the World Health Organization (WHO) defines a healthy body weight as a flexible span corresponding to a <strong>BMI between 18.5 and 24.9 kg/m²</strong>.
        </p>
        <p>
          For example, for an adult standing 5 feet 10 inches (178 cm) tall, the WHO healthy weight range spans approximately <strong>129 lbs to 174 lbs (58.5 kg to 79.0 kg)</strong> — a 45-pound healthy range that accommodates varying muscularity, age, and frame size.
        </p>
      </section>

      {/* 5. Load-Bearing Limitations Section */}
      <section className={styles.contentBlock}>
        <h2>Key Limitations of Ideal Weight Formulas</h2>
        <p>
          Understanding the physiological limitations of linear IBW equations prevents misusing them as personal body goals:
        </p>
        <div className={styles.cardBox} style={{ background: "var(--paper)" }}>
          <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14.5px", lineHeight: "1.7" }}>
            <li>
              <strong>No Body Composition Measurement:</strong> Linear formulas rely strictly on height and biological sex. They cannot differentiate between lean skeletal muscle tissue and adipose fat mass.
            </li>
            <li>
              <strong>Athletic &amp; Muscular Bias:</strong> Athletes and resistance-trained individuals naturally carry dense skeletal muscle tissue, placing them above linear IBW targets while maintaining optimal health and low body fat.
            </li>
            <li>
              <strong>Age Invariance:</strong> IBW formulas apply identical calculations for an 18-year-old and an 80-year-old of the same height, failing to account for natural age-related body composition changes.
            </li>
          </ul>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className={styles.contentBlock}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {IDEAL_WEIGHT_FAQS.map((faq, index) => (
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
          <Link href="/bmi-calculator" className={styles.relatedCard}>
            <div>
              <h4>BMI Calculator</h4>
              <p>Calculate your Body Mass Index, WHO category classifications, and CDC pediatric growth chart percentiles.</p>
            </div>
            <span className={styles.arrowLink}>Open BMI Tool →</span>
          </Link>

          <Link href="/bmr-calculator" className={styles.relatedCard}>
            <div>
              <h4>BMR Calculator</h4>
              <p>Calculate your Basal Metabolic Rate using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle equations.</p>
            </div>
            <span className={styles.arrowLink}>Open BMR Tool →</span>
          </Link>

          <Link href="/calorie-calculator" className={styles.relatedCard}>
            <div>
              <h4>Calorie (TDEE) Calculator</h4>
              <p>Determine daily maintenance calories, TDEE, and activity-adjusted energy requirements.</p>
            </div>
            <span className={styles.arrowLink}>Open Calorie Tool →</span>
          </Link>

          <Link href="/pregnancy-calculator" className={styles.relatedCard}>
            <div>
              <h4>Pregnancy Due Date Calculator</h4>
              <p>Estimate due dates, gestational age in weeks and days, and trimester development milestones.</p>
            </div>
            <span className={styles.arrowLink}>Open Pregnancy Tool →</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
