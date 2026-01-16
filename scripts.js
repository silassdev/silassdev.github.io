(function () {
  'use strict';

  const KEY_THEME = 'site-theme';
  const root = document.documentElement;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    try {
      initTheme();
      initMenu();
      initRevealObserver();
      initSmoothScroll();
      initProjectFilters();
      loadSkills();
    } catch (err) {
      // Fail gracefully: log error but continue
      // eslint-disable-next-line no-console
      console.error('Init error', err);
    }
  }

  /* THEME */
  function initTheme() {
    const btn = document.getElementById('theme-toggle');
    try {
      const stored = localStorage.getItem(KEY_THEME);
      if (stored === 'light') root.classList.add('light');

      if (btn) {
        btn.addEventListener('click', () => {
          const isLight = root.classList.toggle('light');
          localStorage.setItem(KEY_THEME, isLight ? 'light' : 'dark');
          btn.setAttribute('aria-pressed', String(isLight));
        });
        btn.setAttribute('aria-pressed', String(root.classList.contains('light')));
      }
    } catch (err) {
      // localStorage may throw in some contexts (private mode)
      // eslint-disable-next-line no-console
      console.warn('Theme init warning', err);
    }
  }

  /* MOBILE MENU */
  function initMenu() {
    const menuBtn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      // toggle hidden attribute safely
      nav.hidden = !nav.hidden;
    });

    // close menu when a nav link is clicked (mobile)
    nav.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.matches('a')) {
        nav.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* REVEAL ON SCROLL */
  function initRevealObserver() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    reveals.forEach(r => obs.observe(r));
  }

  /* SMOOTH SCROLL */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* PROJECT FILTERS */
  function initProjectFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project');
    if (!buttons.length || !projects.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.setAttribute('aria-selected', 'false'));
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.dataset.filter || 'all';
        projects.forEach(p => {
          const tags = (p.dataset.tags || '').split(',').map(s => s.trim()).filter(Boolean);
          const show = filter === 'all' || tags.includes(filter);
          p.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* LOAD SKILLS JSON + RENDER + ANIMATE */
  async function loadSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    const fallback = [
      { name: 'HTML & CSS', level: 92, note: 'Responsive layouts, accessibility' },
      { name: 'JavaScript', level: 88, note: 'Vanilla & ES6+' },
      { name: 'TypeScript', level: 78, note: 'Typed frontend' }
    ];

    let skills;
    try {
      const resp = await fetch('/skills.json', { cache: 'no-store' });
      if (!resp.ok) throw new Error('fetch error');
      skills = await resp.json();
      if (!Array.isArray(skills) || !skills.length) throw new Error('invalid skills.json');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Could not load skills.json — using fallback', err);
      skills = fallback;
    }

    // render
    grid.innerHTML = skills.map(s => skillCardMarkup(s)).join('\n');

    // animate bars when visible
    const bars = grid.querySelectorAll('.bar');
    if (!bars.length) return;

    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const level = parseInt(el.dataset.level, 10) || 0;
          // clamp 0-100
          const clamped = Math.max(0, Math.min(100, level));
          requestAnimationFrame(() => { el.style.width = clamped + '%'; });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.25 });

    bars.forEach(b => obs.observe(b));
  }

  function skillCardMarkup(s) {
    const name = escapeHtml(s.name || '');
    const note = escapeHtml(s.note || '');
    const level = Number(s.level || 0);
    return `
      <div class="skill">
        <div><h4>${name}</h4><div class="meta">${note}</div></div>
        <div><div class="progress" aria-hidden="true"><div class="bar" data-level="${level}" style="width:0%"></div></div></div>
      </div>
    `;
  }

  /* small XSS-safe helper */
  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

})();
