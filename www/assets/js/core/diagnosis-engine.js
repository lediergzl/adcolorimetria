const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function assessDiagnosis(data = {}) {
  const warnings = [];
  const factors = [];
  let score = 1;

  const level = Number(data.currentLevel);
  if (!Number.isFinite(level) || level < 1 || level > 10) {
    warnings.push('Nivel base no confirmado. La predicción queda limitada.');
    score -= 0.35;
  } else factors.push(`Base nivel ${level}`);

  if (data.historyKnown === false) {
    warnings.push('Historia química incompleta o desconocida.');
    score -= 0.25;
  } else factors.push('Historia química declarada');

  if (data.artificialPigment === true) {
    warnings.push('Existe pigmento artificial: el color cosmético previo puede limitar la aclaración.');
    score -= 0.2;
  }

  const porosity = data.porosity || 'unknown';
  if (porosity === 'high') {
    warnings.push('Porosidad alta: posible absorción irregular y menor estabilidad del resultado.');
    score -= 0.15;
  } else if (porosity === 'unknown') {
    warnings.push('Porosidad no evaluada.');
    score -= 0.1;
  }

  const gray = clamp(Number(data.grayPct) || 0, 0, 100);
  if (gray >= 50) {
    warnings.push('Canas ≥50%: la cobertura y el fondo deben validarse con criterio de marca.');
    score -= 0.1;
  }

  if (data.photos?.length) factors.push('Registro fotográfico disponible');
  else warnings.push('Sin fotografía diagnóstica.');

  const confidence = score >= 0.78 ? 'Alta' : score >= 0.55 ? 'Media' : score >= 0.3 ? 'Baja' : 'Insuficiente';
  return { confidence, score: clamp(score, 0, 1), warnings, factors, grayPct: gray };
}

export const DiagnosisEngine = { assessDiagnosis };
if (typeof window !== 'undefined') window.DiagnosisEngine = DiagnosisEngine;
