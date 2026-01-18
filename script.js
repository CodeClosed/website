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
      closeMenu();
    });
  });

  const closeMenu = () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("open") &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu();
    }
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

  // --- Staggered Reveal for Tech Cards ---
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // distinct handling for grids vs standalone cards
        if (entry.target.classList.contains('tech-grid')) {
          const cards = entry.target.querySelectorAll(".tech-card");
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("visible");
            }, index * 100);
          });
        } else if (entry.target.classList.contains('tech-card')) {
          entry.target.classList.add("visible");
        }

        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const techGrids = document.querySelectorAll(".tech-grid");
  techGrids.forEach(grid => staggerObserver.observe(grid));

  //Also observe standalone tech cards (like in About section) that aren't in a grid
  // We treat them as a "grid of one" for the animation logic
  const independentCards = document.querySelectorAll(".tech-card:not(.tech-grid .tech-card)");
  independentCards.forEach(card => {
    // For single cards, we just add the class directly when visible, reusing the observer is tricky without refactor
    // Since we already have a generic reveal observer, let's just make sure cards have .reveal too if needed
    // Or just treat them as generic reveals.
    // For simplicity given current code:
    card.classList.add("reveal");
    observer.observe(card);
  });

  // --- Education Timeline Logic ---
  const timeline = document.querySelector('.tech-timeline');
  const prevBtn = document.querySelector('.nav-arrow.prev');
  const nextBtn = document.querySelector('.nav-arrow.next');
  const dotsContainer = document.querySelector('.timeline-dots');
  const items = document.querySelectorAll('.timeline-item');

  if (timeline && items.length > 0) {
    // 1. Generate Dots
    items.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot-indicator');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        items[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot-indicator');

    // 2. Active State & Arrow Updating
    const updateActiveState = () => {
      const scrollLeft = timeline.scrollLeft;
      const containerWidth = timeline.clientWidth;
      // Calculate center point or use index logic
      // Simple approach: which item center is closest to container center
      let activeIndex = 0;
      let minDistance = Infinity;

      items.forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const containerCenter = scrollLeft + containerWidth / 2;
        const dist = Math.abs(containerCenter - itemCenter);
        if (dist < minDistance) {
          minDistance = dist;
          activeIndex = index;
        }
      });

      // Update Dots
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));

      // Update Arrows
      prevBtn.disabled = activeIndex === 0;
      nextBtn.disabled = activeIndex === items.length - 1;
    };

    timeline.addEventListener('scroll', () => {
      // Debounce? Or just run. Scroll isn't too heavy here.
      window.requestAnimationFrame(updateActiveState);
    });

    // Initial call
    updateActiveState();

    // 3. Arrow Navigation
    const scrollToItem = (index) => {
      if (index >= 0 && index < items.length) {
        items[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    };

    prevBtn.addEventListener('click', () => {
      // Find current active index and go -1
      const currentDot = document.querySelector('.dot-indicator.active');
      const dotsArray = Array.from(dots);
      let index = dotsArray.indexOf(currentDot);
      scrollToItem(index - 1);
    });

    nextBtn.addEventListener('click', () => {
      const currentDot = document.querySelector('.dot-indicator.active');
      const dotsArray = Array.from(dots);
      let index = dotsArray.indexOf(currentDot);
      scrollToItem(index + 1);
    });

    // 4. Click to Scroll on Cards
    items.forEach(item => {
      item.addEventListener('click', () => {
        item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });

    // 5. Drag to Scroll (Upgraded)
    let isDown = false;
    let startX;
    let scrollLeft;

    timeline.addEventListener('mousedown', (e) => {
      isDown = true;
      timeline.classList.add('active');
      startX = e.pageX - timeline.offsetLeft;
      scrollLeft = timeline.scrollLeft;
    });

    timeline.addEventListener('mouseleave', () => {
      isDown = false;
      timeline.classList.remove('active');
    });

    timeline.addEventListener('mouseup', () => {
      isDown = false;
      timeline.classList.remove('active');
      // Snap logic handles finish
    });

    timeline.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - timeline.offsetLeft;
      const walk = (x - startX) * 2;
      timeline.scrollLeft = scrollLeft - walk;
    });
  }
});