export const LETTER_GRADES = [
  { letter: "A+", gpa: 4.0, min: 97, max: 100, defaultVal: 98, label: "A+ (97–100% / 4.0)" },
  { letter: "A",  gpa: 4.0, min: 93, max: 96.99, defaultVal: 95, label: "A (93–96% / 4.0)" },
  { letter: "A-", gpa: 3.7, min: 90, max: 92.99, defaultVal: 91, label: "A- (90–92% / 3.7)" },
  { letter: "B+", gpa: 3.3, min: 87, max: 89.99, defaultVal: 88, label: "B+ (87–89% / 3.3)" },
  { letter: "B",  gpa: 3.0, min: 83, max: 86.99, defaultVal: 85, label: "B (83–86% / 3.0)" },
  { letter: "B-", gpa: 2.7, min: 80, max: 82.99, defaultVal: 81, label: "B- (80–82% / 2.7)" },
  { letter: "C+", gpa: 2.3, min: 77, max: 79.99, defaultVal: 78, label: "C+ (77–79% / 2.3)" },
  { letter: "C",  gpa: 2.0, min: 73, max: 76.99, defaultVal: 75, label: "C (73–76% / 2.0)" },
  { letter: "C-", gpa: 1.7, min: 70, max: 72.99, defaultVal: 71, label: "C- (70–72% / 1.7)" },
  { letter: "D+", gpa: 1.3, min: 67, max: 69.99, defaultVal: 68, label: "D+ (67–69% / 1.3)" },
  { letter: "D",  gpa: 1.0, min: 63, max: 66.99, defaultVal: 65, label: "D (63–66% / 1.0)" },
  { letter: "D-", gpa: 0.7, min: 60, max: 62.99, defaultVal: 61, label: "D- (60–62% / 0.7)" },
  { letter: "F",  gpa: 0.0, min: 0,  max: 59.99, defaultVal: 50, label: "F (Below 60% / 0.0)" }
];

export function percentageToLetterGrade(percentage) {
  if (percentage == null || isNaN(percentage)) return { letter: "—", gpa: "—", color: "default" };
  const p = Number(percentage);
  if (p >= 97) return { letter: "A+", gpa: "4.0", color: "green" };
  if (p >= 93) return { letter: "A", gpa: "4.0", color: "green" };
  if (p >= 90) return { letter: "A-", gpa: "3.7", color: "green" };
  if (p >= 87) return { letter: "B+", gpa: "3.3", color: "green-light" };
  if (p >= 83) return { letter: "B", gpa: "3.0", color: "green-light" };
  if (p >= 80) return { letter: "B-", gpa: "2.7", color: "amber" };
  if (p >= 77) return { letter: "C+", gpa: "2.3", color: "amber" };
  if (p >= 73) return { letter: "C", gpa: "2.0", color: "amber" };
  if (p >= 70) return { letter: "C-", gpa: "1.7", color: "amber" };
  if (p >= 67) return { letter: "D+", gpa: "1.3", color: "red" };
  if (p >= 63) return { letter: "D", gpa: "1.0", color: "red" };
  if (p >= 60) return { letter: "D-", gpa: "0.7", color: "red" };
  return { letter: "F", gpa: "0.0", color: "red-dark" };
}

export function calculateWeightedGrade(rows) {
  let totalWeightedScore = 0;
  let totalWeight = 0;
  const processedRows = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let gradeVal = null;

    if (row.type === "letter") {
      const match = LETTER_GRADES.find(g => g.letter === row.letter);
      gradeVal = match ? match.defaultVal : null;
    } else if (row.type === "points") {
      const earned = parseFloat(row.pointsEarned);
      const total = parseFloat(row.pointsTotal);
      if (!isNaN(earned) && !isNaN(total) && total > 0) {
        gradeVal = (earned / total) * 100;
      }
    } else {
      // default percentage
      const p = parseFloat(row.grade);
      if (!isNaN(p)) {
        gradeVal = p;
      }
    }

    const weightVal = parseFloat(row.weight);
    const hasValidWeight = !isNaN(weightVal) && weightVal >= 0;
    const hasValidGrade = gradeVal !== null && !isNaN(gradeVal);

    if (hasValidGrade && hasValidWeight && weightVal > 0) {
      totalWeightedScore += gradeVal * weightVal;
      totalWeight += weightVal;
    }

    processedRows.push({
      ...row,
      computedGrade: gradeVal,
      computedWeight: hasValidWeight ? weightVal : 0,
      isValid: hasValidGrade && hasValidWeight && weightVal > 0
    });
  }

  const averagePercentage = totalWeight > 0 ? (totalWeightedScore / totalWeight) : null;
  const gradeMeta = averagePercentage !== null ? percentageToLetterGrade(averagePercentage) : { letter: "—", gpa: "—", color: "default" };

  return {
    averagePercentage: averagePercentage !== null ? Number(averagePercentage.toFixed(2)) : null,
    letterGrade: gradeMeta.letter,
    gpa: gradeMeta.gpa,
    color: gradeMeta.color,
    totalWeight: Number(totalWeight.toFixed(2)),
    processedRows
  };
}

