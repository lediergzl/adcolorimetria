const LENGTH_FACTOR = { short: 1, medium: 1.25, long: 1.5, veryLong: 1.8 };
const DENSITY_FACTOR = { low: 0.85, medium: 1, high: 1.25 };

export function estimateColorQuantity({ length = 'medium', density = 'medium', baseGrams = 60 } = {}) {
  const grams = Number(baseGrams) || 60;
  const estimate = grams * (LENGTH_FACTOR[length] || 1) * (DENSITY_FACTOR[density] || 1);
  return { grams: Math.round(estimate / 5) * 5, basis: { length, density, baseGrams: grams } };
}

export function estimateDeveloper(colorGrams, ratio) {
  const grams = Number(colorGrams) || 0;
  const r = Number(ratio);
  if (!Number.isFinite(r) || r <= 0) return { grams: null, status: 'manufacturer-required' };
  return { grams: Math.round(grams * r * 10) / 10, status: 'calculated' };
}

export const QuantityEngine = { estimateColorQuantity, estimateDeveloper };
if (typeof window !== 'undefined') window.QuantityEngine = QuantityEngine;
