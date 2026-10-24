/**
 * JalSanchar V2 - Unified API Client & Fetch Wrapper
 * Handles base URLs, JWT/Session headers, network timeout, and graceful offline fallback.
 */

(function (window) {
  "use strict";

  const API_BASE_URL = (function () {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      // If local frontend server port is 8000, call self, else call :8000
      return window.location.port === "8000" ? "" : "http://127.0.0.1:8000";
    }
    // Production Render backend
    return "https://jalsanchar.onrender.com";
  })();

  function getAuthHeader() {
    try {
      const raw = sessionStorage.getItem("jalsanchar_gov_session") ||
                  localStorage.getItem("jalsanchar_gov_session") ||
                  sessionStorage.getItem("jalsanjeevani_gov_session");
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.token) {
          return { "Authorization": `Bearer ${s.token}` };
        }
      }
    } catch (e) {
      console.warn("[JalAPI] Session read error:", e);
    }
    return {};
  }

  const JalAPI = {
    baseUrl: API_BASE_URL,

    /**
     * Unified fetch wrapper.
     * @param {string} endpoint - API path (e.g. '/api/village/SN-01/status')
     * @param {object} [options={}] - fetch options
     * @returns {Promise<any>}
     */
    async request(endpoint, options = {}) {
      const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;
      const headers = {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...(options.headers || {})
      };

      const controller = new AbortController();
      const timeoutMs = options.timeoutMs || 12000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          let errDetail = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errJson = await response.json();
            if (errJson && errJson.detail) errDetail = errJson.detail;
          } catch (_) {}
          throw new Error(errDetail);
        }

        return await response.json();
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          throw new Error("Network request timed out. Please check your connectivity.");
        }
        if (!navigator.onLine) {
          throw new Error("Device is offline. Action queued for auto-sync.");
        }
        throw err;
      }
    },

    get(endpoint, options = {}) {
      return this.request(endpoint, { ...options, method: "GET" });
    },

    post(endpoint, body, options = {}) {
      return this.request(endpoint, {
        ...options,
        method: "POST",
        body: JSON.stringify(body)
      });
    }
  };

  window.JalAPI = JalAPI;
})(window);
