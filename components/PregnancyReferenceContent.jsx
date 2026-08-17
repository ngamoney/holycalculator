import { PREGNANCY_FAQS } from "@/lib/data/pregnancyFaqs";
import Link from "next/link";
import styles from "./PregnancyReferenceContent.module.css";

export default function PregnancyReferenceContent() {
  return (
    <article className={styles.referenceContainer}>
      {/* 1. Methodology Section */}
      <section className={styles.section}>
        <h2>Clinical Methods for Calculating Your Due Date</h2>
        <p>
          Determining an accurate estimated due date is one of the first clinical milestones in prenatal care.
          A standard full-term pregnancy spans 40 weeks (280 days) measured from the first day of your last menstrual
          period (LMP), or 38 weeks (266 days) from the date of conception. This <strong>pregnancy calculator</strong> supports
          the five primary clinical dating methods recognized by the American College of Obstetricians and Gynecologists (ACOG).
        </p>

        <div className={styles.methodsGrid}>
          <div className={styles.methodCard}>
            <h3>1. Last Menstrual Period (LMP) — Naegele’s Rule</h3>
            <p>
              Naegele’s rule is the default clinical standard for spontaneous pregnancies. It adds 280 days (40 weeks) to the
              first day of your last period, assuming a standard 28-day menstrual cycle with ovulation occurring on day 14.
              When cycle lengths differ from 28 days, this <strong>due date calculator</strong> adjusts the estimated ovulation
              window accordingly to maintain accuracy.
            </p>
          </div>

          <div className={styles.methodCard}>
            <h3>2. Known Conception Date</h3>
            <p>
              If you tracked ovulation or know the exact date of conception, your estimated due date is calculated by adding
              266 days (38 weeks) directly to the conception date. Fertilization typically occurs within 24 hours of ovulation.
            </p>
          </div>

          <div className={styles.methodCard}>
            <h3>3. IVF Embryo Transfer Date</h3>
            <p>
              In vitro fertilization (IVF) provides precise timing. For a Day 3 embryo transfer, the estimated due date is
              transfer date + 263 days. For a Day 5 or Day 6 blastocyst transfer, the estimated due date is transfer date + 261 days.
            </p>
          </div>

          <div className={styles.methodCard}>
            <h3>4. Early Dating Ultrasound Scan</h3>
            <p>
              A first-trimester ultrasound measuring crown-rump length (CRL) is clinically considered the most precise dating method.
              If an early scan differs from your LMP estimate by more than 5 to 7 days, ACOG guidelines recommend using the
              ultrasound-derived date as the official clinical due date.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Trimester Breakdown Section */}
      <section className={styles.section}>
        <h2>Pregnancy Trimester Timeline Breakdown</h2>
        <p>
          Obstetric care divides pregnancy into three clinical trimesters, each spanning roughly 13 weeks. Tracking your progress
          with a reliable <strong>pregnancy due date calculator</strong> helps contextualize key developmental milestones.
        </p>

        <div className={styles.trimesterTableWrapper}>
          <table className={styles.trimesterTable}>
            <thead>
              <tr>
                <th>Trimester</th>
                <th>Gestational Weeks</th>
                <th>Clinical Focus &amp; Milestones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>First Trimester</strong></td>
                <td>Weeks 1 – 13</td>
                <td>
                  Embryonic development, organogenesis, early prenatal blood tests, and first-trimester dating ultrasound.
                </td>
              </tr>
              <tr>
                <td><strong>Second Trimester</strong></td>
                <td>Weeks 14 – 27</td>
                <td>
                  Rapid fetal growth, anatomical survey ultrasound (typically 18–22 weeks), maternal movement perception, and glucose screening.
                </td>
              </tr>
              <tr>
                <td><strong>Third Trimester</strong></td>
                <td>Weeks 28 – 40+</td>
                <td>
                  Final maturation of lungs and organs, fetal position assessment, group B strep screening, and delivery preparation.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. FAQ Section */}
      <section className={styles.section}>
        <h2>Frequently Asked Questions — Pregnancy &amp; Due Date Calculator</h2>
        <p>
          Common clinical questions regarding gestational age, due date accuracy, and calculation formulas:
        </p>

        <div className={styles.faqList}>
          {PREGNANCY_FAQS.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{faq.question}</h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Related Calculators */}
      <section className={styles.section}>
        <h2>Related Health &amp; Time Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/age-calculator" className={styles.relatedCard}>
            <span className={styles.relatedIcon}>◷</span>
            <div>
              <h4>Age Calculator</h4>
              <p>Calculate exact chronological age in years, months, weeks, and days.</p>
            </div>
          </Link>

          <Link href="/calorie-calculator" className={styles.relatedCard}>
            <span className={styles.relatedIcon}>🔥</span>
            <div>
              <h4>Calorie Calculator</h4>
              <p>Estimate daily energy expenditure, BMR, and nutritional maintenance targets.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Medical Disclaimer Footer */}
      <div className={styles.contentDisclaimer}>
        <p>
          <strong>Medical Notice:</strong> Content on holycalculator.com is provided for informational and educational
          purposes only. It is not intended to serve as medical advice, diagnosis, or treatment. Due date calculations represent
          statistical estimates. Always seek the advice of a qualified physician, OB-GYN, or healthcare professional regarding
          any medical condition or prenatal care regimen.
        </p>
      </div>
    </article>
  );
}
