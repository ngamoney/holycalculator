/**
 * tarot.js — Holy Calculator Daily Tarot Card Reading Engine
 */

export const MAJOR_ARCANA = [
  { id: 0, name: "The Fool", keywords: ["New Beginnings", "Innocence", "Free Spirit"], uprightMeaning: "Step into the unknown with faith and optimism. A fresh journey begins.", loveMeaning: "Spontaneous new romance or exciting new adventure in love.", careerMeaning: "Take a leap of faith on a new project or career opportunity.", yesNo: "Yes" },
  { id: 1, name: "The Magician", keywords: ["Manifestation", "Resourcefulness", "Power"], uprightMeaning: "You possess all the tools and skills needed to manifest your desires into reality.", loveMeaning: "Clear communication and attraction; taking proactive initiative in love.", careerMeaning: "High capability and creative power to achieve your professional goals.", yesNo: "Yes" },
  { id: 2, name: "The High Priestess", keywords: ["Intuition", "Sacred Knowledge", "Divine Feminine"], uprightMeaning: "Trust your inner voice and subconscious wisdom. Secrets and hidden truths are revealed.", loveMeaning: "Deep intuitive bond; look beyond surface appearances in relationships.", careerMeaning: "Patience and discretion; trust your gut instincts before signing contracts.", yesNo: "Yes" },
  { id: 3, name: "The Empress", keywords: ["Abundance", "Nurturing", "Fertility"], uprightMeaning: "Prosperity, creative growth, and unconditional love surround you.", loveMeaning: "Deep emotional warmth, harmonious family life, and sensual connection.", careerMeaning: "Thriving business growth and lucrative creative expansion.", yesNo: "Yes" },
  { id: 4, name: "The Emperor", keywords: ["Authority", "Structure", "Leadership"], uprightMeaning: "Establish order, set strong boundaries, and lead with strategic discipline.", loveMeaning: "Stable, protective, and committed partner relationship.", careerMeaning: "Executive authority, organization, and solid career foundations.", yesNo: "Yes" },
  { id: 5, name: "The Hierophant", keywords: ["Tradition", "Wisdom", "Spiritual Guidance"], uprightMeaning: "Seek higher learning, spiritual wisdom, and respect established principles.", loveMeaning: "Traditional commitment, marriage, and shared spiritual values.", careerMeaning: "Mentorship, formal education, or working within established organizations.", yesNo: "Yes" },
  { id: 6, name: "The Lovers", keywords: ["Harmonious Union", "Choices", "Alignment"], uprightMeaning: "A profound soul alignment and meaningful choice regarding values and commitment.", loveMeaning: "Soulmate chemistry, mutual attraction, and deep emotional harmony.", careerMeaning: "Fruitful business partnerships based on aligned ethics.", yesNo: "Yes" },
  { id: 7, name: "The Chariot", keywords: ["Willpower", "Determination", "Victory"], uprightMeaning: "Overcome obstacles through focused determination and unshakeable willpower.", loveMeaning: "Taking control of your romantic destiny; pursuing love with confidence.", careerMeaning: "Driven success, overcoming work competition, and rapid advancement.", yesNo: "Yes" },
  { id: 8, name: "Strength", keywords: ["Courage", "Compassion", "Inner Power"], uprightMeaning: "Patience, gentle persuasion, and inner fortitude conquer challenges.", loveMeaning: "Compassionate understanding and resilience in working through relationship tests.", careerMeaning: "Quiet confidence and steady perseverance yield long-term success.", yesNo: "Yes" },
  { id: 9, name: "The Hermit", keywords: ["Soul Searching", "Inner Guidance", "Solitude"], uprightMeaning: "Pause for introspection and seek truth from within.", loveMeaning: "Taking time to understand your true emotional needs before committing.", careerMeaning: "Independent study, research, or seeking a deeper vocational purpose.", yesNo: "Neutral" },
  { id: 10, name: "Wheel of Fortune", keywords: ["Destiny", "Cycles", "Turning Point"], uprightMeaning: "A fortunate turn of events and cosmic luck is shifting in your favor.", loveMeaning: "Fate brings a unexpected meeting or positive breakthrough in your love life.", careerMeaning: "Lucky financial turnarounds and sudden positive opportunities.", yesNo: "Yes" },
  { id: 11, name: "Justice", keywords: ["Fairness", "Truth", "Karma"], uprightMeaning: "Truth, cause-and-effect karma, and fair resolutions prevail.", loveMeaning: "Honesty and equality in partnership; clear relationship choices.", careerMeaning: "Fair contract negotiations and ethical business resolutions.", yesNo: "Neutral" },
  { id: 12, name: "The Hanged Man", keywords: ["New Perspective", "Surrender", "Pause"], uprightMeaning: "Pause, release attachment to control, and see things from a fresh angle.", loveMeaning: "Letting go of unrealistic expectations; gaining relationship clarity.", careerMeaning: "Temporary pause; use down time to re-strategize long-term plans.", yesNo: "No" },
  { id: 13, name: "Death", keywords: ["Transformation", "Endings", "New Beginnings"], uprightMeaning: "A natural cycle concludes, clearing space for a powerful new rebirth.", loveMeaning: "Closing out toxic patterns to make room for healthy, soul-aligned love.", careerMeaning: "Career transformation, shedding outdated jobs to start a new path.", yesNo: "Yes" },
  { id: 14, name: "Temperance", keywords: ["Balance", "Moderation", "Patience"], uprightMeaning: "Harmonious balance, patience, and moderation bring peace.", loveMeaning: "Calm, cooperative love; finding middle ground with your partner.", careerMeaning: "Balanced workload, steady progress, and collaborative teamwork.", yesNo: "Yes" },
  { id: 15, name: "The Devil", keywords: ["Shadow Self", "Attachment", "Reframing"], uprightMeaning: "Recognize unhealthy habits or illusions and reclaim your personal freedom.", loveMeaning: "Beware of codependency or obsessive attraction; practice healthy boundaries.", careerMeaning: "Break free from unfulfilling golden handcuffs or workplace stress.", yesNo: "No" },
  { id: 16, name: "The Tower", keywords: ["Sudden Awakening", "Breakthrough", "Revelation"], uprightMeaning: "False foundations crumble to reveal underlying truth and liberate your path.", loveMeaning: "Sudden relationship realization that ultimately frees your heart.", careerMeaning: "Disruption that leads to necessary career restructuring and growth.", yesNo: "No" },
  { id: 17, name: "The Star", keywords: ["Hope", "Inspiration", "Renewal"], uprightMeaning: "Hope, spiritual healing, and serene inspiration illuminate your future.", loveMeaning: "Renewed faith in love; peaceful, uplifting connection.", careerMeaning: "Inspirational projects, widespread recognition, and bright career prospects.", yesNo: "Yes" },
  { id: 18, name: "The Moon", keywords: ["Illusion", "Intuition", "Dreams"], uprightMeaning: "Trust your subconscious dreams and navigate uncertainty with intuition.", loveMeaning: "Unspoken emotions or romantic mystery; listen to your inner feelings.", careerMeaning: "Check facts carefully and trust your instincts regarding ambiguous workplace deals.", yesNo: "Neutral" },
  { id: 19, name: "The Sun", keywords: ["Joy", "Success", "Vitality"], uprightMeaning: "Radiant warmth, celebration, clarity, and abundance fill your life.", loveMeaning: "Pure joy, warmth, mutual happiness, and vibrant romance.", careerMeaning: "Outstanding career achievement, enthusiasm, and public recognition.", yesNo: "Yes" },
  { id: 20, name: "Judgement", keywords: ["Reckoning", "Absolution", "Higher Calling"], uprightMeaning: "A decisive moment of clarity and awakening to your higher purpose.", loveMeaning: "Forgiveness, clear relationship decisions, and spiritual renewal.", careerMeaning: "Heed your true calling; evaluate past accomplishments with pride.", yesNo: "Yes" },
  { id: 21, name: "The World", keywords: ["Completion", "Wholeness", "Accomplishment"], uprightMeaning: "Successful completion of a major life cycle; celebration and wholeness.", loveMeaning: "Fulfilling, complete love partnership; feeling whole in your heart.", careerMeaning: "Mastery of your craft, global reach, and major goal achievement.", yesNo: "Yes" },
];

