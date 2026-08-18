export default function CategoryGrid() {
  return (
    <section className="cat-section" id="categories">
      <div className="section-head">
        <h2>All calculators, by category</h2>
        <p>30+ tools · new ones added monthly</p>
      </div>

      <div className="cat-layout">
        <div className="keypad">
          <div className="key finance" id="finance">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">₹</div>
                <h3>Finance</h3>
              </div>
              <div className="key-see-all">See all 8 →</div>
            </div>
            <div className="key-links">
              <a href="/mortgage-calculator">Mortgage calculator</a>
              <a href="/retirement-calculator">Retirement calculator</a>
              <a href="/loan-calculator">Loan calculator</a>
              <a href="/compound-interest-calculator">Compound interest</a>
              <a href="/budget-calculator">Budget calculator</a>
              <a href="/currency-calculator">Currency converter</a>
              <a href="/sales-tax-calculator">Sales tax calculator</a>
            </div>
          </div>

          <div className="key health" id="health">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">+</div>
                <h3>Health &amp; Fitness</h3>
              </div>
              <div className="key-see-all">See all 6 →</div>
            </div>
            <div className="key-links">
              <a href="/bmi-calculator">BMI calculator</a>
              <a href="/calorie-calculator">Calorie (TDEE) calculator</a>
              <a href="/body-fat-calculator">Body fat calculator</a>
              <a href="/ideal-weight-calculator">Ideal weight calculator</a>
              <a href="/pregnancy-calculator">Pregnancy due date calculator</a>
              <a href="/bmr-calculator">BMR calculator</a>
            </div>
          </div>

          <div className="key math" id="math">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">%</div>
                <h3>Math</h3>
              </div>
              <div className="key-see-all">See all 7 →</div>
            </div>
            <div className="key-links">
              <a href="/grade-calculator">Grade calculator</a>
              <a href="/math/percentage-calculator">Percentage calculator</a>
              <a href="/math/fraction-calculator">Fraction calculator</a>
              <a href="/math/scientific-calculator">Scientific calculator</a>
              <a href="/gpa-calculator">GPA calculator</a>
              <a href="/math/average-calculator">Average calculator</a>
              <a href="/math/standard-deviation-calculator">Standard deviation</a>
            </div>
          </div>

          <div className="key date">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">◷</div>
                <h3>Date &amp; Time</h3>
              </div>
              <div className="key-see-all">See all 5 →</div>
            </div>
            <div className="key-links">
              <a href="/age-calculator">Age calculator</a>
              <a href="/date-calculator">Date difference (calculator)</a>
              <a href="/date-time/time-zone-calculator">Time zone calculator</a>
              <a href="/date-time/countdown-calculator">Countdown calculator</a>
              <a href="/date-calculator">Workdays calculator</a>
            </div>
          </div>

          <div className="key conv" id="conversions">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">⇄</div>
                <h3>Conversions</h3>
              </div>
              <div className="key-see-all">See all 8 →</div>
            </div>
            <div className="key-links">
              <a href="/conversion-calculator">Unit converter</a>
              <a href="/currency-calculator">Currency converter</a>
              <a href="/conversion-calculator?cat=length">Length converter</a>
              <a href="/conversion-calculator?cat=weight">Weight converter</a>
              <a href="/conversion-calculator?cat=temperature">Temperature converter</a>
              <a href="/conversion-calculator?cat=area">Area converter</a>
              <a href="/conversion-calculator?cat=volume">Volume converter</a>
              <a href="/conversion-calculator?cat=speed">Speed converter</a>
            </div>
          </div>

          <div className="key spiritual">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">✦</div>
                <h3>Spiritual &amp; Luck</h3>
              </div>
              <div className="key-see-all">See all 5 →</div>
            </div>
            <div className="key-links">
              <a href="/spiritual/life-path-number-calculator">Life path number</a>
              <a href="/spiritual/zodiac-compatibility-calculator">Zodiac compatibility</a>
              <a href="/spiritual/angel-number-calculator">Angel number calculator</a>
              <a href="/spiritual/lucky-number-generator">Lucky number generator</a>
              <a href="/spiritual/tarot-card-calculator">Daily tarot reading</a>
            </div>
          </div>

          <div className="key other" id="other">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">◎</div>
                <h3>Other Calculators</h3>
              </div>
              <div className="key-see-all">See all 2 →</div>
            </div>
            <div className="key-links">
              <a href="/age-calculator">Age calculator</a>
              <a href="/dice-roller">Dice roller</a>
            </div>
          </div>
        </div>

        <div className="sidebar-ad">
          <div className="ad-vertical">ADVERTISEMENT — 300×600</div>
        </div>
      </div>
    </section>
  );
}
