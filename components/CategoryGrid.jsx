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
              <a href="#">Income tax calculator</a>
              <a href="#">Sales tax calculator</a>
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
              <a href="#">Body fat calculator</a>
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
              <a href="#">Fraction calculator</a>
              <a href="#">Scientific calculator</a>
              <a href="/gpa-calculator">GPA calculator</a>
              <a href="#">Average calculator</a>
              <a href="#">Standard deviation</a>
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
              <a href="#">Countdown calculator</a>
              <a href="#">Workdays calculator</a>
              <a href="#">Time zone converter</a>
            </div>
          </div>

          <div className="key conv">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">⇄</div>
                <h3>Conversions</h3>
              </div>
              <div className="key-see-all">See all 4 →</div>
            </div>
            <div className="key-links">
              <a href="#">Unit converter</a>
              <a href="#">Currency converter</a>
              <a href="#">Length converter</a>
              <a href="#">Weight converter</a>
            </div>
          </div>

          <div className="key spiritual">
            <div className="key-top">
              <div className="key-head">
                <div className="key-icon">✦</div>
                <h3>Spiritual &amp; Luck</h3>
              </div>
              <div className="key-see-all">See all 4 →</div>
            </div>
            <div className="key-links">
              <a href="#">Life path number</a>
              <a href="#">Zodiac compatibility</a>
              <a href="#">Angel number calculator</a>
              <a href="#">Lucky number generator</a>
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
