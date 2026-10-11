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

  // Auth Mode State & Elements
  let currentAuthMode = "signin"; // "signin" | "register"
  const modeSignInBtn = document.getElementById("modeSignInBtn");
  const modeRegisterBtn = document.getElementById("modeRegisterBtn");
  const registrationFields = document.getElementById("registrationFields");
  const groupFullName = document.getElementById("groupFullName");
  const regFullNameInput = document.getElementById("regFullName");
  const groupPhone = document.getElementById("groupPhone");
  const regPhoneInput = document.getElementById("regPhone");
  const roleSpecificContainer = document.getElementById("roleSpecificContainer");
  const roleSelectionWrapper = document.getElementById("roleSelectionWrapper");
  const formMetaRemember = document.getElementById("formMetaRemember");
  const portalTitle = document.getElementById("portalTitle");
  const portalDesc = document.getElementById("portalDesc");

  const fieldsCollector = document.getElementById("fieldsCollector");
  const fieldsDriver = document.getElementById("fieldsDriver");
  const fieldsPanchayat = document.getElementById("fieldsPanchayat");

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
      if (redirectTarget) {
        window.location.href = redirectTarget;
        return;
      }
      if (typeof window.routeAuthenticatedUser === "function") {
        window.routeAuthenticatedUser(session.user || { role: session.role });
        return;
      }
      const theme = window.JalAuth.ROLE_THEMES[session.role];
      if (theme) {
        window.location.href = theme.portalUrl;
        return;
      }
    }
  }

  // Role display info
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
   * Switches between Sign-In Mode and Register Mode
   * In Sign-In mode: strictly presents ONLY Email, Password, Remember Me, and Authorize button.
   */
  function setAuthMode(mode) {
    currentAuthMode = mode;
    const isRegister = mode === "register";
    const theme = window.JalAuth ? window.JalAuth.ROLE_THEMES[activeRoleKey] : null;

    if (modeSignInBtn) {
      modeSignInBtn.classList.toggle("active", !isRegister);
      modeSignInBtn.setAttribute("aria-selected", !isRegister ? "true" : "false");
    }
    if (modeRegisterBtn) {
      modeRegisterBtn.classList.toggle("active", isRegister);
      modeRegisterBtn.setAttribute("aria-selected", isRegister ? "true" : "false");
    }

    // Toggle registration fields container: STRICTLY HIDDEN in sign-in mode!
    if (registrationFields) {
      registrationFields.classList.toggle("hidden", !isRegister);
      registrationFields.style.display = isRegister ? "block" : "none";
    }

    // Toggle Remember Me checkbox (shown in sign-in, hidden in register)
    if (formMetaRemember) {
      formMetaRemember.classList.toggle("hidden", isRegister);
      formMetaRemember.style.display = isRegister ? "none" : "";
    }

    // Update Headings
    if (portalTitle) {
      portalTitle.textContent = isRegister ? "Register Operational Profile" : "Authorized Portal Access";
    }
    if (portalDesc) {
      portalDesc.textContent = isRegister 
        ? "Select your operational role and register your profile into the sovereign state database."
        : "Enter your government service email and cryptographic access key to sign in.";
    }

    // Update Role-Specific Field Blocks in Register Mode
    if (isRegister) {
      updateRoleFieldsBlock(activeRoleKey);
    }

    // Update Submit Button Label
    if (btnText) {
      btnText.textContent = isRegister
        ? `Register & Launch ${theme ? theme.roleLabel : 'Portal'} Console →`
        : "Authorize & Enter Console →";
    }

    // If switching to register, clear pre-filled email so user inputs real credentials
    if (isRegister) {
      if (emailInput && emailInput.value.includes("@sinnar.jalsanjeevani.gov.in")) {
        emailInput.value = "";
      }
    }

    hideAlert();
  }

  function updateRoleFieldsBlock(roleKey) {
    if (fieldsCollector) {
      const show = roleKey === "collector";
      fieldsCollector.classList.toggle("hidden", !show);
      fieldsCollector.style.display = show ? "block" : "none";
    }
    if (fieldsDriver) {
      const show = roleKey === "driver";
      fieldsDriver.classList.toggle("hidden", !show);
      fieldsDriver.style.display = show ? "block" : "none";
    }
    if (fieldsPanchayat) {
      const show = roleKey === "panchayat";
      fieldsPanchayat.classList.toggle("hidden", !show);
      fieldsPanchayat.style.display = show ? "block" : "none";
    }
  }

  modeSignInBtn?.addEventListener("click", () => setAuthMode("signin"));
  modeRegisterBtn?.addEventListener("click", () => setAuthMode("register"));

  /**
   * Sets the active role tab in registration mode
   */
  function setActiveRole(roleKey, shouldUpdateInputs = false) {
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

    // Update role fields block in register mode
    updateRoleFieldsBlock(roleKey);

    // Update Submit Button Label
    if (btnText) {
      btnText.textContent = currentAuthMode === "register"
        ? `Register & Launch ${theme.roleLabel} Console →`
        : "Authorize & Enter Console →";
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
   * Form Submission Handler — handles both Sign-In and Full Registration
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
        if (btnText) btnText.textContent = currentAuthMode === "register" ? "Registering whole profile..." : "Verifying credentials securely...";
        if (btnIcon) btnIcon.textContent = "sync";
        btnIcon?.classList.add("animate-spin");
      }

      try {
        let result;

        if (currentAuthMode === "register") {
          const fullName = regFullNameInput?.value.trim() || "";
          if (!fullName || fullName.length < 2) {
            showAlert("Incomplete Registration", "Please enter your full official name.");
            resetSubmitBtn();
            return;
          }

          const registerPayload = {
            role: activeRoleKey,
            name: fullName,
            email: email,
            phone: regPhoneInput?.value.trim() || "",
            password: password
          };

          // Role specific registration attributes
          if (activeRoleKey === "collector") {
            registerPayload.badge_id = document.getElementById("regCollectorBadge")?.value.trim();
            registerPayload.title = document.getElementById("regCollectorTitle")?.value.trim();
            registerPayload.jurisdiction = document.getElementById("regCollectorJurisdiction")?.value.trim();
          } else if (activeRoleKey === "driver") {
            registerPayload.tanker_id = document.getElementById("regDriverTankerId")?.value.trim();
            registerPayload.registration = document.getElementById("regDriverRegNumber")?.value.trim();
            registerPayload.driver_key = document.getElementById("regDriverKey")?.value.trim();
            registerPayload.village = document.getElementById("regDriverRoute")?.value.trim();
          } else if (activeRoleKey === "panchayat") {
            registerPayload.village = document.getElementById("regPanchayatVillage")?.value.trim();
            registerPayload.badge_id = document.getElementById("regPanchayatBadge")?.value.trim();
            registerPayload.cistern_key = document.getElementById("regPanchayatCisternKey")?.value.trim();
            registerPayload.title = document.getElementById("regPanchayatTitle")?.value.trim();
          }

          result = await window.JalAuth.register(registerPayload);
        } else {
          // Sign In Mode: Universal login by email and access key
          result = await window.JalAuth.login({
            email: email,
            password: password
          });
        }

        if (result.success) {
          if (btnText) btnText.textContent = currentAuthMode === "register" ? "Registered! Launching console..." : "Verified! Redirecting...";
          if (btnIcon) {
            btnIcon.classList.remove("animate-spin");
            btnIcon.textContent = "check_circle";
          }
          submitBtn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";

          if (redirectTarget) {
            const decoded = decodeURIComponent(redirectTarget);
            const userRole = (result.session && result.session.role) ? result.session.role.toLowerCase() : activeRoleKey;
            const isRoleTarget = (userRole === "collector") || decoded.toLowerCase().includes(userRole);
            if (isRoleTarget) {
              setTimeout(() => { window.location.href = decoded; }, 350);
              return;
            }
          }

          setTimeout(() => {
            if (typeof window.routeAuthenticatedUser === "function") {
              window.routeAuthenticatedUser(result.session ? result.session.user : { role: activeRoleKey });
            } else {
              window.location.href = result.redirect || "dashboard.html";
            }
          }, 350);
        } else {
          showAlert(currentAuthMode === "register" ? "Registration Notice" : "Authentication Failed", result.message || "Operation failed.");
          resetSubmitBtn();
        }
      } catch (err) {
        console.error("Auth form submission error:", err);
        showAlert("Connection Notice", "Operation failed. Please check your connection.");
        resetSubmitBtn();
      }
    });
  }


  function resetSubmitBtn() {
    if (submitBtn) {
      submitBtn.disabled = false;
      const theme = window.JalAuth ? window.JalAuth.ROLE_THEMES[activeRoleKey] : null;
      if (btnText) {
        btnText.textContent = currentAuthMode === "register"
          ? `Register & Launch ${theme ? theme.roleLabel : 'Portal'} Console →`
          : "Authorize & Enter Console →";
      }
      if (btnIcon) {
        btnIcon.classList.remove("animate-spin");
        btnIcon.textContent = "login";
      }
      submitBtn.style.background = "";
    }
  }

  // Initialize role and mode
  const urlRole = urlParams.get("role");
  if (urlRole && window.JalAuth && window.JalAuth.ROLE_THEMES[urlRole]) {
    setActiveRole(urlRole, false);
  } else {
    setActiveRole("collector", false);
  }

  const urlMode = urlParams.get("mode");
  if (urlMode === "register") {
    setAuthMode("register");
  } else {
    setAuthMode("signin");
  }
});
