/* ColorPro — Formula Engine v0.7 */
function n(v,f=0){const x=Number(v);return Number.isFinite(x)?x:f;}
export function normalizeFormula(items=[]){
  const clean=items.map((item,index)=>({id:item.id||`item-${index+1}`,product:item.product||'Producto',shade:item.shade||'',grams:Math.max(0,n(item.grams)),oxidant:item.oxidant||null}));
  const total=clean.reduce((s,x)=>s+x.grams,0);
  return {items:clean,totalGrams:total,ratios:clean.map(x=>({...x,ratio:total?x.grams/total:0}))};
}
export function scaleFormula(formula,targetGrams){
  const base=normalizeFormula(formula.items||formula);
  const target=Math.max(0,n(targetGrams));
  const factor=base.totalGrams?target/base.totalGrams:0;
  return normalizeFormula(base.items.map(x=>({...x,grams:+(x.grams*factor).toFixed(1)})));
}
export function oxidantVolume(colorGrams,ratio=1){return +(Math.max(0,n(colorGrams))*Math.max(0,n(ratio))).toFixed(1);}
export const FormulaEngine={normalizeFormula,scaleFormula,oxidantVolume};
if(typeof window!=='undefined') window.FormulaEngine=FormulaEngine;
