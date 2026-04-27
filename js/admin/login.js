const loginForm = document.querySelector(".js-login-form");
const emailInput = document.querySelector(".js-email");
const passwordInput = document.querySelector(".js-password");
const loginButton = document.querySelector(".js-login-btn");
const loginError = document.querySelector(".js-login-error");

if (AdminAuth.isLoggedIn()) {
  window.location.href = "./admin.html";
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginError.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    loginError.textContent = "Please enter email and password.";
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Signing in...";

  setTimeout(() => {
    const success = AdminAuth.login(email, password);
    if (success) {
      window.location.href = "./admin.html";
      return;
    }

    loginError.textContent = "Invalid email or password.";
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }, 500);
});
