/**
 * JalSanchar - Centralized Sovereign Auth Router
 * Handles dynamic role-based routing for authenticated government personas.
 */

async function routeAuthenticatedUser(user) {
  let role = (user && user.role) ? user.role.toLowerCase().trim() : '';

  // Check active session via JalAuth first
  if (!role && window.JalAuth) {
    const session = window.JalAuth.getSession();
    if (session && session.role) {
      role = session.role.toLowerCase().trim();
    }
  }

  // If role is still not resolved, query user profile safely through JalAuth backend API
  if (!role && window.JalAuth && typeof window.JalAuth.fetchUsersFromSupabase === "function") {
    try {
      const users = await window.JalAuth.fetchUsersFromSupabase();
      if (user && (user.id || user.email)) {
        const matched = Object.values(users).find(u => u.id === user.id || u.email === user.email);
        if (matched && matched.role) {
          role = matched.role.toLowerCase().trim();
        }
      }
    } catch (e) {
      console.warn("🔐 [AuthRouter] Profile fetch notice:", e.message);
    }
  }

  switch (role) {
    case 'collector':
      window.location.href = 'dashboard.html';
      break;
    case 'driver':
      window.location.href = 'driver.html';
      break;
    case 'panchayat':
      window.location.href = 'panchayat.html';
      break;
    default:
      window.location.href = 'panchayat.html';
  }
}

if (typeof window !== "undefined") {
  window.routeAuthenticatedUser = routeAuthenticatedUser;
}
