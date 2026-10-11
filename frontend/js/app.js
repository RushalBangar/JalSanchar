/**
 * JalSanjeevani - Sovereign Portal Login Controller
 * Backed by Supabase PostgreSQL Database ('gov_users' table).
 *
 * Manages role switching, dynamic user loading from Supabase,
 * 1-tap demo sign-in, password visibility toggle, and error handling.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Elements
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitBtn = document.getElementById("btnSubmitLogin");
  const btnText = document.getElementById("btnText");
  const btnIcon = document.getElementById("btnIcon");
  const btnInstantDemo = document.getElementById("btnInstantDemo");

  // Role Tab Elements
  const tabCollector = document.getElementById("tabCollector");
  const tabDriver = document.getElementById("tabDriver");
  const tabPanchayat = document.getElementById("tabPanchayat");
  const roleTabs = [tabCollector, tabDriver, tabPanchayat];

  // Context Card Elements
  const contextRoleIcon = document.getElementById("contextRoleIcon");
  const contextRoleBadge = document.getElementById("contextRoleBadge");
  const contextRolePill = document.getElementById("contextRolePill");
  const contextId = document.getElementById("contextId");
  const contextName = document.getElementById("contextName");
  const contextJurisdiction = document.getElementById("contextJurisdiction");

  // Alert Box Elements
  const loginAlertBox = document.getElementById("loginAlertBox");
  const alertTitle = document.getElementById("alertTitle");
  const alertMessage = document.getElementById("alertMessage");

  // Password Visibility Toggle
  const btnTogglePassword = document.getElementById("btnTogglePassword");
  const pwdEyeIcon = document.getElementById("pwdEyeIcon");
  const pwdEyeText = document.getElementById("pwdEyeText");

  // Credentials Helper Drawer
  const btnToggleHelper = document.getElementById("btnToggleHelper");
  const helperDrawer = document.getElementById("helperDrawer");
  const helperChevron = document.getElementById("helperChevron");

  // State
  let activeRoleKey = "collector";

  // URL Query Parameters check
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get("redirect");
  const noticeParam = urlParams.get("notice");
  const isLogout = urlParams.get("logout");

  // If redirected due to protection guard, show alert
  if (noticeParam === "required" && redirectTarget) {
    showAlert("Authentication Required", `Please sign in to access ${redirectTarget.replace(".html", "").toUpperCase()} console.`, "info");
  } else if (isLogout === "true") {
    showAlert("Signed Out", "You have successfully signed out of the operational portal.", "info");
  }

  // 1. Fetch live user accounts dynamically from Supabase database
  if (window.JalAuth && window.JalAuth.fetchUsersFromSupabase) {
    await window.JalAuth.fetchUsersFromSupabase();
  }

  /**
   * Sets the active role tab and synchronizes UI with Supabase data
   */
  function setActiveRole(roleKey, shouldUpdateInputs = true) {
    if (!window.JalAuth) return;
    activeRoleKey = roleKey;
    const theme = window.JalAuth.ROLE_THEMES[roleKey] || window.JalAuth.ROLE_THEMES.collector;
    const supabaseUser = window.JalAuth.getUserByRole(roleKey);

    // Update active tab styles
    roleTabs.forEach(tab => {
      if (!tab) return;
      const isMatch = tab.getAttribute("data-role") === roleKey;
      tab.classList.toggle("active", isMatch);
      tab.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    // Update Context Card with Supabase User data if loaded, else fallback to theme
    const displayName = supabaseUser ? supabaseUser.name : (
      roleKey === "collector" ? "Shri. Rahul More, IAS" :
      roleKey === "driver" ? "Ramesh V. Patil" : "Sunita G. Deshmukh"
    );
    const displayBadgeId = supabaseUser ? (supabaseUser.badge_id || theme.roleBadge) : (
      roleKey === "collector" ? "Govt ID: MH-IAS-0419" :
      roleKey === "driver" ? "RTO: MH15-WT-881" : "Panchayat Reg: GP-SN-104"
    );
    const displayJurisdiction = supabaseUser ? (supabaseUser.jurisdiction || supabaseUser.village) : (
      roleKey === "collector" ? "Ahilyanagar & Sinnar Disaster Division" :
      roleKey === "driver" ? "Tanker TN-SN-02 (MH-15-TK-5512)" : "Khopadi Gram Panchayat (Sinnar)"
    );
    const displayEmail = supabaseUser ? supabaseUser.email : (
      roleKey === "collector" ? "collector@sinnar.jalsanjeevani.gov.in" :
      roleKey === "driver" ? "driver.mh15@sinnar.jalsanjeevani.gov.in" : "panchayat.khopadi@sinnar.jalsanjeevani.gov.in"
    );

    if (contextRoleIcon) contextRoleIcon.textContent = theme.icon || "verified_user";
    if (contextRoleBadge) contextRoleBadge.textContent = theme.roleBadge;
    if (contextRolePill) {
      contextRolePill.style.color = theme.badgeColor;
      contextRolePill.style.backgroundColor = `${theme.badgeColor}26`;
    }
    if (contextId) contextId.textContent = displayBadgeId;
    if (contextName) contextName.textContent = displayName;
    if (contextJurisdiction) contextJurisdiction.textContent = displayJurisdiction;

    // Update Input values if requested
    if (shouldUpdateInputs) {
      if (emailInput) emailInput.value = displayEmail;
      if (passwordInput && !passwordInput.value) {
        passwordInput.value = "sovereign_water_2025";
      }
    }

    // Update Submit Button Label
    if (btnText) {
      btnText.textContent = `Authorize & Enter ${theme.roleLabel} →`;
    }

    hideAlert();
  }

  // Wire Tab Click Events
  roleTabs.forEach(tab => {
    tab?.addEventListener("click", () => {
      const targetRole = tab.getAttribute("data-role");
      setActiveRole(targetRole, true);
    });
  });

  // Password Visibility Toggle
  btnTogglePassword?.addEventListener("click", () => {
    if (!passwordInput) return;
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");
    if (pwdEyeIcon) pwdEyeIcon.textContent = isPassword ? "visibility_off" : "visibility";
    if (pwdEyeText) pwdEyeText.textContent = isPassword ? "Hide" : "Show";
  });

  // Credentials Helper Drawer Toggle
  btnToggleHelper?.addEventListener("click", () => {
    if (!helperDrawer) return;
    const isHidden = helperDrawer.classList.contains("hidden");
    helperDrawer.classList.toggle("hidden", !isHidden);
    if (helperChevron) {
      helperChevron.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
    }
  });

  // Quick Fill from Helper Drawer Cards
  document.querySelectorAll(".helper-card").forEach(card => {
    card.addEventListener("click", () => {
      const fillRole = card.getAttribute("data-fill-role");
      if (fillRole) {
        setActiveRole(fillRole, true);
        passwordInput.value = "sovereign_water_2025";
        emailInput?.focus();
      }
    });
  });

  /**
   * Helper to display clean error/info alert
   */
  function showAlert(title, message, type = "error") {
    if (!loginAlertBox || !alertTitle || !alertMessage) return;
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    if (type === "info") {
      loginAlertBox.style.background = "rgba(0, 229, 255, 0.12)";
      loginAlertBox.style.borderColor = "rgba(0, 229, 255, 0.35)";
      loginAlertBox.style.color = "#38bdf8";
      const icon = loginAlertBox.querySelector(".alert-icon");
      if (icon) icon.style.color = "#00e5ff";
    } else {
      loginAlertBox.style.background = "rgba(239, 68, 68, 0.15)";
      loginAlertBox.style.borderColor = "rgba(239, 68, 68, 0.4)";
      loginAlertBox.style.color = "#fca5a5";
      const icon = loginAlertBox.querySelector(".alert-icon");
      if (icon) icon.style.color = "#ef4444";
    }

    loginAlertBox.classList.remove("hidden");
  }

  function hideAlert() {
    if (loginAlertBox) loginAlertBox.classList.add("hidden");
  }

  /**
   * Form Submission Handler - Authenticates with Supabase
   */
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlert();

      const email = emailInput?.value.trim() || "";
      const password = passwordInput?.value.trim() || "";

      if (!email || !password) {
        showAlert("Incomplete Credentials", "Please enter both service email and access key.");
        return;
      }

      // Enter Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = "Verifying with Supabase Cloud...";
        if (btnIcon) btnIcon.textContent = "sync";
        btnIcon?.classList.add("animate-spin");
      }

      try {
        const result = await window.JalAuth.login({
          email: email,
          password: password,
          role: activeRoleKey
        });

        if (result.success) {
          if (btnText) btnText.textContent = "Supabase Approved! Redirecting...";
          if (btnIcon) {
            btnIcon.classList.remove("animate-spin");
            btnIcon.textContent = "check_circle";
          }
          submitBtn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";

          const finalUrl = redirectTarget ? decodeURIComponent(redirectTarget) : result.redirect;
          setTimeout(() => {
            window.location.href = finalUrl;
          }, 450);
        } else {
          showAlert("Authentication Failed", result.message || "Invalid credentials or unauthorized role.");
          resetSubmitBtn();
        }
      } catch (err) {
        console.error("Login submission error:", err);
        showAlert("Connection Notice", "Verification failed against Supabase database. Please check connection.");
        resetSubmitBtn();
      }
    });
  }

  /**
   * Instant 1-Tap Demo Evaluation Button
   */
  if (btnInstantDemo) {
    btnInstantDemo.addEventListener("click", async () => {
      const theme = window.JalAuth.ROLE_THEMES[activeRoleKey] || window.JalAuth.ROLE_THEMES.collector;
      const supabaseUser = window.JalAuth.getUserByRole(activeRoleKey);
      const email = supabaseUser ? supabaseUser.email : (
        activeRoleKey === "collector" ? "collector@sinnar.jalsanjeevani.gov.in" :
        activeRoleKey === "driver" ? "driver.mh15@sinnar.jalsanjeevani.gov.in" : "panchayat.khopadi@sinnar.jalsanjeevani.gov.in"
      );

      if (emailInput) emailInput.value = email;
      if (passwordInput) passwordInput.value = "sovereign_water_2025";

      btnInstantDemo.disabled = true;
      btnInstantDemo.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Authorizing via Supabase...`;

      const result = await window.JalAuth.login({
        email: email,
        password: "sovereign_water_2025",
        role: activeRoleKey
      });

      if (result.success) {
        const finalUrl = redirectTarget ? decodeURIComponent(redirectTarget) : result.redirect;
        setTimeout(() => {
          window.location.href = finalUrl;
        }, 300);
      } else {
        showAlert("Supabase Auth Notice", result.message);
        btnInstantDemo.disabled = false;
        btnInstantDemo.innerHTML = `<span class="material-symbols-outlined text-[18px]">bolt</span> Instant 1-Tap Evaluation Sign-In`;
      }
    });
  }

  function resetSubmitBtn() {
    if (submitBtn) {
      submitBtn.disabled = false;
      const theme = window.JalAuth.ROLE_THEMES[activeRoleKey];
      if (btnText) btnText.textContent = `Authorize & Enter ${theme ? theme.roleLabel : 'Portal'} →`;
      if (btnIcon) {
        btnIcon.classList.remove("animate-spin");
        btnIcon.textContent = "login";
      }
      submitBtn.style.background = "";
    }
  }

  // Initialize with Collector or URL-specified role
  const urlRole = urlParams.get("role");
  if (urlRole && window.JalAuth.ROLE_THEMES[urlRole]) {
    setActiveRole(urlRole, true);
  } else {
    setActiveRole("collector", true);
  }
});
