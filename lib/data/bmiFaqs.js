/**
 * bmiFaqs.js — Comprehensive FAQ entries for the BMI Calculator page
 */

export const BMI_FAQS = [
  {
    question: "What is a healthy BMI for adults?",
    answer:
      "According to World Health Organization (WHO) and CDC guidelines, a healthy BMI for adults aged 20 and older ranges from 18.5 to 24.9 kg/m². A BMI below 18.5 is classified as underweight, between 25.0 and 29.9 as overweight, and 30.0 or higher as obese. However, BMI is a screening tool rather than a diagnostic measurement, and individual health factors should always be evaluated with a doctor.",
  },
  {
    question: "Is BMI accurate for athletes and bodybuilders?",
    answer:
      "BMI does not distinguish between lean muscle tissue and body fat mass. Because dense muscle tissue weighs more than fat volume per cubic meter, highly trained athletes, bodybuilders, and powerlifters often receive an 'overweight' or 'obese' BMI classification despite having very low body fat percentages and high cardiovascular fitness. For athletes, body fat percentage tests (DXA, skinfold, waist-to-hip ratio) are significantly more informative.",
  },
  {
    question: "How is BMI calculated differently for children and teens?",
    answer:
      "For children and adolescents aged 2 to 19, BMI is computed using the same height-and-weight formula, but it is interpreted using sex- and age-specific CDC percentile growth charts rather than fixed adult cutoffs. Body composition changes rapidly during growth spurts and differs substantially between boys and girls. A child is considered healthy weight between the 5th and 85th percentiles for their exact age in months.",
  },
  {
    question: "What is BMI Prime and how is it used?",
    answer:
      "BMI Prime is a normalized ratio of a person's calculated BMI relative to the upper limit of the WHO healthy adult weight threshold (BMI 25.0 kg/m²). It is computed as BMI ÷ 25. A BMI Prime value less than 0.74 indicates underweight, 0.74 to 0.99 indicates normal weight, 1.00 to 1.19 indicates overweight, and 1.20 or greater indicates obesity. BMI Prime provides a clear percentage comparison to your ideal upper weight boundary.",
  },
  {
    question: "What is the Ponderal Index and how does it compare to BMI?",
    answer:
      "The Ponderal Index (also called the Corpulence Index) is calculated as weight divided by height cubed ($kg/m^3$ or $lbs/in^3 \times 784.6$). Unlike standard BMI, which scales height by a power of 2, the Ponderal Index scales height by a power of 3 to reflect three-dimensional volumetric space. It is particularly useful for very tall or very short individuals, as well as in neonatal medicine for evaluating newborn growth symmetry.",
  },
  {
    question: "What is my healthy weight range for my height?",
    answer:
      "Your healthy weight range corresponds to the body weights that keep your BMI between 18.5 and 24.9 kg/m². For example, an adult who is 5 feet 10 inches tall (178 cm) has a healthy weight range of approximately 129 lbs to 174 lbs (58.5 kg to 79.0 kg). You can find your exact healthy weight range directly in the calculator results card.",
  },
];
