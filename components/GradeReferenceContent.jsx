"use client";

import { useState } from "react";
import Link from "next/link";
import { LETTER_GRADES } from "@/lib/calculations/grade";
import { GRADE_FAQS } from "@/lib/data/gradeFaqs";
import AdBanner from "@/components/AdBanner";

export default function GradeReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="ref-content-section">
      <div className="ref-prose">
        <h2>How Weighted Grades Are Calculated</h2>
        <p>
          In many high school, college, and university courses, assignments are not weighted equally.
          Instructors typically allocate higher percentages of your total course grade to comprehensive
          evaluations—such as midterms, laboratory projects, and final examinations—while homework and
          weekly quizzes carry smaller weights.
        </p>

        {/* Formula Display Box */}
        <div className="formula-card">
          <div className="formula-title">Mathematical Formula — Weighted Grade Average</div>
          <div className="formula-math">
            Weighted Average = ( ∑ (Grade<sub>i</sub> × Weight<sub>i</sub>) ) / ( ∑ Weight<sub>i</sub> )
          </div>
          <div className="formula-desc">
            Where <em>Grade<sub>i</sub></em> is the percentage score earned on assignment <em>i</em>, and <em>Weight<sub>i</sub></em> is the percentage weight assigned to that category.
          </div>
        </div>

        <h3>Worked Step-by-Step Example</h3>
        <p>
          Suppose your syllabus defines the following four grading components for a 100-point course:
        </p>
        <ul>
          <li><strong>Homework:</strong> 95% score (Weight: 20%) → 95 × 0.20 = <strong>19.0 points</strong></li>
          <li><strong>Quizzes:</strong> 85% score (Weight: 20%) → 85 × 0.20 = <strong>17.0 points</strong></li>
          <li><strong>Midterm Exam:</strong> 78% score (Weight: 30%) → 78 × 0.30 = <strong>23.4 points</strong></li>
          <li><strong>Final Project:</strong> 90% score (Weight: 30%) → 90 × 0.30 = <strong>27.0 points</strong></li>
        </ul>
        <p>
          Summing the earned weighted points gives: <code>19.0 + 17.0 + 23.4 + 27.0 = 86.4%</code>.
          According to the standard grading scale, an 86.4% corresponds to a solid <strong>B grade (3.0 GPA)</strong>.
        </p>

        <h3>How to Calculate the Final Exam Score You Need</h3>
        <p>
          When you enter finals week, you often want to know the minimum exam score required to maintain or achieve a specific letter grade.
          The formula to calculate the required final exam score is:
        </p>

        <div className="formula-card">
          <div className="formula-title">Mathematical Formula — Final Exam Target Planner</div>
          <div className="formula-math">
            Final Exam Score = [ Desired Grade − ( Current Grade × (1 − Final Weight) ) ] / Final Weight
          </div>
          <div className="formula-desc">
            Convert weights to decimals (e.g., 25% weight = 0.25, leaving 0.75 for completed coursework).
          </div>
        </div>

        <p>
          For example, if your current grade is <strong>88%</strong>, you want an <strong>A- (90%)</strong>, and the final exam represents <strong>25% (0.25)</strong> of the total grade:
        </p>
        <ul>
          <li>Remaining weight fraction before final: <code>1 − 0.25 = 0.75</code></li>
          <li>Points locked in from current grade: <code>88 × 0.75 = 66.0 points</code></li>
          <li>Points needed from final: <code>90 − 66.0 = 24.0 points</code></li>
          <li>Required final exam score: <code>24.0 / 0.25 = 96.0%</code></li>
        </ul>
        <p>
          You would need at least a <strong>96.0% (A)</strong> on the final exam to finish the course with an overall grade of 90.0% (A-).
        </p>

        <h2>Letter Grade, GPA Scale &amp; Percentage Conversion Table</h2>
        <p>
          The table below illustrates the standard 4.0 Grade Point Average (GPA) conversion scale utilized across most US universities and secondary schools:
        </p>

        {/* Semantic Grade Conversion Table */}
        <div className="grade-scale-wrapper">
          <table className="grade-scale-table">
            <thead>
              <tr>
                <th>Letter Grade</th>
                <th>GPA (4.0 Scale)</th>
                <th>Percentage Range</th>
                <th>Academic Standing</th>
              </tr>
            </thead>
            <tbody>
              {LETTER_GRADES.map((item) => (
                <tr key={item.letter}>
                  <td><strong>{item.letter}</strong></td>
                  <td><code style={{ fontFamily: "var(--mono)" }}>{item.gpa.toFixed(1)}</code></td>
                  <td>{item.min}% – {item.max < 100 ? `${item.max.toFixed(0)}%` : "100%"}</td>
                  <td>
                    {item.gpa >= 3.7 && "Excellent (Honors)"}
                    {item.gpa >= 2.7 && item.gpa < 3.7 && "Above Average / Good"}
                    {item.gpa >= 1.7 && item.gpa < 2.7 && "Satisfactory / Average"}
                    {item.gpa >= 0.7 && item.gpa < 1.7 && "Passing / Below Average"}
                    {item.gpa === 0.0 && "Failing"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* In-content Advertisement Banner between reference sections */}
        <AdBanner />

        {/* Frequently Asked Questions Section */}
        <div className="faq-wrap" id="faqs">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {GRADE_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="faq-item">
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className={`faq-icon ${isOpen ? "open" : ""}`}>+</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Calculators Links */}
        <div style={{ marginTop: "50px", padding: "24px", background: "var(--paper-raised)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}>
          <h3 style={{ marginTop: 0 }}>Explore Related Math &amp; Academic Calculators</h3>
          <p style={{ marginBottom: "16px" }}>
            Check out our suite of free, instant calculation tools built for students and educators:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            <Link href="/#math" style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--paper)", display: "block" }}>
              <strong style={{ display: "block", color: "var(--ink)" }}>GPA Calculator →</strong>
              <span style={{ fontSize: "12px", color: "var(--ink-60)" }}>Calculate cumulative semester GPA</span>
            </Link>
            <Link href="/#math" style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--paper)", display: "block" }}>
              <strong style={{ display: "block", color: "var(--ink)" }}>Percentage Calculator →</strong>
              <span style={{ fontSize: "12px", color: "var(--ink-60)" }}>Find percentages and percent changes</span>
            </Link>
            <Link href="/#math" style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--paper)", display: "block" }}>
              <strong style={{ display: "block", color: "var(--ink)" }}>Fraction Calculator →</strong>
              <span style={{ fontSize: "12px", color: "var(--ink-60)" }}>Simplify and operate on fractions</span>
            </Link>
            <Link href="/" style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--paper)", display: "block" }}>
              <strong style={{ display: "block", color: "var(--ink)" }}>Scientific Calculator →</strong>
              <span style={{ fontSize: "12px", color: "var(--ink-60)" }}>Full-featured keyboard calculator</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
