document.addEventListener("DOMContentLoaded", () => {
  // Flag that JS is running
  document.body.classList.add("js-enabled");

  const themeToggle = document.getElementById("themeToggle");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  // --- Theme Logic ---
  try {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const applyTheme = (isDark) => {
      if (isDark) {
        document.body.classList.add("dark");
        if (themeToggle) themeToggle.textContent = "☀️";
      } else {
        document.body.classList.remove("dark");
        if (themeToggle) themeToggle.textContent = "🌙";
      }
      if (themeToggle) themeToggle.setAttribute("aria-pressed", isDark);
    };

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      applyTheme(true);
    } else {
      applyTheme(false);
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark");
        applyTheme(isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
      });
    }
  } catch (e) {
    console.warn("Theme logic failed:", e);
  }

  // --- Mobile Nav Logic ---
  try {
    if (navToggle && navMenu) {
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
    }
  } catch (e) {
    console.warn("Nav logic failed:", e);
  }

  // --- Scroll Reveal Animation ---
  try {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  } catch (e) {
    // If Observer fails, ensure everything is visible
    console.warn("Scroll reveal failed:", e);
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("active"));
  }
});
