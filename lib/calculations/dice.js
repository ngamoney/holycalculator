/**
 * Returns a cryptographically random 32-bit unsigned integer.
 * Falls back to Math.random() on HTTP origins where crypto API may be restricted
 * (e.g. testing on a local network IP over plain HTTP on Android/iOS).
 */
function randomUint32() {
  try {
    const array = new Uint32Array(1);
    (window.crypto || globalThis.crypto).getRandomValues(array);
    return array[0];
  } catch (_) {
    // Fallback: Math.random() scaled to Uint32 range
    return Math.floor(Math.random() * 4294967296);
  }
}

/**
 * Cryptographically random integer in [1, sides] inclusive.
 * Uses crypto.getRandomValues() with rejection sampling to eliminate modulo bias.
 * Falls back to Math.random() on insecure HTTP origins (local network testing).
 */
export function rollDie(sides) {
  if (!Number.isInteger(sides) || sides < 2) {
    throw new RangeError(`sides must be an integer >= 2, got ${sides}`);
  }
  // Rejection sampling to avoid modulo bias
  const max = 4294967296 - (4294967296 % sides);
  let value;
  do {
    value = randomUint32();
  } while (value >= max);
  return (value % sides) + 1;
}

/**
 * Roll `count` dice each with `sides` faces.
 * Returns { rolls: number[], total: number, count, sides }
 */
export function rollDice(count, sides) {
  const validCount = Math.max(1, Math.min(100, Math.round(count)));
  const validSides = Math.max(2, Math.round(sides));
  const rolls = Array.from({ length: validCount }, () => rollDie(validSides));
  const total = rolls.reduce((sum, r) => sum + r, 0);
  return { rolls, total, count: validCount, sides: validSides };
}

/** Local-storage key for persisted dice config */
const STORAGE_KEY = "dice-roller-config";

export function saveConfig(count, sides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, sides }));
  } catch (_) {
    // ignore (private browsing / storage full)
  }
}

export function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { count, sides } = JSON.parse(raw);
    if (Number.isInteger(count) && count >= 1 && Number.isInteger(sides) && sides >= 2) {
      return { count, sides };
    }
  } catch (_) {}
  return null;
}
