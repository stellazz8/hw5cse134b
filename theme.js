const root = document.documentElement;
const toggle = document.querySelector("#theme-toggle");



if (toggle) {
  const stored = localStorage.getItem("theme") || "light";
  root.dataset.theme = stored;
  toggle.setAttribute("aria-pressed", stored === "dark");

  toggle.addEventListener("click", () => {
    const current = root.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";

    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    toggle.setAttribute("aria-pressed", next === "dark");
  });
}
