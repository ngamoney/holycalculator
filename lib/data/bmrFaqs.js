/**
 * bmrFaqs.js — Comprehensive FAQ entries for the BMR Calculator page
 */

export const BMR_FAQS = [
  {
    question: "What is the difference between BMR and TDEE?",
    answer:
      "Basal Metabolic Rate (BMR) is the minimum number of calories your body needs to maintain basic life-sustaining functions (breathing, circulation, cellular repair, brain activity) while at complete rest in a neutral thermal environment. Total Daily Energy Expenditure (TDEE) represents your total daily caloric burn, which equals your BMR plus physical activity, exercise, and the thermic effect of digesting food. TDEE is typically 1.2 to 2.0 times higher than BMR depending on your activity level.",
  },
  {
    question: "Which BMR formula is the most accurate?",
    answer:
      "The Mifflin-St Jeor equation is widely recognized by the Academy of Nutrition and Dietetics as the most accurate formula for the general population. The Revised Harris-Benedict formula is an older clinical equation that can slightly overestimate metabolic rate in individuals with higher body fat percentages. For muscular individuals or athletes who know their body fat percentage, the Katch-McArdle formula is often the most precise because it calculates metabolic rate directly from lean body mass.",
  },
  {
    question: "How does age affect my Basal Metabolic Rate?",
    answer:
      "BMR generally decreases by 1% to 2% per decade after age 20. This gradual decline is primarily driven by a natural loss of skeletal muscle mass (sarcopenia) and hormonal changes. However, engaging in regular resistance training to build or preserve lean muscle mass can offset much of this age-related metabolic slowdown.",
  },
  {
    question: "What is the Katch-McArdle formula and when should I use it?",
    answer:
      "The Katch-McArdle formula calculates BMR based on lean body mass ($BMR = 370 + 21.6 \times \text{Lean Mass in kg}$) rather than total body weight. It is recommended for athletes, bodybuilders, or fitness enthusiasts who track their body fat percentage, as it accounts for muscle density and avoids overestimating caloric needs in higher-weight individuals or underestimating them in highly muscular athletes.",
  },
  {
    question: "Does severe caloric restriction lower BMR?",
    answer:
      "Yes. Prolonged or extreme caloric deficits trigger an adaptive physiological response known as adaptive thermogenesis (often referred to colloquially as 'starvation mode'). Your body reduces non-exercise activity, decreases thyroid hormone output, and optimizes energy efficiency, causing BMR to drop below predicted formula values. Gradual caloric deficits paired with adequate protein and strength training help minimize metabolic adaptation.",
  },
];
