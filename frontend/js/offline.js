/**
 * JalSanchar V2 - Field Offline Persistence & Sync
 * Reuses existing IndexedDB architecture to queue offline source readings & telemetry.
 */

(function (window) {
  "use strict";

  const DB_NAME = "JalSancharV2_OfflineDB";
  const DB_VERSION = 1;
  const STORE_READINGS = "offline_readings";
  const STORE_SOURCES = "offline_sources";

  let dbInstance = null;

  function initDB() {
    if (dbInstance) return Promise.resolve(dbInstance);

    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        console.warn("[JalOffline] IndexedDB not available.");
        resolve(null);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_READINGS)) {
          db.createObjectStore(STORE_READINGS, { keyPath: "id", autoIncrement: true });
        }
        if (!db.objectStoreNames.contains(STORE_SOURCES)) {
          db.createObjectStore(STORE_SOURCES, { keyPath: "id" });
        }
      };

      request.onsuccess = (e) => {
        dbInstance = e.target.result;
        resolve(dbInstance);
      };

      request.onerror = (e) => {
        console.error("[JalOffline] IndexedDB error:", e);
        resolve(null);
      };
    });
  }

  const JalOffline = {
    /**
     * Enqueues a source reading when offline.
     */
    async enqueueReading(reading) {
      const db = await initDB();
      if (!db) {
        // Fallback to localStorage
        const stored = JSON.parse(localStorage.getItem("jalsanchar_offline_readings") || "[]");
        stored.push({ ...reading, queuedAt: Date.now() });
        localStorage.setItem("jalsanchar_offline_readings", JSON.stringify(stored));
        return true;
      }

      return new Promise((resolve) => {
        const tx = db.transaction([STORE_READINGS], "readwrite");
        const store = tx.objectStore(STORE_READINGS);
        store.add({ ...reading, queuedAt: Date.now() });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    },

    /**
     * Retrieves all pending offline readings.
     */
    async getPendingReadings() {
      const db = await initDB();
      if (!db) {
        return JSON.parse(localStorage.getItem("jalsanchar_offline_readings") || "[]");
      }

      return new Promise((resolve) => {
        const tx = db.transaction([STORE_READINGS], "readonly");
        const store = tx.objectStore(STORE_READINGS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    },

    /**
     * Clears all synced readings.
     */
    async clearPendingReadings() {
      const db = await initDB();
      if (!db) {
        localStorage.removeItem("jalsanchar_offline_readings");
        return;
      }

      const tx = db.transaction([STORE_READINGS], "readwrite");
      tx.objectStore(STORE_READINGS).clear();
    },

    /**
     * Tries to sync pending readings to the server.
     */
    async syncPendingReadings() {
      if (!navigator.onLine) return { synced: 0, remaining: 0 };
      const pending = await this.getPendingReadings();
      if (!pending || pending.length === 0) return { synced: 0, remaining: 0 };

      let syncedCount = 0;
      for (const item of pending) {
        try {
          if (window.JalAPI) {
            await window.JalAPI.post("/api/readings", {
              source_id: item.source_id,
              value: item.value,
              method: item.method || "manual",
              photo_url: item.photo_url || null,
              quality: item.quality || "measured"
            });
            syncedCount++;
          }
        } catch (e) {
          console.warn("[JalOffline] Reading sync failed, will retry:", e);
          break; // Stop and retry later if network fails mid-sync
        }
      }

      if (syncedCount === pending.length) {
        await this.clearPendingReadings();
      }
      return { synced: syncedCount, remaining: pending.length - syncedCount };
    }
  };

  // Auto-sync when coming back online
  window.addEventListener("online", () => {
    console.log("[JalOffline] Device is back online. Syncing pending readings...");
    JalOffline.syncPendingReadings();
  });

  window.JalOffline = JalOffline;
})(window);
