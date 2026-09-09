/* ColorPro — professional mixing engine v1.2 */
function num(v){const n=Number(v);return Number.isFinite(n)?n:0;}
function normalize(items=[]){return items.filter(Boolean).map((x,i)=>({id:x.id||`item-${i+1}`,product:String(x.product||'').trim(),shade:String(x.shade||'').trim(),grams:Math.max(0,num(x.grams)),category:x.category||'color',developerRatio:x.developerRatio??null,source:x.source||'unknown'})).filter(x=>x.grams>0);}
function total(items){return normalize(items).reduce((s,x)=>s+x.grams,0);}
function proportions(items){const list=normalize(items),t=total(list);return list.map(x=>({...x,percent:t?Math.round(x.grams/t*1000)/10:0}));}
function scale(items,targetGrams){const list=normalize(items),t=total(list),target=num(targetGrams);if(!t||target<=0)return list;return list.map(x=>({...x,grams:Math.round(x.grams/t*target*10)/10}));}
function validate(items=[]){const list=normalize(items),warnings=[];if(!list.length)warnings.push('No hay componentes en la fórmula.');if(list.some(x=>x.category==='color'&&x.source==='unknown'))warnings.push('Hay tonos sin procedencia verificada.');if(list.some(x=>x.category==='developer'&&x.developerRatio==null))warnings.push('La proporción del oxidante no está verificada; debe consultarse la ficha del fabricante.');return {valid:!warnings.length,warnings,items:proportions(list),totalGrams:total(list)};}
export const MixingEngine={normalize,total,proportions,scale,validate};
if(typeof window!=='undefined')window.MixingEngine=MixingEngine;
