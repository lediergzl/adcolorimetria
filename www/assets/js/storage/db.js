const DB_NAME = 'colorpro';
const DB_VERSION = 2;

export const STORES = [
  'clients','hairProfiles','diagnoses','colorTargets','formulas','formulaItems',
  'products','processes','results','photos','predictions','settings'
];

const INDEXES = {
  clients:['updatedAt','createdAt'],
  hairProfiles:['clientId','updatedAt'],
  diagnoses:['clientId','updatedAt','createdAt'],
  colorTargets:['clientId','updatedAt','createdAt'],
  formulas:['clientId','predictionId','updatedAt','createdAt'],
  formulaItems:['formulaId','updatedAt'],
  products:['brandId','verified','updatedAt'],
  processes:['clientId','formulaId','predictionId','updatedAt','createdAt'],
  results:['clientId','formulaId','predictionId','updatedAt','createdAt'],
  photos:['clientId','formulaId','predictionId','kind','updatedAt','createdAt'],
  predictions:['clientId','updatedAt','createdAt'],
  settings:['updatedAt']
};

const id = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
function requestToPromise(request){return new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});}
function ensureIndexes(os, store){(INDEXES[store]||[]).forEach(name=>{if(!os.indexNames.contains(name))os.createIndex(name,name,{unique:false})});}

export function openDatabase(){return new Promise((resolve,reject)=>{
  const request=indexedDB.open(DB_NAME,DB_VERSION);
  request.onupgradeneeded=()=>{const db=request.result;STORES.forEach(store=>{const os=db.objectStoreNames.contains(store)?request.transaction.objectStore(store):db.createObjectStore(store,{keyPath:'id'});ensureIndexes(os,store);});};
  request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
});}

export async function put(store,value){const db=await openDatabase();const now=new Date().toISOString();const record={...value,id:value.id||id(),createdAt:value.createdAt||now,updatedAt:now};const tx=db.transaction(store,'readwrite');const result=await requestToPromise(tx.objectStore(store).put(record));return record;}
export async function get(store,key){const db=await openDatabase();return requestToPromise(db.transaction(store,'readonly').objectStore(store).get(key));}
export async function all(store){const db=await openDatabase();return requestToPromise(db.transaction(store,'readonly').objectStore(store).getAll());}
export async function remove(store,key){const db=await openDatabase();await requestToPromise(db.transaction(store,'readwrite').objectStore(store).delete(key));}
export async function byClient(store,clientId){const db=await openDatabase();const os=db.transaction(store,'readonly').objectStore(store);return os.indexNames.contains('clientId')?requestToPromise(os.index('clientId').getAll(clientId)):requestToPromise(os.getAll()).then(rows=>rows.filter(r=>r.clientId===clientId));}
export async function byIndex(store,indexName,key){const db=await openDatabase();const os=db.transaction(store,'readonly').objectStore(store);return os.indexNames.contains(indexName)?requestToPromise(os.index(indexName).getAll(key)):[];}
export async function setSetting(key,value){return put('settings',{id:key,value});}
export async function getSetting(key,fallback=null){const row=await get('settings',key);return row?row.value:fallback;}

export const DB={openDatabase,put,get,all,remove,byClient,byIndex,setSetting,getSetting,version:DB_VERSION};
if(typeof window!=='undefined')window.ColorProDB=DB;
