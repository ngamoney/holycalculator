import Link from "next/link";
import styles from "./CurrencyReferenceContent.module.css";
import { CURRENCY_FAQS } from "@/lib/data/currencyFaqs";

export default function CurrencyReferenceContent() {
  return (
    <article className={styles.referenceWrapper}>
      {/* 1. Key Forex Terms Glossary */}
      <section className={styles.contentBlock}>
        <h2>Foreign Exchange (Forex) Terminology Glossary</h2>
        <p>
          Understanding key currency exchange concepts helps travelers and international businesses navigate real-world conversion costs:
        </p>

        <div className={styles.gridTwo}>
          <div className={styles.cardBox}>
            <h4>1. Interbank Rate vs. Retail Rate</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              <strong>Interbank Rate:</strong> The wholesale mid-market exchange rate used between major financial institutions.<br />
              <strong>Retail Rate:</strong> The consumer rate quoted by commercial banks and currency kiosks, which includes a markup (spread).
            </p>
          </div>

          <div className={styles.cardBox}>
            <h4>2. Bid-Ask Spread &amp; Pips</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              <strong>Bid-Ask Spread:</strong> The difference between the price a broker is willing to buy and sell a currency pair.<br />
              <strong>Pip (Percentage in Point):</strong> The smallest price move in a currency pair, typically equal to 0.0001.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Drivers of Exchange Rate Fluctuations */}
      <section className={styles.contentBlock}>
        <h2>What Drives Currency Exchange Rates?</h2>
        <p>
          Exchange rates are floating market values driven by five fundamental macroeconomic forces:
        </p>

        <div className={styles.cardBox} style={{ background: "var(--paper)" }}>
          <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14.5px", lineHeight: "1.7" }}>
            <li>
              <strong>Central Bank Interest Rates:</strong> Higher benchmark interest rates offer lenders a higher return relative to other countries, attracting foreign capital and increasing currency demand.
            </li>
            <li>
              <strong>Inflation Differential:</strong> Countries with consistently lower inflation rates see an appreciation in currency purchasing power.
            </li>
            <li>
              <strong>Trade Deficits &amp; Current Account Balance:</strong> Countries with high export demand generate higher demand for their domestic currency.
            </li>
            <li>
              <strong>Political &amp; Economic Stability:</strong> Foreign investors seek stable nations with strong GDP growth and low sovereign debt default risk.
            </li>
          </ul>
        </div>
      </section>

      {/* 3. Practical Travel Exchange Tips */}
      <section className={styles.contentBlock}>
        <h2>Practical Travel Currency Exchange Tips</h2>
        <p>
          Avoid unnecessary transaction markup fees when spending money overseas:
        </p>

        <div className={styles.gridTwo}>
          <div className={styles.cardBox}>
            <h4>1. Avoid Airport &amp; Hotel Kiosks</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Physical currency exchange kiosks at airports, train stations, and hotel lobbies charge some of the highest markups (often 7% to 15% above mid-market rates).
            </p>
          </div>

          <div className={styles.cardBox}>
            <h4>2. Decline Dynamic Currency Conversion (DCC)</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              When paying by credit card at overseas ATMs or merchants, always choose to be charged in the <strong>local destination currency</strong> rather than your home currency to avoid hidden conversion markups.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className={styles.contentBlock}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {CURRENCY_FAQS.map((faq, index) => (
            <details key={index} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                <span>{faq.question}</span>
                <span style={{ fontSize: "18px", color: "var(--ink)" }}>+</span>
              </summary>
              <div className={styles.faqAnswer}>{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* 5. Related Calculators */}
      <section className={styles.contentBlock}>
        <h2>Related Financial &amp; Conversion Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/conversion-calculator" className={styles.relatedCard}>
            <div>
              <h4>Unit Conversion Calculator</h4>
              <p>Convert units across Length, Weight, Temperature, Area, Volume, Time, and Speed instantly.</p>
            </div>
            <span className={styles.arrowLink}>Open Unit Tool →</span>
          </Link>

          <Link href="/compound-interest-calculator" className={styles.relatedCard}>
            <div>
              <h4>Compound Interest Calculator</h4>
              <p>Calculate future investment growth, interest compounding schedules, and principal accumulation.</p>
            </div>
            <span className={styles.arrowLink}>Open Interest Tool →</span>
          </Link>

          <Link href="/mortgage-calculator" className={styles.relatedCard}>
            <div>
              <h4>Mortgage Calculator</h4>
              <p>Estimate monthly mortgage payments, P&amp;I amortization, property taxes, and home insurance.</p>
            </div>
            <span className={styles.arrowLink}>Open Mortgage Tool →</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
