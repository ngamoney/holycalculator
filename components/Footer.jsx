import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo">
              <span className="digit">holy</span>calculator
            </div>
            <p>
              One engine for every number you need — practical and otherwise.
            </p>
          </div>
          <div>
            <h5>Finance</h5>
            <ul>
              <li>
                <Link href="/mortgage-calculator">Mortgage</Link>
              </li>
              <li>
                <Link href="/retirement-calculator">Retirement</Link>
              </li>
              <li>
                <Link href="/loan-calculator">Loan Calculator</Link>
              </li>
              <li>
                <Link href="/budget-calculator">Budget Calculator</Link>
              </li>
              <li>
                <Link href="/compound-interest-calculator">Compound Interest</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Health</h5>
            <ul>
              <li>
                <Link href="/calorie-calculator">Calorie</Link>
              </li>
              <li>
                <Link href="/pregnancy-calculator">Pregnancy Due Date</Link>
              </li>
              <li>
                <Link href="/bmi-calculator">BMI</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Everyday</h5>
            <ul>
              <li>
                <Link href="/age-calculator">Age</Link>
              </li>
              <li>
                <Link href="/math/percentage-calculator">Percentage</Link>
              </li>
              <li>
                <Link href="/conversion-calculator">Unit converter</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Spiritual</h5>
            <ul>
              <li>
                <Link href="/spiritual/life-path-calculator">Life path number</Link>
              </li>
              <li>
                <Link href="/spiritual/zodiac-calculator">Zodiac match</Link>
              </li>
              <li>
                <Link href="/spiritual/angel-number-calculator">Angel numbers</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Trust &amp; Legal</h5>
            <ul>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service">Terms of Service</Link>
              </li>
              <li>
                <Link href="/disclaimer">Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 holycalculator.com</span>
          <span>Every calculator shows its formula.</span>
        </div>
      </div>
    </footer>
  );
}

