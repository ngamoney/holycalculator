/**
 * GPA Calculation Engine & Utilities
 * Standard 4.0 Scale with A+ (4.3) and Non-GPA Grade Exclusions (P, NP, I, W)
 */

export const GPA_LETTER_GRADES = [
  { letter: "A+", points: 4.3, minPercent: 97, maxPercent: 100, label: "A+ (97–100% / 4.30)", isExcluded: false },
  { letter: "A",  points: 4.0, minPercent: 93, maxPercent: 96.99, label: "A (93–96% / 4.00)", isExcluded: false },
  { letter: "A-", points: 3.7, minPercent: 90, maxPercent: 92.99, label: "A- (90–92% / 3.70)", isExcluded: false },
  { letter: "B+", points: 3.3, minPercent: 87, maxPercent: 89.99, label: "B+ (87–89% / 3.30)", isExcluded: false },
  { letter: "B",  points: 3.0, minPercent: 83, maxPercent: 86.99, label: "B (83–86% / 3.00)", isExcluded: false },
  { letter: "B-", points: 2.7, minPercent: 80, maxPercent: 82.99, label: "B- (80–82% / 2.70)", isExcluded: false },
  { letter: "C+", points: 2.3, minPercent: 77, maxPercent: 79.99, label: "C+ (77–79% / 2.30)", isExcluded: false },
  { letter: "C",  points: 2.0, minPercent: 73, maxPercent: 76.99, label: "C (73–76% / 2.00)", isExcluded: false },
  { letter: "C-", points: 1.7, minPercent: 70, maxPercent: 72.99, label: "C- (70–72% / 1.70)", isExcluded: false },
  { letter: "D+", points: 1.3, minPercent: 67, maxPercent: 69.99, label: "D+ (67–69% / 1.30)", isExcluded: false },
  { letter: "D",  points: 1.0, minPercent: 63, maxPercent: 66.99, label: "D (63–66% / 1.00)", isExcluded: false },
  { letter: "D-", points: 0.7, minPercent: 60, maxPercent: 62.99, label: "D- (60–62% / 0.70)", isExcluded: false },
  { letter: "F",  points: 0.0, minPercent: 0,  maxPercent: 59.99, label: "F (Below 60% / 0.00)", isExcluded: false },
  { letter: "P",  points: null, minPercent: null, maxPercent: null, label: "P (Pass / No GPA Impact)", isExcluded: true },
  { letter: "NP", points: null, minPercent: null, maxPercent: null, label: "NP (No Pass / No GPA Impact)", isExcluded: true },
  { letter: "I",  points: null, minPercent: null, maxPercent: null, label: "I (Incomplete / No GPA Impact)", isExcluded: true },
  { letter: "W",  points: null, minPercent: null, maxPercent: null, label: "W (Withdrawal / No GPA Impact)", isExcluded: true }
];

export function percentageToGpaPoints(percentage) {
  if (percentage == null || isNaN(percentage)) return null;
  const p = Number(percentage);
  if (p >= 97) return 4.3;
  if (p >= 93) return 4.0;
  if (p >= 90) return 3.7;
  if (p >= 87) return 3.3;
  if (p >= 83) return 3.0;
  if (p >= 80) return 2.7;
  if (p >= 77) return 2.3;
  if (p >= 73) return 2.0;
  if (p >= 70) return 1.7;
  if (p >= 67) return 1.3;
  if (p >= 63) return 1.0;
  if (p >= 60) return 0.7;
  return 0.0;
}

export function gpaToStanding(gpa) {
  if (gpa == null || isNaN(gpa)) {
    return { letter: "—", label: "No grades entered", color: "default" };
  }
  const val = Number(gpa);
  if (val >= 3.9) return { letter: "A / A+", label: "Summa Cum Laude / High Honors", color: "green" };
  if (val >= 3.7) return { letter: "A-", label: "Magna Cum Laude / Dean's List", color: "green" };
  if (val >= 3.5) return { letter: "B+", label: "Cum Laude / Honors Standing", color: "green-light" };
  if (val >= 3.0) return { letter: "B", label: "Good Academic Standing", color: "green-light" };
  if (val >= 2.5) return { letter: "B- / C+", label: "Satisfactory Standing", color: "amber" };
  if (val >= 2.0) return { letter: "C", label: "Minimum Passing Standing", color: "amber" };
  return { letter: "D / F", label: "Academic Warning / Probation", color: "red" };
}

