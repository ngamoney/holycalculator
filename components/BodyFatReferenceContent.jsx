"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./BodyFatReferenceContent.module.css";
import { BODY_FAT_FAQS } from "@/lib/data/bodyFatFaqs";
import { JACKSON_POLLOCK_REFERENCE_DATA } from "@/lib/calculations/bodyFat";

export default function BodyFatReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        {/* Section 1: Essential Fat vs Storage Fat */}
        <h2 className={styles.blockHeading}>Essential Fat vs. Storage Fat</h2>
        <p className={styles.paragraph}>
          Body composition consists of two primary components: <strong>fat mass</strong> and <strong>lean body mass</strong> (muscles, bones, organs, fluids, and connective tissue). Total body fat is subdivided into two distinct biological categories:
        </p>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li>
            <strong>Essential Body Fat:</strong> The baseline fat required for normal physiological function, cellular membrane integrity, hormone regulation, and organ cushioning. Essential body fat is approximately <strong>2% to 5% for men</strong> and <strong>10% to 13% for women</strong>. Women naturally require higher essential fat for reproductive health and endocrine balance.
          </li>
          <li>
            <strong>Storage Fat:</strong> Adipose tissue accumulated beneath the skin (subcutaneous fat) and around internal organs (visceral fat). While excess visceral fat carries metabolic health risks, adequate storage fat provides energy reserves and body temperature regulation.
          </li>
        </ul>

        {/* Section 2: ACE Body Fat Category Table */}
        <h2 className={styles.blockHeading}>ACE Body Fat Categories</h2>
        <p className={styles.paragraph}>
          The American Council on Exercise (ACE) categorizes body fat percentage ranges by gender as follows:
        </p>

        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Classification</th>
                <th>Women Body Fat %</th>
                <th>Men Body Fat %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Essential Fat</strong></td>
                <td className={styles.monoCell}>10% – 13%</td>
                <td className={styles.monoCell}>2% – 5%</td>
              </tr>
              <tr>
                <td><strong>Athletes</strong></td>
                <td className={styles.monoCell}>14% – 20%</td>
                <td className={styles.monoCell}>6% – 13%</td>
              </tr>
              <tr>
                <td><strong>Fitness</strong></td>
                <td className={styles.monoCell}>21% – 24%</td>
                <td className={styles.monoCell}>14% – 17%</td>
              </tr>
              <tr>
                <td><strong>Average</strong></td>
                <td className={styles.monoCell}>25% – 31%</td>
                <td className={styles.monoCell}>18% – 24%</td>
              </tr>
              <tr>
                <td><strong>Above Average / Higher</strong></td>
                <td className={styles.monoCell}>32%+</td>
                <td className={styles.monoCell}>25%+</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Jackson & Pollock Age-Based Reference Table */}
        <h2 className={styles.blockHeading}>Jackson &amp; Pollock Ideal Body Fat Percentages by Age</h2>
        <p className={styles.paragraph}>
          Research by Jackson &amp; Pollock highlights how average body fat distribution shifts naturally across age brackets:
        </p>

        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Age Bracket</th>
                <th>Men Reference Range</th>
                <th>Women Reference Range</th>
              </tr>
            </thead>
            <tbody>
              {JACKSON_POLLOCK_REFERENCE_DATA.map((row) => (
                <tr key={row.ageGroup}>
                  <td><strong>{row.ageGroup} years</strong></td>
                  <td className={styles.monoCell}>{row.male}</td>
                  <td className={styles.monoCell}>{row.female}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: How U.S. Navy Method Works & Protocol */}
        <h2 className={styles.blockHeading}>How the U.S. Navy Method Works</h2>
        <p className={styles.paragraph}>
          Developed by the Naval Health Research Center, the <strong>U.S. Navy Method</strong> estimates body density by comparing abdominal circumference against neck circumference and height. Because abdominal fat is closely correlated with total body fat while neck circumference correlates with lean upper body frame, this logarithmic formula estimates fat percentage without expensive clinical equipment.
        </p>
        <h3 className={styles.subHeading}>Standard Tape Measurement Protocol</h3>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li><strong>Neck:</strong> Measure around the neck just below the larynx (Adam&apos;s apple), keeping the tape perpendicular to the neck axis.</li>
          <li><strong>Waist (Men):</strong> Measure horizontally around the abdomen at navel level at the end of a normal exhalation.</li>
          <li><strong>Waist (Women):</strong> Measure at the narrowest point of the natural waistline between the ribcage and navel.</li>
          <li><strong>Hips (Women):</strong> Measure horizontally at the widest circumference of the buttocks.</li>
        </ul>

        {/* Section 5: Clinical Limitations & Medical Disclaimer */}
        <h2 className={styles.blockHeading}>Clinical Limitations &amp; Health Context</h2>
        <p className={styles.paragraph}>
          While the U.S. Navy Method is widely utilized, all circumference-based formulas are indirect statistical estimates:
        </p>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li><strong>Muscular Athletes &amp; Bodybuilders:</strong> Individuals with significant muscular development in the upper body or neck may receive skewed estimates.</li>
          <li><strong>Hydration &amp; Meal Timing:</strong> Abdominal bloating or fluid retention can alter daily waist measurements.</li>
          <li><strong>Too Low Body Fat Warning:</strong> Attempting to lower body fat below essential levels (under 5% for men or 13% for women) carries serious health risks, including hormonal disruption, impaired immune function, bone density loss, and cardiovascular strain.</li>
        </ul>

        <div className={styles.disclaimerCallout}>
          <h4 className={styles.disclaimerTitle}>Medical &amp; Diagnostic Disclaimer</h4>
          <p className={styles.disclaimerBody}>
            The body fat estimations provided by Holy Calculator are intended strictly for general fitness and educational tracking. They are not medical diagnostic tools. For clinical body composition analysis, consult a physician or sports dietitian for DEXA scanning, hydrostatic weighing, or 3D optical body scanning.
          </p>
        </div>

        {/* FAQ Section */}
        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {BODY_FAT_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className={`${styles.faqIcon} ${isOpen ? styles.open : ""}`}>+</span>
                </button>
                {isOpen && (
                  <div className={styles.faqAnswer}>
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Related Health Calculators */}
        <h2 className={styles.blockHeading}>Related Health &amp; Fitness Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/bmi-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>BMI Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate Body Mass Index, WHO categories, and healthy weight ranges for adults and kids.
              </p>
            </div>
          </Link>
          <Link href="/ideal-weight-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Ideal Weight Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Compare ideal body weight across Devine, Robinson, Miller, and Hamwi formulas.
              </p>
            </div>
          </Link>
          <Link href="/calorie-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Calorie (TDEE) Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Estimate your Total Daily Energy Expenditure and baseline daily calorie needs.
              </p>
            </div>
          </Link>
          <Link href="/bmr-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>BMR Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate Basal Metabolic Rate using Mifflin-St Jeor and Katch-McArdle equations.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
