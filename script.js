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
  // 2. MOBILE NAVIGATION DRAWER (Focus management, Tab trap, Escape)
  // --------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function getMobileMenuFocusables() {
    if (!mobileMenu) return [];
    return Array.from(
      mobileMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.hasAttribute('hidden'));
  }

  function setMobileMenuState(isOpen, { restoreFocus = false } = {}) {
    if (!mobileNavToggle || !mobileMenu) return;
    mobileMenu.classList.toggle('open', isOpen);
    mobileNavToggle.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      mobileMenu.removeAttribute('inert');
      const focusables = getMobileMenuFocusables();
      if (focusables.length > 0) {
        requestAnimationFrame(() => focusables[0].focus({ preventScroll: true }));
      }
    } else {
      mobileMenu.setAttribute('inert', '');
      if (restoreFocus) {
        mobileNavToggle.focus();
      }
    }
  }

  if (mobileNavToggle && mobileMenu) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !mobileMenu.classList.contains('open');
      setMobileMenuState(isOpen, { restoreFocus: !isOpen });
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        setMobileMenuState(false, { restoreFocus: false });
      });
    });

    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !mobileNavToggle.contains(e.target)
      ) {
        setMobileMenuState(false, { restoreFocus: false });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!mobileMenu.classList.contains('open')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuState(false, { restoreFocus: true });
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getMobileMenuFocusables();
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !mobileMenu.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last || !mobileMenu.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
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
      e.stopPropagation();
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

    const statusEl =
      document.getElementById(`${group}FilterStatus`) ||
      (bar.nextElementSibling && bar.nextElementSibling.classList.contains('filter-status')
        ? bar.nextElementSibling
        : bar.parentElement?.querySelector('.filter-status'));

    function applyFilter(btn, syncUrl = true) {
      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filterValue = btn.getAttribute('data-filter');
      const visibleItems = [];

      targetItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          visibleItems.push(item);
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

      if (group === 'projects') {
        targetItems.forEach((item) => item.classList.remove('project-card-featured'));
        if (visibleItems.length % 2 === 1 && visibleItems[0]) {
          visibleItems[0].classList.add('project-card-featured');
        }
      }

      if (syncUrl && group && window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        if (!filterValue || filterValue === 'all') {
          url.searchParams.delete(group);
        } else {
          url.searchParams.set(group, filterValue);
        }
        window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      }

      const visibleCount = visibleItems.length;
      if (statusEl) {
        const filterLabel = btn.textContent.trim();
        statusEl.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'item' : 'items'} for ${filterLabel}.`;
      }
    }

    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => applyFilter(btn, true));

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

    if (group) {
      const initialFilter = new URLSearchParams(window.location.search).get(group);
      if (initialFilter) {
        const initialBtn = buttons.find((b) => b.getAttribute('data-filter') === initialFilter);
        if (initialBtn) applyFilter(initialBtn, false);
      }
    }
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

  // --------------------------------------------------------------------------
  // 7. ACTIVE NAV SCROLL-SPY (Hardened for tall #projects & bottom #contact)
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

  function updateScrollSpy() {
    if (spySections.length === 0) return;

    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) {
      setActiveNavLink(spySections[spySections.length - 1].id);
      return;
    }

    const triggerOffset = 140;
    let activeId = spySections[0].id;
    for (const sec of spySections) {
      if (sec.getBoundingClientRect().top <= triggerOffset) {
        activeId = sec.id;
      } else {
        break;
      }
    }

    setActiveNavLink(activeId);
  }

  if (spySections.length > 0) {
    let spyTicking = false;
    const onScrollOrResize = () => {
      if (spyTicking) return;
      spyTicking = true;
      requestAnimationFrame(() => {
        updateScrollSpy();
        spyTicking = false;
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    window.addEventListener('hashchange', updateScrollSpy);
    updateScrollSpy();
  }

  // --------------------------------------------------------------------------
  // 8. SUBTLE SCROLL-TRIGGERED REVEALS (Disabled when reduced-motion active)
  // --------------------------------------------------------------------------
  const revealTargets = Array.from(document.querySelectorAll('.content-section'));

  function revealAtOrAbove(limitTop) {
    revealTargets.forEach((el) => {
      if (el.classList.contains('is-visible')) return;
      const docTop = el.getBoundingClientRect().top + window.scrollY;
      if (docTop <= limitTop) {
        el.classList.add('is-visible');
      }
    });
  }

  if (!prefersReducedMotion.matches && 'IntersectionObserver' in window && revealTargets.length > 0) {
    htmlRoot.classList.add('reveal-enabled');

    revealTargets.forEach((el) => {
      el.classList.add('reveal-target');
    });

    const hashTarget = window.location.hash ? document.querySelector(window.location.hash) : null;
    const initialLimitTop = Math.max(
      window.scrollY + window.innerHeight * 0.95,
      hashTarget ? hashTarget.getBoundingClientRect().top + window.scrollY + 100 : 0
    );
    revealAtOrAbove(initialLimitTop);

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

    const syncRevealsOnJump = () => {
      revealAtOrAbove(window.scrollY + window.innerHeight * 0.98);
    };
    window.addEventListener('load', syncRevealsOnJump);
    window.addEventListener('hashchange', syncRevealsOnJump);
  }

  // --------------------------------------------------------------------------
  // 8. BACK TO TOP BUTTON & KEYBOARD SHORTCUTS (T = Theme, D = Resume)
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    const updateBackToTop = () => {
      backToTopBtn.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const target = e.target;
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/i.test(target.tagName))) {
      return;
    }
    if (mobileMenu && mobileMenu.classList.contains('open')) return;

    const key = e.key.toLowerCase();
    if (key === 't' && themeToggleBtn) {
      themeToggleBtn.click();
    } else if (key === 'd') {
      const resumeLink = document.querySelector('a[href="Resume.pdf"][download]');
      if (resumeLink) {
        resumeLink.click();
        showToast('Downloading Resume.pdf');
      }
    }
  });
});