/**
 * Calculate GPA for a list of course rows.
 * @param {Array} courses List of course objects { id, name, credits, gradeType, letter, percentage, points }
 * @param {string} defaultFormat "letter" | "percentage" | "points"
 */
export function calculateSemesterGPA(courses, defaultFormat = "letter") {
  let totalQualityPoints = 0;
  let totalGpaCredits = 0;
  let totalAttemptedCredits = 0;
  const processedCourses = [];

  for (let i = 0; i < courses.length; i++) {
    const row = courses[i];
    const format = row.gradeType || defaultFormat;
    const creditsNum = parseFloat(row.credits);
    const hasValidCredits = !isNaN(creditsNum) && creditsNum > 0;

    let pointsVal = null;
    let isExcluded = false;

    if (format === "letter") {
      const match = GPA_LETTER_GRADES.find(g => g.letter === (row.letter || "A"));
      if (match) {
        if (match.isExcluded) {
          isExcluded = true;
          pointsVal = null;
        } else {
          pointsVal = match.points;
        }
      }
    } else if (format === "percentage") {
      const pct = parseFloat(row.percentage);
      if (!isNaN(pct)) {
        pointsVal = percentageToGpaPoints(pct);
      }
    } else if (format === "points") {
      const pts = parseFloat(row.points);
      if (!isNaN(pts)) {
        pointsVal = pts;
      }
    }

    const isValidCourse = hasValidCredits && (pointsVal !== null || isExcluded);

    if (hasValidCredits) {
      totalAttemptedCredits += creditsNum;
      if (pointsVal !== null && !isExcluded) {
        totalQualityPoints += pointsVal * creditsNum;
        totalGpaCredits += creditsNum;
      }
    }

    processedCourses.push({
      ...row,
      computedPoints: pointsVal,
      computedCredits: hasValidCredits ? creditsNum : 0,
      isExcluded,
      isValid: isValidCourse
    });
  }

  const gpa = totalGpaCredits > 0 ? totalQualityPoints / totalGpaCredits : null;

  return {
    gpa: gpa !== null ? Number(gpa.toFixed(2)) : null,
    gpaRaw: gpa,
    totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
    totalGpaCredits: Number(totalGpaCredits.toFixed(2)),
    totalAttemptedCredits: Number(totalAttemptedCredits.toFixed(2)),
    processedCourses
  };
}

/**
 * Calculate Cumulative GPA across multiple semesters plus optional prior GPA.
 */
export function calculateCumulativeGPA(semesters, priorGPA = "", priorCredits = "", defaultFormat = "letter") {
  let combinedQualityPoints = 0;
  let combinedGpaCredits = 0;
  let combinedAttemptedCredits = 0;
  const semesterResults = [];

  // 1. Incorporate prior semester's GPA if provided
  const pGpa = parseFloat(priorGPA);
  const pCreds = parseFloat(priorCredits);
  const hasPrior = !isNaN(pGpa) && !isNaN(pCreds) && pCreds > 0 && pGpa >= 0;

  if (hasPrior) {
    const priorQP = pGpa * pCreds;
    combinedQualityPoints += priorQP;
    combinedGpaCredits += pCreds;
    combinedAttemptedCredits += pCreds;
  }

  // 2. Process each semester
  for (let s = 0; s < semesters.length; s++) {
    const sem = semesters[s];
    const semResult = calculateSemesterGPA(sem.courses || [], defaultFormat);
    semesterResults.push({
      id: sem.id,
      name: sem.name || `Semester ${s + 1}`,
      ...semResult
    });

    combinedQualityPoints += semResult.totalQualityPoints;
    combinedGpaCredits += semResult.totalGpaCredits;
    combinedAttemptedCredits += semResult.totalAttemptedCredits;
  }

  const overallGpa = combinedGpaCredits > 0 ? combinedQualityPoints / combinedGpaCredits : null;
  const standing = gpaToStanding(overallGpa);

  return {
    cumulativeGpa: overallGpa !== null ? Number(overallGpa.toFixed(2)) : null,
    cumulativeGpaRaw: overallGpa,
    totalQualityPoints: Number(combinedQualityPoints.toFixed(2)),
    totalGpaCredits: Number(combinedGpaCredits.toFixed(2)),
    totalAttemptedCredits: Number(combinedAttemptedCredits.toFixed(2)),
    standing,
    hasPrior,
    priorSummary: hasPrior ? { gpa: pGpa, credits: pCreds, qualityPoints: Number((pGpa * pCreds).toFixed(2)) } : null,
    semesterResults
  };
}

