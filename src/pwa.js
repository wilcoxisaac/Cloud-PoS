let deferredPrompt = null;
let installAvailableCallbacks = [];

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const swUrl = import.meta.env.PROD ? '/sw.js' : '/sw.js';
        const registration = await navigator.serviceWorker.register(swUrl, {
          scope: '/'
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                if (window.confirm('A new version of Cloud POS is available. Refresh to update?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
      } catch (error) {
        console.log('SW registration failed:', error);
      }
    });
  }
}

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installAvailableCallbacks.forEach(cb => cb());
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
  });
}

export function onInstallAvailable(callback) {
  installAvailableCallbacks.push(callback);
  if (deferredPrompt) {
    callback();
  }
  return () => {
    installAvailableCallbacks = installAvailableCallbacks.filter(cb => cb !== callback);
  };
}

export async function promptInstall() {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome === 'accepted';
}

export function canInstall() {
  return deferredPrompt !== null;
}

export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}

export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isSafari() {
  return /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
}
