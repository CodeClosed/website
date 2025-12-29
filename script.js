document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  // --- Theme Logic ---
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const applyTheme = (isDark) => {
    if (isDark) {
      document.body.classList.add("dark");
      themeToggle.textContent = "☀️";
    } else {
      document.body.classList.remove("dark");
      themeToggle.textContent = "🌙";
    }
    themeToggle.setAttribute("aria-pressed", isDark);
  };

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark");
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // --- Mobile Nav Logic ---
  navToggle.addEventListener("click", () => {
    const isExpanded = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isExpanded);
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // --- Scroll Reveal Animation ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});