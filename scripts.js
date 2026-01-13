/* Minimal, well-documented vanilla JS for interactivity */
(() => {
  const typedPhrases = ['fast interfaces', 'accessible UI', 'maintainable code', 'scalable components'];
  const typedEl = document.getElementById('typed');
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMenu();
    initTyped(typedPhrases, typedEl);
    loadSkills();
    initRevealObserver();
    initProjectFilters();
    initSmoothScroll();
  });

  /* THEME: persist in localStorage */
  function initTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') document.body.classList.add('light');
    updateThemeButton();
    themeToggle?.addEventListener('click', () => {
      document.body.classList.toggle('light');
      localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
      updateThemeButton();
    });
  }
  function updateThemeButton() {
    if (!themeToggle) return;
    const isLight = document.body.classList.contains('light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.textContent = isLight ? 'Light' : 'Dark';
  }

  /* MOBILE MENU */
  function initMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      if (nav.hidden) nav.hidden = false; else nav.hidden = true;
    });
  }

  /* Typed effect (simple) */
  function initTyped(phrases = [], el, speed = 60, pause = 1000) {
    if (!el || !phrases.length) return;
    let pi = 0, ci = 0, deleting = false;
    function step() {
      const txt = phrases[pi];
      el.textContent = txt.slice(0, ci) + (deleting ? '' : '');
      if (!deleting) {
        ci++;
        if (ci > txt.length) { deleting = true; setTimeout(step, pause); return; }
      } else {
        ci--;
        if (ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; }
      }
      setTimeout(step, deleting ? speed / 2 : speed);
    }
    step();
  }

  /* Load skills.json and render */
  async function loadSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;
    try {
      const res = await fetch('/skills.json', {cache: 'no-store'});
      if (!res.ok) throw new Error('Not found');
      const skills = await res.json();
      grid.innerHTML = skills.map(s => skillMarkup(s)).join('');
      observeSkillBars();
    } catch (err) {
      grid.innerHTML = `<div class="skill"><h4>HTML & CSS</h4><div class="meta">Responsive layouts</div></div>`;
      console.warn('skills load failed', err);
    }
  }
  function skillMarkup(s) {
    const name = escapeHtml(s.name);
    const note = escapeHtml(s.note || '');
    const level = Number(s.level || 0);
    return `<div class="skill">
      <div><h4>${name}</h4><div class="meta">${note}</div></div>
      <div><div class="progress" aria-hidden="true"><div class="bar" data-level="${level}"></div></div></div>
    </div>`;
  }

  /* animate bars when visible */
  function observeSkillBars() {
    const bars = document.querySelectorAll('.bar');
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const b = en.target;
          const lvl = b.dataset.level || 0;
          requestAnimationFrame(() => b.style.width = `${lvl}%`);
          o.unobserve(b);
        }
      });
    }, {threshold: 0.2});
    bars.forEach(b => obs.observe(b));
  }

  /* reveal elements on scroll */
  function initRevealObserver() {
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(en => {
        if (en.isIntersecting) en.target.classList.add('show'), o.unobserve(en.target);
      });
    }, {threshold: 0.18});
    reveals.forEach(r => obs.observe(r));
  }

  /* project filtering */
  function initProjectFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-selected', 'false'));
      b.setAttribute('aria-selected', 'true');
      const f = b.dataset.filter;
      projects.forEach(p => {
        const tags = (p.dataset.tags || '').split(',').map(t => t.trim());
        const show = f === 'all' || tags.includes(f);
        p.style.display = show ? '' : 'none';
      });
    }));
  }

  /* smooth scroll for anchor links */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        if (!nav.hidden) { nav.hidden = true; menuToggle.setAttribute('aria-expanded','false'); }
      });
    });
  }

  /* tiny helper */
  function escapeHtml(s='') {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();
