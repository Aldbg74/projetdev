
const root = document.documentElement;
const savedTheme = localStorage.getItem("novatech-theme");
if (savedTheme) root.dataset.theme = savedTheme;

const themeButton = document.querySelector("[data-theme-toggle]");
function updateThemeIcon() {
  if (!themeButton) return;
  themeButton.textContent = root.dataset.theme === "light" ? "☾" : "☀";
  themeButton.setAttribute("aria-label", root.dataset.theme === "light" ? "Activer le mode sombre" : "Activer le mode clair");
}
updateThemeIcon();

themeButton?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("novatech-theme", root.dataset.theme);
  updateThemeIcon();
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const currentPage = document.body.dataset.page;
document.querySelectorAll(".nav-links a[data-page]").forEach(link => {
  if (link.dataset.page === currentPage) link.setAttribute("aria-current", "page");
});

document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

const backToTop = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => {
  backToTop?.classList.toggle("visible", window.scrollY > 500);
});
backToTop?.addEventListener("click", () => window.scrollTo({top: 0, behavior: "smooth"}));

const observer = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: .08})
  : null;

document.querySelectorAll(".reveal").forEach(el => {
  if (observer) observer.observe(el);
  else el.classList.add("visible");
});

const form = document.querySelector("#contact-form");
if (form) {
  const status = document.querySelector("#form-status");
  const fields = [...form.querySelectorAll("[data-required]")];

  function setError(field, message) {
    const error = field.closest(".field")?.querySelector(".field-error");
    if (error) error.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(field) {
    const value = field.value.trim();
    if (!value) {
      setError(field, "Ce champ est obligatoire.");
      return false;
    }
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(field, "Saisissez une adresse e-mail valide.");
      return false;
    }
    if (field.type === "tel" && !/^[0-9+().\s-]{8,20}$/.test(value)) {
      setError(field, "Saisissez un numéro de téléphone valide.");
      return false;
    }
    setError(field, "");
    return true;
  }

  fields.forEach(field => field.addEventListener("blur", () => validateField(field)));

  form.addEventListener("submit", event => {
    event.preventDefault();
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      status.textContent = "Vérifiez les champs indiqués.";
      status.className = "form-status";
      return;
    }
    status.textContent = "Merci ! Votre demande a bien été préparée (formulaire de démonstration).";
    status.className = "form-status success";
    form.reset();
  });
}
