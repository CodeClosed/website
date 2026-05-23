/* -------------------------------------------------------------
   THE VIHAAN VARSHNEY TIMES — INTERACTIVE LOGIC
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initDate();
  initTheme();
  initEmberCanvas();
  initBackToTop();
  initSidebar();
});

/* -------------------------------------------------------------
   1. MASTHEAD DATE INJECTION
   ------------------------------------------------------------- */
function initDate() {
  const dateEl = document.getElementById('currentDate');
  if (!dateEl) return;

  const now = new Date();
  
  // Format: SATURDAY, MAY 23, 2026
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const formattedDate = now.toLocaleDateString('en-US', options).toUpperCase();
  dateEl.textContent = formattedDate;
}

/* -------------------------------------------------------------
   2. CONTRAST THEME TOGGLER (DARK/LIGHT PRINT)
   ------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const themeIcon = toggleBtn.querySelector('.theme-icon');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    if (themeIcon) themeIcon.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    if (themeIcon) themeIcon.textContent = '🌙';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    if (themeIcon) {
      themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
  });
}

/* -------------------------------------------------------------
   3. FLOATING AMBER EMBERS (HTML5 CANVAS ENGINE)
   ------------------------------------------------------------- */
function initEmberCanvas() {
  const canvas = document.getElementById('emberCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const maxParticles = 65;

  // Track Mouse
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle Resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle Blueprint
  class EmberParticle {
    constructor() {
      this.reset(true); // Random y for startup
    }

    reset(initPhase = false) {
      this.x = Math.random() * canvas.width;
      this.y = initPhase ? Math.random() * canvas.height : canvas.height + 20;
      this.size = Math.random() * 2.5 + 1.2;
      this.speedY = -(Math.random() * 0.8 + 0.3); // Drifts upwards
      this.speedX = (Math.random() * 0.4 - 0.2); // Gentle sway
      
      // Warm amber hues
      const hue = Math.floor(Math.random() * 25) + 12; // 12 to 37 (Orange/Red/Amber)
      this.color = `hsla(${hue}, 88%, 55%, `;
      this.opacity = Math.random() * 0.6 + 0.3;
      this.fadeSpeed = Math.random() * 0.002 + 0.0005;
      
      // Micro sways
      this.angle = Math.random() * Math.PI * 2;
      this.angularVelocity = Math.random() * 0.02 - 0.01;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.angle) * 0.25;
      this.angle += this.angularVelocity;
      this.opacity -= this.fadeSpeed;

      // Mouse Proximity Interaction (Embers repel away from mouse)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          
          this.x += forceDirectionX * force * 3;
          this.y += forceDirectionY * force * 2; // Extra rise force
        }
      }

      // Reset when particle drifts off-screen or fades out completely
      if (this.y < -10 || this.opacity <= 0 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      
      // Shadow glow effect
      ctx.shadowColor = 'rgba(240, 130, 58, 0.4)';
      ctx.shadowBlur = this.size * 2;
      
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate Array
  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push(new EmberParticle());
    }
  }
  initParticles();

  // Animation Loop
  function animate() {
    // Clear with transparent wash to allow page background to show
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    
    requestAnimationFrame(animate);
  }
  animate();

  // Reinitialize on window resize to re-space particles
  window.addEventListener('resize', () => {
    initParticles();
  });
}

/* -------------------------------------------------------------
   4. BACK TO TOP BUTTON
   ------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  // Toggle button visibility based on scroll distance (threshold: 300px)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // Smooth scroll to top on click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* -------------------------------------------------------------
   5. RESPONSIVE SIDEBAR CABINET TOGGLES
   ------------------------------------------------------------- */
function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');
  const sidebar = document.getElementById('sidebarNav');
  const backdrop = document.getElementById('navBackdrop');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  if (!toggleBtn || !closeBtn || !sidebar || !backdrop) return;

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  // Event Listeners
  toggleBtn.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  backdrop.addEventListener('click', closeSidebar);

  // Close when clicking any sidebar link
  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  // Close on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
}

