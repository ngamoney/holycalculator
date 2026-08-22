import styles from "./YmylDisclaimer.module.css";

export default function YmylDisclaimer({ text, type = "financial" }) {
  const defaultText =
    type === "tax"
      ? "Tax Estimate Notice: Calculations are based on standard federal benchmarks for planning purposes only. This does not constitute tax or legal advice. Consult a certified CPA or tax professional for your specific filing situation."
      : type === "debt"
      ? "Financial Planning Notice: Payoff figures are simulated estimates based on static interest rates and consistent payments. Lenders may calculate daily compounding or fees differently. Consult a certified non-profit credit counselor or financial advisor for debt management."
      : type === "mortgage"
      ? "Lending Estimate Notice: Monthly payments, taxes, PMI, and affordability limits are estimates based on standard underwriting conventions. Actual mortgage rates, closing fees, and approval terms vary by lender and borrower credit qualifications."
      : "Financial Disclaimer: This tool provides mathematical estimates for informational and planning purposes only. It does not constitute formal financial, investment, lending, or tax advice. Consult a qualified financial advisor or licensed professional before making major financial commitments.";

  return (
    <div className={styles.disclaimerBox} role="note" aria-label="Financial Disclaimer">
      <div className={styles.header}>
        <span className={styles.dot}></span>
        <span className={styles.title}>Estimate Notice</span>
      </div>
      <p className={styles.text}>{text || defaultText}</p>
    </div>
  );
}
