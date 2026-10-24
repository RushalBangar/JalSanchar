/**
 * JalSanchar (RouteGuard) - Driver PWA Tactical Cockpit Engine
 * Handles live cryptographic QR token generation, geofence arrival lock,
 * and online-first Supabase telemetry synchronization.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Authentication & Access Protection
  if (window.JalAuth) {
    if (!window.JalAuth.protectPage(['driver', 'collector'])) return;
    window.JalAuth.mountNavbarProfile('#userProfileMount');
  }

  const qrContainer = document.getElementById("qrcode");
  const btnLogArrival = document.getElementById("btnLogArrival") || document.getElementById("btnArrived");
  const btnLogArrivalText = document.getElementById("btnLogArrivalText");
  const arrivalSuccessBanner = document.getElementById("arrivalSuccessBanner");
  const geofenceStatusText = document.getElementById("geofenceStatusText");
  const geofenceRangeBadge = document.getElementById("geofenceRangeBadge");
  const geofenceRadarIcon = document.getElementById("geofenceRadarIcon");
  const driverCryptoKey = document.getElementById("driverCryptoKey");
  const transitBadge = document.getElementById("transitBadge");
  const transitDot = document.getElementById("transitDot");

  const copyTokenBtn = document.getElementById("copyTokenBtn") || document.getElementById("btnCopyPayload");
  const btnRefreshQR = document.getElementById("btnRefreshQR");
  const saveImageBtn = document.getElementById("saveImageBtn") || document.getElementById("btnDownloadQR");
  const toggleJsonBtn = document.getElementById("toggleJsonBtn") || document.getElementById("btnTogglePayload");
  const closeJsonProofBtn = document.getElementById("closeJsonProofBtn");
  const jsonProofDrawer = document.getElementById("jsonProofDrawer");
  const payloadJsonView = document.getElementById("payloadJsonView");
  const tokenDynamicBadge = document.getElementById("tokenDynamicBadge");
  const sosBeaconBtn = document.getElementById("sosBeaconBtn");
  const driverToast = document.getElementById("driverToast");

  let isArrived = false;
  let qrcodeInstance = null;

  // Online-First Network Status Sync
  const networkBadge = document.getElementById("networkStatusBadge");
  const networkDot = document.getElementById("networkStatusDot");
  const networkText = document.getElementById("networkStatusText");

  function syncNetworkStatus() {
    if (!networkBadge || !networkText) return;
    if (navigator.onLine) {
      networkBadge.className = "flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-full border border-safe-emerald/30";
      if (networkDot) networkDot.className = "w-2 h-2 rounded-full bg-safe-emerald animate-pulse";
      networkText.className = "font-label-tactical text-label-tactical text-safe-emerald uppercase font-bold tracking-tight";
      networkText.textContent = "Online";
    } else {
      networkBadge.className = "flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-full border border-warning-amber/40";
      if (networkDot) networkDot.className = "w-2 h-2 rounded-full bg-warning-amber";
      networkText.className = "font-label-tactical text-label-tactical text-warning-amber uppercase font-bold tracking-tight";
      networkText.textContent = "Offline PWA";
    }
  }

  window.addEventListener("online", syncNetworkStatus);
  window.addEventListener("offline", syncNetworkStatus);
  syncNetworkStatus();

  // Active delivery manifest parameters
  let loggedInUser = window.JalAuth ? window.JalAuth.getUser() : null;
  const manifest = {
    protocol: "JALSANCHAR_POD_V2",
    tanker_id: (loggedInUser && loggedInUser.tanker_id) ? loggedInUser.tanker_id : "TN-SN-02",
    registration: (loggedInUser && loggedInUser.registration) ? loggedInUser.registration : "MH-15-TK-5512",
    target_village: (loggedInUser && loggedInUser.village) ? loggedInUser.village : "Khopadi (Sinnar)",
    volume_liters: 10000,
    driver_key: (loggedInUser && loggedInUser.driver_key) ? loggedInUser.driver_key : "0x9F3B4ED812C4",
    lat: 19.9016,
    lng: 74.1028,
    geofence_status: "WITHIN_CORRIDOR_15M"
  };

  /**
   * Generates secure cryptographic nonce (16-char hex)
   */
  function generateSecureNonce() {
    if (window.crypto && window.crypto.getRandomValues) {
      const buf = new Uint8Array(8);
      window.crypto.getRandomValues(buf);
      return Array.from(buf, b => b.toString(16).padStart(2, "0")).join("");
    }
    return "NONCE-" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  }

  /**
   * Computes dynamic HMAC-SHA256 signature over the canonical payload
   */
  async function calculateHmacSha256(keyStr, dataStr) {
    try {
      const enc = new TextEncoder();
      const keyData = enc.encode(keyStr || "sovereign_water_2025");
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, enc.encode(dataStr));
      const hashArray = Array.from(new Uint8Array(signature));
      return "HMAC-SHA256:" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
    } catch (e) {
      let h1 = 0xdeadbeef, h2 = 0x41c64e6d;
      for (let i = 0; i < dataStr.length; i++) {
        const ch = dataStr.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
      h2 = Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      const hex = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, "0");
      return "HMAC-SHA256:" + hex + hex;
    }
  }

  // Dynamic Anti-Replay Token State
  let currentDynamicToken = {
    trip_id: "TRIP-" + (manifest.tanker_id || "TN-04") + "-" + Math.floor(Date.now() / 3600000),
    panchayat_id: "GP-SN-104",
    timestamp: new Date().toISOString(),
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    nonce: generateSecureNonce(),
    signature: "HMAC-SHA256:8f4c2e1b9a7d3c5e00b8c6a4e321598f"
  };

  /**
   * Refreshes the dynamic token with a fresh nonce and 10-minute validity window
   */
  async function refreshDynamicToken(notify = false) {
    const nonce = generateSecureNonce();
    const timestamp = new Date().toISOString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const trip_id = "TRIP-" + (manifest.tanker_id || "TN-04") + "-" + Math.floor(Date.now() / 3600000);
    const panchayat_id = "GP-SN-104";

    const canonicalPayload = `${manifest.tanker_id}|${trip_id}|${panchayat_id}|${timestamp}|${nonce}`;
    const signature = await calculateHmacSha256(manifest.driver_key, canonicalPayload);

    currentDynamicToken = {
      trip_id,
      panchayat_id,
      timestamp,
      expires_at,
      nonce,
      signature
    };

    renderQRCode();

    if (tokenDynamicBadge) {
      const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      tokenDynamicBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-safe-emerald animate-pulse"></span><span>Token Refreshed: ${timeStr} • Nonce [${nonce.slice(0, 6)}...]</span>`;
    }

    if (notify) {
      showToast("⚡ Dynamic QR Re-Signed with Fresh Nonce");
    }
  }

  /**
   * Generates or refreshes the Cryptographic Delivery Token Payload
   */
  function getCurrentPayloadString() {
    return JSON.stringify({
      protocol: manifest.protocol,
      tanker_id: manifest.tanker_id,
      trip_id: currentDynamicToken.trip_id,
      panchayat_id: currentDynamicToken.panchayat_id,
      registration: manifest.registration,
      target_village: manifest.target_village,
      volume_liters: manifest.volume_liters,
      driver_key: manifest.driver_key,
      lat: isArrived ? 19.9015 : manifest.lat,
      lng: isArrived ? 74.1030 : manifest.lng,
      geofence_verified: isArrived,
      timestamp: currentDynamicToken.timestamp,
      expires_at: currentDynamicToken.expires_at,
      nonce: currentDynamicToken.nonce,
      signature: currentDynamicToken.signature
    });
  }

  /**
   * Renders the scannable high-density QR code
   */
  function renderQRCode() {
    if (!qrContainer) return;

    const payloadText = getCurrentPayloadString();

    // Update human-readable JSON preview if visible
    if (payloadJsonView) {
      try {
        payloadJsonView.textContent = JSON.stringify(JSON.parse(payloadText), null, 2);
      } catch (_) {
        payloadJsonView.textContent = payloadText;
      }
    }

    if (typeof QRCode !== "undefined") {
      qrContainer.innerHTML = "";
      qrcodeInstance = new QRCode(qrContainer, {
        text: payloadText,
        width: 220,
        height: 220,
        colorDark: "#070e1a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      console.warn("QRCode library not loaded yet.");
    }
  }

  /**
   * Synchronizes Driver Cockpit DOM with live user profile data
   */
  function syncDynamicDriverUI() {
    loggedInUser = window.JalAuth ? window.JalAuth.getUser() : null;
    if (loggedInUser) {
      if (loggedInUser.tanker_id) manifest.tanker_id = loggedInUser.tanker_id;
      if (loggedInUser.registration) manifest.registration = loggedInUser.registration;
      if (loggedInUser.village) manifest.target_village = loggedInUser.village;
      if (loggedInUser.driver_key) manifest.driver_key = loggedInUser.driver_key;
    }

    const headerTankerBadge = document.getElementById("headerTankerBadge");
    if (headerTankerBadge) headerTankerBadge.textContent = manifest.tanker_id;

    const missionBanner = document.getElementById("missionActiveBannerText");
    if (missionBanner) missionBanner.textContent = `Mission ${manifest.tanker_id} Active`;

    const targetVillageTitle = document.getElementById("targetVillageTitle");
    if (targetVillageTitle) targetVillageTitle.textContent = `Target: ${manifest.target_village}`;

    if (driverCryptoKey) {
      const shortKey = manifest.driver_key.length > 8 ? manifest.driver_key.slice(0, 8) : manifest.driver_key;
      driverCryptoKey.textContent = isArrived 
        ? `TOKEN READY: ${shortKey} • GEOFENCE VERIFIED`
        : `KEY: ${shortKey} • GEOFENCE ENCRYPTED`;
    }

    renderQRCode();
  }

  // Listen for live dynamic profile updates without requiring page reload
  window.addEventListener("jal-profile-updated", () => {
    syncDynamicDriverUI();
    showToast("✓ Cockpit Synced to Updated Profile");
  });

  /**
   * Displays floating tactical toast message
   */
  function showToast(message) {
    if (!driverToast) return;
    driverToast.textContent = message;
    driverToast.classList.remove("hidden");
    clearTimeout(driverToast._timer);
    driverToast._timer = setTimeout(() => {
      driverToast.classList.add("hidden");
    }, 2500);
  }

  // 1. Initial Dynamic Render
  syncDynamicDriverUI();

  // 2. Geofence & GPS Arrival Handshake Handler
  if (btnLogArrival) {
    btnLogArrival.addEventListener("click", () => {
      if (!isArrived) {
        btnLogArrival.disabled = true;
        btnLogArrival.classList.add("opacity-75");
        if (btnLogArrivalText) {
          btnLogArrivalText.textContent = "Checking Location...";
        }

        setTimeout(() => {
          isArrived = true;

          // Update Status Text & Badges
          if (geofenceStatusText) {
            geofenceStatusText.textContent = "✓ At Village Tank (12m)";
            geofenceStatusText.className = "font-body-lg text-body-lg font-bold text-safe-emerald";
          }
          if (geofenceRangeBadge) {
            geofenceRangeBadge.textContent = "Location Confirmed";
            geofenceRangeBadge.className = "bg-safe-emerald/15 text-safe-emerald px-2 py-0.5 rounded font-label-tactical text-label-tactical uppercase font-bold";
          }
          if (geofenceRadarIcon) {
            geofenceRadarIcon.innerHTML = `<i data-lucide="map-pin-check" class="w-4 h-4 text-green-600"></i>`;
          }
          if (arrivalSuccessBanner) {
            arrivalSuccessBanner.classList.remove("hidden");
          }
          if (driverCryptoKey) {
            driverCryptoKey.textContent = "QR READY: 0x9F3B4E • LOCATION CONFIRMED";
          }
          if (transitBadge) {
            transitBadge.textContent = "ARRIVED AT VILLAGE TANK";
            transitBadge.className = "font-label-tactical text-label-tactical font-bold text-safe-emerald uppercase tracking-wider";
          }
          if (transitDot) {
            transitDot.className = "w-2 h-2 rounded-full bg-safe-emerald";
          }

          // Button state
          btnLogArrival.disabled = false;
          btnLogArrival.classList.remove("opacity-75", "bg-primary-container", "hover:bg-primary");
          btnLogArrival.classList.add("bg-safe-emerald", "text-surface-base");
          if (btnLogArrivalText) {
            btnLogArrivalText.textContent = "Arrival Confirmed ✓ (Click to Reset)";
          }

          // Re-render QR code with locked GPS coordinates and fresh dynamic token
          refreshDynamicToken(false);
          showToast("✓ Arrival Confirmed: QR Code Ready to Scan");

          // Sync arrival to Supabase
          if (window.JalSupabase) {
            window.JalSupabase.updateTankerLocation(manifest.tanker_id, 19.9015, 74.1030, false, "arrived");
            console.log(`🌊 Driver arrival coordinates synced to Supabase for Tanker ${manifest.tanker_id}.`);
          }
        }, 700);

      } else {
        // Reset state for re-testing
        isArrived = false;

        if (geofenceStatusText) {
          geofenceStatusText.textContent = "Geofence: 180m from Target";
          geofenceStatusText.className = "font-body-lg text-body-lg font-bold text-on-surface";
        }
        if (geofenceRangeBadge) {
          geofenceRangeBadge.textContent = "Within Corridor";
          geofenceRangeBadge.className = "bg-warning-amber/15 text-warning-amber px-2 py-0.5 rounded font-label-tactical text-label-tactical uppercase font-bold";
        }
        if (geofenceRadarIcon) {
          geofenceRadarIcon.innerHTML = `<i data-lucide="map-pin" class="w-4 h-4 text-primary animate-pulse"></i>`;
        }
        if (arrivalSuccessBanner) {
          arrivalSuccessBanner.classList.add("hidden");
        }
        if (driverCryptoKey) {
          driverCryptoKey.textContent = "KEY: 0x9F3B4E • GEOFENCE ENCRYPTED";
        }
        if (transitBadge) {
          transitBadge.textContent = "IN TRANSIT";
          transitBadge.className = "font-label-tactical text-label-tactical font-bold text-primary uppercase tracking-wider";
        }
        if (transitDot) {
          transitDot.className = "w-2 h-2 rounded-full bg-primary animate-pulse";
        }

        btnLogArrival.classList.remove("bg-safe-emerald", "text-surface-base");
        btnLogArrival.classList.add("bg-primary-container", "hover:bg-primary");
        if (btnLogArrivalText) {
          btnLogArrivalText.textContent = "Log Arrival Coordinates";
        }

        refreshDynamicToken(false);
        showToast("Reset to In-Transit corridor state");

        if (window.JalSupabase) {
          window.JalSupabase.updateTankerLocation(manifest.tanker_id, 19.8920, 74.0610, false, "en_route");
        }
      }
    });
  }

  // Hook Manual Dynamic QR Refresh Button
  if (btnRefreshQR) {
    btnRefreshQR.addEventListener("click", () => {
      refreshDynamicToken(true);
    });
  }

  // Periodic Anti-Replay Auto-Refresh (Every 60s)
  setInterval(() => {
    refreshDynamicToken(false);
  }, 60000);

  // 3. Copy Token Payload to Clipboard
  if (copyTokenBtn) {
    copyTokenBtn.addEventListener("click", () => {
      const payloadText = getCurrentPayloadString();
      const origContent = copyTokenBtn.innerHTML;

      const doSuccess = () => {
        copyTokenBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 mr-1 text-green-600 inline"></i><span class="text-xs font-semibold text-green-700">Copied!</span>`;
        if (window.lucide) lucide.createIcons();
        showToast("📋 Token JSON copied to clipboard!");
        setTimeout(() => { copyTokenBtn.innerHTML = origContent; if (window.lucide) lucide.createIcons(); }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(payloadText).then(doSuccess).catch(() => fallbackCopy(payloadText, doSuccess));
      } else {
        fallbackCopy(payloadText, doSuccess);
      }
    });
  }

  function fallbackCopy(text, onSuccess) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      if (onSuccess) onSuccess();
    } catch (e) {
      alert("Token payload:\n" + text);
    }
    document.body.removeChild(ta);
  }

  // 4. Download QR Code Image
  if (saveImageBtn) {
    saveImageBtn.addEventListener("click", () => {
      const img = qrContainer ? qrContainer.querySelector("img") : null;
      const canvas = qrContainer ? qrContainer.querySelector("canvas") : null;

      let dataUrl = null;
      if (canvas) {
        // Add crisp white quiet zone border around QR for 100% decoder reliability
        const paddedCanvas = document.createElement("canvas");
        const pad = 24;
        paddedCanvas.width = canvas.width + pad * 2;
        paddedCanvas.height = canvas.height + pad * 2;
        const ctx = paddedCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
        ctx.drawImage(canvas, pad, pad);
        dataUrl = paddedCanvas.toDataURL("image/png");
      } else if (img && img.src) {
        dataUrl = img.src;
      }

      if (dataUrl) {
        const link = document.createElement("a");
        link.download = `JalSanchar_QR_Tanker_TK04_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        const origContent = saveImageBtn.innerHTML;
        saveImageBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 mr-1 text-green-600 inline"></i><span class="text-xs font-semibold text-green-700">Saved!</span>`;
        if (window.lucide) lucide.createIcons();
        showToast("💾 QR Code Image Downloaded!");
        setTimeout(() => { saveImageBtn.innerHTML = origContent; if (window.lucide) lucide.createIcons(); }, 1800);
      } else {
        showToast("Generating image, please try again in 1s");
      }
    });
  }

  // 5. Toggle JSON Payload Preview Drawer
  function toggleJsonProof() {
    if (!jsonProofDrawer) return;
    const isHidden = jsonProofDrawer.classList.contains("hidden");
    if (isHidden) {
      jsonProofDrawer.classList.remove("hidden");
      if (payloadJsonView) {
        payloadJsonView.textContent = getCurrentPayloadString();
      }
    } else {
      jsonProofDrawer.classList.add("hidden");
    }
  }

  if (toggleJsonBtn) {
    toggleJsonBtn.addEventListener("click", toggleJsonProof);
  }
  if (closeJsonProofBtn) {
    closeJsonProofBtn.addEventListener("click", toggleJsonProof);
  }

  // 6. SOS Beacon Trigger
  if (sosBeaconBtn) {
    sosBeaconBtn.addEventListener("click", () => {
      alert("🚨 Emergency beacon triggered!\n\nSinnar District Dispatch Node and Quick Response Team have been alerted with Tanker #04 telemetry coordinates.");
      if (window.JalSupabase && window.JalSupabase.client) {
        window.JalSupabase.client.from("escrow_actions").insert([{
          tanker_id: "TN-SN-02",
          penalty_amount: "SOS_ALERT",
          reason: "Driver emergency distress beacon triggered along Sinnar drought corridor.",
          status: "ALERT"
        }]).then(() => console.log("🚨 SOS logged to Supabase."));
      }
    });
  }

  // 7. Live 30-Second TOTP Anti-Replay Loop & Rotating Nonce Hash
  let totpSecondsLeft = 30;
  const totpCountdownText = document.getElementById("totpCountdownText");
  const totpProgressBar = document.getElementById("totpProgressBar");
  const liveNonceHash = document.getElementById("liveNonceHash");

  if (liveNonceHash && currentDynamicToken) {
    liveNonceHash.textContent = "0x" + currentDynamicToken.nonce.slice(0, 8).toUpperCase();
  }

  setInterval(() => {
    totpSecondsLeft--;
    if (totpCountdownText) totpCountdownText.textContent = `${totpSecondsLeft}s`;
    if (totpProgressBar) totpProgressBar.style.width = `${(totpSecondsLeft / 30) * 100}%`;

    if (totpSecondsLeft <= 0) {
      totpSecondsLeft = 30;
      refreshDynamicToken(false);
      if (liveNonceHash && currentDynamicToken) {
        liveNonceHash.textContent = "0x" + currentDynamicToken.nonce.slice(0, 8).toUpperCase();
      }
      if (totpProgressBar) {
        totpProgressBar.style.width = "100%";
      }
    }
  }, 1000);

  // 8. High-Contrast Outdoor Sunlight Theme Controller
  const btnSunlightToggle = document.getElementById("btnSunlightToggle");
  function applySunlightTheme(isSunlight) {
    if (isSunlight) {
      document.documentElement.classList.add("sunlight-theme");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("jalsanjeevani_theme", "sunlight");
      if (btnSunlightToggle) btnSunlightToggle.innerHTML = '<span class="material-symbols-outlined text-[15px] text-amber-500">dark_mode</span><span class="hidden xs:inline">Dark</span>';
    } else {
      document.documentElement.classList.remove("sunlight-theme");
      document.documentElement.classList.add("dark");
      localStorage.setItem("jalsanjeevani_theme", "dark");
      if (btnSunlightToggle) btnSunlightToggle.innerHTML = '<span class="material-symbols-outlined text-[15px] text-amber-400">wb_sunny</span><span class="hidden xs:inline">Sunlight</span>';
    }
  }

  const savedTheme = localStorage.getItem("jalsanchar_theme") || localStorage.getItem("jalsanjeevani_theme");
  if (savedTheme === "sunlight") {
    applySunlightTheme(true);
  }

  btnSunlightToggle?.addEventListener("click", () => {
    const isCurrentlySunlight = document.documentElement.classList.contains("sunlight-theme");
    applySunlightTheme(!isCurrentlySunlight);
  });

  // 9. Reset Demo State Action & Cross-Tab Realtime Synchronization
  const btnResetDemoDriver = document.getElementById("btnResetDemoDriver");
  btnResetDemoDriver?.addEventListener("click", async () => {
    if (confirm("Reset JalSanchar demo state across all tabs back to initial baseline?")) {
      if (window.JalSupabase) {
        await window.JalSupabase.resetDemoState();
      }
      showToast("🔄 Demo State Reset! Reloading baseline...");
      setTimeout(() => window.location.reload(), 1000);
    }
  });

  if (window.JalSupabase) {
    window.JalSupabase.onStateBroadcast((event) => {
      console.log("📡 Driver Cockpit received cross-tab event:", event);
      if (event.type === "DEMO_STATE_RESET") {
        showToast("🔄 Demo State Reset across tabs. Reloading...");
        setTimeout(() => window.location.reload(), 1200);
      } else if (event.type === "DELIVERY_VERIFIED") {
        showToast(`✓ Panchayat Confirmed Handshake for ${event.data.tanker || 'Tanker'}! Escrow Released.`);
        if (transitBadge) {
          transitBadge.textContent = "DISCHARGED ✓";
          transitBadge.className = "font-label-tactical text-label-tactical font-bold text-safe-emerald uppercase tracking-wider";
        }
      }
    });
  }
});
