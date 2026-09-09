import { DB } from './storage/db.js';

const $=s=>document.querySelector(s), esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>x?new Date(x).toLocaleString('es-ES',{dateStyle:'medium',timeStyle:'short'}):'—';
const label={diagnosis:'Diagnóstico',colorTarget:'Objetivo',formula:'Fórmula',prediction:'Predicción',process:'Proceso',result:'Resultado real',photo:'Fotografía'};
async function rows(store,clientId){return (await DB.byClient(store,clientId)).sort((a,b)=>String(b.createdAt||b.updatedAt).localeCompare(String(a.createdAt||a.updatedAt)));}
async function loadWorkspace(){return await DB.get('settings','workspace')||{};}
async function renderDossier(clientId){
 const c=await DB.get('clients',clientId); if(!c){$('#view').innerHTML='<div class="empty">No hay clienta seleccionada.</div>';return;}
 const [diagnoses,targets,formulas,predictions,processes,results,photos]=await Promise.all(['diagnoses','colorTargets','formulas','predictions','processes','results','photos'].map(s=>rows(s,clientId)));
 const events=[];
 diagnoses.forEach(x=>events.push({type:'diagnosis',date:x.createdAt||x.updatedAt,data:x}));
 targets.forEach(x=>events.push({type:'colorTarget',date:x.createdAt||x.updatedAt,data:x}));
 formulas.forEach(x=>events.push({type:'formula',date:x.createdAt||x.updatedAt,data:x}));
 predictions.forEach(x=>events.push({type:'prediction',date:x.createdAt||x.updatedAt,data:x}));
 processes.forEach(x=>events.push({type:'process',date:x.createdAt||x.updatedAt,data:x}));
 results.forEach(x=>events.push({type:'result',date:x.createdAt||x.updatedAt,data:x}));
 photos.forEach(x=>events.push({type:'photo',date:x.createdAt||x.updatedAt,data:x}));
 events.sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 const latestPrediction=predictions[0], latestResult=results[0];
 $('#page-title').textContent='Expediente'; $('#page-subtitle').textContent='Dossier técnico de clienta';
 $('#view').innerHTML=`<div class="hero"><div class="actions"><button class="secondary" data-view="clients">← Clientas</button><button class="primary" data-print-dossier="1">Imprimir / PDF</button></div><h2>${esc(c.name)}</h2><p class="muted">${esc(c.phone||'Sin teléfono')} · actualizado ${fmt(c.updatedAt)}</p>${c.notes?`<p>${esc(c.notes)}</p>`:''}</div>
 <div class="grid"><div class="card"><h3>Diagnósticos</h3><div class="metric">${diagnoses.length}</div></div><div class="card"><h3>Fórmulas</h3><div class="metric">${formulas.length}</div></div><div class="card"><h3>Fotos</h3><div class="metric">${photos.length}</div></div><div class="card"><h3>Resultados</h3><div class="metric">${results.length}</div></div></div>
 ${latestPrediction||latestResult?`<div class="card"><h3>Predicción vs. resultado</h3><p>Nivel previsto: <b>${latestPrediction?.prediction?.estimatedLevel??'—'}</b> · nivel observado: <b>${latestResult?.level??'—'}</b></p><p>Estado: <b>${esc(latestResult?.comparison?.alignment||'Pendiente')}</b></p></div>`:''}
 <div class="card"><h3>Línea de tiempo</h3><div class="timeline">${events.map(e=>`<article class="timeline-item"><div class="pill">${label[e.type]||e.type}</div><small class="muted">${fmt(e.date)}</small>${eventText(e)}</article>`).join('')||'<div class="empty">Aún no hay actividad registrada.</div>'}</div></div>`;
}
function eventText(e){const x=e.data;if(e.type==='diagnosis')return `<p>Nivel actual: <b>${esc(x.currentLevel)}</b> · porosidad: ${esc(x.porosity||'—')} · historia: ${x.historyKnown?'conocida':'incompleta'}.</p>`;if(e.type==='colorTarget')return `<p>Objetivo: nivel <b>${esc(x.level)}</b> · reflejo ${esc(x.reflection||'—')}.</p>`;if(e.type==='formula')return `<p>${esc(x.name||'Fórmula técnica')} · ${esc(x.totalGrams||'')} g.</p>`;if(e.type==='prediction')return `<p>Nivel estimado: <b>${esc(x.prediction?.estimatedLevel||'—')}</b> · ${esc(x.prediction?.confidence||'—')}.</p>`;if(e.type==='process')return `<p>${esc(x.developer||'Oxidante no indicado')} · ${esc(x.minutes||'—')} min · proporción ${esc(x.ratio||'—')}.</p>`;if(e.type==='result')return `<p>Resultado: nivel <b>${esc(x.level||'—')}</b> · comparación <b>${esc(x.comparison?.alignment||'—')}</b>.</p>`;return `<p>${esc(x.kind||'Foto')} · ${esc(x.name||'imagen')} ${x.note?'· '+esc(x.note):''}</p>`;}
function printDossier(){window.print();}
async function boot(){const w=await loadWorkspace();if(!$('#nav [data-view="dossier"]')){const b=document.createElement('button');b.dataset.view='dossier';b.textContent='Expediente';$('#nav').appendChild(b);}if(w.clientId)renderDossier(w.clientId);}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-print-dossier]');if(b)printDossier();const back=e.target.closest('[data-view="clients"]');if(back){e.preventDefault();document.querySelector('#nav [data-view="clients"]')?.click();}});
window.ColorProDossier={renderDossier};
boot();
