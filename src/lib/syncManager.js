import { getSyncQueue, removeSyncItem } from './offlineStorage';

let syncInProgress = false;

export async function processSyncQueue() {
  if (syncInProgress || !navigator.onLine) return;
  syncInProgress = true;

  try {
    const queue = await getSyncQueue();
    if (queue.length === 0) return;

    const sorted = queue.sort((a, b) => a.timestamp - b.timestamp);

    for (const item of sorted) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: item.body ? JSON.stringify(item.body) : undefined,
        });

        if (response.ok || response.status === 409) {
          await removeSyncItem(item.id);
        } else if (response.status >= 500) {
          break;
        } else {
          await removeSyncItem(item.id);
        }
      } catch {
        break;
      }
    }
  } finally {
    syncInProgress = false;
  }
}

export function triggerSync() {
  if (navigator.onLine) {
    setTimeout(() => processSyncQueue(), 100);
  }
}

export function startBackgroundSync() {
  window.__triggerSync = triggerSync;

  window.addEventListener('online', () => {
    processSyncQueue();
  });

  if (navigator.onLine) {
    processSyncQueue();
  }
}
