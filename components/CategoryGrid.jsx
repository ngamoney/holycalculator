import Link from "next/link";
import SidebarAd from "@/components/SidebarAd";

export default function CategoryGrid() {
  return (
    <section className="cat-section" id="categories">
      <div className="section-head">
        <h2>All calculators, by category</h2>
        <p>30+ tools · new ones added monthly</p>
      </div>

      <div className="cat-layout">
        <div className="keypad">
          {/* Finance */}
          <div className="key finance" id="finance">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">$</div>
                <h3>Finance</h3>
              </div>
              <Link href="/finance" className="key-see-all">See all 8 →</Link>
            </div>
            <div className="key-links">
              <Link href="/mortgage-calculator">Mortgage calculator</Link>
              <Link href="/auto-loan-calculator">Auto loan calculator</Link>
              <Link href="/retirement-calculator">Retirement calculator</Link>
              <Link href="/loan-calculator">Loan calculator</Link>
              <Link href="/compound-interest-calculator">Compound interest</Link>
              <Link href="/budget-calculator">Budget calculator</Link>
              <Link href="/currency-calculator">Currency converter</Link>
              <Link href="/sales-tax-calculator">Sales tax calculator</Link>
            </div>
          </div>

          {/* Health & Fitness */}
          <div className="key health" id="health">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">+</div>
                <h3>Health &amp; Fitness</h3>
              </div>
              <Link href="/health" className="key-see-all">See all 6 →</Link>
            </div>
            <div className="key-links">
              <Link href="/bmi-calculator">BMI calculator</Link>
              <Link href="/calorie-calculator">Calorie (TDEE) calculator</Link>
              <Link href="/body-fat-calculator">Body fat calculator</Link>
              <Link href="/ideal-weight-calculator">Ideal weight calculator</Link>
              <Link href="/pregnancy-calculator">Pregnancy due date calculator</Link>
              <Link href="/bmr-calculator">BMR calculator</Link>
            </div>
          </div>

          {/* Math */}
          <div className="key math" id="math">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">%</div>
                <h3>Math</h3>
              </div>
              <Link href="/math" className="key-see-all">See all 7 →</Link>
            </div>
            <div className="key-links">
              <Link href="/grade-calculator">Grade calculator</Link>
              <Link href="/math/percentage-calculator">Percentage calculator</Link>
              <Link href="/math/fraction-calculator">Fraction calculator</Link>
              <Link href="/math/scientific-calculator">Scientific calculator</Link>
              <Link href="/gpa-calculator">GPA calculator</Link>
              <Link href="/math/average-calculator">Average calculator</Link>
              <Link href="/math/standard-deviation-calculator">Standard deviation</Link>
            </div>
          </div>

          {/* Date & Time */}
          <div className="key date" id="date-time">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">◷</div>
                <h3>Date &amp; Time</h3>
              </div>
              <Link href="/date-time" className="key-see-all">See all 4 →</Link>
            </div>
            <div className="key-links">
              <Link href="/age-calculator">Age calculator</Link>
              <Link href="/date-calculator">Date calculator</Link>
              <Link href="/date-time/time-zone-calculator">Time zone calculator</Link>
              <Link href="/date-time/countdown-calculator">Countdown calculator</Link>
            </div>
          </div>

          {/* Conversions */}
          <div className="key conv" id="conversions">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">⇄</div>
                <h3>Conversions</h3>
              </div>
              <Link href="/conversions" className="key-see-all">See all 8 →</Link>
            </div>
            <div className="key-links">
              <Link href="/conversion-calculator">Unit converter</Link>
              <Link href="/currency-calculator">Currency converter</Link>
              <Link href="/conversion-calculator?cat=length">Length converter</Link>
              <Link href="/conversion-calculator?cat=weight">Weight converter</Link>
              <Link href="/conversion-calculator?cat=temperature">Temperature converter</Link>
              <Link href="/conversion-calculator?cat=area">Area converter</Link>
              <Link href="/conversion-calculator?cat=volume">Volume converter</Link>
              <Link href="/conversion-calculator?cat=speed">Speed converter</Link>
            </div>
          </div>

          {/* Spiritual & Luck */}
          <div className="key spiritual" id="spiritual">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">✦</div>
                <h3>Spiritual &amp; Luck</h3>
              </div>
              <Link href="/spiritual" className="key-see-all">See all 5 →</Link>
            </div>
            <div className="key-links">
              <Link href="/spiritual/life-path-number-calculator">Life path number</Link>
              <Link href="/spiritual/zodiac-compatibility-calculator">Zodiac compatibility</Link>
              <Link href="/spiritual/angel-number-calculator">Angel number calculator</Link>
              <Link href="/spiritual/lucky-number-generator">Lucky number generator</Link>
              <Link href="/spiritual/tarot-card-calculator">Daily tarot reading</Link>
            </div>
          </div>

          {/* Tools & Games */}
          <div className="key other" id="other">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">◎</div>
                <h3>Tools &amp; Games</h3>
              </div>
              <Link href="/tools" className="key-see-all">See tool →</Link>
            </div>
            <div className="key-links">
              <Link href="/dice-roller">Virtual dice roller</Link>
            </div>
          </div>
        </div>

        {/* Unified Sidebar Ad */}
        <SidebarAd />
      </div>
    </section>
  );
}
