
    (function () {
      // theme toggle (persist)
      const tBtn = document.getElementById('theme-toggle');
      const root = document.documentElement;
      const stored = localStorage.getItem('site-theme');
      if (stored === 'light') root.classList.add('light');
      if (tBtn) {
        tBtn.addEventListener('click', () => {
          const isLight = root.classList.toggle('light');
          localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
          tBtn.setAttribute('aria-pressed', String(isLight));
        });
        tBtn.setAttribute('aria-pressed', String(root.classList.contains('light')));
      }

      // mobile menu
      const menuBtn = document.getElementById('menu-toggle');
      const nav = document.getElementById('main-nav');
      if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
          const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
          menuBtn.setAttribute('aria-expanded', String(!expanded));
          nav.hidden = !nav.hidden;
        });
      }

      // reveal on scroll
      const reveals = document.querySelectorAll('.reveal');
      const ro = new IntersectionObserver((entries, o) => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('show'); o.unobserve(en.target); }});
      }, {threshold:0.18});
      reveals.forEach(r => ro.observe(r));

      // project filters
      const filterBtns = document.querySelectorAll('.filter-btn');
      const projects = document.querySelectorAll('.project');
      filterBtns.forEach(btn => btn.addEventListener('click', () => {
        filterBtns.forEach(b=> b.setAttribute('aria-selected','false'));
        btn.setAttribute('aria-selected','true');
        const f = btn.dataset.filter;
        projects.forEach(p => {
          const tags = (p.dataset.tags || '').split(',').map(s=>s.trim());
          p.style.display = (f === 'all' || tags.includes(f)) ? '' : 'none';
        });
      }));
    })();