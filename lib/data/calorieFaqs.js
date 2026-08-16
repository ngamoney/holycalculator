/**
 * calorieFaqs.js — FAQ data for the Calorie Calculator page
 * Used for both the FAQPage JSON-LD schema and the rendered FAQ section.
 *
 * Copy is YMYL-safe: no absolute medical claims, uses hedged language ("estimates suggest",
 * "typically", "may"), and directs medical-specific questions to professionals.
 */

export const CALORIE_FAQS = [
  {
    question: "How many calories should I eat to lose weight?",
    answer:
      "A commonly cited guideline is a deficit of 500 calories per day, which typically produces roughly 1 pound (0.45 kg) of weight loss per week — since approximately 3,500 calories corresponds to 1 lb of body fat (though individual results vary). Mild deficits of 250 calories per day tend to be more sustainable for many people. Most health guidelines recommend not going below 1,200 kcal/day for women or 1,500 kcal/day for men without medical supervision. If you have any health conditions, are pregnant, or have a history of disordered eating, please consult a registered dietitian or physician before making significant dietary changes.",
  },
  {
    question: "What is the difference between BMR and TDEE?",
    answer:
      "BMR (Basal Metabolic Rate) is the estimated number of calories your body burns at complete rest — the energy needed just to keep your heart beating, lungs breathing, and organs functioning. TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor that accounts for the calories burned through movement and exercise throughout the day. TDEE is your maintenance calorie level — the number of calories that, on average, would neither cause weight gain nor weight loss.",
  },
  {
    question: "Is 1,200 calories a day too low?",
    answer:
      "For most adults, 1,200 kcal/day is at or near the lower end of what's considered adequate to meet basic nutrient needs. Many health organizations and registered dietitians use this as a general floor for women (1,500 for men) below which calorie restriction becomes difficult to sustain nutritionally without supplementation and medical oversight. Very-low-calorie diets may also slow metabolism over time and increase the risk of nutrient deficiencies. Individual needs vary significantly — factors like height, weight, age, and activity level all affect what's appropriate. A personalized assessment from a registered dietitian is the safest approach if you're considering an aggressive deficit.",
  },
  {
    question: "Which BMR formula is most accurate?",
    answer:
      "The Mifflin-St Jeor formula is generally considered the most accurate for the general population and is the default in this calculator. Research suggests it estimates BMR within about 10% for most adults. The Revised Harris-Benedict formula is slightly older (revised in 1984) but remains widely used and typically produces similar results. The Katch-McArdle formula is theoretically the most precise when body fat percentage is accurately known, because it accounts for lean body mass rather than total weight — making it better suited for athletes or people with unusually high or low body fat. For most people without a DEXA scan or hydrostatic weighing result, the margin of error in body fat estimation roughly cancels out any advantage over Mifflin-St Jeor.",
  },
  {
    question: "How accurate are calorie calculators?",
    answer:
      "All calorie calculators — including this one — provide estimates, not exact measurements. Research suggests that even under controlled conditions, predictive BMR equations can vary from measured metabolic rate by ±10–15% in most individuals, and more in certain populations (older adults, athletes, people with thyroid conditions, etc.). Real-world TDEE is also affected by non-exercise activity thermogenesis (NEAT), adaptive thermogenesis, and other factors not captured by simple multipliers. Use the results as a starting point: track your actual intake and weight for 2–3 weeks, then adjust your target based on real-world results.",
  },
  {
    question: "Do I need to count calories to lose weight?",
    answer:
      "No — calorie counting is one tool, not a requirement. Some people find it helpful for building awareness of food intake; others find it stressful or counterproductive. Many people achieve sustainable weight management through approaches like mindful eating, focusing on food quality and satiety, or structured meal planning without tracking individual calories. The research on what works best is genuinely mixed and individual. If you find calorie tracking increases anxiety around food, that's a signal to explore other approaches — ideally with guidance from a registered dietitian who can tailor a strategy to your specific situation.",
  },
];
