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
// ===== DAILY REPORT =====

let entries = [];
let activeEntry = null;

// элементы
const addEntryBtn = document.getElementById("addEntryBtn");
const entriesContainer = document.getElementById("entriesContainer");
const noEntriesMessage = document.getElementById("noEntries");

// ===== RENDER =====

function renderEntries() {
  entriesContainer.innerHTML = "";

  if (entries.length === 0 && !activeEntry) {
    entriesContainer.appendChild(noEntriesMessage);
    return;
  }

  // рендер сохранённых
  entries.forEach((entry, index) => {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "40px 1fr 1fr 40px";
    row.style.marginBottom = "6px";

    // #
    const num = document.createElement("div");
    num.textContent = index + 1;

    // service
    const service = document.createElement("div");
    service.textContent = entry.service.toFixed(2);

    // tips
    const tips = document.createElement("div");
    tips.textContent = entry.tips.toFixed(2);

    // delete
    const del = document.createElement("button");
    del.textContent = "🗑";
    del.style.border = "none";
    del.style.background = "transparent";
    del.style.cursor = "pointer";

    del.addEventListener("click", () => {
      entries.splice(index, 1);
      renderEntries();
    });

    row.appendChild(num);
    row.appendChild(service);
    row.appendChild(tips);
    row.appendChild(del);

    entriesContainer.appendChild(row);
  });

  // активная строка
  if (activeEntry) {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "40px 1fr 1fr 40px";
    row.style.marginTop = "6px";

    const num = document.createElement("div");
    num.textContent = entries.length + 1;

    const serviceInput = document.createElement("input");
    serviceInput.type = "number";
    serviceInput.placeholder = "0";
    serviceInput.style.width = "90%";

    const tipsInput = document.createElement("input");
    tipsInput.type = "number";
    tipsInput.placeholder = "0";
    tipsInput.style.width = "90%";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "✔";
    saveBtn.style.border = "none";
    saveBtn.style.background = "transparent";
    saveBtn.style.cursor = "pointer";

    saveBtn.addEventListener("click", () => {
      const serviceVal = parseFloat(serviceInput.value) || 0;
      const tipsVal = parseFloat(tipsInput.value) || 0;

      if (serviceVal < 0 || tipsVal < 0) return;

      entries.push({
        service: serviceVal,
        tips: tipsVal,
      });

      activeEntry = null;
      renderEntries();
    });

    row.appendChild(num);
    row.appendChild(serviceInput);
    row.appendChild(tipsInput);
    row.appendChild(saveBtn);

    entriesContainer.appendChild(row);
  }
}

// ===== ADD ENTRY =====

addEntryBtn.addEventListener("click", () => {
  if (activeEntry) return;

  activeEntry = {};
  renderEntries();
});

// первый рендер
renderEntries();
