/**
 * JalSanjeevani (RouteGuard) - Sovereign Government Authentication & Session Guard
 * Connected to Supabase PostgreSQL ('gov_users' table).
 *
 * Provides:
 * 1. Role-Based Access Control (RBAC) queried directly from Supabase.
 * 2. Route Protection Guards for Collector, Driver, and Gram Panchayat consoles.
 * 3. Session Persistence (24h Cryptographic Token in localStorage).
 * 4. Tactical Top-Bar User Profile & Logout Widgets.
 */

(function (window) {
  "use strict";

  const STORAGE_KEY = "jalsanjeevani_gov_session";
  const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

  // Visual Theme Tokens mapped by role
  const ROLE_THEMES = {
    collector: {
      key: "collector",
      roleLabel: "District Collector",
      roleBadge: "LEVEL-1 AUTHORITY",
      badgeColor: "#00e5ff",
      icon: "shield_person",
      portalUrl: "dashboard.html"
    },
    driver: {
      key: "driver",
      roleLabel: "Tanker Pilot",
      roleBadge: "TACTICAL PWA",
      badgeColor: "#10b981",
      icon: "local_shipping",
      portalUrl: "driver.html"
    },
    panchayat: {
      key: "panchayat",
      roleLabel: "Gram Panchayat",
      roleBadge: "VERIFIER ENCLOSURE",
      badgeColor: "#f59e0b",
      icon: "account_balance",
      portalUrl: "panchayat.html"
    }
  };

  // Cached Supabase users loaded dynamically from the database
  let _cachedSupabaseUsers = {};

  const JalAuth = {
    ROLE_THEMES,

    /**
     * Resolves API host:
     * - Local development (http://localhost:8000 or http://127.0.0.1:8000)
     * - Production cloud host (Render)
     */
    getApiBase() {
      const origin = window.location.origin;
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return "http://127.0.0.1:8000";
      }
      return "https://jalsanjeevani.onrender.com";
    },

    /**
     * Dynamically fetches registered users from Supabase PostgreSQL ('gov_users' table).
     */
    async fetchUsersFromSupabase() {
      // 1. Try via frontend Supabase client if available
      if (window.JalSupabase && window.JalSupabase.client) {
        try {
          const { data, error } = await window.JalSupabase.client
            .from("gov_users")
            .select("id, email, role, name, title, badge_id, jurisdiction, portal_url, tanker_id, registration, driver_key, village, cistern_key, permissions, is_active")
            .eq("is_active", true);

          if (!error && data && data.length > 0) {
            _cachedSupabaseUsers = {};
            data.forEach(u => {
              _cachedSupabaseUsers[u.role] = u;
            });
            console.log("🔐 [JalAuth] Loaded users directly from Supabase 'gov_users' table:", data.length);
            return _cachedSupabaseUsers;
          }
        } catch (err) {
          console.warn("🔐 [JalAuth] Supabase direct query notice:", err);
        }
      }

      // 2. Try via FastAPI backend endpoint which queries Supabase
      try {
        const apiBase = this.getApiBase();
        const res = await fetch(`${apiBase}/api/auth/users`);
        if (res.ok) {
          const json = await res.json();
          if (json.users && json.users.length > 0) {
            _cachedSupabaseUsers = {};
            json.users.forEach(u => {
              _cachedSupabaseUsers[u.role] = u;
            });
            console.log("🔐 [JalAuth] Loaded users from Supabase via backend API:", json.users.length);
            return _cachedSupabaseUsers;
          }
        }
      } catch (err) {
        console.warn("🔐 [JalAuth] Backend API /api/auth/users notice:", err);
      }

      return _cachedSupabaseUsers;
    },

    /**
     * Gets user data for a specific role from the Supabase cache.
     */
    getUserByRole(roleKey) {
      return _cachedSupabaseUsers[roleKey] || null;
    },

    /**
     * Retrieves active authenticated session from localStorage, checking expiration.
     */
    getSession() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const session = JSON.parse(raw);
        if (!session || !session.expiresAt) {
          this.logout(false);
          return null;
        }
        if (Date.now() > session.expiresAt) {
          console.warn("🔐 [JalAuth] Session expired.");
          this.logout(false);
          return null;
        }
        return session;
      } catch (e) {
        console.error("🔐 [JalAuth] Session read error:", e);
        return null;
      }
    },

    /**
     * Returns true if user has a valid active session.
     */
    isAuthenticated() {
      return this.getSession() !== null;
    },

    /**
     * Returns current user metadata object from session.
     */
    getUser() {
      const session = this.getSession();
      return session ? session.user : null;
    },

    /**
     * Returns current role key: 'collector', 'driver', or 'panchayat'.
     */
    getRole() {
      const session = this.getSession();
      return session ? session.role : null;
    },

    /**
     * Checks if current user matches given role or one of multiple roles.
     */
    hasRole(roles) {
      const currentRole = this.getRole();
      if (!currentRole) return false;
      if (Array.isArray(roles)) {
        return roles.includes(currentRole);
      }
      return currentRole === roles;
    },

    /**
     * Authenticates user against Supabase PostgreSQL 'gov_users' table.
     */
    async login({ email, password, role }) {
      const cleanEmail = (email || "").trim().toLowerCase();
      const cleanPwd = (password || "").trim();
      const cleanRole = (role || "").trim().toLowerCase();

      // 1. Direct Supabase Client Query (Client-side directly to Supabase)
      if (window.JalSupabase && window.JalSupabase.client) {
        try {
          const { data, error } = await window.JalSupabase.client
            .from("gov_users")
            .select("*")
            .ilike("email", cleanEmail)
            .eq("is_active", true);

          if (!error && data && data.length > 0) {
            const userRecord = data[0];
            const storedPwd = userRecord.password_hash || userRecord.password;

            if (cleanPwd !== storedPwd) {
              return {
                success: false,
                message: "Invalid cryptographic access key. Access denied by Supabase."
              };
            }

            if (cleanRole && userRecord.role !== cleanRole) {
              return {
                success: false,
                message: `Account is registered in Supabase as ${userRecord.role.toUpperCase()}, not ${cleanRole.toUpperCase()}. Please switch tabs.`
              };
            }

            // Issue session token
            const session = {
              token: "JAL-SUPABASE-" + Math.random().toString(36).substring(2, 12).toUpperCase(),
              role: userRecord.role,
              data_source: "Supabase PostgreSQL (gov_users)",
              user: {
                id: userRecord.id,
                name: userRecord.name,
                title: userRecord.title,
                email: cleanEmail,
                role: userRecord.role,
                badge_id: userRecord.badge_id,
                jurisdiction: userRecord.jurisdiction || userRecord.village,
                tanker_id: userRecord.tanker_id,
                registration: userRecord.registration,
                driver_key: userRecord.driver_key,
                village: userRecord.village,
                cistern_key: userRecord.cistern_key,
                permissions: userRecord.permissions || []
              },
              loginAt: Date.now(),
              expiresAt: Date.now() + SESSION_TTL_MS
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
            console.log("🔐 [JalAuth] Authenticated directly via Supabase client:", userRecord.name);
            return { success: true, redirect: userRecord.portal_url || "dashboard.html", session };
          }
        } catch (supabaseErr) {
          console.warn("🔐 [JalAuth] Supabase direct auth failed, trying backend API:", supabaseErr);
        }
      }

      // 2. Query via Backend API (which queries Supabase server-side)
      try {
        const apiBase = this.getApiBase();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(`${apiBase}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password: cleanPwd, role: cleanRole || undefined }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const session = {
            token: data.token,
            role: data.role,
            data_source: data.data_source || "Supabase PostgreSQL",
            user: data.user,
            loginAt: Date.now(),
            expiresAt: Date.now() + SESSION_TTL_MS
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
          console.log("🔐 [JalAuth] Authenticated via FastAPI / Supabase API:", session.user.name);
          return { success: true, redirect: data.redirect_url, session };
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.detail || "Authentication rejected by Supabase.";
          return { success: false, message: errMsg };
        }
      } catch (apiErr) {
        console.error("🔐 [JalAuth] Authentication connection error:", apiErr);
        return {
          success: false,
          message: "Unable to reach Supabase database. Please ensure 'supabase_schema.sql' has been executed in the Supabase SQL Editor and internet connection is active."
        };
      }
    },

    /**
     * Signs out the user, removes session, and redirects to login portal.
     */
    logout(redirect = true) {
      localStorage.removeItem(STORAGE_KEY);
      console.log("🔐 [JalAuth] User logged out.");
      if (redirect) {
        window.location.href = "login.html?logout=true";
      }
    },

    /**
     * Route protection guard for HTML consoles.
     * Call at top of dashboard.html, driver.html, panchayat.html.
     */
    protectPage(allowedRoles = []) {
      const session = this.getSession();
      const currentPage = window.location.pathname.split("/").pop() || "index.html";

      if (!session) {
        console.warn(`🔐 [JalAuth] Unauthenticated attempt to access ${currentPage}. Redirecting to login.`);
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}&notice=required`;
        return false;
      }

      const userRole = session.role;
      // Allow Collector supervisory access over all operational consoles
      const hasAccess = allowedRoles.includes(userRole) || (userRole === "collector");

      if (!hasAccess) {
        console.warn(`🔐 [JalAuth] Role '${userRole}' not authorized for ${currentPage}. Required: [${allowedRoles.join(", ")}]`);
        alert(`Access Restricted: This console is designated for ${allowedRoles.join(" or ").toUpperCase()}. Redirecting you to your authorized portal.`);
        const targetUrl = session.user.portal_url || "login.html";
        window.location.href = targetUrl;
        return false;
      }

      return true;
    },

    /**
     * Mounts tactical user profile avatar pill and dropdown into navbar.
     */
    mountNavbarProfile(containerSelector = "#userProfileMount") {
      const container = typeof containerSelector === "string" 
        ? document.querySelector(containerSelector) 
        : containerSelector;
      
      if (!container) return;

      const session = this.getSession();
      if (!session) {
        container.innerHTML = `
          <a href="login.html" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-semibold text-xs hover:bg-tertiary-container transition-all shadow-sm">
            <span class="material-symbols-outlined text-[16px]">login</span>
            <span>Sign In</span>
          </a>
        `;
        return;
      }

      const u = session.user;
      const theme = ROLE_THEMES[session.role] || ROLE_THEMES.collector;
      const initials = (u.name || "Gov User")
        .split(" ")
        .filter(n => !n.includes("."))
        .slice(0, 2)
        .map(n => n[0])
        .join("") || "GV";

      container.innerHTML = `
        <div class="relative inline-block text-left" id="jalAuthProfileRoot">
          <!-- Profile Pill Button -->
          <button id="jalAuthProfileBtn" type="button" class="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-surface-container-high/90 hover:bg-surface-bright border border-white/10 hover:border-primary/40 transition-all cursor-pointer shadow-sm group" aria-haspopup="true" aria-expanded="false">
            <div class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-black shadow-inner" style="background: ${theme.badgeColor};">
              ${initials}
            </div>
            <div class="hidden sm:flex flex-col text-left leading-none">
              <span class="font-bold text-xs text-on-surface truncate max-w-[110px] md:max-w-[140px]">${u.name.split(",")[0]}</span>
              <span class="font-mono text-[9px] uppercase tracking-wider text-primary font-semibold">${theme.roleLabel}</span>
            </div>
            <span class="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">expand_more</span>
          </button>

          <!-- Dropdown Card -->
          <div id="jalAuthDropdown" class="hidden absolute right-0 mt-2 w-72 rounded-2xl bg-surface-panel/95 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.65)] py-3 px-3 z-50 text-left transition-all transform origin-top-right">
            <!-- User Info Header -->
            <div class="pb-3 border-b border-white/10">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-black shrink-0 shadow-md" style="background: ${theme.badgeColor};">
                  ${initials}
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="font-semibold text-sm text-on-surface truncate leading-snug">${u.name}</span>
                  <span class="text-[11px] text-on-surface-variant truncate">${u.title}</span>
                  <span class="font-mono text-[9px] text-primary uppercase font-bold tracking-wider mt-0.5">${u.badge_id || theme.roleBadge}</span>
                </div>
              </div>
              <div class="mt-2.5 px-2.5 py-1 rounded-md bg-surface-container text-[11px] font-mono text-on-surface-variant flex items-center gap-1.5 border border-white/5">
                <span class="material-symbols-outlined text-[14px] text-primary">database</span>
                <span class="truncate">Verified via Supabase Cloud</span>
              </div>
            </div>

            <!-- Portal Navigation Links -->
            <div class="py-2 flex flex-col gap-1 text-xs">
              <span class="text-[10px] font-mono uppercase text-on-surface-variant tracking-wider px-2 pt-1 font-semibold">Switch Portals</span>
              <a href="dashboard.html" class="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-on-surface transition-colors ${session.role === 'collector' ? 'bg-primary/10 text-primary font-semibold' : ''}">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">monitoring</span> Collector Command</span>
                ${session.role === 'collector' ? '<span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary text-black font-bold">Active</span>' : ''}
              </a>
              <a href="driver.html" class="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-on-surface transition-colors ${session.role === 'driver' ? 'bg-primary/10 text-primary font-semibold' : ''}">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">local_shipping</span> Driver Cockpit</span>
                ${session.role === 'driver' ? '<span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary text-black font-bold">Active</span>' : ''}
              </a>
              <a href="panchayat.html" class="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-on-surface transition-colors ${session.role === 'panchayat' ? 'bg-primary/10 text-primary font-semibold' : ''}">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">qr_code_scanner</span> Panchayat Verify</span>
                ${session.role === 'panchayat' ? '<span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary text-black font-bold">Active</span>' : ''}
              </a>
            </div>

            <!-- Sign Out Button -->
            <div class="pt-2 border-t border-white/10">
              <button id="jalAuthLogoutBtn" type="button" class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-alert-crimson/15 hover:bg-alert-crimson/25 text-alert-crimson font-semibold text-xs border border-alert-crimson/30 transition-all cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">logout</span>
                <span>Sign Out of Portal</span>
              </button>
            </div>
          </div>
        </div>
      `;

      // Event Listeners for dropdown
      const btn = document.getElementById("jalAuthProfileBtn");
      const dropdown = document.getElementById("jalAuthDropdown");
      const logoutBtn = document.getElementById("jalAuthLogoutBtn");

      if (btn && dropdown) {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          dropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", (e) => {
          if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.classList.add("hidden");
          }
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          JalAuth.logout(true);
        });
      }
    }
  };

  window.JalAuth = JalAuth;
})(window);
