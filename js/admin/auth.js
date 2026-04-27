const AdminAuth = (() => {
  const SESSION_KEY = "shopco_admin_session";
  const ADMIN_EMAIL = "admin@shopco.com";
  const ADMIN_PASSWORD = "admin123";

  function login(email, password) {
    const ok = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    if (ok) {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ email, loggedInAt: Date.now() })
      );
    }
    return ok;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function isLoggedIn() {
    return Boolean(localStorage.getItem(SESSION_KEY));
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = "./admin-login.html";
    }
  }

  return { login, logout, isLoggedIn, requireAuth };
})();
