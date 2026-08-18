import Link from "next/link";
import styles from "./BmiReferenceContent.module.css";
import { BMI_FAQS } from "@/lib/data/bmiFaqs";

export default function BmiReferenceContent() {
  return (
    <article className={styles.referenceWrapper}>
      {/* 1. How It Works Explanation */}
      <section className={styles.contentBlock}>
        <h2>How the BMI Calculator Works</h2>
        <p>
          Body Mass Index (BMI) is a standardized statistical measurement used worldwide to evaluate an individual&apos;s mass relative to their height. First introduced by Belgian mathematician Adolphe Quetelet in the 1830s, BMI provides a straightforward, non-invasive screening metric to categorize individuals into weight classifications established by the World Health Organization (WHO) and the Centers for Disease Control and Prevention (CDC).
        </p>
        <p>
          Our BMI calculator supports both <strong>US Customary units</strong> (feet, inches, pounds) and <strong>Metric units</strong> (centimeters, meters, kilograms), automatically applying age- and sex-adjusted algorithms. For adults aged 20 and older, BMI values are grouped into standard clinical weight bands. For children and adolescents aged 2 to 19, the calculator calculates exact age-in-months growth chart percentiles using CDC LMS parameters ($L, M, S$) to reflect natural growth velocity during child development.
        </p>
      </section>

      {/* 2. Adult WHO BMI Reference Table */}
      <section className={styles.contentBlock}>
        <h2>Adult BMI Classification (WHO Standards, Age 20+)</h2>
        <p>
          The World Health Organization categorizes adult body mass index into distinct categories and subclasses to assist healthcare professionals in population-level health screening.
        </p>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Classification</th>
                <th>WHO Subclass</th>
                <th>BMI Range (kg/m²)</th>
                <th>BMI Prime</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Underweight</td>
                <td>Severe Thinness</td>
                <td className={styles.monoCell}>&lt; 16.0</td>
                <td className={styles.monoCell}>&lt; 0.64</td>
              </tr>
              <tr>
                <td>Underweight</td>
                <td>Moderate Thinness</td>
                <td className={styles.monoCell}>16.0 – 16.9</td>
                <td className={styles.monoCell}>0.64 – 0.67</td>
              </tr>
              <tr>
                <td>Underweight</td>
                <td>Mild Thinness</td>
                <td className={styles.monoCell}>17.0 – 18.4</td>
                <td className={styles.monoCell}>0.68 – 0.73</td>
              </tr>
              <tr style={{ background: "rgba(79, 122, 91, 0.08)" }}>
                <td><strong>Normal Weight</strong></td>
                <td><strong>Healthy Weight</strong></td>
                <td className={styles.monoCell}><strong>18.5 – 24.9</strong></td>
                <td className={styles.monoCell}><strong>0.74 – 0.99</strong></td>
              </tr>
              <tr>
                <td>Overweight</td>
                <td>Pre-Obese</td>
                <td className={styles.monoCell}>25.0 – 29.9</td>
                <td className={styles.monoCell}>1.00 – 1.19</td>
              </tr>
              <tr>
                <td>Obesity</td>
                <td>Obese Class I</td>
                <td className={styles.monoCell}>30.0 – 34.9</td>
                <td className={styles.monoCell}>1.20 – 1.39</td>
              </tr>
              <tr>
                <td>Obesity</td>
                <td>Obese Class II</td>
                <td className={styles.monoCell}>35.0 – 39.9</td>
                <td className={styles.monoCell}>1.40 – 1.59</td>
              </tr>
              <tr>
                <td>Obesity</td>
                <td>Obese Class III</td>
                <td className={styles.monoCell}>&ge; 40.0</td>
                <td className={styles.monoCell}>&ge; 1.60</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Children & Teens CDC Percentiles */}
      <section className={styles.contentBlock}>
        <h2>Children &amp; Teens BMI Percentiles (CDC Growth Charts, Age 2–19)</h2>
        <p>
          Because children undergo continuous physical growth, body composition changes rapidly by month of age. Therefore, fixed adult BMI thresholds are not clinically valid for pediatric populations. The CDC uses age- and sex-specific growth charts based on the 2000 US National Health and Nutrition Examination Survey (NHANES).
        </p>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Percentile Range</th>
                <th>CDC Category</th>
                <th>Clinical Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.monoCell}>&lt; 5th Percentile</td>
                <td>Underweight</td>
                <td>Weight is lower than 95% of peers of the same age and sex.</td>
              </tr>
              <tr style={{ background: "rgba(79, 122, 91, 0.08)" }}>
                <td className={styles.monoCell}><strong>5th to &lt; 85th Percentile</strong></td>
                <td><strong>Healthy Weight</strong></td>
                <td><strong>Weight is within the expected normal range for growth.</strong></td>
              </tr>
              <tr>
                <td className={styles.monoCell}>85th to &lt; 95th Percentile</td>
                <td>At Risk of Overweight</td>
                <td>Weight is higher than 85% of peers; monitored for growth trajectory.</td>
              </tr>
              <tr>
                <td className={styles.monoCell}>&ge; 95th Percentile</td>
                <td>Overweight / Obese</td>
                <td>Weight is higher than 95% of peers of the same age and sex.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Health Risks (Factual & Objective) */}
      <section className={styles.contentBlock}>
        <h2>Health Implications of Weight Classifications</h2>
        <p>
          Epidemiological studies indicate statistical correlations between extreme BMI classifications and long-term health risks. These observations describe population-level trends and serve as clinical screening flags rather than personal diagnoses.
        </p>

        <div className={styles.gridTwo}>
          <div className={styles.cardBox}>
            <h4>Risks Associated with Underweight (BMI &lt; 18.5)</h4>
            <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14px", lineHeight: "1.6" }}>
              <li>Nutritional deficiencies and micronutrient anemia</li>
              <li>Impaired immune function and slower wound healing</li>
              <li>Decreased bone mineral density (osteopenia/osteoporosis risk)</li>
              <li>Hormonal imbalances and reproductive health disruptions</li>
            </ul>
          </div>

          <div className={styles.cardBox}>
            <h4>Risks Associated with Overweight/Obesity (BMI &ge; 25.0)</h4>
            <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14px", lineHeight: "1.6" }}>
              <li>Elevated cardiovascular strain and hypertension risk</li>
              <li>Insulin resistance and type 2 diabetes mellitus susceptibility</li>
              <li>Increased joint stress on knees, hips, and lumbar spine</li>
              <li>Sleep apnea and respiratory sleep architecture disruption</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Load-Bearing Limitations Section */}
      <section className={styles.contentBlock}>
        <h2>Key Limitations of Body Mass Index</h2>
        <p>
          While BMI is an efficient screening tool for large demographic populations, it has significant physiological limitations when applied to individuals. Understanding these caveats prevents misinterpreting your calculated result:
        </p>
        <div className={styles.cardBox} style={{ background: "var(--paper)" }}>
          <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14.5px", lineHeight: "1.7" }}>
            <li>
              <strong>Muscle Density vs. Body Fat:</strong> Muscle tissue has a density of approximately 1.06 g/cm³, whereas adipose fat tissue has a density of 0.90 g/cm³. Athletic individuals with high skeletal muscle mass often register an &quot;overweight&quot; or &quot;obese&quot; BMI despite possessing exceptionally low body fat levels.
            </li>
            <li>
              <strong>Body Fat Distribution:</strong> BMI does not account for visceral abdominal fat versus subcutaneous peripheral fat. Waist circumference and waist-to-hip ratio are superior indicators of metabolic risk.
            </li>
            <li>
              <strong>Age &amp; Sex Variance:</strong> Older adults naturally lose lean muscle mass (sarcopenia) and gain adipose tissue while maintaining a constant body weight. Women naturally carry higher body fat percentages than men at identical BMI values.
            </li>
            <li>
              <strong>Ethnic Variations:</strong> Clinical studies demonstrate that metabolic risk thresholds vary across ethnic populations. For instance, WHO Asia-Pacific guidelines recommend lower overweight (BMI &ge; 23.0) and obesity (BMI &ge; 25.0) cutoffs for East and South Asian populations.
            </li>
          </ul>
        </div>
      </section>

      {/* 6. Formulas & Worked Examples */}
      <section className={styles.contentBlock}>
        <h2>Mathematical Formulas &amp; Worked Example</h2>
        <p>
          The mathematical equation for Body Mass Index divides body mass by the square of body height.
        </p>

        <div className={styles.formulaBox}>
          <strong>Metric Formula (SI Units):</strong><br />
          {"BMI = Weight (kg) / [Height (m)]²"}
          <br /><br />
          <strong>Imperial Formula (US Customary):</strong><br />
          {"BMI = 703 × Weight (lbs) / [Height (inches)]²"}
        </div>

        <h3>Worked Numerical Example</h3>
        <p>
          Consider an adult individual who stands <strong>5 feet 10 inches</strong> (70 inches = 1.778 meters) tall and weighs <strong>160 pounds</strong> (72.57 kilograms):
        </p>
        <div className={styles.formulaBox} style={{ borderLeftColor: "var(--gold-deep)" }}>
          {"Imperial Calculation: BMI = 703 × (160 / 70²) = 703 × (160 / 4900) = 22.95 kg/m²"}
          <br />
          {"Metric Calculation: BMI = 72.57 / (1.778²) = 72.57 / 3.1613 = 22.95 kg/m²"}
        </div>

        <h3>BMI Prime and Ponderal Index</h3>
        <p>
          <strong>BMI Prime</strong> evaluates your weight relative to the WHO healthy upper boundary (25.0 kg/m²):
          <br />
          <code>{"BMI Prime = BMI / 25 = 22.95 / 25 = 0.92 (Normal range: 0.74 – 0.99)"}</code>
        </p>
        <p>
          <strong>Ponderal Index</strong> (Corpulence Index) scales height by a power of 3 to measure 3D body volume:
          <br />
          <code>{"Ponderal Index = Weight (kg) / [Height (m)]³ = 72.57 / (1.778³) = 12.91 kg/m³"}</code>
        </p>
      </section>

      {/* 7. FAQ Section */}
      <section className={styles.contentBlock}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {BMI_FAQS.map((faq, index) => (
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

      {/* 8. Related Calculators */}
      <section className={styles.contentBlock}>
        <h2>Related Health &amp; Fitness Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/calorie-calculator" className={styles.relatedCard}>
            <div>
              <h4>Calorie Calculator</h4>
              <p>Calculate your daily Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on activity level.</p>
            </div>
            <span className={styles.arrowLink}>Open Calorie Tool →</span>
          </Link>

          <Link href="/pregnancy-calculator" className={styles.relatedCard}>
            <div>
              <h4>Pregnancy Due Date Calculator</h4>
              <p>Estimate your due date, gestational age in weeks and days, and trimester timeline using ACOG clinical formulas.</p>
            </div>
            <span className={styles.arrowLink}>Open Pregnancy Tool →</span>
          </Link>

          <Link href="/age-calculator" className={styles.relatedCard}>
            <div>
              <h4>Age Calculator</h4>
              <p>Calculate exact chronological age down to days, hours, and seconds, plus upcoming birthday countdowns.</p>
            </div>
            <span className={styles.arrowLink}>Open Age Tool →</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
