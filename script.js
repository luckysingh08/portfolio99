// EDIT: your email address (the contact form opens an email to this address)
const EMAIL = "your.email@example.com";

const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

// Theme: light or dark, remembered between visits
function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "Light" : "Dark";
  try { localStorage.setItem("theme", theme); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeBtn.addEventListener("click", () => {
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// Highlight the nav link for the section on screen
const links = [...nav.querySelectorAll("a")];
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));

// Browser mockup tilts toward the pointer
const browser = document.getElementById("browser");
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (browser && !calm) {
  document.getElementById("top").addEventListener("pointermove", (e) => {
    const r = browser.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
    const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
    browser.style.setProperty("--ry", (x * 14).toFixed(2) + "deg");
    browser.style.setProperty("--rx", (-y * 14).toFixed(2) + "deg");
  });
  document.getElementById("top").addEventListener("pointerleave", () => {
    browser.style.setProperty("--rx", "0deg");
    browser.style.setProperty("--ry", "0deg");
  });
}

// Contact form: opens the visitor's email app with the message filled in
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = encodeURIComponent(e.target.name.value);
  const body = encodeURIComponent(e.target.message.value + "\n\n" + e.target.name.value);
  window.location.href = `mailto:${EMAIL}?subject=Website%20enquiry%20from%20${name}&body=${body}`;
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();