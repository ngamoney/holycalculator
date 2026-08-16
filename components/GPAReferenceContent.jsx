"use client";

import { useState } from "react";
import Link from "next/link";
import { GPA_LETTER_GRADES } from "@/lib/calculations/gpa";
import { GPA_FAQS } from "@/lib/data/gpaFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./GPAReferenceContent.module.css";

export default function GPAReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      {/* Top in-content ad banner above reference content */}
      <AdBanner />

      <div className={styles.refProse}>
        <h2>How GPA (Grade Point Average) Is Calculated</h2>
        <p>
          Your Grade Point Average (GPA) is the standard numerical metric used by high schools, universities, and graduate admissions to summarize your overall academic achievement. Rather than taking a simple arithmetic mean of your course percentages, GPA is a <strong>credit-weighted average of grade points</strong>.
        </p>
        <p>
          Each course on your transcript contributes a specific number of &ldquo;quality points&rdquo; (also known as grade points) determined by multiplying the course&rsquo;s credit hours by the numeric value assigned to the letter grade earned. A 4-credit calculus course carries twice the weight of a 2-credit elective when calculating your final average.
        </p>

        {/* Formula Display Box */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Mathematical Formula — Semester GPA</div>
          <div className={styles.formulaMath}>
            GPA = ( ∑ (Grade Points<sub>i</sub> × Credits<sub>i</sub>) ) / ( ∑ Credits<sub>i</sub> )
          </div>
          <div className={styles.formulaDesc}>
            Where <em>Grade Points<sub>i</sub></em> is the numerical point equivalent for class <em>i</em>, and <em>Credits<sub>i</sub></em> is the credit hour value of the course. Non-credit grades (P, NP, I, W) are omitted from both the numerator and denominator.
          </div>
        </div>

        <h3>Worked Example 1: Letter Grade Course Load</h3>
        <p>
          Consider a typical semester course load of 15 credit hours across five academic subjects:
        </p>

        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Course</th>
                <th>Credits</th>
                <th>Letter Grade</th>
                <th>Grade Points</th>
                <th>Quality Points (Credits × Points)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>English Literature</td>
                <td>3</td>
                <td>A</td>
                <td>4.00</td>
                <td>3 × 4.00 = <strong>12.00</strong></td>
              </tr>
              <tr>
                <td>Calculus I</td>
                <td>4</td>
                <td>B+</td>
                <td>3.30</td>
                <td>4 × 3.30 = <strong>13.20</strong></td>
              </tr>
              <tr>
                <td>General Chemistry + Lab</td>
                <td>4</td>
                <td>A-</td>
                <td>3.70</td>
                <td>4 × 3.70 = <strong>14.80</strong></td>
              </tr>
              <tr>
                <td>World History</td>
                <td>3</td>
                <td>B</td>
                <td>3.00</td>
                <td>3 × 3.00 = <strong>9.00</strong></td>
              </tr>
              <tr>
                <td>Physical Education</td>
                <td>1</td>
                <td>P (Pass)</td>
                <td>—</td>
                <td>0 (Excluded from GPA)</td>
              </tr>
              <tr className={styles.tableTotalRow}>
                <td><strong>Semester Totals</strong></td>
                <td><strong>14 Graded Credits</strong> (15 Attempted)</td>
                <td colSpan={2}><strong>Total Quality Points:</strong></td>
                <td><strong>49.00</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          To compute the semester GPA, divide the total quality points by the graded credit hours:
        </p>
        <p style={{ fontFamily: "var(--mono)", fontSize: "14.5px", background: "var(--paper-raised)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--line)" }}>
          Semester GPA = 49.00 Quality Points / 14 Graded Credits = <strong>3.50 GPA (B+ / Honors Standing)</strong>
        </p>

        <h3>Worked Example 2: Numeric / Percentage Grade Course Load</h3>
        <p>
          When courses report percentage scores, each percentage is converted to its standard letter-grade point value before applying credit weights:
        </p>

        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Course</th>
                <th>Credits</th>
                <th>Score (%)</th>
                <th>Grade Equivalent</th>
                <th>Quality Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Microeconomics</td>
                <td>3</td>
                <td>95%</td>
                <td>A (4.00)</td>
                <td>3 × 4.00 = <strong>12.00</strong></td>
              </tr>
              <tr>
                <td>Computer Science 101</td>
                <td>4</td>
                <td>88%</td>
                <td>B+ (3.30)</td>
                <td>4 × 3.30 = <strong>13.20</strong></td>
              </tr>
              <tr>
                <td>Statistics</td>
                <td>3</td>
                <td>78%</td>
                <td>C+ (2.30)</td>
                <td>3 × 2.30 = <strong>6.90</strong></td>
              </tr>
              <tr className={styles.tableTotalRow}>
                <td><strong>Totals</strong></td>
                <td><strong>10 Graded Credits</strong></td>
                <td colSpan={2}><strong>Total Quality Points:</strong></td>
                <td><strong>32.10</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontFamily: "var(--mono)", fontSize: "14.5px", background: "var(--paper-raised)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--line)" }}>
          Calculated GPA = 32.10 / 10 = <strong>3.21 GPA (B Standing)</strong>
        </p>

        <h3>Cumulative GPA with Prior Semesters</h3>
        <p>
          Your cumulative GPA combines all completed semesters with any existing academic credits. The calculation carries forward prior quality points without simply taking an unweighted average of semester GPA numbers:
        </p>

        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Mathematical Formula — Cumulative GPA Carry-Forward</div>
          <div className={styles.formulaMath}>
            Cumulative GPA = [ (Prior GPA × Prior Credits) + (Current Semester Quality Points) ] / (Prior Credits + Current Credits)
          </div>
          <div className={styles.formulaDesc}>
            Example: A student entering with a 3.20 GPA over 30 credits who earns a 3.80 GPA over 15 new credits achieves: <code>[(3.20 × 30) + (3.80 × 15)] / (30 + 15) = (96 + 57) / 45 = <strong>3.40 Cumulative GPA</strong></code>.
          </div>
        </div>

        {/* Reciprocal Cross-Sell Banner to Grade Calculator */}
        <div className={styles.crossSellBanner}>
          <div className={styles.crossSellText}>
            <h4>Need to calculate individual assignment weights or final exam goals?</h4>
            <p>Use our companion Grade Calculator to compute syllabus weighted percentages and score requirements.</p>
          </div>
          <Link href="/grade-calculator" className={styles.crossSellBtn}>
            <span>Grade Calculator</span>
            <span>→</span>
          </Link>
        </div>

        <h2>Letter Grade to GPA Points Conversion Scale</h2>
        <p>
          Below is the official 4.0 GPA conversion scale, including standard 4.30 point values for A+ grades and non-credit exemptions:
        </p>

        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Letter Grade</th>
                <th>GPA Points (4.0 Scale)</th>
                <th>Standard Percentage Range</th>
                <th>Academic Status</th>
              </tr>
            </thead>
            <tbody>
              {GPA_LETTER_GRADES.map((item) => (
                <tr key={item.letter}>
                  <td><strong>{item.letter}</strong></td>
                  <td>{item.points !== null ? item.points.toFixed(2) : "Excluded"}</td>
                  <td>
                    {item.minPercent !== null ? `${item.minPercent}% – ${item.maxPercent}%` : "Non-numeric"}
                  </td>
                  <td>
                    {item.isExcluded
                      ? "No impact on Grade Point Average"
                      : item.points >= 3.7
                      ? "Dean's List / Honors"
                      : item.points >= 3.0
                      ? "Good Standing"
                      : item.points >= 2.0
                      ? "Satisfactory / Minimum Passing"
                      : "Below Minimum Standing"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary In-Content Ad Banner */}
      <AdBanner />

      {/* FAQ Section */}
      <div className={styles.faqWrap}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {GPA_FAQS.map((faq, index) => {
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
      </div>
    </section>
  );
}
