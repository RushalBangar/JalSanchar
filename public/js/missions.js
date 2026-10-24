/**
 * JalSanchar V2 — Tri-Party Mission & Handshake Orchestrator
 * Connects the 3 key personas with Instant Cross-Tab Real-Time Sync:
 * 1. Gram Panchayat (Sarpanch) -> Logs emergency distress demand ticket.
 * 2. District Collector -> Authorizes and dispatches OR-Tools CVRP optimized route.
 * 3. Tanker Driver -> Receives dispatch, navigates geofence, and executes dual-key QR handshake.
 *
 * Architecture:
 * - Real-Time Cross-Tab Bus: BroadcastChannel('jalsanchar_triparty_bus') + storage event fallback
 * - Resilient State Store: LocalStorage + REST API (/api/missions) with automatic fallback
 * - Synthesizer Audio Engine: Web Audio API notification and celebration chimes
 */

(function (window) {
  "use strict";

  const STORAGE_KEY = "jalsanchar_triparty_missions";
  const BROADCAST_CHANNEL_NAME = "jalsanchar_triparty_bus";

  // Deterministic Default Seed Missions
  function getDefaultMissions() {
    return [
      {
        id: "MSN-SN02-01",
        ticket_id: "TKT-SN-02",
        village_code: "SN-02",
        village_name: "Khopadi",
        district: "Nashik",
        taluka: "Sinnar",
        demanded_liters: 10000,
        population: 3200,
        cattle: 1200,
        current_well_level: "7% Critical",
        reason: "Cistern reserve critical at 7% (3,150L). Depletion horizon 13 hours.",
        status: "REQUESTED", // Starts as REQUESTED for live end-to-end testing
        tanker_id: null,
        tanker_registration: null,
        driver_name: null,
        driver_phone_masked: "+91 98XXX-XX512",
        requested_by: "Sunita G. Deshmukh (Sarpanch)",
        requested_at: new Date(Date.now() - 15 * 60000).toISOString(),
        dispatched_at: null,
        arrived_at: null,
        delivered_at: null,
        eta_minutes: null,
        driver_key: "0x9F3B4ED812C4",
        cistern_key: "0x74CE8A1109B2",
        payment_token: null
      },
      {
        id: "MSN-SN01-01",
        ticket_id: "TKT-SN-01",
        village_code: "SN-01",
        village_name: "Pangari",
        district: "Nashik",
        taluka: "Sinnar",
        demanded_liters: 12000,
        population: 2450,
        cattle: 820,
        current_well_level: "11% High Risk",
        reason: "Percolation pond drying up. Urgent drinking quota needed.",
        status: "REQUESTED",
        tanker_id: null,
        tanker_registration: null,
        driver_name: null,
        requested_by: "Kailas Shinde (Gram Sevak)",
        requested_at: new Date(Date.now() - 45 * 60000).toISOString(),
        dispatched_at: null,
        arrived_at: null,
        delivered_at: null,
        eta_minutes: null,
        driver_key: null,
        cistern_key: "0x12FA88BC4411",
        payment_token: null
      }
    ];
  }

  // Tactical Audio Synth Chimes (Zero external dependencies)
  function playAudioTone(type = "notify") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "notify") {
        // High-low alert beep (880Hz -> 1174Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1174, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "success") {
        // Ascending major chord fanfare (C5 -> E5 -> G5 -> C6)
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.connect(gain);
          gain.connect(ctx.destination);

          const startTime = ctx.currentTime + (i * 0.08);
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.15, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
      }
    } catch (_) {}
  }

  // Real-Time Cross-Tab Event Bus
  let broadcastBus = null;
  if (typeof BroadcastChannel !== "undefined") {
    try {
      broadcastBus = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    } catch (e) {
      console.warn("[JalMissions] BroadcastChannel init note:", e);
    }
  }

  function broadcastEvent(type, payload = {}) {
    const message = { type, payload, timestamp: Date.now() };
    if (broadcastBus) {
      try {
        broadcastBus.postMessage(message);
      } catch (e) {
        console.warn("[JalMissions] Broadcast error:", e);
      }
    }
    // Also trigger storage event for cross-window sync
    try {
      localStorage.setItem("jalsanchar_bus_tick", JSON.stringify(message));
    } catch (_) {}
  }

  // Local Storage State Helpers
  function loadLocalMissions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}
    const defaults = getDefaultMissions();
    saveLocalMissions(defaults);
    return defaults;
  }

  function saveLocalMissions(missions) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
    } catch (e) {
      console.warn("[JalMissions] Save local error:", e);
    }
  }

  function getApiBase() {
    if (window.JalAuth && typeof window.JalAuth.getApiBase === "function") {
      return window.JalAuth.getApiBase();
    }
    if (window.JalAPI && window.JalAPI.baseUrl) {
      return window.JalAPI.baseUrl;
    }
    // If running on local server or Vercel, use relative proxy
    return "";
  }

  // Floating Toast Notification
  function showToast(msg, duration = 3500) {
    let toast = document.getElementById("jalMissionGlobalToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "jalMissionGlobalToast";
      toast.className = "fixed bottom-5 right-5 z-[9999] bg-[#070e1a] text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-2 max-w-sm transition-all duration-300 transform translate-y-0";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="text-base">🌊</span><span>${msg}</span>`;
    toast.classList.remove("hidden", "opacity-0", "translate-y-4");
    toast.classList.add("opacity-100", "translate-y-0");

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-4");
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, duration);
  }

  // ─── JalMissions Core API ───
  const JalMissions = {
    /**
     * Get all active missions (local-first with resilient API fallback)
     */
    async getMissions(status = null, village = null) {
      let missions = loadLocalMissions();

      // Attempt async backend fetch
      try {
        const apiBase = getApiBase();
        const url = `${apiBase}/api/missions`;
        const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.missions) && data.missions.length > 0) {
            // Keep status from local if local was updated more recently
            const localMap = new Map(missions.map(m => [m.id, m]));
            missions = data.missions.map(m => {
              const local = localMap.get(m.id);
              if (local && local.status !== m.status) {
                return local; // preserve client-side workflow transitions
              }
              return m;
            });
            saveLocalMissions(missions);
          }
        }
      } catch (_) {
        // Safe offline / Render sleeping fallback
      }

      let filtered = [...missions];
      if (status) {
        filtered = filtered.filter(m => m.status.toLowerCase() === status.toLowerCase());
      }
      if (village) {
        const v = village.toLowerCase();
        filtered = filtered.filter(m => 
          (m.village_code && m.village_code.toLowerCase().includes(v)) ||
          (m.village_name && m.village_name.toLowerCase().includes(v))
        );
      }

      return { count: filtered.length, missions: filtered };
    },

    /**
     * Get single active mission for Khopadi (default demo village)
     */
    getActiveMission(villageCode = "SN-02") {
      const missions = loadLocalMissions();
      const code = villageCode.toUpperCase();
      const found = missions.find(m => m.village_code === code);
      return found || missions[0] || getDefaultMissions()[0];
    },

    /**
     * 1. Panchayat: Logs emergency water demand ticket
     */
    async requestEmergencyTanker(data = {}) {
      const missions = loadLocalMissions();
      const villageCode = (data.village_code || "SN-02").toUpperCase();
      const villageName = data.village_name || (villageCode === "SN-02" ? "Khopadi" : "Pangari");
      const demandedLiters = Number(data.demanded_liters || 10000);
      const ticketId = `TKT-${villageCode}-${Math.floor(100 + Math.random() * 900)}`;
      const missionId = `MSN-${villageCode}-${Date.now().toString(36).slice(-4).toUpperCase()}`;

      // Update or create mission
      let mission = missions.find(m => m.village_code === villageCode);
      if (mission) {
        mission.ticket_id = ticketId;
        mission.status = "REQUESTED";
        mission.demanded_liters = demandedLiters;
        mission.reason = data.reason || "Cistern reserve critical at 7% (3,150L). Depletion horizon 13 hours.";
        mission.requested_at = new Date().toISOString();
        mission.tanker_id = null;
        mission.tanker_registration = null;
        mission.driver_name = null;
        mission.dispatched_at = null;
        mission.arrived_at = null;
        mission.delivered_at = null;
        mission.current_well_level = "7% Critical";
      } else {
        mission = {
          id: missionId,
          ticket_id: ticketId,
          village_code: villageCode,
          village_name: villageName,
          district: "Nashik",
          taluka: "Sinnar",
          demanded_liters: demandedLiters,
          population: 3200,
          cattle: 1200,
          current_well_level: "7% Critical",
          reason: data.reason || "Cistern reserve critical at 7% (3,150L). Depletion horizon 13 hours.",
          status: "REQUESTED",
          tanker_id: null,
          tanker_registration: null,
          driver_name: null,
          driver_phone_masked: "+91 98XXX-XX512",
          requested_by: data.requested_by || "Sunita G. Deshmukh (Sarpanch)",
          requested_at: new Date().toISOString(),
          dispatched_at: null,
          arrived_at: null,
          delivered_at: null,
          eta_minutes: null,
          driver_key: "0x9F3B4ED812C4",
          cistern_key: "0x74CE8A1109B2",
          payment_token: null
        };
        missions.unshift(mission);
      }

      saveLocalMissions(missions);
      broadcastEvent("DEMAND_LOGGED", { mission });
      playAudioTone("notify");

      // Asynchronous API call
      try {
        const apiBase = getApiBase();
        fetch(`${apiBase}/api/missions/request-tanker`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            village_code: villageCode,
            village_name: villageName,
            demanded_liters: demandedLiters,
            reason: mission.reason,
            requested_by: mission.requested_by
          })
        }).catch(() => {});
      } catch (_) {}

      return {
        status: "success",
        message: `Emergency water demand ticket #${ticketId} created.`,
        mission
      };
    },

    /**
     * 2. Collector: Authorizes OR-Tools CVRP dispatch for pending ticket
     */
    async authorizeDispatch(missionId = "MSN-SN02-01", tankerId = "TN-SN-02") {
      const missions = loadLocalMissions();
      let target = missions.find(m => m.id === missionId || m.ticket_id === missionId || m.village_code === "SN-02");
      if (!target) target = missions[0];

      if (target) {
        target.status = "DISPATCHED";
        target.tanker_id = tankerId;
        target.tanker_registration = "MH-15-TK-5512";
        target.driver_name = "Ramesh Patil";
        target.eta_minutes = 15;
        target.dispatched_at = new Date().toISOString();
      }

      saveLocalMissions(missions);
      broadcastEvent("TANKER_DISPATCHED", { mission: target });
      playAudioTone("notify");

      // Asynchronous API call
      try {
        const apiBase = getApiBase();
        fetch(`${apiBase}/api/missions/authorize-dispatch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mission_id: target.id,
            tanker_id: tankerId,
            tanker_registration: "MH-15-TK-5512",
            driver_name: "Ramesh Patil"
          })
        }).catch(() => {});
      } catch (_) {}

      return {
        status: "success",
        message: `Dispatch order authorized for Tanker ${tankerId}.`,
        mission: target
      };
    },

    /**
     * 3. Driver: Reaches village cistern geofence
     */
    async onDriverArrival(tankerId = "TN-SN-02") {
      const missions = loadLocalMissions();
      let target = missions.find(m => m.tanker_id === tankerId || m.village_code === "SN-02");
      if (!target) target = missions[0];

      if (target) {
        target.status = "AT_CISTERN";
        target.arrived_at = new Date().toISOString();
      }

      saveLocalMissions(missions);
      broadcastEvent("TANKER_ARRIVED", { mission: target });
      playAudioTone("notify");

      return {
        status: "success",
        message: `Tanker ${tankerId} reached Khopadi Cistern geofence.`,
        mission: target
      };
    },

    /**
     * 4. Dual-Key Handshake Attestation Verified
     */
    async onHandshakeComplete(tankerId = "TN-SN-02", village = "Khopadi", volume = 10000, receipt = {}) {
      const missions = loadLocalMissions();
      let target = missions.find(m => m.village_code === "SN-02" || m.tanker_id === tankerId);
      if (!target) target = missions[0];

      const paymentToken = "JAL-TREASURY-AUTH-" + Math.random().toString(36).substring(2, 10).toUpperCase();

      if (target) {
        target.status = "DELIVERED";
        target.delivered_at = new Date().toISOString();
        target.payment_token = paymentToken;
        target.current_well_level = "29% Adequate";
      }

      saveLocalMissions(missions);
      broadcastEvent("DELIVERY_VERIFIED", { mission: target, receipt });
      playAudioTone("success");

      // Asynchronous API call
      try {
        const apiBase = getApiBase();
        fetch(`${apiBase}/api/missions/complete-handshake`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mission_id: target.id,
            tanker_id: tankerId,
            village_code: target.village_code,
            driver_token: receipt.driver_key || "0x9F3B4ED812C4",
            volume_liters: volume
          })
        }).catch(() => {});
      } catch (_) {}

      return {
        status: "success",
        message: `Delivery of ${volume.toLocaleString()}L verified at ${village} Cistern.`,
        mission: target,
        payment_token: paymentToken
      };
    },

    /**
     * Reset complete demo workflow to initial 7% critical state
     */
    resetMissionsWorkflow() {
      const defaults = getDefaultMissions();
      saveLocalMissions(defaults);
      broadcastEvent("WORKFLOW_RESET", { missions: defaults });
      playAudioTone("notify");
      showToast("🔄 Tri-Party workflow reset to initial state (Khopadi 7% Critical).");
      return defaults;
    }
  };

  window.JalMissions = JalMissions;
  window.authorizeCollectorDispatch = function (missionId) {
    JalMissions.authorizeDispatch(missionId, "TN-SN-02");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // UI Synchronization Hook across all 3 pages
  // ─────────────────────────────────────────────────────────────────────────────

  document.addEventListener("DOMContentLoaded", () => {
    initPanchayatMissionUI();
    initCollectorMissionUI();
    initDriverMissionUI();
    initWorkflowSandboxBar();

    // Cross-tab real-time event listener
    if (broadcastBus) {
      broadcastBus.onmessage = (event) => {
        handleTripartyEvent(event.data);
      };
    }

    window.addEventListener("storage", (e) => {
      if (e.key === "jalsanchar_bus_tick" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          handleTripartyEvent(data);
        } catch (_) {}
      }
    });
  });

  function handleTripartyEvent(msg) {
    if (!msg || !msg.type) return;
    const type = msg.type;
    const mission = (msg.payload && msg.payload.mission) || JalMissions.getActiveMission();

    if (type === "DEMAND_LOGGED") {
      showToast(`🚨 Gram Panchayat raised Demand #${mission.ticket_id} (10,000L)!`);
    } else if (type === "TANKER_DISPATCHED") {
      showToast(`🚚 Collector Dispatched Tanker ${mission.tanker_id || 'TN-SN-02'} to Khopadi!`);
    } else if (type === "TANKER_ARRIVED") {
      showToast(`📍 Tanker ${mission.tanker_id || 'TN-SN-02'} arrived within 15m of Khopadi Cistern!`);
    } else if (type === "DELIVERY_VERIFIED") {
      showToast(`✓ Dual-Key Handshake Verified! Khopadi Cistern +10,000L. Escrow ₹15,000 Released.`);
    } else if (type === "WORKFLOW_RESET") {
      showToast(`🔄 Workflow reset to Initial State.`);
    }

    // Refresh whichever UI is currently loaded on this page
    refreshCurrentPageUI(mission);
  }

  function refreshCurrentPageUI(mission) {
    if (document.getElementById("missionCoordinationCard")) {
      updatePanchayatView(mission);
    }
    if (document.getElementById("panchayatDemandQueueCard")) {
      updateCollectorView(mission);
    }
    if (document.getElementById("btnLogArrival") || document.getElementById("missionActiveBannerText")) {
      updateDriverView(mission);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Gram Panchayat Page UI (panchayat.html)
  // ─────────────────────────────────────────────────────────────────────────────

  function initPanchayatMissionUI() {
    const card = document.getElementById("missionCoordinationCard");
    const btnRaise = document.getElementById("btnRaiseEmergencyDemand");
    const btnRefresh = document.getElementById("btnRefreshMissionStatus");

    if (!card && !btnRaise) return;

    // Attach raise demand handler
    if (btnRaise) {
      btnRaise.onclick = async () => {
        btnRaise.disabled = true;
        btnRaise.innerHTML = `<span class="inline-block animate-spin mr-1">⏳</span> Logging Demand...`;

        const res = await JalMissions.requestEmergencyTanker({
          village_code: "SN-02",
          village_name: "Khopadi",
          demanded_liters: 10000,
          reason: "Cistern reserve critical at 7% (3,150L). Depletion horizon 13 hours."
        });

        btnRaise.disabled = false;
        btnRaise.innerHTML = `<i data-lucide="plus-circle" class="w-3.5 h-3.5 mr-1 text-red-600"></i> Raise New Demand Ticket`;
        if (window.lucide) lucide.createIcons();

        updatePanchayatView(res.mission);
        showToast(`🚨 Demand Ticket #${res.mission.ticket_id} Logged & Sent to District Collector!`);
      };
    }

    if (btnRefresh) {
      btnRefresh.onclick = () => {
        btnRefresh.classList.add("animate-spin");
        const m = JalMissions.getActiveMission("SN-02");
        updatePanchayatView(m);
        setTimeout(() => btnRefresh.classList.remove("animate-spin"), 400);
      };
    }

    // Initial render
    const initialMission = JalMissions.getActiveMission("SN-02");
    updatePanchayatView(initialMission);
  }

  function updatePanchayatView(mission) {
    if (!mission) mission = JalMissions.getActiveMission("SN-02");

    const badge = document.getElementById("missionLifecycleBadge");
    const ticketLabel = document.getElementById("missionTicketLabel");
    const tankerText = document.getElementById("missionTankerText");
    const driverText = document.getElementById("missionDriverText");
    const etaText = document.getElementById("missionEtaText");
    const s1 = document.getElementById("step1Demand");
    const s2 = document.getElementById("step2Dispatch");
    const s3 = document.getElementById("step3Arrival");
    const s4 = document.getElementById("step4Verified");

    if (ticketLabel) ticketLabel.textContent = `Ticket #${mission.ticket_id || "TKT-SN-02"}`;

    const status = mission.status || "REQUESTED";

    // Callout Alert Box inside Mission Card
    let callout = document.getElementById("missionLiveCallout");
    if (!callout) {
      const card = document.getElementById("missionCoordinationCard");
      if (card) {
        callout = document.createElement("div");
        callout.id = "missionLiveCallout";
        callout.className = "p-2.5 rounded-lg text-xs font-medium transition-all duration-300";
        card.insertBefore(callout, card.children[2]);
      }
    }

    if (status === "REQUESTED") {
      if (badge) {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300";
        badge.textContent = "QUEUED (COLLECTOR APPROVAL)";
      }
      if (tankerText) tankerText.textContent = "Awaiting Collector Allocation...";
      if (driverText) driverText.textContent = "OR-Tools Route Pending";
      if (etaText) {
        etaText.textContent = "Pending Authorization";
        etaText.className = "font-bold text-amber-700";
      }
      setSteps(1);

      if (callout) {
        callout.className = "p-2.5 rounded-lg text-xs bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-between";
        callout.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Ticket submitted to District Collector. Awaiting CVRP allocation.</span>
          </div>
          <button onclick="JalMissions.authorizeDispatch('${mission.id}')" class="px-2 py-1 rounded bg-amber-700 hover:bg-amber-800 text-white font-bold text-[10px] shrink-0 cursor-pointer shadow-sm">
            ⚡ Simulate Collector Dispatch
          </button>
        `;
      }

    } else if (status === "DISPATCHED") {
      if (badge) {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300";
        badge.textContent = "DISPATCHED (EN ROUTE)";
      }
      if (tankerText) tankerText.textContent = `${mission.tanker_id || "TN-SN-02"} (${mission.tanker_registration || "MH-15-TK-5512"})`;
      if (driverText) driverText.textContent = `${mission.driver_name || "Ramesh Patil"} (GPS Locked)`;
      if (etaText) {
        etaText.textContent = `~${mission.eta_minutes || 15} Minutes (Inside Sector)`;
        etaText.className = "font-bold text-blue-700";
      }
      setSteps(2);

      if (callout) {
        callout.className = "p-2.5 rounded-lg text-xs bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-between";
        callout.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Tanker ${mission.tanker_id || "TN-SN-02"} is En Route to Khopadi (~15 min).</span>
          </div>
          <button onclick="JalMissions.onDriverArrival('${mission.tanker_id || "TN-SN-02"}')" class="px-2 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-[10px] shrink-0 cursor-pointer shadow-sm">
            📍 Simulate Tanker Arrival
          </button>
        `;
      }

    } else if (status === "AT_CISTERN") {
      if (badge) {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse";
        badge.textContent = "ARRIVED AT CISTERN (12M)";
      }
      if (tankerText) tankerText.textContent = `${mission.tanker_id || "TN-SN-02"} (On Site)`;
      if (driverText) driverText.textContent = `${mission.driver_name || "Ramesh Patil"} (Ready with QR)`;
      if (etaText) {
        etaText.textContent = "Arrived at Tank (12m Inside Geofence)";
        etaText.className = "font-bold text-green-700";
      }
      setSteps(3);

      if (callout) {
        callout.className = "p-2.5 rounded-lg text-xs bg-green-50 text-green-950 border border-green-300 flex items-center justify-between";
        callout.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-green-600 animate-ping"></span>
            <span><strong>Tanker Outside Cistern!</strong> Ready for dual-key handshake.</span>
          </div>
          <button onclick="simulateQuickHandshake()" class="px-2.5 py-1 rounded bg-green-700 hover:bg-green-800 text-white font-bold text-[10px] shrink-0 cursor-pointer shadow-sm">
            🔑 Auto-Verify Handshake
          </button>
        `;
      }

    } else if (status === "DELIVERED") {
      if (badge) {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-900 border border-green-300";
        badge.textContent = "VERIFIED & DELIVERED ✓";
      }
      if (tankerText) tankerText.textContent = `${mission.tanker_id || "TN-SN-02"} (Discharged)`;
      if (driverText) driverText.textContent = "Handshake Attested ✓";
      if (etaText) {
        etaText.textContent = "Reserve Restored to 29% (+10,000L)";
        etaText.className = "font-bold text-green-700";
      }
      setSteps(4);

      if (callout) {
        callout.className = "p-2.5 rounded-lg text-xs bg-emerald-50 text-emerald-950 border border-emerald-300 flex items-center justify-between";
        callout.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-green-700 text-sm">verified</span>
            <span>Delivery validated! Escrow ₹15,000 released. Storage at 29%.</span>
          </div>
          <button onclick="JalMissions.resetMissionsWorkflow()" class="px-2 py-1 rounded bg-slate-700 hover:bg-slate-800 text-white font-bold text-[10px] shrink-0 cursor-pointer shadow-sm">
            🔄 Reset Demo
          </button>
        `;
      }
    }

    function setSteps(cur) {
      if (s1) s1.className = cur >= 1 ? "p-1 rounded bg-green-50 text-green-800 border border-green-300 font-bold" : "p-1 rounded bg-gray-100 text-gray-400 border border-gray-200 font-bold";
      if (s2) s2.className = cur >= 2 ? "p-1 rounded bg-blue-50 text-blue-800 border border-blue-300 font-bold" : "p-1 rounded bg-gray-100 text-gray-400 border border-gray-200 font-bold";
      if (s3) s3.className = cur === 3 ? "p-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold animate-pulse" : (cur > 3 ? "p-1 rounded bg-blue-50 text-blue-800 border border-blue-300 font-bold" : "p-1 rounded bg-gray-100 text-gray-400 border border-gray-200 font-bold");
      if (s4) s4.className = cur >= 4 ? "p-1 rounded bg-green-100 text-green-900 border border-green-300 font-bold" : "p-1 rounded bg-gray-100 text-gray-400 border border-gray-200 font-bold";
    }
  }

  window.simulateQuickHandshake = function () {
    const payload = JSON.stringify({
      protocol: "JALSANCHAR_POD_V2",
      tanker_id: "TN-SN-02",
      registration: "MH-15-TK-5512",
      target_village: "Khopadi (Sinnar)",
      volume_liters: 10000,
      driver_key: "0x9F3B4ED812C4",
      lat: 19.9015,
      lng: 74.1030,
      timestamp: new Date().toISOString(),
      nonce: "NONCE-" + Date.now().toString(36),
      signature: "HMAC-SHA256:8f4c2e1b9a7d3c5e00b8c6a4e321598f"
    });

    if (window.onScanSuccess) {
      window.onScanSuccess(payload);
    } else {
      JalMissions.onHandshakeComplete("TN-SN-02", "Khopadi", 10000, { driver_key: "0x9F3B4ED812C4" });
      updatePanchayatView(JalMissions.getActiveMission("SN-02"));
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. District Collector Page UI (dashboard.html)
  // ─────────────────────────────────────────────────────────────────────────────

  function initCollectorMissionUI() {
    const card = document.getElementById("panchayatDemandQueueCard");
    if (!card) return;

    const mission = JalMissions.getActiveMission("SN-02");
    updateCollectorView(mission);
  }

  function updateCollectorView(mission) {
    const card = document.getElementById("panchayatDemandQueueCard");
    const countEl = document.getElementById("collectorQueueCount");
    const btn = document.getElementById("btnCollectorAuthorizeDispatch");
    if (!card) return;

    if (!mission) mission = JalMissions.getActiveMission("SN-02");
    const status = mission.status || "REQUESTED";

    if (status === "REQUESTED") {
      card.className = "mt-4 p-4 rounded-xl bg-red-50/80 border border-red-300 space-y-3 transition-all";
      if (countEl) {
        countEl.textContent = "1 Critical Request Pending";
        countEl.className = "text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 animate-pulse";
      }
      if (btn) {
        btn.disabled = false;
        btn.className = "px-3.5 py-2 rounded-lg bg-gov-navy hover:bg-gov-deep text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer";
        btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">local_shipping</span><span>Authorize &amp; Dispatch TN-SN-02</span>`;
      }
    } else if (status === "DISPATCHED") {
      card.className = "mt-4 p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-3 transition-all";
      if (countEl) {
        countEl.textContent = "0 Requests Pending • 1 Tanker En Route";
        countEl.className = "text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300";
      }
      if (btn) {
        btn.disabled = true;
        btn.className = "px-3.5 py-2 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm opacity-90";
        btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">navigation</span><span>Dispatched • TN-SN-02 En Route (~15m ETA)</span>`;
      }
    } else if (status === "AT_CISTERN") {
      card.className = "mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-3 transition-all";
      if (countEl) {
        countEl.textContent = "📍 Tanker Arrived at Khopadi Cistern";
        countEl.className = "text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 animate-pulse";
      }
      if (btn) {
        btn.disabled = false;
        btn.className = "px-3.5 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer";
        btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">qr_code</span><span>At Destination • Awaiting Sarpanch Handshake</span>`;
      }
    } else if (status === "DELIVERED") {
      card.className = "mt-4 p-4 rounded-xl bg-green-50/80 border border-green-300 space-y-3 transition-all";
      if (countEl) {
        countEl.textContent = "✓ Delivery Verified • Escrow Released";
        countEl.className = "text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-green-100 text-green-900 border border-green-300";
      }
      if (btn) {
        btn.disabled = false;
        btn.className = "px-3.5 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer";
        btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">check_circle</span><span>✓ Delivered 10,000L • Reserve Restored (29%)</span>`;
      }

      // Update Khopadi village level in the collector table if visible
      const khopadiRow = document.querySelector(`tr[data-village="SN-02"]`) || document.querySelector(`tr:has(td:contains("Khopadi"))`);
      if (khopadiRow) {
        khopadiRow.querySelectorAll("td").forEach(td => {
          if (td.textContent.includes("7%")) {
            td.innerHTML = `<span class="font-bold text-green-700">29% (Restored)</span>`;
          }
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Tanker Driver Page UI (driver.html)
  // ─────────────────────────────────────────────────────────────────────────────

  function initDriverMissionUI() {
    const banner = document.getElementById("missionActiveBannerText");
    const targetTitle = document.getElementById("targetVillageTitle");
    const btnArrival = document.getElementById("btnLogArrival");

    if (!banner && !targetTitle && !btnArrival) return;

    const mission = JalMissions.getActiveMission("SN-02");
    updateDriverView(mission);

    if (btnArrival) {
      btnArrival.addEventListener("click", () => {
        const m = JalMissions.getActiveMission("SN-02");
        if (m.status !== "AT_CISTERN" && m.status !== "DELIVERED") {
          JalMissions.onDriverArrival("TN-SN-02");
        }
      });
    }
  }

  function updateDriverView(mission) {
    const banner = document.getElementById("missionActiveBannerText");
    const targetTitle = document.getElementById("targetVillageTitle");
    const btnArrival = document.getElementById("btnLogArrival");
    const btnText = document.getElementById("btnLogArrivalText");
    const bannerSuccess = document.getElementById("arrivalSuccessBanner");
    const transitBadge = document.getElementById("transitBadge");

    if (!banner && !targetTitle) return;
    if (!mission) mission = JalMissions.getActiveMission("SN-02");

    const status = mission.status || "REQUESTED";

    if (status === "REQUESTED") {
      if (banner) banner.textContent = "Standby in Depot • Awaiting Collector Dispatch";
      if (targetTitle) targetTitle.textContent = "Target: Standby (Depot)";
      if (btnText) btnText.textContent = "Awaiting Collector Authorization...";
      if (btnArrival) btnArrival.disabled = true;
      if (transitBadge) transitBadge.textContent = "STANDBY";
    } else if (status === "DISPATCHED") {
      if (banner) banner.textContent = `🚨 Active Mission: Deliver 10,000L to Khopadi Cistern #02`;
      if (targetTitle) targetTitle.textContent = `Target: Khopadi Public Cistern #02`;
      if (btnText) btnText.textContent = "Log Arrival at Cistern";
      if (btnArrival) {
        btnArrival.disabled = false;
        btnArrival.classList.remove("bg-green-600");
        btnArrival.classList.add("bg-primary");
      }
      if (transitBadge) transitBadge.textContent = "EN ROUTE (GPS LOCKED)";
    } else if (status === "AT_CISTERN") {
      if (banner) banner.textContent = `✓ Arrived at Khopadi Cistern (12m) • GPS Verified`;
      if (targetTitle) targetTitle.textContent = `Target: Khopadi Public Cistern #02`;
      if (btnText) btnText.textContent = "Arrival Confirmed ✓ (Present QR Code Below)";
      if (btnArrival) {
        btnArrival.disabled = false;
        btnArrival.classList.add("bg-green-600");
      }
      if (bannerSuccess) bannerSuccess.classList.remove("hidden");
      if (transitBadge) transitBadge.textContent = "READY TO SCAN";
    } else if (status === "DELIVERED") {
      if (banner) banner.textContent = `🎉 Delivery Verified by Sarpanch! Escrow ₹15,000 Released.`;
      if (targetTitle) targetTitle.textContent = `Khopadi Cistern #02 (Delivered ✓)`;
      if (btnText) btnText.textContent = "✓ Trip Completed (Escrow Unlocked)";
      if (btnArrival) btnArrival.disabled = true;
      if (transitBadge) transitBadge.textContent = "DELIVERED & VERIFIED ✓";
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. Interactive Tri-Party Workflow Sandbox Toolbar
  // ─────────────────────────────────────────────────────────────────────────────

  function initWorkflowSandboxBar() {
    // Only inject if not already present
    if (document.getElementById("jalWorkflowSandboxBar")) return;

    // Check if on one of the relevant pages
    const isPanchayat = document.getElementById("missionCoordinationCard");
    const isCollector = document.getElementById("panchayatDemandQueueCard");
    const isDriver = document.getElementById("btnLogArrival");

    if (!isPanchayat && !isCollector && !isDriver) return;

    const bar = document.createElement("div");
    bar.id = "jalWorkflowSandboxBar";
    bar.className = "fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-[#070e1a]/95 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-2xl border border-white/20 flex items-center gap-1.5 text-[11px] font-sans";
    bar.innerHTML = `
      <span class="text-white/60 font-bold px-1 hidden sm:inline">Tri-Party Live Pipeline:</span>
      <button onclick="JalMissions.requestEmergencyTanker({ village_code: 'SN-02' })" class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition cursor-pointer" title="1. Panchayat logs distress demand">
        1. Raise Demand
      </button>
      <span class="text-white/40">→</span>
      <button onclick="JalMissions.authorizeDispatch('MSN-SN02-01')" class="px-2 py-0.5 rounded bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 font-semibold transition cursor-pointer" title="2. Collector authorizes CVRP route">
        2. Dispatch
      </button>
      <span class="text-white/40">→</span>
      <button onclick="JalMissions.onDriverArrival('TN-SN-02')" class="px-2 py-0.5 rounded bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 font-semibold transition cursor-pointer" title="3. Driver reaches cistern">
        3. Arrive
      </button>
      <span class="text-white/40">→</span>
      <button onclick="simulateQuickHandshake()" class="px-2 py-0.5 rounded bg-green-500/30 hover:bg-green-500/50 text-green-200 font-semibold transition cursor-pointer" title="4. Sarpanch dual-key verify">
        4. Handshake
      </button>
      <span class="text-white/20">|</span>
      <button onclick="JalMissions.resetMissionsWorkflow()" class="px-1.5 py-0.5 rounded bg-red-500/20 hover:bg-red-500/40 text-red-200 font-semibold transition cursor-pointer" title="Reset to initial 7% critical state">
        Reset
      </button>
    `;

    document.body.appendChild(bar);
  }

})(window);