function getRandomCardIndex() {
  return Math.floor(Math.random() * MAJOR_ARCANA.length);
}

export function drawTarotSpread(spreadType = "threeCard") {
  if (spreadType === "singleCard") {
    const idx = getRandomCardIndex();
    return {
      type: "singleCard",
      title: "Daily Single Card Draw",
      cards: [{ position: "Daily Guidance", card: MAJOR_ARCANA[idx] }],
    };
  }

  if (spreadType === "yesNo") {
    const idx = getRandomCardIndex();
    const c = MAJOR_ARCANA[idx];
    return {
      type: "yesNo",
      title: "Yes / No Tarot Reading",
      answer: c.yesNo,
      cards: [{ position: "Answer Card", card: c }],
    };
  }

  // 3-Card Spread (Past, Present, Future)
  const indices = new Set();
  while (indices.size < 3) {
    indices.add(getRandomCardIndex());
  }
  const [i1, i2, i3] = Array.from(indices);

  return {
    type: "threeCard",
    title: "3-Card Tarot Spread (Past, Present, Future)",
    cards: [
      { position: "Past Influences", card: MAJOR_ARCANA[i1] },
      { position: "Present Energy", card: MAJOR_ARCANA[i2] },
      { position: "Future Path", card: MAJOR_ARCANA[i3] },
    ],
  };
}
