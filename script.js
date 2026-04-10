/* ── Hlakaniphilez Accountants & Advisors – script.js ─────────────────── */

/* 1. Theme toggle — respects prefers-color-scheme, overrides via data-theme */
(function () {
  const html = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = prefersDark ? 'dark' : 'light';
  html.setAttribute('data-theme', theme);

  const btn = document.querySelector('[data-theme-toggle]');
  function updateBtn() {
    if (!btn) return;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  updateBtn();
  if (btn) {
    btn.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      updateBtn();
    });
  }
})();

/* 2. Mobile nav toggle */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const OPEN_ICON   = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const CLOSED_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

  toggle.innerHTML = CLOSED_ICON;

  toggle.addEventListener('click', function () {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open navigation menu');
    toggle.innerHTML = open ? OPEN_ICON : CLOSED_ICON;
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      toggle.innerHTML = CLOSED_ICON;
    });
  });
})();

/* 3. Sticky header via IntersectionObserver */
(function () {
  const header = document.getElementById('site-header');
  if (!header || !window.IntersectionObserver) return;
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'height:1px;pointer-events:none;';
  header.parentNode.insertBefore(sentinel, header);
  new IntersectionObserver(function (entries) {
    header.classList.toggle('is-sticky', !entries[0].isIntersecting);
  }, { rootMargin: '-1px 0px 0px 0px', threshold: 0 }).observe(sentinel);
})();

/* 4. Scroll reveal */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!window.IntersectionObserver) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  els.forEach(function (el) { obs.observe(el); });
})();

/* 5. Active nav link on scroll */
(function () {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links    = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (!sections.length || !links.length || !window.IntersectionObserver) return;
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(function (s) { obs.observe(s); });
})();

/* 6. Email reveal */
(function () {
  const btn = document.querySelector('[data-email-reveal]');
  if (!btn) return;
  const encodedEmail = [
    [121, 110, 110, 111, 110],
    [122, 101, 108, 105, 104, 112, 105, 110, 97, 107, 97, 108, 104],
    [97, 122, 46, 111, 99],
  ];
  const decodePart = (codes) => String.fromCharCode(...[...codes].reverse());
  btn.addEventListener('click', function () {
    const address = decodePart(encodedEmail[0]) + '@' + decodePart(encodedEmail[1]) + '.' + decodePart(encodedEmail[2]);
    const a = document.createElement('a');
    a.className = 'email-link';
    a.href = 'mailto:' + address;
    a.textContent = address;
    a.setAttribute('aria-label', 'Email ' + address);
    btn.replaceWith(a);
  }, { once: true });
})();

/* 7. Contact form – validation + async Formspree submit */
(function () {
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit');
  const successEl = document.getElementById('form-success');
  if (!form) return;

  function showErr(input, msg) {
    const el = input.closest('.form-field') && input.closest('.form-field').querySelector('.field-error');
    if (el) el.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }
  function clearErr(input) {
    const el = input.closest('.form-field') && input.closest('.form-field').querySelector('.field-error');
    if (el) el.textContent = '';
    input.removeAttribute('aria-invalid');
  }
  function validate() {
    let ok = true;
    const name    = form.querySelector('#f-name');
    const email   = form.querySelector('#f-email');
    const message = form.querySelector('#f-message');
    if (!name || !name.value.trim() || name.value.trim().length < 2) {
      if (name) showErr(name, 'Please enter your full name.'); ok = false;
    } else clearErr(name);
    if (!email || !email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      if (email) showErr(email, 'Please enter a valid email address.'); ok = false;
    } else clearErr(email);
    if (!message || !message.value.trim() || message.value.trim().length < 10) {
      if (message) showErr(message, 'Please describe what you need (at least 10 characters).'); ok = false;
    } else clearErr(message);
    return ok;
  }

  ['f-name', 'f-email', 'f-message'].forEach(function (id) {
    const el = form.querySelector('#' + id);
    if (el) el.addEventListener('blur', validate);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    const hp = form.querySelector('#hp-name');
    if (hp && hp.value) return; // honeypot triggered

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';

    const action = form.getAttribute('action') || '';

    // Dev/no-Formspree mode
    if (!action || action.indexOf('formspree.io') === -1) {
      setTimeout(function () {
        form.reset();
        if (successEl) {
          successEl.hidden = false;
          successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request a consultation';
      }, 700);
      return;
    }

    fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        if (successEl) {
          successEl.hidden = false;
          successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        submitBtn.textContent = 'Sent \u2713';
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request a consultation';
        alert('Something went wrong. Please call us on 081\u00a0556\u00a06602.');
      }
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request a consultation';
      alert('Network error. Please call 081\u00a0556\u00a06602.');
    });
  });
})();
