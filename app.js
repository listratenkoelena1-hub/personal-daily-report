// ===== STATE =====
let isLoginMode = true;
let currentUser = null;

// ===== ELEMENTS =====

// Auth
const authScreen = document.getElementById("authScreen");
const mainScreen = document.getElementById("mainScreen");

const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");
const confirmInput = document.getElementById("authConfirmPassword");

const confirmWrap = document.getElementById("confirmWrap");

const authSubmitBtn = document.getElementById("authSubmitBtn");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

const authMessage = document.getElementById("authMessage");

// Main
const logoutBtn = document.getElementById("logoutBtn");

// ===== INIT =====

// Проверяем localStorage при загрузке
window.addEventListener("load", () => {
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showMain();
  } else {
    showAuth();
  }
});

// ===== SCREEN SWITCH =====

function showAuth() {
  authScreen.style.display = "block";
  mainScreen.style.display = "none";
}

function showMain() {
  authScreen.style.display = "none";
  mainScreen.style.display = "block";
}

// ===== MODE TOGGLE =====

toggleModeBtn.addEventListener("click", () => {
  isLoginMode = !isLoginMode;

  if (isLoginMode) {
    authSubmitBtn.textContent = "Sign in";
    toggleModeBtn.textContent = "Create account";
    confirmWrap.style.display = "none";
  } else {
    authSubmitBtn.textContent = "Create account";
    toggleModeBtn.textContent = "Sign in";
    confirmWrap.style.display = "block";
  }

  authMessage.textContent = "";
});

// ===== AUTH SUBMIT =====

authSubmitBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirm = confirmInput.value.trim();

  if (!email || !password) {
    authMessage.textContent = "Fill all fields";
    return;
  }

  if (!isLoginMode && password !== confirm) {
    authMessage.textContent = "Passwords do not match";
    return;
  }

  if (isLoginMode) {
    login(email, password);
  } else {
    register(email, password);
  }
});

// ===== FAKE AUTH (ПОКА БЕЗ FIREBASE) =====

function register(email, password) {
  const user = {
    email,
    password,
  };

  localStorage.setItem("user", JSON.stringify(user));
  currentUser = user;

  showMain();
}

function login(email, password) {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    authMessage.textContent = "User not found";
    return;
  }

  const user = JSON.parse(savedUser);

  if (user.email !== email || user.password !== password) {
    authMessage.textContent = "Wrong email or password";
    return;
  }

  currentUser = user;
  showMain();
}

// ===== LOGOUT =====

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  currentUser = null;

  showAuth();
});

// ===== FORGOT PASSWORD (ПОКА ПРОСТО ЗАГЛУШКА) =====

forgotPasswordBtn.addEventListener("click", () => {
  authMessage.textContent = "Password reset will be added later";
});
