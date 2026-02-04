document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  // --- Interactive Particles Animation ---
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = {
      x: null,
      y: null,
      radius: 150
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 4 + 2;
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.5 + 0.4;
        this.density = Math.random() * 30 + 1;
      }

      update() {
        // Move base position
        this.baseX += this.speedX;
        this.baseY += this.speedY;

        // Wrap around
        if (this.baseX < 0) this.baseX = canvas.width;
        if (this.baseX > canvas.width) this.baseX = 0;
        if (this.baseY < 0) this.baseY = canvas.height;
        if (this.baseY > canvas.height) this.baseY = 0;

        // Mouse interaction - repel particles
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.baseX;
          let dy = mouse.y - this.baseY;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = mouse.radius;
          let force = (maxDistance - distance) / maxDistance;

          if (distance < mouse.radius) {
            // Repel from mouse
            this.x = this.baseX - forceDirectionX * force * this.density;
            this.y = this.baseY - forceDirectionY * force * this.density;
            // Grow when near mouse
            this.size = this.baseSize + force * 3;
          } else {
            this.x = this.baseX;
            this.y = this.baseY;
            this.size = this.baseSize;
          }
        } else {
          this.x = this.baseX;
          this.y = this.baseY;
          this.size = this.baseSize;
        }
      }

      draw() {
        const isDark = document.body.classList.contains('dark');

        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = isDark ? 'rgba(255, 107, 53, 0.9)' : 'rgba(255, 69, 0, 0.7)';

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 107, 53, ${this.opacity})`
          : `rgba(255, 69, 0, ${this.opacity * 0.9})`;
        ctx.fill();

        ctx.shadowBlur = 0;
      }
    }

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    // Draw connections between particles and to mouse
    const drawConnections = () => {
      const isDark = document.body.classList.contains('dark');

      // Particle to particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(255, 107, 53, ${0.4 * (1 - distance / 100)})`
              : `rgba(255, 69, 0, ${0.3 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Connect particles to mouse
        if (mouse.x != null && mouse.y != null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(255, 200, 100, ${0.6 * (1 - distance / mouse.radius)})`
              : `rgba(255, 120, 50, ${0.5 * (1 - distance / mouse.radius)})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Draw mouse glow
      if (mouse.x != null && mouse.y != null) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 50);
        gradient.addColorStop(0, isDark ? 'rgba(255, 107, 53, 0.3)' : 'rgba(255, 69, 0, 0.2)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawConnections();

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // --- Typing Animation ---
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const phrases = [
      'B.Tech CSE (AI & ML) @ VIT Vellore',
      'Aspiring Software Developer',
      'Python • Java • JavaScript',
      'Problem Solver & Quick Learner'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 30 : 80;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before new phrase
      }

      setTimeout(type, typeSpeed);
    };
    setTimeout(type, 1000);
  }

  // --- Stats Counter Animation ---
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateStats = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.dataset.target);
          const isDecimal = stat.dataset.decimal === 'true';
          const duration = 2000;
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            stat.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              stat.textContent = isDecimal ? target.toFixed(2) : target;
            }
          };
          requestAnimationFrame(updateCount);
        });
        observer.unobserve(entry.target);
      }
    });
  };

  const statsObserver = new IntersectionObserver(animateStats, { threshold: 0.5 });
  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) statsObserver.observe(statsContainer);

  // --- Skills Progress Bar Animation ---
  const skillBars = document.querySelectorAll('.skill-progress');
  const animateSkills = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach((bar, index) => {
          setTimeout(() => {
            const progress = bar.dataset.progress;
            bar.style.width = progress + '%';
          }, index * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  };

  const skillsObserver = new IntersectionObserver(animateSkills, { threshold: 0.3 });
  const skillsSection = document.querySelector('.skills-categories');
  if (skillsSection) skillsObserver.observe(skillsSection);

  // --- Scroll Progress Indicator ---
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    });
  }

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



