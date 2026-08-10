export default function Ticker() {
  const tickerItems = [
    "Mortgage Calculator",
    "BMI Calculator",
    "Life Path Number",
    "Age Calculator",
    "Percentage Calculator",
    "Zodiac Compatibility",
    "Currency Converter",
    "EMI Calculator",
    "Calorie Calculator",
    "Angel Number Calculator",
  ];

  const renderItems = (items, keyPrefix) =>
    items.map((item, idx) => (
      <span key={`${keyPrefix}-${idx}`}>
        <em>↗</em>
        {item}
        <span className="sep">·</span>
      </span>
    ));

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {renderItems(tickerItems, "a")}
        {renderItems(tickerItems, "b")}
      </div>
    </div>
  );
}
