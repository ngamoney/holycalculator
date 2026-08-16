export const DICE_FAQS = [
  {
    question: "Is a virtual dice roll truly random?",
    answer:
      "Holy Calculator uses the browser's built-in crypto.getRandomValues() API — the same cryptographically secure random number generator used by password managers and encryption tools. This is significantly more unpredictable than standard Math.random(), which uses a deterministic pseudo-random algorithm. While a virtual dice roll can never be entropy-identical to a physical die tumbling on a table, crypto.getRandomValues() is genuinely random for all practical tabletop gaming purposes."
  },
  {
    question: "How do I roll a d20 online?",
    answer:
      "Select the 'd20' quick-preset button in the Non-Standard Dice section (or type 20 in the 'Sides on Dice' field), set your number of dice, then click Roll. The roller supports any die shape from d2 (coin flip) to d100 and beyond. For standard D&D rolls, use the quick-select preset buttons for d4, d6, d8, d10, d12, and d20."
  },
  {
    question: "How do I roll multiple dice at once (e.g. 2d6 or 3d8)?",
    answer:
      "Set the 'Number of Dice' input to your desired count (e.g. 2 for 2d6, 3 for 3d8) and set the dice type accordingly. Rolling multiple dice simultaneously is ideal for D&D damage rolls, ability score generation (4d6 drop lowest requires rolling 4 at once), and Yahtzee-style games. Mixed multi-type rolls (e.g. 1d8 + 1d6 in a single roll) are planned for a future update."
  },
  {
    question: "What dice types do tabletop role-playing games use?",
    answer:
      "Standard tabletop RPGs like Dungeons & Dragons use a set of polyhedral dice: d4 (tetrahedron, 4 faces), d6 (cube, 6 faces), d8 (octahedron, 8 faces), d10 (pentagonal trapezohedron, 10 faces), d12 (dodecahedron, 12 faces), and d20 (icosahedron, 20 faces). Some games also use a d100 (percentile dice, often rolled as two d10s). Each shape is defined by a Platonic solid or Archimedean solid with equal face probabilities."
  },
  {
    question: "Are physical dice actually fair?",
    answer:
      "Not perfectly. Mass-produced casino dice (19mm precision cubes) are held to strict tolerances and are genuinely close to fair. Most hobby gaming dice are injection-molded plastic, which can have minor weight imbalances from the ink filling face pips, slightly rounded corners, or internal air bubbles. Studies have found some brands of hobby dice can deviate by 1-2% from expected probability on certain faces. A virtual dice roller using crypto.getRandomValues() has no physical imbalance — each face has exactly the same mathematical probability."
  },
  {
    question: "What does 'roll a d6' mean?",
    answer:
      "The notation 'dN' means 'roll a die with N sides.' A d6 is a standard six-sided die (a cube), a d20 is a twenty-sided die, and so on. The prefix number indicates how many of that die to roll: '2d6' means roll two six-sided dice and add the results, '4d8' means roll four eight-sided dice and add. This notation is standard in tabletop RPGs, wargames, and board games worldwide."
  }
];
