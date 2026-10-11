/**
 * JalSanjeevani - Centralized Sovereign Auth Router
 * Handles dynamic role-based routing for authenticated government personas.
 */

async function routeAuthenticatedUser(user) {
  let role = (user && user.role) ? user.role.toLowerCase().trim() : '';

  // If role isn't directly on user object, query Supabase user profile
  if (!role && window.supabaseClient && user && user.id) {
    try {
      const { data: profile } = await window.supabaseClient
        .from('gov_users')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile && profile.role) {
        role = profile.role.toLowerCase().trim();
      }
    } catch (e) {
      console.warn("🔐 [AuthRouter] Profile fetch notice:", e.message);
    }
  }

  // Fallback check against active session if still empty
  if (!role && window.JalAuth) {
    const session = window.JalAuth.getSession();
    if (session && session.role) {
      role = session.role.toLowerCase().trim();
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
