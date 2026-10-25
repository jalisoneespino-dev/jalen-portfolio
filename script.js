/* ---------------------------------------------------------
   Navigation, theme controls, and contact form behavior.
   Yung file na ito ay ginagamit ang plain JavaScript with no framework or build step.
   --------------------------------------------------------- */

const pageNames = ["home", "about", "projects", "skills", "certifications", "contact"];
const navButtons = document.querySelectorAll("[data-view]");
const views = document.querySelectorAll("[data-page]");
const mobileNav = document.getElementById("mobile-nav");
const menuToggle = document.getElementById("menu-toggle");
const themeToggle = document.getElementById("theme-toggle");
const toast = document.getElementById("toast");
let toastTimer;

// Display a small status message without interrupting keyboard or screen-reader users.
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

// Switches to a distinct page panel and updates the URL hash for shareable navigation.
function showView(viewName, updateHash = true) {
  const targetName = pageNames.includes(viewName) ? viewName : "home";
  views.forEach((view) => {
    const isCurrent = view.dataset.page === targetName;
    view.classList.toggle("active", isCurrent);
    view.hidden = !isCurrent;
  });
  navButtons.forEach((button) => {
    const isCurrent = button.dataset.view === targetName;
    button.classList.toggle("active", isCurrent);
    if (isCurrent) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (updateHash && window.location.hash !== `#${targetName}`) {
    history.pushState({ view: targetName }, "", `#${targetName}`);
  }
  mobileNav.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

// Navigation buttons and any internal data-go link all use the same page switcher.
document.querySelectorAll("[data-view], [data-go]").forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    showView(control.dataset.view || control.dataset.go);
  });
});

// Support direct links such as index.html#projects and browser Back/Forward buttons.
window.addEventListener("popstate", () => showView(window.location.hash.slice(1), false));
window.addEventListener("hashchange", () => showView(window.location.hash.slice(1), false));
showView(window.location.hash.slice(1) || "home", false);

// Accessible responsive menu.
menuToggle.addEventListener("click", () => {
  const willOpen = mobileNav.hidden;
  mobileNav.hidden = !willOpen;
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
});

// Remember the selected color theme in local storage.
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.innerHTML = isDark ? "☼ <span>Light</span>" : "◐ <span>Dark</span>";
}
const savedTheme = localStorage.getItem("jalen-portfolio-theme");
applyTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("jalen-portfolio-theme", nextTheme);
});

// Repository URLs are intentionally blank until the owner adds the real repository links.
document.querySelectorAll("[data-repository]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("Repository link placeholder — add your project URL in index.html.");
  });
});

// The form creates an email draft locally. It does not collect or transmit data itself.
document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const service = String(formData.get("service") || "General inquiry");
  const message = String(formData.get("message") || "").trim();
  const body = [
    `Hello Jalen,`,
    ``,
    `My name is ${name}.`,
    `My email: ${email}`,
    phone ? `My phone: ${phone}` : "",
    `Service needed: ${service}`,
    ``,
    message || "(No additional message provided.)"
  ].filter(Boolean).join("\n");
  const mailto = `mailto:alistairbespino@gmail.com?subject=${encodeURIComponent(`Portfolio inquiry: ${service}`)}&body=${encodeURIComponent(body)}`;
  document.getElementById("form-note").textContent = "Your email app should open with a prepared draft. Review it before sending.";
  window.location.href = mailto;
});

// Keep the footer year current without manually editing it every January.
document.getElementById("current-year").textContent = new Date().getFullYear();
