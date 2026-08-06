export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("PWA Service Worker registrado com sucesso:", reg.scope);
        })
        .catch((err) => {
          console.log("Falha ao registrar PWA Service Worker:", err);
        });
    });
  }
}

export function subscribeOnlineStatus(callback: (isOnline: boolean) => void) {
  const updateStatus = () => callback(navigator.onLine);
  window.addEventListener("online", updateStatus);
  window.addEventListener("offline", updateStatus);
  updateStatus();

  return () => {
    window.removeEventListener("online", updateStatus);
    window.removeEventListener("offline", updateStatus);
  };
}
