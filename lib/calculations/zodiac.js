/**
 * zodiac.js — Holy Calculator Zodiac Compatibility Engine
 */

export const ZODIAC_SIGNS = {
  aries: { slug: "aries", name: "Aries", symbol: "♈", element: "Fire", modality: "Cardinal", dates: "Mar 21 – Apr 19" },
  taurus: { slug: "taurus", name: "Taurus", symbol: "♉", element: "Earth", modality: "Fixed", dates: "Apr 20 – May 20" },
  gemini: { slug: "gemini", name: "Gemini", symbol: "♊", element: "Air", modality: "Mutable", dates: "May 21 – Jun 20" },
  cancer: { slug: "cancer", name: "Cancer", symbol: "♋", element: "Water", modality: "Cardinal", dates: "Jun 21 – Jul 22" },
  leo: { slug: "leo", name: "Leo", symbol: "♌", element: "Fire", modality: "Fixed", dates: "Jul 23 – Aug 22" },
  virgo: { slug: "virgo", name: "Virgo", symbol: "♍", element: "Earth", modality: "Mutable", dates: "Aug 23 – Sep 22" },
  libra: { slug: "libra", name: "Libra", symbol: "♎", element: "Air", modality: "Cardinal", dates: "Sep 23 – Oct 22" },
  scorpio: { slug: "scorpio", name: "Scorpio", symbol: "♏", element: "Water", modality: "Fixed", dates: "Oct 23 – Nov 21" },
  sagittarius: { slug: "sagittarius", name: "Sagittarius", symbol: "♐", element: "Fire", modality: "Mutable", dates: "Nov 22 – Dec 21" },
  capricorn: { slug: "capricorn", name: "Capricorn", symbol: "♑", element: "Earth", modality: "Cardinal", dates: "Dec 22 – Jan 19" },
  aquarius: { slug: "aquarius", name: "Aquarius", symbol: "♒", element: "Air", modality: "Fixed", dates: "Jan 20 – Feb 18" },
  pisces: { slug: "pisces", name: "Pisces", symbol: "♓", element: "Water", modality: "Mutable", dates: "Feb 19 – Mar 20" },
};

// Base matrix adjustments for iconic pairs
const CUSTOM_MATCHES = {
  "leo-aries": { love: 95, comm: 90, passion: 98, values: 92 },
  "scorpio-cancer": { love: 96, comm: 94, passion: 97, values: 95 },
  "gemini-libra": { love: 93, comm: 98, passion: 88, values: 92 },
  "taurus-capricorn": { love: 95, comm: 92, passion: 90, values: 97 },
  "sagittarius-aquarius": { love: 91, comm: 95, passion: 90, values: 89 },
  "scorpio-taurus": { love: 85, comm: 80, passion: 95, values: 82 }, // Opposite signs
  "leo-aquarius": { love: 84, comm: 88, passion: 91, values: 80 },
  "aries-libra": { love: 86, comm: 85, passion: 94, values: 81 },
};

/**
 * Calculates Zodiac Love Compatibility between sign1 and sign2.
 */
export function calculateZodiacCompatibility(s1Slug, s2Slug) {
  const p1 = ZODIAC_SIGNS[s1Slug?.toLowerCase()] || ZODIAC_SIGNS.leo;
  const p2 = ZODIAC_SIGNS[s2Slug?.toLowerCase()] || ZODIAC_SIGNS.aries;

  const key1 = `${p1.slug}-${p2.slug}`;
  const key2 = `${p2.slug}-${p1.slug}`;

  let loveScore = 75;
  let commScore = 75;
  let passionScore = 75;
  let valuesScore = 75;

  if (CUSTOM_MATCHES[key1]) {
    const m = CUSTOM_MATCHES[key1];
    loveScore = m.love; commScore = m.comm; passionScore = m.passion; valuesScore = m.values;
  } else if (CUSTOM_MATCHES[key2]) {
    const m = CUSTOM_MATCHES[key2];
    loveScore = m.love; commScore = m.comm; passionScore = m.passion; valuesScore = m.values;
  } else if (p1.element === p2.element) {
    // Same element
    loveScore = 92; commScore = 88; passionScore = 90; valuesScore = 94;
  } else if (
    (p1.element === "Fire" && p2.element === "Air") ||
    (p1.element === "Air" && p2.element === "Fire") ||
    (p1.element === "Earth" && p2.element === "Water") ||
    (p1.element === "Water" && p2.element === "Earth")
  ) {
    // Complementary elements
    loveScore = 85; commScore = 86; passionScore = 88; valuesScore = 84;
  } else {
    // Challenging / Growth elements
    loveScore = 68; commScore = 65; passionScore = 74; valuesScore = 66;
  }

  // Dynamic analysis descriptions
  let elementSynergy = "";
  if (p1.element === p2.element) {
    elementSynergy = `Double ${p1.element}: High natural understanding, shared instincts, and effortless emotional resonance.`;
  } else if ((p1.element === "Fire" && p2.element === "Air") || (p1.element === "Air" && p2.element === "Fire")) {
    elementSynergy = "Fire & Air: Air fuels Fire's passion, while Fire inspires Air's intellect. Dynamic and exciting connection.";
  } else if ((p1.element === "Earth" && p2.element === "Water") || (p1.element === "Water" && p2.element === "Earth")) {
    elementSynergy = "Earth & Water: Water nurtures Earth's growth, while Earth provides stability for Water's emotions. Deeply grounding bond.";
  } else {
    elementSynergy = `${p1.element} & ${p2.element}: A growth-oriented pairing requiring conscious communication and appreciation of differences.`;
  }

  return {
    p1,
    p2,
    scores: {
      overall: loveScore,
      communication: commScore,
      passion: passionScore,
      values: valuesScore,
    },
    elementSynergy,
    modalitySynergy: `Modality Blend (${p1.modality} + ${p2.modality}): ${
      p1.modality === p2.modality
        ? "Shared operational style—great momentum when aligned."
        : "Complementary operational styles that balance action with adaptability."
    }`,
  };
}
