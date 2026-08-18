/**
 * currencyFaqs.js — FAQ dataset for Currency Calculator
 */

export const CURRENCY_FAQS = [
  {
    question: "What is an exchange rate?",
    answer:
      "An exchange rate is the relative value of one country's currency expressed in terms of another currency. For example, if EUR/USD is 1.10, 1 Euro can be exchanged for 1.10 US Dollars in the foreign exchange market.",
  },
  {
    question: "Why do live exchange rates change constantly?",
    answer:
      "Foreign exchange (forex) rates fluctuate continuously based on global supply and demand dynamics, differential central bank interest rates, inflation expectations, trade balance deficits, political stability, and overall economic performance indicators.",
  },
  {
    question: "What is the Interbank Rate vs. Bank Quoted Rate?",
    answer:
      "The Interbank Rate is the wholesale mid-market rate at which large commercial banks exchange currencies with each other. Consumer banks, credit cards, and airport exchange kiosks add a markup (bid-ask spread) of 1% to 5% above the interbank rate to cover operating costs and profit margins.",
  },
  {
    question: "What is the best way to exchange currency when traveling abroad?",
    answer:
      "The most cost-effective method is using a debit or credit card that waives foreign transaction fees at local bank ATMs or point-of-sale terminals, choosing to be billed in the local destination currency rather than your home currency (avoiding Dynamic Currency Conversion). Avoid physical currency exchange kiosks at airports and hotels, which charge the highest spreads.",
  },
  {
    question: "What does Bid Price and Ask Price mean?",
    answer:
      "The Bid Price is the maximum price a currency buyer is willing to pay. The Ask Price (Offer Price) is the minimum price a currency seller is willing to accept. The difference between the bid and ask price is called the bid-ask spread.",
  },
  {
    question: "How often are exchange rates updated on Holy Calculator?",
    answer:
      "Our live exchange rate tool fetches real-time global exchange rates directly from central bank and interbank feeds upon loading, caching rate updates for session efficiency. A timestamp displaying the exact rate update date is shown alongside your results.",
  },
];
