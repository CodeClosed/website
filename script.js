/**
 * ============================================================================
 * VIHAAN VARSHNEY — PORTFOLIO INTERACTIONS
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // --------------------------------------------------------------------------
  // 1. THEME CONTROLLER (Preserves vv_editorial_theme + updates aria-pressed)
  // --------------------------------------------------------------------------
  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function syncThemeUI(theme) {
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#09090b' : '#fafaf9');
    }
  }

  const initialTheme = htmlRoot.getAttribute('data-theme') || localStorage.getItem('vv_editorial_theme') || 'light';
  htmlRoot.setAttribute('data-theme', initialTheme);
  syncThemeUI(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', nextTheme);
      localStorage.setItem('vv_editorial_theme', nextTheme);
      syncThemeUI(nextTheme);
      showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} mode`);
    });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function setMobileMenuState(isOpen) {
    if (!mobileNavToggle || !mobileMenu) return;
    mobileMenu.classList.toggle('open', isOpen);
    mobileNavToggle.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
      mobileMenu.removeAttribute('inert');
    } else {
      mobileMenu.setAttribute('inert', '');
    }
  }

  if (mobileNavToggle && mobileMenu) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !mobileMenu.classList.contains('open');
      setMobileMenuState(isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        setMobileMenuState(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !mobileNavToggle.contains(e.target)
      ) {
        setMobileMenuState(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        setMobileMenuState(false);
        mobileNavToggle.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. COPY EMAIL TO CLIPBOARD WITH TOAST & INLINE BUTTON FEEDBACK
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
    const labelSpan = btn.querySelector('span');
    const originalLabel = labelSpan ? labelSpan.textContent : btn.textContent;
    let feedbackTimeout = null;

    function showInlineCopied() {
      if (labelSpan) {
        labelSpan.textContent = 'Copied!';
      } else {
        btn.textContent = 'Copied!';
      }
      clearTimeout(feedbackTimeout);
      feedbackTimeout = setTimeout(() => {
        if (labelSpan) {
          labelSpan.textContent = originalLabel;
        } else {
          btn.textContent = originalLabel;
        }
      }, 2000);
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'vihaan.varshney@outlook.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Copied email to clipboard');
          showInlineCopied();
        }).catch(() => {
          showToast(`Email: ${email}`);
        });
      } else {
        showToast(`Email: ${email}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. SMOOTH SCROLL OFFSET FOR STICKY HEADER
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (targetEl.classList.contains('reveal-target')) {
          targetEl.classList.add('is-visible');
        }
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. INTERACTIVE SECTION FILTER CONTROLLER + KEYBOARD NAVIGATION
  // --------------------------------------------------------------------------
  const filterBars = document.querySelectorAll('.filter-pills-bar');

  filterBars.forEach((bar) => {
    const group = bar.getAttribute('data-filter-group');
    const buttons = Array.from(bar.querySelectorAll('.filter-pill-btn'));

    let targetItems = [];
    if (group === 'skills') {
      targetItems = document.querySelectorAll('.skills-cloud-layout .skill-category-row');
    } else if (group === 'projects') {
      targetItems = document.querySelectorAll('.projects-editorial-list .project-editorial-item');
    } else if (group === 'education') {
      targetItems = document.querySelectorAll('.timeline-editorial .timeline-row');
    }

    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filterValue = btn.getAttribute('data-filter');

        targetItems.forEach((item) => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.classList.remove('filter-item-hidden');
            item.classList.remove('filter-item-fade');
            if (!prefersReducedMotion.matches) {
              void item.offsetWidth;
              item.classList.add('filter-item-fade');
            }
          } else {
            item.classList.add('filter-item-hidden');
            item.classList.remove('filter-item-fade');
          }
        });
      });

      btn.addEventListener('keydown', (e) => {
        let nextIdx = null;
        if (e.key === 'ArrowRight') {
          nextIdx = (idx + 1) % buttons.length;
        } else if (e.key === 'ArrowLeft') {
          nextIdx = (idx - 1 + buttons.length) % buttons.length;
        } else if (e.key === 'Home') {
          nextIdx = 0;
        } else if (e.key === 'End') {
          nextIdx = buttons.length - 1;
        }

        if (nextIdx !== null) {
          e.preventDefault();
          buttons[nextIdx].focus();
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. ACCORDION DETAILS TOGGLER & PRINT EXPANSION
  // --------------------------------------------------------------------------
  const accordions = document.querySelectorAll('.experience-accordion');
  accordions.forEach((acc) => {
    const toggleText = acc.querySelector('.toggle-text');
    acc.addEventListener('toggle', () => {
      if (toggleText) {
        toggleText.textContent = acc.open ? 'Collapse' : 'Details';
      }
    });
  });

  const summaryLinks = document.querySelectorAll('.exp-accordion-header a');
  summaryLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  let printAccordionStates = [];
  window.addEventListener('beforeprint', () => {
    printAccordionStates = Array.from(accordions).map((acc) => {
      const wasOpen = acc.open;
      acc.open = true;
      return { acc, wasOpen };
    });
  });

  window.addEventListener('afterprint', () => {
    printAccordionStates.forEach(({ acc, wasOpen }) => {
      acc.open = wasOpen;
    });
    printAccordionStates = [];
  });

  const printPdfBtn = document.getElementById('printPdfBtn');
  if (printPdfBtn) {
    printPdfBtn.addEventListener('click', () => {
      showToast('Preparing print view...');
      setTimeout(() => {
        window.print();
      }, 150);
    });
  }

  // --------------------------------------------------------------------------
  // 7. ACTIVE NAV SCROLL-SPY (IntersectionObserver)
  // --------------------------------------------------------------------------
  const spySections = Array.from(document.querySelectorAll('main > section[id]'));
  const navLinksAll = document.querySelectorAll('.site-nav .nav-link, #mobileMenu .mobile-nav-link');

  function setActiveNavLink(sectionId) {
    navLinksAll.forEach((link) => {
      const href = link.getAttribute('href');
      const isMatch = sectionId && sectionId !== 'home' && href === `#${sectionId}`;
      link.classList.toggle('active', Boolean(isMatch));
      if (isMatch) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window && spySections.length > 0) {
    const visibleRatios = new Map();
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let activeId = null;
        let maxRatio = 0;
        for (const sec of spySections) {
          const ratio = visibleRatios.get(sec.id) || 0;
          if (ratio > maxRatio) {
            maxRatio = ratio;
            activeId = sec.id;
          }
        }

        if (activeId) {
          setActiveNavLink(activeId);
        }
      },
      {
        rootMargin: '-70px 0px -45% 0px',
        threshold: [0, 0.15, 0.35, 0.6]
      }
    );

    spySections.forEach((sec) => spyObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 8. SUBTLE SCROLL-TRIGGERED REVEALS (Disabled when reduced-motion active)
  // --------------------------------------------------------------------------
  const revealTargets = Array.from(document.querySelectorAll('.content-section'));

  if (!prefersReducedMotion.matches && 'IntersectionObserver' in window && revealTargets.length > 0) {
    htmlRoot.classList.add('reveal-enabled');

    revealTargets.forEach((el) => {
      el.classList.add('reveal-target');
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('is-visible');
      }
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.04
      }
    );

    revealTargets.forEach((el) => {
      if (!el.classList.contains('is-visible')) {
        revealObserver.observe(el);
      }
    });
  }
});
