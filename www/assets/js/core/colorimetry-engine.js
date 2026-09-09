/* ColorPro — Professional Colorimetry Engine v0.7
 * Deterministic, explainable model. Not a guarantee of physical result.
 */
const LEVELS = Object.freeze({
  1:{name:'Negro', background:'rojo'}, 2:{name:'Castaño muy oscuro',background:'rojo'},
  3:{name:'Castaño oscuro',background:'rojo'}, 4:{name:'Castaño medio',background:'rojo-naranja'},
  5:{name:'Castaño claro',background:'naranja'}, 6:{name:'Rubio oscuro',background:'naranja'},
  7:{name:'Rubio medio',background:'amarillo-naranja'}, 8:{name:'Rubio claro',background:'amarillo'},
  9:{name:'Rubio muy claro',background:'amarillo-pálido'}, 10:{name:'Rubio extra claro',background:'amarillo-pálido'}
});

const COMPLEMENTS = Object.freeze({
  rojo:'verde', 'rojo-naranja':'azul-verde', naranja:'azul', 'amarillo-naranja':'azul-violeta',
  amarillo:'violeta', 'amarillo-pálido':'violeta'
});
const REFLECTIONS = Object.freeze({
  '.0':{name:'Natural',tone:'neutro'}, '.1':{name:'Ceniza',tone:'azul'}, '.2':{name:'Irisado/Violeta',tone:'violeta'},
  '.3':{name:'Dorado',tone:'amarillo'}, '.4':{name:'Cobrizo',tone:'naranja'}, '.5':{name:'Caoba',tone:'rojo-violeta'},
  '.6':{name:'Rojo',tone:'rojo'}, '.7':{name:'Mate',tone:'verde'}
});

function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function num(v,f=0){const n=Number(v);return Number.isFinite(n)?n:f;}
function backgroundForLevel(level){return LEVELS[clamp(Math.round(level),1,10)]?.background || 'desconocido';}
function normalizeLevel(value){return clamp(num(value,5),1,10);}

function analyzeViability({currentLevel,targetLevel,artificialPigment=false,historyKnown=true,porosity='unknown',grayPct=0}){
  const current=normalizeLevel(currentLevel), target=normalizeLevel(targetLevel);
  const lift=target-current;
  const warnings=[];
  let confidence='High';
  if(!historyKnown){warnings.push('Historia química incompleta: la predicción pierde fiabilidad.');confidence='Low';}
  if(artificialPigment && lift>0){warnings.push('El color cosmético existente no se aclara de forma fiable con color.');confidence='Low';}
  if(porosity==='high'){warnings.push('Porosidad alta: posible absorción irregular y resultado más frío/oscuro.');confidence=confidence==='High'?'Medium':confidence;}
  if(lift>3){warnings.push('Salto de más de 3 niveles: requiere estrategia técnica específica y control del fondo.');confidence='Low';}
  if(grayPct>70 && target<6){warnings.push('Cobertura de cana elevada: validar base natural, saturación y tiempo de exposición.');confidence=confidence==='High'?'Medium':confidence;}
  if(lift<0) warnings.push('Para oscurecer, evaluar pigmentación de relleno cuando corresponda.');
  return {current,target,lift,viable:!(artificialPigment&&lift>0),confidence,warnings};
}

function estimateBackground({currentLevel,targetLevel,neutralizer}){
  const target=normalizeLevel(targetLevel), current=normalizeLevel(currentLevel);
  const residual=backgroundForLevel(Math.max(current,target));
  const complement=COMPLEMENTS[residual];
  const neutralized=neutralizer && complement && String(neutralizer).toLowerCase().includes(complement);
  return {base:residual,complement,neutralized};
}

export function simulateColor(input={}){
  const current=normalizeLevel(input.currentLevel), target=normalizeLevel(input.targetLevel);
  const viability=analyzeViability({
    currentLevel:current,targetLevel:target,
    artificialPigment:Boolean(input.artificialPigment),historyKnown:input.historyKnown!==false,
    porosity:input.porosity||'unknown',grayPct:num(input.grayPct)
  });
  const bg=estimateBackground({currentLevel:current,targetLevel:target,neutralizer:input.neutralizer});
  const reflection=REFLECTIONS[String(input.reflection||'.0')] || REFLECTIONS['.0'];
  let tendency=reflection.name;
  if(bg.base!=='desconocido' && !bg.neutralized) tendency += ` + tendencia a ${bg.complement}`;
  if(input.artificialPigment && viability.lift>0) tendency='Resultado limitado por pigmento artificial existente';
  return {
    estimatedLevel:target,
    estimatedLevelName:LEVELS[target].name,
    tendency,
    residualBackground:bg.base,
    neutralization:bg.complement,
    confidence:viability.confidence,
    viable:viability.viable,
    warnings:viability.warnings,
    explanation:`Base ${current} → objetivo ${target}. Salto ${viability.lift >= 0 ? '+' : ''}${viability.lift} niveles. Fondo esperado: ${bg.base}.`,
    disclaimer:'Simulación colorimétrica orientativa; no sustituye diagnóstico presencial ni prueba de mechón.'
  };
}

export function compareFormulas(baseInput, formulas=[]){
  return formulas.map(formula=>({
    formula,
    result:simulateColor({...baseInput,...formula}),
  })).sort((a,b)=>({High:0,Medium:1,Low:2}[a.result.confidence]??3)-({High:0,Medium:1,Low:2}[b.result.confidence]??3));
}

export const Colorimetry={LEVELS,COMPLEMENTS,REFLECTIONS,simulateColor,compareFormulas,analyzeViability};
if(typeof window!=='undefined') window.Colorimetry=Colorimetry;
