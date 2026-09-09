/* ColorPro — catalog service and verified mixer bridge v1.8 */
import { DB } from './storage/db.js';
import { CatalogEngine } from './catalog-engine.js';
import { ProductEngine } from './product-engine.js';

const KEY='catalogWorkspace';
const clean=v=>String(v??'').trim();

export async function loadWorkspace(){
  const saved=await DB.get('settings',KEY);
  return {schemaVersion:'1.8',revision:Number(saved?.revision)||0,updatedAt:clean(saved?.updatedAt),source:clean(saved?.source)||'local',catalog:Array.isArray(saved?.catalog)?saved.catalog.map(CatalogEngine.normalizeProduct):[]};
}

export async function saveWorkspace(catalog=[],meta={}){
  const current=await loadWorkspace();
  const check=CatalogEngine.validateCatalog(catalog);
  const next={schemaVersion:'1.8',revision:current.revision+1,updatedAt:new Date().toISOString(),source:clean(meta.source)||'local',catalog:check.products};
  await DB.setSetting(KEY,next);
  return {...next,validation:check};
}

export async function importPayload(payload,{replace=false,source='import'}={}){
  const incoming=Array.isArray(payload)?payload:(Array.isArray(payload?.catalog)?payload.catalog:[]);
  const current=await loadWorkspace();
  const normalized=incoming.map(CatalogEngine.normalizeProduct);
  const base=replace?[]:current.catalog;
  const byKey=new Map(base.map(p=>[identity(p),p]));
  const duplicates=[];
  normalized.forEach(p=>{const key=identity(p);if(byKey.has(key))duplicates.push(p);else byKey.set(key,p)});
  const merged=[...byKey.values()];
  const validation=CatalogEngine.validateCatalog(merged);
  return {current,incoming:normalized,merged,validation,duplicates,source};
}

function identity(p){return clean(p.id)||[p.brand,p.line,p.shade,p.category].map(x=>clean(x).toLowerCase()).join('|');}

export async function getVerifiedProducts(){
  const ws=await loadWorkspace();
  return ws.catalog.map(ProductEngine.normalize).filter(ProductEngine.isUsable);
}

export async function exportWorkspace(){
  const ws=await loadWorkspace();
  return CatalogEngine.exportCatalog(ws.catalog,{revision:ws.revision,source:ws.source});
}

export const CatalogService={loadWorkspace,saveWorkspace,importPayload,getVerifiedProducts,exportWorkspace};
if(typeof window!=='undefined')window.CatalogService=CatalogService;
