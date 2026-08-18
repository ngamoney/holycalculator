/**
 * luckyNumber.js — Holy Calculator US Lottery & Numerology Lucky Number Generator
 */

function getSecureRandomInt(min, max) {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    array[0] = Math.floor(Math.random() * 4294967296);
  }
  return min + (array[0] % range);
}

function generateUniqueNumbers(count, min, max) {
  const set = new Set();
  while (set.size < count) {
    set.add(getSecureRandomInt(min, max));
  }
  return Array.from(set).sort((a, b) => a - b);
}

export function generateLuckyNumbers(gameType = "powerball", dobMonth, dobDay, dobYear) {
  if (gameType === "powerball") {
    const main = generateUniqueNumbers(5, 1, 69);
    const powerball = getSecureRandomInt(1, 26);
    return {
      gameName: "Powerball",
      mainNumbers: main,
      bonusNumber: powerball,
      bonusLabel: "Powerball",
    };
  }

  if (gameType === "megamillions") {
    const main = generateUniqueNumbers(5, 1, 70);
    const megaBall = getSecureRandomInt(1, 25);
    return {
      gameName: "Mega Millions",
      mainNumbers: main,
      bonusNumber: megaBall,
      bonusLabel: "Mega Ball",
    };
  }

  if (gameType === "cash4life") {
    const main = generateUniqueNumbers(5, 1, 60);
    const cashBall = getSecureRandomInt(1, 4);
    return {
      gameName: "Cash4Life",
      mainNumbers: main,
      bonusNumber: cashBall,
      bonusLabel: "Cash Ball",
    };
  }

  if (gameType === "pick3") {
    const digits = [getSecureRandomInt(0, 9), getSecureRandomInt(0, 9), getSecureRandomInt(0, 9)];
    return { gameName: "Pick 3", mainNumbers: digits };
  }

  if (gameType === "pick4") {
    const digits = [
      getSecureRandomInt(0, 9),
      getSecureRandomInt(0, 9),
      getSecureRandomInt(0, 9),
      getSecureRandomInt(0, 9),
    ];
    return { gameName: "Pick 4", mainNumbers: digits };
  }

  if (gameType === "pick5") {
    const digits = [
      getSecureRandomInt(0, 9),
      getSecureRandomInt(0, 9),
      getSecureRandomInt(0, 9),
      getSecureRandomInt(0, 9),
      getSecureRandomInt(0, 9),
    ];
    return { gameName: "Pick 5", mainNumbers: digits };
  }

  // DOB Numerology mode
  const m = parseInt(dobMonth || 10, 10);
  const d = parseInt(dobDay || 28, 10);
  const y = parseInt(dobYear || 1994, 10);

  const n1 = (m + d) % 69 || 7;
  const n2 = (d + (y % 100)) % 69 || 14;
  const n3 = (m + (y % 100)) % 69 || 21;
  const n4 = getSecureRandomInt(1, 69);
  const n5 = getSecureRandomInt(1, 69);
  const main = Array.from(new Set([n1, n2, n3, n4, n5])).sort((a, b) => a - b);
  while (main.length < 5) {
    main.push(getSecureRandomInt(1, 69));
  }
  const luckyBonus = (m * d) % 26 || 11;

  return {
    gameName: "Birthday Numerology",
    mainNumbers: main.slice(0, 5),
    bonusNumber: luckyBonus,
    bonusLabel: "Lucky Bonus",
  };
}
