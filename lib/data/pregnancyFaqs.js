/**
 * pregnancyFaqs.js — FAQ data for the Pregnancy & Due Date Calculator page
 * Used for both the FAQPage JSON-LD schema and the rendered FAQ section.
 *
 * Copy is YMYL-safe: strictly clinical, objective, hedged language,
 * citing standard ACOG guidelines, with prominent medical disclaimer.
 */

export const PREGNANCY_FAQS = [
  {
    question: "How does a pregnancy due date calculator work?",
    answer:
      "A pregnancy calculator estimates your due date using standard clinical formulas established by the American College of Obstetricians and Gynecologists (ACOG). The most common method, Naegele's rule, assumes a typical 280-day (40-week) gestation starting from the first day of your Last Menstrual Period (LMP). If your menstrual cycle is longer or shorter than 28 days, the formula adjusts the estimated conception date accordingly. Alternative clinical calculation methods include known conception date (+266 days), IVF transfer date (+261 to +263 days depending on embryo age), or crown-rump length ultrasound measurements.",
  },
  {
    question: "How is my due date calculated if I do not know my last period (LMP)?",
    answer:
      "If you have irregular cycles, cannot recall your LMP, or conceived shortly after stopping hormonal contraception, a pregnancy due date can be estimated using an early dating ultrasound (typically performed in the first trimester between 7 and 14 weeks). A clinician measures the embryo's crown-rump length (CRL), which correlates closely with gestational age. Alternatively, if you know the exact date of conception or your IVF embryo transfer date, those dates can be used directly in this calculator to compute your estimated due date.",
  },
  {
    question: "How accurate is an estimated due date?",
    answer:
      "An estimated due date is a reference benchmark rather than a precise prediction. Clinical data shows that only about 5% of infants are born on their exact estimated due date. However, roughly 90% of healthy pregnancies deliver within a two-week window surrounding the due date (between 37 and 42 weeks of gestation). An early first-trimester ultrasound is considered the most accurate clinical method for confirming gestational age, with a margin of error of approximately ±5 to 7 days.",
  },
  {
    question: "Can my estimated due date change during pregnancy?",
    answer:
      "Yes, your healthcare provider or OB-GYN may adjust your due date if an early ultrasound measurement differs significantly from your LMP-derived date. According to ACOG guidelines, if a first-trimester ultrasound dating differs by more than 5 to 7 days from the LMP estimate, the ultrasound date is typically adopted as the official clinical due date. Due dates are rarely changed after the second trimester because fetal growth rates begin to vary naturally later in pregnancy.",
  },
  {
    question: "Why are pregnancy weeks counted from the last period instead of conception?",
    answer:
      "Gestational age is clinically measured from the first day of your last menstrual period (LMP) because the exact date of ovulation and fertilization is usually unknown for spontaneous pregnancies. Measuring from LMP provides a consistent standard starting point. Under this standard clinical convention, a person is considered '2 weeks pregnant' at the time conception actually occurs, and a full-term pregnancy lasts 40 weeks (280 days) from LMP, or 38 weeks (266 days) from conception.",
  },
];
