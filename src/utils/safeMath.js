/**
 * Safe math utilities to prevent NaN values
 */

/**
 * Safe division that returns 0 if denominator is 0 or NaN
 */
export function safeDivide(numerator, denominator, fallback = 0) {
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    return fallback;
  }
  const result = numerator / denominator;
  return isNaN(result) ? fallback : result;
}

/**
 * Safe percentage calculation
 */
export function safePercentage(value, total, fallback = 0) {
  return safeDivide(value, total, fallback) * 100;
}

/**
 * Safe round that handles NaN
 */
export function safeRound(value, decimals = 0, fallback = 0) {
  if (isNaN(value)) return fallback;
  const rounded = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return isNaN(rounded) ? fallback : rounded;
}

/**
 * Safe min/max that handles NaN
 */
export function safeMin(value, min, fallback = 0) {
  if (isNaN(value)) return fallback;
  return Math.min(value, min);
}

export function safeMax(value, max, fallback = 0) {
  if (isNaN(value)) return fallback;
  return Math.max(value, max);
}

/**
 * Safe clamp that handles NaN
 */
export function safeClamp(value, min, max, fallback = 0) {
  if (isNaN(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

/**
 * Validate number and return fallback if invalid
 */
export function safeNumber(value, fallback = 0) {
  if (isNaN(value) || value === null || value === undefined) {
    return fallback;
  }
  return Number(value);
}

/**
 * Ensure array is valid
 */
export function safeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}
