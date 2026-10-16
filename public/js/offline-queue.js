/**
 * JalSanjeevani - Offline-First Sovereign IndexedDB Queue & Sync Manager
 * Layer 4: Field Resilience for Intermittent Rural 4G Connectivity
 *
 * Provides:
 * 1. Persistent offline queueing for cryptographic delivery receipts.
 * 2. Nonce ledger to prevent replay attacks offline & online.
 * 3. Automatic background synchronization upon network recovery.
 */

(function (window) {
  "use strict";

  const DB_NAME = "JalSanjeevaniDB";
  const DB_VERSION = 1;
  const STORE_VERIFICATIONS = "verifications";
  const STORE_NONCES = "redeemed_nonces";

  let dbPromise = null;

  function getDB() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) {
          console.warn("⚠️ [OfflineQueue] IndexedDB not supported by browser.");
          resolve(null);
          return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_VERIFICATIONS)) {
            const verStore = db.createObjectStore(STORE_VERIFICATIONS, { keyPath: "id", autoIncrement: true });
            verStore.createIndex("timestamp", "timestamp", { unique: false });
            verStore.createIndex("status", "status", { unique: false });
            verStore.createIndex("nonce", "nonce", { unique: false });
          }
          if (!db.objectStoreNames.contains(STORE_NONCES)) {
            db.createObjectStore(STORE_NONCES, { keyPath: "nonce" });
          }
        };

        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => {
          console.error("❌ [OfflineQueue] Database open error:", e.target.error);
          resolve(null);
        };
      });
    }
    return dbPromise;
  }

  const JalOfflineQueue = {
    /**
     * Checks if a cryptographic nonce has already been redeemed
     */
    async isNonceRedeemed(nonce) {
      if (!nonce) return false;
      const db = await getDB();
      if (!db) {
        // Fallback to localStorage cache
        const used = JSON.parse(localStorage.getItem("jal_redeemed_nonces") || "[]");
        return used.includes(nonce);
      }

      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NONCES, "readonly");
          const store = tx.objectStore(STORE_NONCES);
          const req = store.get(nonce);
          req.onsuccess = () => resolve(!!req.result);
          req.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    },

    /**
     * Marks a cryptographic nonce as redeemed
     */
    async recordRedeemedNonce(nonce, metadata = {}) {
      if (!nonce) return;
      const db = await getDB();

      // Mirror to localStorage fallback
      try {
        const used = JSON.parse(localStorage.getItem("jal_redeemed_nonces") || "[]");
        if (!used.includes(nonce)) {
          used.push(nonce);
          if (used.length > 500) used.shift();
          localStorage.setItem("jal_redeemed_nonces", JSON.stringify(used));
        }
      } catch (e) {}

      if (!db) return;

      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NONCES, "readwrite");
          const store = tx.objectStore(STORE_NONCES);
          store.put({
            nonce: nonce,
            redeemed_at: Date.now(),
            tanker_id: metadata.tanker_id || "",
            village: metadata.village || ""
          });
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    },

    /**
     * Saves a verified delivery receipt to the local offline queue
     */
    async savePendingVerification(receipt) {
      const record = {
        ...receipt,
        status: "pending_sync",
        queued_at: new Date().toISOString()
      };

      const db = await getDB();
      if (!db) {
        const queue = JSON.parse(localStorage.getItem("jal_offline_queue") || "[]");
        record.id = Date.now();
        queue.push(record);
        localStorage.setItem("jal_offline_queue", JSON.stringify(queue));
        return record.id;
      }

      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_VERIFICATIONS, "readwrite");
          const store = tx.objectStore(STORE_VERIFICATIONS);
          const req = store.add(record);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    },

    /**
     * Retrieves all pending verifications
     */
    async getPendingVerifications() {
      const db = await getDB();
      if (!db) {
        return JSON.parse(localStorage.getItem("jal_offline_queue") || "[]");
      }

      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_VERIFICATIONS, "readonly");
          const store = tx.objectStore(STORE_VERIFICATIONS);
          const req = store.getAll();
          req.onsuccess = () => {
            const all = req.result || [];
            resolve(all.filter((item) => item.status === "pending_sync"));
          };
          req.onerror = () => resolve([]);
        } catch (e) {
          resolve([]);
        }
      });
    },

    /**
     * Marks an item as synced or deletes it from the pending queue
     */
    async markVerificationSynced(id) {
      const db = await getDB();
      if (!db) {
        let queue = JSON.parse(localStorage.getItem("jal_offline_queue") || "[]");
        queue = queue.filter((item) => item.id !== id);
        localStorage.setItem("jal_offline_queue", JSON.stringify(queue));
        return;
      }

      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_VERIFICATIONS, "readwrite");
          const store = tx.objectStore(STORE_VERIFICATIONS);
          store.delete(id);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    },

    /**
     * Flushes all pending receipts to Supabase / Backend API once connected
     */
    async syncAllPending() {
      if (!navigator.onLine) {
        console.log("📶 [OfflineQueue] Device is currently offline. Sync deferred.");
        return 0;
      }

      const pending = await this.getPendingVerifications();
      if (!pending.length) return 0;

      console.log(`⚡ [OfflineQueue] Synchronizing ${pending.length} offline verifications to state ledger...`);
      let syncedCount = 0;

      for (const item of pending) {
        try {
          let synced = false;

          // 1. Attempt sync via Supabase client if available
          const sbClient = (window.JalSupabase && window.JalSupabase.client) || window.supabaseClient;
          if (sbClient) {
            const { error } = await sbClient.from("delivery_receipts").insert([{
              village: item.village || item.target_village,
              tanker: item.tanker || item.tanker_id,
              volume_liters: item.volume_liters || item.volume || 10000,
              driver_key: item.driver_key,
              cistern_key: item.cistern_key,
              signature: item.signature,
              status: item.status || "VERIFIED_DELIVERED"
            }]);
            if (!error) synced = true;
          }

          // 2. Fallback to backend API if Supabase insert failed or wasn't configured
          if (!synced && window.JalAuth) {
            const apiBase = window.JalAuth.getApiBase();
            const authHeaders = window.JalAuth.getAuthHeaders();
            const res = await fetch(`${apiBase}/api/verify-delivery`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeaders
              },
              body: JSON.stringify({
                tanker_id: item.tanker || item.tanker_id,
                target_village: item.village || item.target_village,
                driver_lat: item.lat || 19.9015,
                driver_lng: item.lng || 74.1030,
                driver_key: item.driver_key,
                cistern_key: item.cistern_key,
                volume_liters: item.volume_liters || item.volume || 10000
              })
            }).catch(() => null);

            if (res && res.ok) synced = true;
          }

          // Only mark verified as synced when successful sync occurred
          if (synced) {
            await this.markVerificationSynced(item.id);
            syncedCount++;
          }
        } catch (err) {
          console.warn("⚠️ [OfflineQueue] Sync attempt warning:", err);
        }
      }

      if (syncedCount > 0) {
        console.log(`✅ [OfflineQueue] Flushed ${syncedCount} queued receipts.`);
        window.dispatchEvent(new CustomEvent("jalsanjeevani-queue-synced", { detail: { count: syncedCount } }));
      }

      return syncedCount;
    }
  };

  // Auto-sync listener on reconnection
  window.addEventListener("online", () => {
    setTimeout(() => {
      JalOfflineQueue.syncAllPending();
    }, 1500);
  });

  window.JalOfflineQueue = JalOfflineQueue;
})(window);
