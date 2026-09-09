/* ColorPro — professional decision layer v1.6 */
import { Colorimetry } from './colorimetry-engine.js';
import { DiagnosisEngine } from './diagnosis-engine.js';
import { MixingEngine } from './mixing-engine.js';

const uniq=a=>[...new Set(a.filter(Boolean))];
const confidenceRank={Alta:0,High:0,Media:1,Medium:1,Baja:2,Low:2,Insuficiente:3};

export function assessCase({diagnosis={},target={},formula=[]}={}){
  const dx=DiagnosisEngine.assessDiagnosis(diagnosis);
  const simulation=Colorimetry.simulateColor({
    currentLevel:diagnosis.currentLevel,
    targetLevel:target.level,
    reflection:target.reflection,
    artificialPigment:Boolean(diagnosis.artificialPigment),
    historyKnown:diagnosis.historyKnown!==false,
    porosity:diagnosis.porosity||'unknown',
    grayPct:diagnosis.grayPct||0
  });
  const mixing=MixingEngine.validate(formula);
  const blockers=[];
  const required=[];
  const warnings=uniq([...dx.warnings,...simulation.warnings,...mixing.warnings]);
  if(dx.confidence==='Insuficiente') blockers.push('Diagnóstico insuficiente para emitir una decisión técnica.');
  if(!Number.isFinite(Number(diagnosis.currentLevel))) required.push('Nivel actual confirmado.');
  if(!diagnosis.historyKnown) required.push('Historia química documentada.');
  if(!target.level) required.push('Nivel objetivo.');
  if(simulation.viable===false) blockers.push('La estrategia solicitada no es viable con el estado químico declarado.');
  if(formula.length && !mixing.valid) blockers.push('La fórmula requiere revisión de procedencia o proporción antes de aplicarse.');
  if(diagnosis.porosity==='unknown') required.push('Evaluación de porosidad.');
  if(Number(diagnosis.grayPct)>=50) required.push('Validación de cobertura de cana según la línea seleccionada.');
  const rank=Math.max(confidenceRank[dx.confidence]??3,confidenceRank[simulation.confidence]??3);
  const confidence=['Alta','Media','Baja','Insuficiente'][rank];
  let decision='proceed';
  if(blockers.length) decision='do-not-proceed';
  else if(required.length || confidence==='Insuficiente') decision='request-data';
  return {decision,confidence,diagnosis:dx,simulation,mixing,blockers:uniq(blockers),required:uniq(required),warnings};
}

export function evaluateFormulaReadiness(formula=[]){
  const result=MixingEngine.validate(formula);
  const developer=formula.find(x=>x.category==='developer');
  return {
    ready:result.valid && Boolean(developer),
    totalGrams:result.totalGrams,
    proportions:result.items,
    warnings:uniq([...result.warnings,!developer?'Oxidante no registrado en la fórmula.':null])
  };
}

export const ProfessionalFlow={assessCase,evaluateFormulaReadiness};
if(typeof window!=='undefined')window.ProfessionalFlow=ProfessionalFlow;
