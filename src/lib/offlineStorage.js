const DB_NAME = 'cloud-pos-offline';
const DB_VERSION = 1;

const STORES = {
  appState: 'appState',
  transactions: 'transactions',
  customers: 'customers',
  products: 'products',
  employees: 'employees',
  inventory: 'inventory',
  appointments: 'appointments',
  tables: 'tables',
  syncQueue: 'syncQueue',
};

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      Object.values(STORES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: storeName === 'syncQueue' });
          if (storeName === 'syncQueue') {
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getStore(storeName, mode = 'readonly') {
  const db = await openDB();
  const tx = db.transaction(storeName, mode);
  return { store: tx.objectStore(storeName), tx };
}

export async function getAll(storeName) {
  const { store } = await getStore(storeName);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getItem(storeName, key) {
  const { store } = await getStore(storeName);
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putItem(storeName, item) {
  const { store } = await getStore(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.put(item);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putAll(storeName, items) {
  const { store, tx } = await getStore(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    items.forEach((item) => store.put(item));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteItem(storeName, key) {
  const { store } = await getStore(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearStore(storeName) {
  const { store } = await getStore(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveAppState(key, value) {
  return putItem(STORES.appState, { id: key, value, updatedAt: Date.now() });
}

export async function loadAppState(key) {
  const result = await getItem(STORES.appState, key);
  return result ? result.value : null;
}

export async function addToSyncQueue(action) {
  await putItem(STORES.syncQueue, {
    ...action,
    id: `sync-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    synced: false,
  });
  if (typeof window !== 'undefined' && window.__triggerSync) {
    window.__triggerSync();
  }
}

export async function getSyncQueue() {
  return getAll(STORES.syncQueue);
}

export async function clearSyncQueue() {
  return clearStore(STORES.syncQueue);
}

export async function removeSyncItem(id) {
  return deleteItem(STORES.syncQueue, id);
}

export { STORES };
