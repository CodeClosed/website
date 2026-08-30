/**
 * ============================================================================
 * WEBSITE 2 — MINIMALIST EDITORIAL JAVASCRIPT
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. THEME CONTROLLER (Defaults to Clean Light Paper Theme)
  // --------------------------------------------------------------------------
  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');

  const savedTheme = localStorage.getItem('vv_editorial_theme') || 'light';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', nextTheme);
      localStorage.setItem('vv_editorial_theme', nextTheme);
      showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} mode`);
    });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileNavToggle && mobileMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. COPY EMAIL TO CLIPBOARD WITH TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  function showToast(msg) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotification.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2400);
  }

  const copyButtons = document.querySelectorAll('.copy-email-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'vihaan.varshney@outlook.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Copied email to clipboard');
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. SMOOTH SCROLL OFFSET FOR STICKY HEADER
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. INTERACTIVE SECTION FILTER CONTROLLER (Skills, Projects, Education)
  // --------------------------------------------------------------------------
  const filterBars = document.querySelectorAll('.filter-pills-bar');

  filterBars.forEach((bar) => {
    const group = bar.getAttribute('data-filter-group');
    const buttons = bar.querySelectorAll('.filter-pill-btn');

    let targetItems = [];
    if (group === 'skills') {
      targetItems = document.querySelectorAll('.skills-cloud-layout .skill-category-row');
    } else if (group === 'projects') {
      targetItems = document.querySelectorAll('.projects-editorial-list .project-editorial-item');
    } else if (group === 'education') {
      targetItems = document.querySelectorAll('.timeline-editorial .timeline-row');
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Toggle active button state
        buttons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterValue = btn.getAttribute('data-filter');

        targetItems.forEach((item) => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.classList.remove('filter-item-hidden');
            item.classList.remove('filter-item-fade');
            void item.offsetWidth; // Trigger reflow for animation
            item.classList.add('filter-item-fade');
          } else {
            item.classList.add('filter-item-hidden');
            item.classList.remove('filter-item-fade');
          }
        });
      });
    });
  });

});
