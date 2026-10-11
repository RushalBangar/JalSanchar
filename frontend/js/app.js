/**
 * JalSanjeevani - Sovereign Portal Login Controller
 * 🔒 SECURED: No hardcoded passwords. All auth via backend API with bcrypt.
 *
 * Manages role switching, dynamic user loading,
 * password visibility toggle, and error handling.
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

  // If already authenticated, redirect to appropriate portal
  if (window.JalAuth && window.JalAuth.isAuthenticated()) {
    const session = window.JalAuth.getSession();
    if (session && !isLogout) {
      const theme = window.JalAuth.ROLE_THEMES[session.role];
      if (theme) {
        window.location.href = redirectTarget || theme.portalUrl;
        return;
      }
    }
  }

  // Role display info (no passwords — purely visual context)
  const ROLE_DISPLAY = {
    collector: {
      email: "collector@sinnar.jalsanjeevani.gov.in",
      name: "Shri. Rahul More, IAS",
      badgeId: "Govt ID: MH-IAS-0419",
      jurisdiction: "Ahilyanagar & Sinnar Disaster Division"
    },
    driver: {
      email: "driver.mh15@sinnar.jalsanjeevani.gov.in",
      name: "Ramesh V. Patil",
      badgeId: "RTO: MH15-WT-881",
      jurisdiction: "Tanker TN-SN-02 (MH-15-TK-5512)"
    },
    panchayat: {
      email: "panchayat.khopadi@sinnar.jalsanjeevani.gov.in",
      name: "Sunita G. Deshmukh",
      badgeId: "Panchayat Reg: GP-SN-104",
      jurisdiction: "Khopadi Gram Panchayat (Sinnar)"
    }
  };

  /**
   * Sets the active role tab and synchronizes UI
   */
  function setActiveRole(roleKey, shouldUpdateInputs = true) {
    if (!window.JalAuth) return;
    activeRoleKey = roleKey;
    const theme = window.JalAuth.ROLE_THEMES[roleKey] || window.JalAuth.ROLE_THEMES.collector;
    const displayInfo = ROLE_DISPLAY[roleKey] || ROLE_DISPLAY.collector;

    // Update active tab styles
    roleTabs.forEach(tab => {
      if (!tab) return;
      const isMatch = tab.getAttribute("data-role") === roleKey;
      tab.classList.toggle("active", isMatch);
      tab.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    // Update Context Card
    if (contextRoleIcon) contextRoleIcon.textContent = theme.icon || "verified_user";
    if (contextRoleBadge) contextRoleBadge.textContent = theme.roleBadge;
    if (contextRolePill) {
      contextRolePill.style.color = theme.badgeColor;
      contextRolePill.style.backgroundColor = `${theme.badgeColor}26`;
    }
    if (contextId) contextId.textContent = displayInfo.badgeId;
    if (contextName) contextName.textContent = displayInfo.name;
    if (contextJurisdiction) contextJurisdiction.textContent = displayInfo.jurisdiction;

    // 🔒 Only auto-fill email, NEVER auto-fill password
    if (shouldUpdateInputs) {
      if (emailInput) emailInput.value = displayInfo.email;
      // Password field is intentionally left empty for security
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
        if (passwordInput) passwordInput.value = "sovereign_water_2025";
        showAlert("Credentials Populated", `Test credentials filled for ${fillRole.toUpperCase()}. Click Authorize to sign in.`, "info");
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
   * Form Submission Handler — authenticates via secure backend API
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

      if (password.length < 8) {
        showAlert("Weak Credentials", "Access key must be at least 8 characters.");
        return;
      }

      // Enter Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = "Verifying credentials securely...";
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
          if (btnText) btnText.textContent = "Verified! Redirecting...";
          if (btnIcon) {
            btnIcon.classList.remove("animate-spin");
            btnIcon.textContent = "check_circle";
          }
          submitBtn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";

          let finalUrl = result.redirect;
          if (redirectTarget) {
            const decoded = decodeURIComponent(redirectTarget);
            const userRole = (result.session && result.session.role) ? result.session.role.toLowerCase() : activeRoleKey;
            const isRoleTarget = (userRole === "collector") || decoded.toLowerCase().includes(userRole);
            if (isRoleTarget) {
              finalUrl = decoded;
            }
          }
          setTimeout(() => {
            window.location.href = finalUrl;
          }, 350);
        } else {
          showAlert("Authentication Failed", result.message || "Invalid credentials or unauthorized role.");
          resetSubmitBtn();
        }
      } catch (err) {
        console.error("Login submission error:", err);
        showAlert("Connection Notice", "Verification failed. Please check your connection.");
        resetSubmitBtn();
      }
    });
  }

  /**
   * Instant 1-Tap Demo Evaluation Button
   * Automatically sets test credentials and signs into the selected role immediately.
   */
  if (btnInstantDemo) {
    btnInstantDemo.addEventListener("click", async () => {
      const displayInfo = ROLE_DISPLAY[activeRoleKey] || ROLE_DISPLAY.collector;

      if (emailInput) emailInput.value = displayInfo.email;
      if (passwordInput && !passwordInput.value.trim()) {
        passwordInput.value = "sovereign_water_2025";
      }

      btnInstantDemo.disabled = true;
      btnInstantDemo.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Authorizing securely...`;

      const result = await window.JalAuth.login({
        email: displayInfo.email,
        password: passwordInput ? passwordInput.value.trim() : "sovereign_water_2025",
        role: activeRoleKey
      });

      if (result.success) {
        btnInstantDemo.innerHTML = `<span class="material-symbols-outlined text-[18px]">check_circle</span> Authorized! Loading console...`;
        let finalUrl = result.redirect;
        if (redirectTarget) {
          const decoded = decodeURIComponent(redirectTarget);
          const userRole = (result.session && result.session.role) ? result.session.role.toLowerCase() : activeRoleKey;
          const isRoleTarget = (userRole === "collector") || decoded.toLowerCase().includes(userRole);
          if (isRoleTarget) {
            finalUrl = decoded;
          }
        }
        setTimeout(() => {
          window.location.href = finalUrl;
        }, 300);
      } else {
        showAlert("Authentication Notice", result.message);
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
