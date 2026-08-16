import styles from "./CalorieReferenceContent.module.css";
import { CALORIE_FAQS } from "@/lib/data/calorieFaqs";

// -----------------------------------------------------------------------
// Static Data Tables
// -----------------------------------------------------------------------

const FOOD_CALORIES = [
  { food: "Apple (medium, 182 g)", calories: 95, per: "1 apple" },
  { food: "Banana (medium, 118 g)", calories: 105, per: "1 banana" },
  { food: "White rice (cooked)", calories: 206, per: "1 cup (186 g)" },
  { food: "Brown rice (cooked)", calories: 216, per: "1 cup (195 g)" },
  { food: "Chicken breast (roasted, skinless)", calories: 165, per: "100 g" },
  { food: "Salmon (Atlantic, baked)", calories: 208, per: "100 g" },
  { food: "Whole egg (large)", calories: 78, per: "1 egg" },
  { food: "Whole milk", calories: 149, per: "1 cup (244 ml)" },
  { food: "Greek yogurt (plain, nonfat)", calories: 100, per: "170 g container" },
  { food: "Cheddar cheese", calories: 113, per: "1 oz (28 g)" },
  { food: "White bread (1 slice)", calories: 79, per: "1 slice (25 g)" },
  { food: "Oatmeal (cooked)", calories: 166, per: "1 cup (234 g)" },
  { food: "Broccoli (raw)", calories: 55, per: "1 cup (88 g)" },
  { food: "Sweet potato (baked)", calories: 103, per: "1 medium (114 g)" },
  { food: "Avocado (Hass)", calories: 240, per: "1 whole (201 g)" },
  { food: "Almonds (raw)", calories: 164, per: "1 oz (28 g)" },
  { food: "Peanut butter (smooth)", calories: 188, per: "2 tbsp (32 g)" },
  { food: "Orange juice", calories: 112, per: "1 cup (248 ml)" },
  { food: "Cola soft drink", calories: 140, per: "12 fl oz (355 ml)" },
  { food: "Dark chocolate (70–85%)", calories: 170, per: "1 oz (28 g)" },
];

const EXERCISE_CALORIES = [
  { activity: "Walking (3.5 mph)", cal150lb: 267, cal185lb: 330, per: "60 min" },
  { activity: "Running (6 mph / 10-min mile)", cal150lb: 612, cal185lb: 755, per: "60 min" },
  { activity: "Cycling (moderate, ~12 mph)", cal150lb: 454, cal185lb: 562, per: "60 min" },
  { activity: "Swimming laps (vigorous)", cal150lb: 534, cal185lb: 659, per: "60 min" },
  { activity: "Strength training (general)", cal150lb: 204, cal185lb: 252, per: "60 min" },
  { activity: "HIIT / circuit training", cal150lb: 476, cal185lb: 588, per: "60 min" },
  { activity: "Yoga (Hatha)", cal150lb: 183, cal185lb: 226, per: "60 min" },
  { activity: "Jump rope (moderate)", cal150lb: 544, cal185lb: 671, per: "60 min" },
  { activity: "Rowing machine (moderate)", cal150lb: 413, cal185lb: 510, per: "60 min" },
  { activity: "Dancing (aerobic / Zumba)", cal150lb: 342, cal185lb: 422, per: "60 min" },
];