export function calculateFinalGradeNeeded(currentGrade, desiredGrade, finalWeight) {
  const current = parseFloat(currentGrade);
  const desired = parseFloat(desiredGrade);
  const weight = parseFloat(finalWeight);

  if (isNaN(current) || isNaN(desired) || isNaN(weight) || weight <= 0 || weight > 100) {
    return {
      scoreNeeded: null,
      status: "invalid",
      message: "Please enter valid percentages (Final exam weight between 1% and 100%)."
    };
  }

  const weightFraction = weight / 100;
  const needed = (desired - current * (1 - weightFraction)) / weightFraction;
  const roundedNeeded = Number(needed.toFixed(2));

  let status = "achievable";
  let message = "";
  let badgeColor = "green";

  if (roundedNeeded <= 0) {
    status = "secured";
    message = "You have already secured your target grade! You need 0% on the final.";
    badgeColor = "green";
  } else if (roundedNeeded <= 70) {
    status = "comfortable";
    message = `Easily achievable! A score of ${roundedNeeded}% on the final will secure your goal.`;
    badgeColor = "green";
  } else if (roundedNeeded <= 89) {
    status = "feasible";
    message = `Realistic target: You need a solid ${roundedNeeded}% on the final exam.`;
    badgeColor = "green-light";
  } else if (roundedNeeded <= 100) {
    status = "challenging";
    message = `High target: You will need ${roundedNeeded}% on the final exam to reach this goal.`;
    badgeColor = "amber";
  } else {
    status = "impossible";
    message = `Mathematically impossible without extra credit: You would need ${roundedNeeded}% on the final.`;
    badgeColor = "red";
  }

  return {
    scoreNeeded: roundedNeeded,
    letterGrade: percentageToLetterGrade(roundedNeeded).letter,
    status,
    message,
    badgeColor
  };
}

// Compact State Serialization for Tiny Shareable URLs (e.g. ?r=95_20_Homework,88_10_Quizzes&goal=90)
export function encodeCompactGradeState(rows, goal, remainingWeight, mode) {
  const activeRows = rows.filter(r => (r.grade && r.grade !== "") || (r.weight && r.weight !== "") || (r.name && r.name !== ""));
  
  const tokens = activeRows.map(r => {
    const encName = r.name ? encodeURIComponent(r.name) : "";
    if (r.type === "points") {
      return `p~${r.pointsEarned || 0}~${r.pointsTotal || 100}~${r.weight || 0}${encName ? `~${encName}` : ""}`;
    } else if (r.type === "letter") {
      return `l~${r.letter || "A"}~${r.weight || 0}${encName ? `~${encName}` : ""}`;
    } else {
      return `${r.grade || 0}~${r.weight || 0}${encName ? `~${encName}` : ""}`;
    }
  });

  const params = new URLSearchParams();
  if (tokens.length > 0) params.set("r", tokens.join(","));
  if (goal && goal !== "90") params.set("goal", goal);
  if (remainingWeight && remainingWeight !== "55") params.set("rw", remainingWeight);
  if (mode && mode !== "percentage") params.set("m", mode);

  return params.toString();
}

export function decodeCompactGradeState(searchStr) {
  if (!searchStr) return null;
  const params = new URLSearchParams(searchStr);
  const rParam = params.get("r");
  const gParam = params.get("g");

  // Backwards compatibility for old JSON base64 parameter
  if (gParam) {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(gParam)));
      if (decoded.rows) {
        return {
          rows: decoded.rows,
          goal: decoded.finalGoal || decoded.finalInputs?.desired || "90",
          remainingWeight: decoded.remainingWeight || decoded.finalInputs?.weight || "55",
          mode: decoded.globalMode || "percentage"
        };
      }
    } catch (e) {}
  }

  if (!rParam) return null;

  try {
    const tokens = rParam.split(",");
    const rows = tokens.map((tok, idx) => {
      const parts = tok.split("~");
      if (parts[0] === "p") {
        const pointsEarned = parts[1] || "";
        const pointsTotal = parts[2] || "";
        const weight = parts[3] || "";
        const name = parts[4] ? decodeURIComponent(parts[4]) : "";
        const grade = pointsEarned && pointsTotal ? ((parseFloat(pointsEarned) / parseFloat(pointsTotal)) * 100).toFixed(1) : "";
        return {
          id: (idx + 1).toString(),
          name,
          type: "points",
          grade,
          pointsEarned,
          pointsTotal,
          letter: "A",
          weight
        };
      } else if (parts[0] === "l") {
        const letter = parts[1] || "A";
        const weight = parts[2] || "";
        const name = parts[3] ? decodeURIComponent(parts[3]) : "";
        const match = LETTER_GRADES.find(g => g.letter === letter);
        const grade = match ? match.defaultVal.toString() : "95";
        return {
          id: (idx + 1).toString(),
          name,
          type: "letter",
          grade,
          pointsEarned: grade,
          pointsTotal: "100",
          letter,
          weight
        };
      } else {
        const grade = parts[0] || "";
        const weight = parts[1] || "";
        const name = parts[2] ? decodeURIComponent(parts[2]) : "";
        return {
          id: (idx + 1).toString(),
          name,
          type: "percentage",
          grade,
          pointsEarned: grade,
          pointsTotal: "100",
          letter: "A",
          weight
        };
      }
    });

    return {
      rows,
      goal: params.get("goal") || "90",
      remainingWeight: params.get("rw") || "55",
      mode: params.get("m") || "percentage"
    };
  } catch (e) {
    return null;
  }
}