/**
 * GPA Planning Calculator
 * Determines the required future GPA on additional credits to reach a target cumulative GPA.
 */
export function calculateGPAPlanner(currentGPA, targetGPA, currentCredits, additionalCredits) {
  const cGpa = parseFloat(currentGPA);
  const tGpa = parseFloat(targetGPA);
  const cCreds = parseFloat(currentCredits);
  const aCreds = parseFloat(additionalCredits);

  if (isNaN(cGpa) || isNaN(tGpa) || isNaN(cCreds) || isNaN(aCreds) || aCreds <= 0 || cCreds < 0 || cGpa < 0 || tGpa < 0) {
    return {
      requiredGPA: null,
      status: "invalid",
      message: "Please enter valid numbers for all fields (Additional credits must be greater than 0)."
    };
  }

  const totalCreditsTarget = cCreds + aCreds;
  const targetQualityPoints = tGpa * totalCreditsTarget;
  const currentQualityPoints = cGpa * cCreds;
  const neededQualityPoints = targetQualityPoints - currentQualityPoints;
  const requiredGPA = neededQualityPoints / aCreds;
  const roundedReq = Number(requiredGPA.toFixed(2));

  let status = "achievable";
  let message = "";
  let badgeColor = "green";

  if (roundedReq <= 0) {
    status = "secured";
    message = `Target already secured! You could earn a 0.00 GPA on your next ${aCreds} credits and still maintain at least a ${tGpa.toFixed(2)} cumulative GPA.`;
    badgeColor = "green";
  } else if (roundedReq <= 2.5) {
    status = "comfortable";
    message = `Easily achievable! You only need a ${roundedReq.toFixed(2)} GPA (approx. C average) across your upcoming ${aCreds} credits.`;
    badgeColor = "green";
  } else if (roundedReq <= 3.5) {
    status = "feasible";
    message = `Solid realistic target: You need a ${roundedReq.toFixed(2)} GPA (approx. B / B+ average) across your upcoming ${aCreds} credits.`;
    badgeColor = "green-light";
  } else if (roundedReq <= 4.0) {
    status = "challenging";
    message = `High target: You need a ${roundedReq.toFixed(2)} GPA (approx. A average) across your upcoming ${aCreds} credits.`;
    badgeColor = "amber";
  } else if (roundedReq <= 4.33) {
    status = "maximum";
    message = `Very difficult: Requires straight A+ grades (${roundedReq.toFixed(2)} GPA on a 4.3 scale) to achieve your target.`;
    badgeColor = "amber";
  } else {
    status = "impossible";
    message = `Mathematically impossible on a standard scale: You would need a ${roundedReq.toFixed(2)} GPA on your next ${aCreds} credits to reach ${tGpa.toFixed(2)}. Consider taking more credits or adjusting your target.`;
    badgeColor = "red";
  }

  return {
    requiredGPA: roundedReq,
    status,
    message,
    badgeColor,
    currentQualityPoints: Number(currentQualityPoints.toFixed(2)),
    targetQualityPoints: Number(targetQualityPoints.toFixed(2)),
    neededQualityPoints: Number(neededQualityPoints.toFixed(2))
  };
}

/**
 * Ultra-Compact URL State Encoding / Decoding
 * Semesters separated by "|", courses separated by ",", course parts separated by "~"
 * Format: s=c1~3~A,c2~4~B|c3~3~A-&m=letter&pGpa=3.5&pCred=30&tGpa=3.8&aCred=15&grp=1
 */
