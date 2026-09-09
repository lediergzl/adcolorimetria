import { DB } from '../storage/db.js';

export async function createClient(input = {}) {
  return DB.put('clients', { ...input, createdAt: input.createdAt || new Date().toISOString() });
}

export async function saveDiagnosis(clientId, diagnosis) {
  return DB.put('diagnoses', { clientId, ...diagnosis });
}

export async function saveTarget(clientId, target) {
  return DB.put('colorTargets', { clientId, ...target });
}

export async function saveFormula(clientId, formula, items = []) {
  const saved = await DB.put('formulas', { clientId, ...formula });
  for (const item of items) await DB.put('formulaItems', { formulaId: saved.id, clientId, ...item });
  return saved;
}

export async function savePrediction(clientId, prediction) {
  return DB.put('predictions', { clientId, ...prediction });
}

export async function saveResult(clientId, result) {
  return DB.put('results', { clientId, ...result });
}

export async function clientTimeline(clientId) {
  const [diagnoses, targets, formulas, predictions, results, photos, processes] = await Promise.all([
    DB.byClient('diagnoses', clientId), DB.byClient('colorTargets', clientId), DB.byClient('formulas', clientId),
    DB.byClient('predictions', clientId), DB.byClient('results', clientId), DB.byClient('photos', clientId), DB.byClient('processes', clientId)
  ]);
  return { diagnoses, targets, formulas, predictions, results, photos, processes };
}

export const Workflow = { createClient, saveDiagnosis, saveTarget, saveFormula, savePrediction, saveResult, clientTimeline };
if (typeof window !== 'undefined') window.ColorProWorkflow = Workflow;
