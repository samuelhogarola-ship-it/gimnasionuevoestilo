(() => {
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('js');

  const setMenu = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
    document.body.classList.toggle('menu-open', open);
    nav.dataset.open = String(open);
  };

  toggle?.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }

    if (event.key === 'Tab' && toggle?.getAttribute('aria-expanded') === 'true' && nav) {
      const focusable = [toggle, ...nav.querySelectorAll('a[href]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const mobileAction = document.querySelector('.mobile-action');

  if (mobileAction) {
    const isDarkBackground = (element) => {
      let current = element;

      while (current && current !== document.documentElement) {
        const background = window.getComputedStyle(current).backgroundColor;
        const match = background.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);

        if (match) {
          const alpha = match[4] === undefined ? 1 : Number(match[4]);

          if (alpha > 0.2) {
            const red = Number(match[1]);
            const green = Number(match[2]);
            const blue = Number(match[3]);
            const luminance = (red * 0.299) + (green * 0.587) + (blue * 0.114);

            return luminance < 90;
          }
        }

        current = current.parentElement;
      }

      return false;
    };

    const updateMobileActionContrast = () => {
      const rect = mobileAction.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const originalPointerEvents = mobileAction.style.pointerEvents;

      mobileAction.style.pointerEvents = 'none';
      const elementBelow = document.elementFromPoint(x, y);
      mobileAction.style.pointerEvents = originalPointerEvents;

      const darkRegionBelow = elementBelow?.closest('.section-dark, .site-footer, .legal-hero, .hero, .contact-section');
      const actionCenterInsideDarkRegion = Array.from(document.querySelectorAll('.section-dark, .site-footer, .legal-hero, .hero, .contact-section')).some((section) => {
        const sectionRect = section.getBoundingClientRect();
        return x >= sectionRect.left && x <= sectionRect.right && y >= sectionRect.top && y <= sectionRect.bottom;
      });

      mobileAction.classList.toggle('is-over-dark', Boolean(isDarkBackground(elementBelow) || darkRegionBelow || actionCenterInsideDarkRegion));
    };

    updateMobileActionContrast();
    window.addEventListener('scroll', updateMobileActionContrast, { passive: true });
    window.addEventListener('resize', updateMobileActionContrast);
  }

  document.querySelectorAll('[data-gallery-toggle]').forEach((button) => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(willOpen));
      panel.hidden = !willOpen;
    });
  });

  document.querySelectorAll('[data-gallery-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('.facility-gallery');
      if (!panel) return;
      const toggle = document.querySelector(`[data-gallery-toggle][aria-controls="${panel.id}"]`);
      panel.hidden = true;
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.focus({ preventScroll: true });
    });
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px' });

    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
