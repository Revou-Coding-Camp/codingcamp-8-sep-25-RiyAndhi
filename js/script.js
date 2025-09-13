// ===== Utility =====
const $ = (sel) => document.querySelector(sel);

// ===== Navbar (mobile) =====
const hamburger = $("#hamburger");
const navMenu = $("#navMenu");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("show");
  });
}

// ===== Tahun Footer =====
$("#year").textContent = new Date().getFullYear();

// ===== Greeting Name =====
const nameHolder = $("#nameHolder");
const greetText = $("#greetText");
const changeNameBtn = $("#changeNameBtn");

function askName(initial = false) {
  const current = (localStorage.getItem("guest_name") || "").trim();
  let nm = current;
  if (initial && current) {
    // use stored name silently
    nm = current;
  } else {
    nm = prompt("Masukkan nama Anda:", current || "");
    if (nm === null) return; // user cancelled
    nm = nm.trim();
  }
  if (nm) {
    localStorage.setItem("guest_name", nm);
    nameHolder.textContent = nm;
    greetText.textContent = `Hi, ${nm} 👋`;
  }
}

// on load
document.addEventListener("DOMContentLoaded", () => {
  askName(true);
});

changeNameBtn.addEventListener("click", () => askName(false));

// ===== Form Validation & Output =====
const form = $("#contactForm");
const resultBox = $("#formResult");

const rules = {
  name: (v) => v.trim().length > 0 || "Nama tidak boleh kosong.",
  email: (v) => {
    if (!v.trim()) return "Email tidak boleh kosong.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(v) || "Format email tidak valid.";
  },
  phone: (v) => {
    if (!v.trim()) return "Nomor telepon tidak boleh kosong.";
    const digits = v.replace(/\D/g, "");
    return digits.length >= 10 || "Nomor telepon minimal 10 digit.";
  },
  message: (v) => v.trim().length > 0 || "Pesan tidak boleh kosong."
};

function setError(id, msg) {
  const el = document.getElementById(`err-${id}`);
  if (typeof msg === "string") el.textContent = msg;
  else el.textContent = ""; // valid
}

// Live validation (optional)
["name","email","phone","message"].forEach((field) => {
  const input = field === "message" ? $("#messageInput") : document.getElementById(field);
  input.addEventListener("input", () => {
    const res = rules[field](input.value);
    setError(field, res === true ? "" : res);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    name: $("#name").value,
    email: $("#email").value,
    phone: $("#phone").value,
    message: $("#messageInput").value
  };

  // Validate all
  let valid = true;
  Object.entries(data).forEach(([key, val]) => {
    const res = rules[key](val);
    if (res !== true) valid = false;
    setError(key, res === true ? "" : res);
  });

  if (!valid) {
    resultBox.classList.add("hidden");
    return;
  }

  // Show result
  resultBox.innerHTML = `
    <h3>Hasil Form</h3>
    <p><strong>Nama:</strong> ${escapeHTML(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHTML(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHTML(data.phone)}</p>
    <p><strong>Message:</strong> ${escapeHTML(data.message)}</p>
  `;
  resultBox.classList.remove("hidden");

  // optional: reset form
  form.reset();
});

// Simple escape to prevent HTML injection in preview
function escapeHTML(str){
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[s]));
}