export function encodeCompactGPAState(semesters, format, priorGPA, priorCredits, targetGPA, additionalCredits, isGrouped) {
  try {
    const params = new URLSearchParams();

    // Semesters
    const semTokens = [];
    for (const sem of semesters) {
      const activeCourses = (sem.courses || []).filter(c => {
        const hasName = Boolean(c.name && c.name.trim() !== "");
        const hasCredits = Boolean(c.credits && c.credits.trim() !== "");
        const hasGrade = (c.gradeType === "percentage" && c.percentage) ||
                         (c.gradeType === "points" && c.points) ||
                         (c.letter && c.letter !== "A");
        return hasName || hasCredits || hasGrade;
      });

      if (activeCourses.length > 0 || sem.name) {
        const cTokens = activeCourses.map(c => {
          const encName = c.name ? encodeURIComponent(c.name.trim()) : "";
          const cCred = c.credits || "0";
          let gradeVal = c.letter || "A";
          if (c.gradeType === "percentage" || format === "percentage") {
            gradeVal = `pct_${c.percentage || "95"}`;
          } else if (c.gradeType === "points" || format === "points") {
            gradeVal = `pts_${c.points || "4.0"}`;
          }
          return `${encName}~${cCred}~${gradeVal}`;
        });
        const semNameEnc = sem.name ? encodeURIComponent(sem.name) : "";
        semTokens.push(`${semNameEnc}:${cTokens.join(",")}`);
      }
    }

    if (semTokens.length > 0) {
      params.set("s", semTokens.join("|"));
    }

    if (format && format !== "letter") params.set("m", format);
    if (priorGPA) params.set("pg", priorGPA);
    if (priorCredits) params.set("pc", priorCredits);
    if (targetGPA && targetGPA !== "3.5") params.set("tg", targetGPA);
    if (additionalCredits && additionalCredits !== "15") params.set("ac", additionalCredits);
    if (isGrouped === false) params.set("grp", "0");

    return params.toString();
  } catch (e) {
    return "";
  }
}

export function decodeCompactGPAState(searchString) {
  if (!searchString || searchString.length <= 1) return null;
  try {
    const params = new URLSearchParams(searchString.startsWith("?") ? searchString.slice(1) : searchString);
    const sParam = params.get("s");
    const mode = params.get("m") || "letter";
    const priorGPA = params.get("pg") || "";
    const priorCredits = params.get("pc") || "";
    const targetGPA = params.get("tg") || "3.5";
    const additionalCredits = params.get("ac") || "15";
    const isGrouped = params.get("grp") !== "0";

    const semesters = [];

    if (sParam) {
      const rawSemesters = sParam.split("|");
      rawSemesters.forEach((semStr, semIdx) => {
        let semName = `Semester ${semIdx + 1}`;
        let courseListStr = semStr;

        if (semStr.includes(":")) {
          const colonIdx = semStr.indexOf(":");
          const parsedName = decodeURIComponent(semStr.slice(0, colonIdx));
          if (parsedName) semName = parsedName;
          courseListStr = semStr.slice(colonIdx + 1);
        }

        const courses = [];
        if (courseListStr) {
          const rawCourses = courseListStr.split(",");
          rawCourses.forEach((cStr, cIdx) => {
            const parts = cStr.split("~");
            const name = parts[0] ? decodeURIComponent(parts[0]) : "";
            const credits = parts[1] || "";
            const gradeToken = parts[2] || "A";

            let gradeType = mode;
            let letter = "A";
            let percentage = "95";
            let points = "4.0";

            if (gradeToken.startsWith("pct_")) {
              gradeType = "percentage";
              percentage = gradeToken.replace("pct_", "");
            } else if (gradeToken.startsWith("pts_")) {
              gradeType = "points";
              points = gradeToken.replace("pts_", "");
            } else {
              letter = gradeToken;
            }

            courses.push({
              id: `${semIdx + 1}-${cIdx + 1}`,
              name,
              credits,
              gradeType,
              letter,
              percentage,
              points
            });
          });
        }

        semesters.push({
          id: `sem-${semIdx + 1}`,
          name: semName,
          courses
        });
      });
    }

    return {
      semesters: semesters.length > 0 ? semesters : null,
      mode,
      priorGPA,
      priorCredits,
      targetGPA,
      additionalCredits,
      isGrouped
    };
  } catch (e) {
    return null;
  }
}
