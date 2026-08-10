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
          <form className="hero-search">
            <input
              type="text"
              placeholder="Search calculators — “BMI”, “life path number”, “EMI”…"
            />
            <button type="submit">Search</button>
          </form>
          <div className="hero-chips">
            <a href="#">Mortgage</a>
            <a href="#">BMI</a>
            <a href="#">Age</a>
            <a href="#">Life Path Number</a>
            <a href="#">Currency</a>
            <a href="#">Percentage</a>
          </div>
        </div>

        <CalculatorWidget />
      </div>
    </section>
  );
}
