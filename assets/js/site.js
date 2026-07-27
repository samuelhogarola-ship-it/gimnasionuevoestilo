(() => {
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const deckStackRoots = Array.from(document.querySelectorAll('[data-deck-stack]'));

  if (deckStackRoots.length && typeof window.initDeckStack === 'function') {
    deckStackRoots.forEach((deckStackRoot) => {
      window.initDeckStack(deckStackRoot, {
        mobileBreakpoint: 820,
        desktopCardShift: 44,
        desktopCardScaleLoss: 0.02,
        desktopMediaShift: -22,
        desktopMediaRotate: -4.5,
        desktopMediaScaleGain: 0.03,
        mobileCardShift: 28,
        mobileCardScaleLoss: 0.016,
        mobileMediaShift: -14,
        mobileMediaRotate: -2.4,
        mobileMediaScaleGain: 0.02,
      });
    });
  }

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
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

  const shouldUseCallSheet = () => window.matchMedia('(max-width: 860px)').matches || window.matchMedia('(pointer: coarse)').matches;

  const getCallSheetLabels = () => {
    const isEnglish = document.documentElement.lang?.toLowerCase().startsWith('en');
    return isEnglish ? {
      eyebrow: 'Direct contact',
      call: 'Call now',
      copy: 'Copy',
      copied: 'Number copied',
      copyError: 'Could not copy automatically',
      close: 'Close',
    } : {
      eyebrow: 'Contacto directo',
      call: 'Llamar ahora',
      copy: 'Copiar',
      copied: 'Número copiado',
      copyError: 'No se ha podido copiar automáticamente',
      close: 'Cerrar',
    };
  };

  const formatPhoneNumber = (href) => {
    const raw = href.replace(/^tel:/i, '').trim();

    if (raw === '+34952470044') return '952 47 00 44';
    if (raw === '+34951211028') return '951 21 10 28';

    const digits = raw.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('34')) {
      return digits.slice(2).replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }

    return raw;
  };

  const copyText = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', 'readonly');
    helper.style.position = 'absolute';
    helper.style.left = '-9999px';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  };

  const createCallSheet = () => {
    const labels = getCallSheetLabels();
    const sheet = document.createElement('div');
    sheet.className = 'call-sheet';
    sheet.hidden = true;
    sheet.innerHTML = `
      <button class="call-sheet-backdrop" type="button" aria-label="${labels.close}"></button>
      <div class="call-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="call-sheet-number">
        <button class="call-sheet-close" type="button" aria-label="${labels.close}">×</button>
        <p class="call-sheet-eyebrow">${labels.eyebrow}</p>
        <strong class="call-sheet-number" id="call-sheet-number"></strong>
        <div class="call-sheet-actions">
          <a class="button button-primary call-sheet-call" href="#"></a>
          <button class="button button-outline call-sheet-copy" type="button"></button>
        </div>
        <p class="call-sheet-status" aria-live="polite"></p>
      </div>
    `;

    const callButton = sheet.querySelector('.call-sheet-call');
    const copyButton = sheet.querySelector('.call-sheet-copy');
    const closeButton = sheet.querySelector('.call-sheet-close');
    const backdrop = sheet.querySelector('.call-sheet-backdrop');
    const numberNode = sheet.querySelector('.call-sheet-number');
    const statusNode = sheet.querySelector('.call-sheet-status');
    let activeTrigger = null;
    let currentNumber = '';

    callButton.textContent = labels.call;
    copyButton.textContent = labels.copy;

    const close = () => {
      sheet.classList.remove('is-open');
      document.body.classList.remove('call-sheet-open');
      window.setTimeout(() => {
        sheet.hidden = true;
      }, 180);
      if (activeTrigger) activeTrigger.focus({ preventScroll: true });
      activeTrigger = null;
    };

    const open = (link) => {
      activeTrigger = link;
      currentNumber = formatPhoneNumber(link.getAttribute('href') || '');
      numberNode.textContent = currentNumber;
      callButton.setAttribute('href', link.getAttribute('href') || '#');
      statusNode.textContent = '';
      sheet.hidden = false;
      document.body.classList.add('call-sheet-open');
      window.requestAnimationFrame(() => {
        sheet.classList.add('is-open');
      });
    };

    copyButton.addEventListener('click', async () => {
      try {
        await copyText(currentNumber);
        statusNode.textContent = labels.copied;
      } catch (error) {
        statusNode.textContent = labels.copyError;
      }
    });

    [closeButton, backdrop].forEach((element) => element.addEventListener('click', close));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && sheet.classList.contains('is-open')) {
        close();
      }
    });

    document.body.appendChild(sheet);
    return { open };
  };

  const callSheet = phoneLinks.length ? createCallSheet() : null;

  phoneLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!callSheet || !shouldUseCallSheet()) return;
      if (link.closest('.call-sheet')) return;
      event.preventDefault();
      callSheet.open(link);
    });
  });


  const minibarSheet = document.getElementById('minibar-sheet');
  const minibarOpeners = Array.from(document.querySelectorAll('[data-minibar-open]'));

  if (minibarSheet && minibarOpeners.length) {
    const minibarCloser = Array.from(minibarSheet.querySelectorAll('[data-minibar-close]'));
    const minibarCloseButton = minibarSheet.querySelector('.minibar-sheet-close');
    let activeMinibarTrigger = null;

    const closeMinibar = () => {
      minibarSheet.classList.remove('is-open');
      minibarSheet.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('minibar-sheet-open');
      minibarOpeners.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
      window.setTimeout(() => {
        minibarSheet.hidden = true;
      }, 220);
      activeMinibarTrigger?.focus({ preventScroll: true });
      activeMinibarTrigger = null;
    };

    const openMinibar = (trigger) => {
      activeMinibarTrigger = trigger;
      minibarSheet.hidden = false;
      minibarSheet.setAttribute('aria-hidden', 'false');
      document.body.classList.add('minibar-sheet-open');
      minibarOpeners.forEach((item) => item.setAttribute('aria-expanded', String(item === trigger)));
      window.requestAnimationFrame(() => {
        minibarSheet.classList.add('is-open');
      });
      window.setTimeout(() => minibarCloseButton?.focus({ preventScroll: true }), 80);
    };

    minibarOpeners.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        const isOpen = minibarSheet.classList.contains('is-open');
        if (isOpen) {
          closeMinibar();
          return;
        }
        openMinibar(trigger);
      });
    });

    minibarCloser.forEach((button) => button.addEventListener('click', closeMinibar));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && minibarSheet.classList.contains('is-open')) {
        closeMinibar();
      }
    });
  }

  if (mobileAction) {
    const updateMobileActionContrast = () => {
      const rect = mobileAction.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const originalPointerEvents = mobileAction.style.pointerEvents;

      mobileAction.style.pointerEvents = 'none';
      const elementBelow = document.elementFromPoint(x, y);
      mobileAction.style.pointerEvents = originalPointerEvents;

      const darkSection = elementBelow?.closest('.section-dark, .review-band-dark, .site-footer, .legal-hero, .hero, .contact-section');
      const lightSection = elementBelow?.closest('.section-paper, .section-light, .legal-content, .review-band:not(.review-band-dark), .service-card-light, .contact-card');

      mobileAction.classList.toggle('is-over-dark', Boolean(darkSection && !lightSection));
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