// -----------------------------------------------------------------------
// BMR Formula Equations (for the explainer section)
// -----------------------------------------------------------------------
const BMR_FORMULAS = [
  {
    name: "Mifflin-St Jeor (Recommended)",
    year: "1990",
    source: "Mifflin MD, St Jeor ST, et al. Am J Clin Nutr. 1990;51(2):241–247.",
    male: "BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5",
    female: "BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161",
    notes:
      "The most widely validated formula for the general population. Research suggests it estimates BMR within ±10% for most adults. Does not require body fat percentage, making it practical for everyday use.",
  },
  {
    name: "Revised Harris-Benedict",
    year: "1984",
    source: "Roza AM, Shizgal HM. Am J Clin Nutr. 1984;40(1):168–182.",
    male: "BMR = 88.362 + (13.397 × weight_kg) + (4.799 × height_cm) − (5.677 × age)",
    female: "BMR = 447.593 + (9.247 × weight_kg) + (3.098 × height_cm) − (4.330 × age)",
    notes:
      "A revision of the original 1919 Harris-Benedict equation. It remains widely used in clinical and research settings. Results are similar to Mifflin-St Jeor for most individuals.",
  },
  {
    name: "Katch-McArdle",
    year: "1986",
    source: "Katch VL. Am J Clin Nutr. 1986;44(4):520–525.",
    single: "BMR = 370 + (21.6 × lean_body_mass_kg)",
    notes:
      "The Katch-McArdle formula is theoretically more accurate for people with known body composition, because it uses lean body mass rather than total weight. This makes it better suited for athletes or muscular individuals whose BMR may be underestimated by weight-based formulas. The accuracy depends heavily on how precisely body fat percentage is measured — a rough estimate will reduce its advantage over Mifflin-St Jeor.",
  },
];

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------
export default function CalorieReferenceContent() {
  return (
    <div className={styles.referenceRoot}>

      {/* ================================================================
          BMR / TDEE EXPLAINER
          ================================================================ */}
      <section className={styles.section} aria-labelledby="bmr-explainer-heading">
        <h2 id="bmr-explainer-heading" className={styles.sectionTitle}>
          Understanding BMR, TDEE, and Calorie Needs
        </h2>
        <div className={styles.prose}>
          <p>
            <strong>Basal Metabolic Rate (BMR)</strong> is the number of calories your body needs to maintain basic physiological functions — breathing, circulation, cell production, temperature regulation — at complete rest. Think of it as the energy your body would burn if you stayed in bed all day without moving.
          </p>
          <p>
            <strong>Total Daily Energy Expenditure (TDEE)</strong> is your BMR multiplied by an <em>activity factor</em> that accounts for energy burned through movement, exercise, and daily activities. TDEE is your <em>maintenance calorie level</em> — the number of calories that would, on average, keep your body weight stable over time.
          </p>
          <p>
            To lose weight, you typically consume fewer calories than your TDEE (a calorie deficit); to gain weight, you consume more (a calorie surplus). A widely cited rule of thumb is that approximately 3,500 kcal of net energy deficit or surplus corresponds to roughly 1 lb (0.45 kg) of body weight change — though individual responses vary based on metabolism, diet composition, and adaptive thermogenesis (<a href="https://www.ncbi.nlm.nih.gov/books/NBK499909/" target="_blank" rel="noopener noreferrer">NIH reference</a>).
          </p>
        </div>

        {/* BMR Formulas */}
        <h3 className={styles.subTitle}>The Three BMR Formulas</h3>
        <div className={styles.formulaGrid}>
          {BMR_FORMULAS.map((f) => (
            <div key={f.name} className={styles.formulaCard}>
              <div className={styles.formulaName}>{f.name}</div>
              <div className={styles.formulaMeta}>Published {f.year} · {f.source}</div>
              <div className={styles.formulaEquations}>
                {f.single ? (
                  <code className={styles.equation}>{f.single}</code>
                ) : (
                  <>
                    <code className={styles.equation}><strong>Male:</strong> {f.male}</code>
                    <code className={styles.equation}><strong>Female:</strong> {f.female}</code>
                  </>
                )}
              </div>
              <p className={styles.formulaNotes}>{f.notes}</p>
            </div>
          ))}
        </div>

        {/* Activity Multipliers */}
        <h3 className={styles.subTitle}>Activity Multipliers (TDEE = BMR × Factor)</h3>
        <div className={styles.tableWrap}>
          <table className={styles.refTable}>
            <thead>
              <tr>
                <th>Activity Level</th>
                <th>Description</th>
                <th>Multiplier</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Sedentary</td><td>Little or no exercise, desk job</td><td>× 1.2</td></tr>
              <tr><td>Light</td><td>Light exercise 1–3 days/week</td><td>× 1.375</td></tr>
              <tr><td>Moderate</td><td>Moderate exercise 3–5 days/week</td><td>× 1.55</td></tr>
              <tr><td>Active</td><td>Hard exercise 6–7 days/week</td><td>× 1.725</td></tr>
              <tr><td>Very Active</td><td>Very hard exercise and a physical job</td><td>× 1.9</td></tr>
              <tr><td>Extra Active</td><td>Professional athlete or twice-daily training</td><td>× 2.0</td></tr>
            </tbody>
          </table>
        </div>
        <p className={styles.tableNote}>
          Multipliers derived from the original Harris-Benedict methodology, widely used in nutrition research. Activity factors are estimates — metabolic rate varies by individual.
        </p>
      </section>

      {/* ================================================================
          HOW MANY CALORIES DO YOU NEED
          ================================================================ */}
      <section className={styles.section} aria-labelledby="calorie-needs-heading">
        <h2 id="calorie-needs-heading" className={styles.sectionTitle}>
          General Calorie Estimates by Population
        </h2>
        <div className={styles.prose}>
          <p>
            The U.S. Dietary Guidelines for Americans estimates general daily calorie needs by age and sex, based on sedentary to moderately active lifestyles. These are population-level estimates — individual needs can vary significantly depending on body size, muscle mass, metabolic health, and other factors. Always use the calculator above for an individualized estimate.
          </p>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.refTable}>
            <thead>
              <tr>
                <th>Age Group</th>
                <th>Males (kcal/day)</th>
                <th>Females (kcal/day)</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>19–30 years</td><td>2,400–3,000</td><td>1,800–2,400</td><td>Sedentary–Active range</td></tr>
              <tr><td>31–50 years</td><td>2,200–3,000</td><td>1,800–2,200</td><td>Sedentary–Active range</td></tr>
              <tr><td>51–70 years</td><td>2,000–2,800</td><td>1,600–2,200</td><td>Sedentary–Active range</td></tr>
              <tr><td>71+ years</td><td>2,000–2,600</td><td>1,600–2,000</td><td>Sedentary–Active range</td></tr>
            </tbody>
          </table>
        </div>
        <p className={styles.tableNote}>
          Source: <a href="https://www.dietaryguidelines.gov/sites/default/files/2020-12/Dietary_Guidelines_for_Americans_2020-2025.pdf" target="_blank" rel="noopener noreferrer">
            U.S. Dietary Guidelines for Americans 2020–2025
          </a>, Appendix 2. Pregnancy and lactation substantially increase calorie needs — consult a healthcare provider for personalized guidance.
        </p>
      </section>

      {/* ================================================================
          CALORIES IN COMMON FOODS
          ================================================================ */}
      <section className={styles.section} aria-labelledby="food-calories-heading">
        <h2 id="food-calories-heading" className={styles.sectionTitle}>
          Calories in Common Foods
        </h2>
        <p className={styles.sectionLead}>
          Approximate values for common foods. Individual values may vary based on preparation method, brand, and specific variety.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.refTable}>
            <thead>
              <tr>
                <th>Food</th>
                <th>Serving</th>
                <th>Calories (kcal)</th>
              </tr>
            </thead>
            <tbody>
              {FOOD_CALORIES.map((row) => (
                <tr key={row.food}>
                  <td>{row.food}</td>
                  <td className={styles.mono}>{row.per}</td>
                  <td className={styles.mono}>{row.calories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.tableNote}>
          Values sourced from the <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener noreferrer">USDA FoodData Central database</a>. Values are approximate and represent typical cooked/prepared servings unless noted as raw.
        </p>
      </section>

      {/* ================================================================
          CALORIES BURNED FROM EXERCISE
          ================================================================ */}
      <section className={styles.section} aria-labelledby="exercise-calories-heading">
        <h2 id="exercise-calories-heading" className={styles.sectionTitle}>
          Calories Burned from Common Exercises
        </h2>
        <p className={styles.sectionLead}>
          Estimates for a 150 lb (68 kg) and 185 lb (84 kg) person. Heavier individuals burn more calories performing the same activity. Actual burn varies by fitness level, intensity, and individual metabolism.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.refTable}>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Duration</th>
                <th>~150 lb person</th>
                <th>~185 lb person</th>
              </tr>
            </thead>
            <tbody>
              {EXERCISE_CALORIES.map((row) => (
                <tr key={row.activity}>
                  <td>{row.activity}</td>
                  <td className={styles.mono}>{row.per}</td>
                  <td className={styles.mono}>{row.cal150lb} kcal</td>
                  <td className={styles.mono}>{row.cal185lb} kcal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.tableNote}>
          Estimates based on MET (Metabolic Equivalent of Task) values from the <a href="https://sites.google.com/site/compendiumofphysicalactivities/" target="_blank" rel="noopener noreferrer">Compendium of Physical Activities</a> (Ainsworth et al., 2011). Exercise calorie burn data is also referenced in <a href="https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-for-people-of-three-different-weights" target="_blank" rel="noopener noreferrer">Harvard Health Publishing</a>.
        </p>
      </section>

      {/* ================================================================
          FAQ
          ================================================================ */}
      <section className={styles.section} aria-labelledby="faq-heading">
        <h2 id="faq-heading" className={styles.sectionTitle}>
          Frequently Asked Questions
        </h2>
        <div className={styles.faqList}>
          {CALORIE_FAQS.map((faq, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{faq.question}</summary>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
