/* ColorPro — professional decision UI v1.6 */
import { DB } from './storage/db.js';
import { ProfessionalFlow } from './core/professional-flow-engine.js';

const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function workspace(){return await DB.get('settings','workspace')||{}};
function decisionLabel(d){return d==='proceed'?'Proceder':d==='request-data'?'Solicitar datos':'No proceder';}
function card(flow){
 const stateClass=flow.decision==='proceed'?'ok':flow.decision==='request-data'?'warning':'warning';
 return `<div class="card flow16 ${stateClass}"><div class="split"><div><span class="pill">Decisión técnica</span><h3>${decisionLabel(flow.decision)}</h3></div><div><b>Confianza ${esc(flow.confidence)}</b></div></div>${flow.blockers.map(x=>`<div class="warning">⛔ ${esc(x)}</div>`).join('')}${flow.required.map(x=>`<div class="warning">ℹ Falta: ${esc(x)}</div>`).join('')}${flow.warnings.filter(x=>!flow.blockers.includes(x)&&!flow.required.includes(x)).map(x=>`<div class="warning">⚠ ${esc(x)}</div>`).join('')}<p class="muted">La decisión es una evaluación orientativa basada en los datos registrados; no sustituye prueba de mechón, ficha técnica ni criterio profesional.</p></div>`;
}
async function renderDecision(){
 const ws=await workspace();
 if(!$('#view')||!ws.diagnosis&&!ws.target)return;
 const flow=ProfessionalFlow.assessCase({diagnosis:ws.diagnosis||{},target:ws.target||{},formula:ws.formula||[]});
 const anchor=$('#view .hero');
 if(anchor&&!anchor.querySelector('.flow16'))anchor.insertAdjacentHTML('beforeend',card(flow));
}
async function enhanceSimulator(){setTimeout(renderDecision,40);}
async function enhanceResult(){
 setTimeout(async()=>{
  const ws=await workspace(); const c=$('#comparison'); if(!c)return;
  if(ws.lastResult){const flow=ProfessionalFlow.assessCase({diagnosis:ws.diagnosis||{},target:ws.target||{},formula:ws.formula||[]});c.insertAdjacentHTML('beforeend',`<div class="card"><h3>Lectura técnica v1.6</h3><p class="muted">La comparación registrada no modifica automáticamente las reglas colorimétricas. Se conserva como evidencia para revisión futura.</p>${flow.simulation.warnings.map(x=>`<div class="warning">⚠ ${esc(x)}</div>`).join('')}</div>`)}
 },80);
}
document.addEventListener('click',e=>{const b=e.target.closest('#nav button[data-view="simulator"]');if(b)enhanceSimulator()},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-go="simulator"]');if(b)enhanceSimulator()},true);
document.addEventListener('submit',e=>{if(e.target.id==='resultForm')enhanceResult()},true);
window.ColorProProfessional16={renderDecision,assessCase:ProfessionalFlow.assessCase};
