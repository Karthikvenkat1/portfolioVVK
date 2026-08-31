/* ==========================================================================
   Velaga Venkata Karthik — Portfolio
   script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('menu-open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('menu-open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Theme toggle (persisted) ---------- */
  const themeToggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  }

  const updateThemeIcon = () => {
    if (!themeToggle) return;
    const isLight = root.getAttribute('data-theme') === 'light';
    themeToggle.innerHTML = isLight
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  };
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      if (next === 'dark') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', 'light');
      }
      localStorage.setItem('portfolio-theme', next);
      updateThemeIcon();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href^="index.html#"]');

  if (sections.length && navAnchors.length) {
    const setActive = () => {
      let currentId = '';
      const scrollPos = window.scrollY + 140;
      sections.forEach(section => {
        if (scrollPos >= section.offsetTop) currentId = section.id;
      });
      navAnchors.forEach(a => {
        const href = a.getAttribute('href').split('#')[1];
        a.classList.toggle('active', href === currentId);
      });
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  /* ---------- Scroll to top button ---------- */
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Navbar background on scroll ---------- */
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');

    const validators = {
      name: (v) => v.trim().length >= 2 || 'Please enter your full name.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
      subject: (v) => v.trim().length >= 3 || 'Please add a short subject.',
      message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.'
    };

    const showError = (field, message) => {
      const errorEl = form.querySelector(`[data-error-for="${field}"]`);
      if (errorEl) errorEl.textContent = message || '';
    };

    Object.keys(validators).forEach(field => {
      const input = form.elements[field];
      if (!input) return;
      input.addEventListener('blur', () => {
        const result = validators[field](input.value);
        showError(field, result === true ? '' : result);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      Object.keys(validators).forEach(field => {
        const input = form.elements[field];
        if (!input) return;
        const result = validators[field](input.value);
        if (result !== true) {
          showError(field, result);
          isValid = false;
        } else {
          showError(field, '');
        }
      });

      status.classList.remove('show', 'success', 'error');

      if (!isValid) {
        status.textContent = 'Please fix the highlighted fields before sending.';
        status.classList.add('show', 'error');
        return;
      }

      // No backend/email service is connected yet, so we open the user's
      // email client with the message pre-filled instead of pretending to send it.
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const subject = form.elements.subject.value.trim();
      const message = form.elements.message.value.trim();

      const destination = 'velagavenkatakarthik1@gmail.com';
      const mailBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const mailtoLink = `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

      window.location.href = mailtoLink;

      status.textContent = 'Opening your email app with this message pre-filled — hit send there to reach me.';
      status.classList.add('show', 'success');
      form.reset();
    });
  }

});
