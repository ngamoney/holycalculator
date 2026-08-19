import Link from "next/link";
import CalculatorWidget from "@/components/CalculatorWidget";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div>
          <div className="eyebrow">
            <span className="dot"></span> One engine, every kind of number
          </div>
          <h1>Whatever you&apos;re trying to figure out, it does the math.</h1>
          <p className="sub">
            30+ free calculators — mortgage to BMI to life path number. No
            sign-in, no downloads, no cost. Every result shows the formula
            behind it.
          </p>
          <form className="hero-search" action="/#categories">
            <input
              type="text"
              name="q"
              placeholder="Search calculators — “BMI”, “life path number”, “Mortgage”…"
            />
            <button type="submit">Search</button>
          </form>
          <div className="hero-chips">
            <Link href="/mortgage-calculator">Mortgage</Link>
            <Link href="/bmi-calculator">BMI</Link>
            <Link href="/age-calculator">Age</Link>
            <Link href="/spiritual/life-path-number-calculator">Life Path Number</Link>
            <Link href="/currency-calculator">Currency</Link>
            <Link href="/math/percentage-calculator">Percentage</Link>
          </div>
        </div>

        <CalculatorWidget />
      </div>
    </section>
  );
}
