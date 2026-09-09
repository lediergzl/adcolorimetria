const DB_NAME = 'colorpro';
const DB_VERSION = 1;

export const STORES = [
  'clients','hairProfiles','diagnoses','colorTargets','formulas','formulaItems',
  'products','processes','results','photos','predictions','settings'
];

const id = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      STORES.forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          const os = db.createObjectStore(store, { keyPath: 'id' });
          os.createIndex('updatedAt', 'updatedAt');
          if (store === 'diagnoses' || store === 'colorTargets' || store === 'formulas' || store === 'predictions') {
            os.createIndex('clientId', 'clientId');
          }
        }
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function put(store, value) {
  const db = await openDatabase();
  const record = { ...value, id: value.id || id(), updatedAt: new Date().toISOString() };
  const tx = db.transaction(store, 'readwrite');
  await requestToPromise(tx.objectStore(store).put(record));
  return record;
}

export async function get(store, key) {
  const db = await openDatabase();
  return requestToPromise(db.transaction(store, 'readonly').objectStore(store).get(key));
}

export async function all(store) {
  const db = await openDatabase();
  return requestToPromise(db.transaction(store, 'readonly').objectStore(store).getAll());
}

export async function remove(store, key) {
  const db = await openDatabase();
  await requestToPromise(db.transaction(store, 'readwrite').objectStore(store).delete(key));
}

export async function byClient(store, clientId) {
  const db = await openDatabase();
  const os = db.transaction(store, 'readonly').objectStore(store);
  return requestToPromise(os.indexNames.contains('clientId')
    ? os.index('clientId').getAll(clientId)
    : os.getAll()).then(rows => os.indexNames.contains('clientId') ? rows : rows.filter(r => r.clientId === clientId));
}

export async function setSetting(key, value) { return put('settings', { id: key, value }); }
export async function getSetting(key, fallback = null) {
  const row = await get('settings', key);
  return row ? row.value : fallback;
}

export const DB = { openDatabase, put, get, all, remove, byClient, setSetting, getSetting };
if (typeof window !== 'undefined') window.ColorProDB = DB;
