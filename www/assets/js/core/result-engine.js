/* ColorPro — Result comparison engine */
function normalize(v){ return String(v ?? '').trim().toLowerCase(); }
function comparePredictionToResult(prediction={}, actual={}){
  const predictedLevel=Number(prediction.estimatedLevel);
  const actualLevel=Number(actual.level);
  const levelDelta=Number.isFinite(predictedLevel)&&Number.isFinite(actualLevel)?actualLevel-predictedLevel:null;
  const predictedReflection=normalize(prediction.reflection || prediction.tendency);
  const actualReflection=normalize(actual.reflection);
  const reflectionMatch=actualReflection&&predictedReflection?predictedReflection.includes(actualReflection)||actualReflection.includes(predictedReflection):null;
  let alignment='Insuficiente';
  if(levelDelta!==null){
    if(Math.abs(levelDelta)===0 && reflectionMatch!==false) alignment='Alineado';
    else if(Math.abs(levelDelta)<=1) alignment='Cercano';
    else alignment='Desviado';
  }
  const observations=[];
  if(levelDelta!==null&&levelDelta>0) observations.push(`El resultado quedó ${levelDelta} nivel(es) más claro que la predicción.`);
  if(levelDelta!==null&&levelDelta<0) observations.push(`El resultado quedó ${Math.abs(levelDelta)} nivel(es) más oscuro que la predicción.`);
  if(reflectionMatch===false) observations.push('El reflejo observado no coincide con la tendencia registrada.');
  if(actual.residualBackground) observations.push(`Fondo observado: ${actual.residualBackground}.`);
  return {predictedLevel:Number.isFinite(predictedLevel)?predictedLevel:null,actualLevel:Number.isFinite(actualLevel)?actualLevel:null,levelDelta,reflectionMatch,alignment,observations};
}
export const ResultEngine={comparePredictionToResult};
if(typeof window!=='undefined') window.ResultEngine=ResultEngine;
