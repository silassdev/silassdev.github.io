<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Silas — Developer Portfolio</title>
  <link rel="stylesheet" href="styles.css" />
  <meta name="description" content="Silas — frontend developer. Portfolio and skills." />
</head>
<body>
  <header class="nav">
    <div class="container nav-inner">
      <a class="brand" href="#">Silas</a>
      <button id="menu-btn" class="menu-btn" aria-label="Toggle menu">
        ☰
      </button>
      <nav id="nav-links" class="nav-links">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero container" id="home">
      <div>
        <h1>Silas Tyokaha</h1>
        <p class="lead">Frontend developer • Laravel • TypeScript • React</p>
        <div class="hero-cta">
          <a class="btn" href="#projects">View projects</a>
          <a class="btn btn-ghost" href="#contact">Contact</a>
        </div>
      </div>
      <div class="hero-illustration" aria-hidden="true">
        <div class="card">Simple, fast, maintainable UI</div>
      </div>
    </section>

    <section id="about" class="container section">
      <h2>About</h2>
      <p>
        I build clean, maintainable frontends and integrate them with Laravel backends.
        I focus on performant, accessible UI and clear project structure.
      </p>
    </section>

    <section id="skills" class="container section">
      <h2>Skills</h2>
      <div id="skills-grid" class="skills-grid" aria-live="polite">
        <!-- populated by scripts.js -->
      </div>
    </section>

    <section id="projects" class="container section">
      <h2>Projects</h2>
      <div class="projects-grid">
        <article class="project">
          <h3>Apltoday</h3>
          <p>Sports blog — custom CMS and performance optimizations.</p>
        </article>
        <article class="project">
          <h3>Allpilar</h3>
          <p>Tech/entertainment site with incremental static pages.</p>
        </article>
        <!-- add your project cards here -->
      </div>
    </section>

    <section id="contact" class="container section">
      <h2>Contact</h2>
      <p>Email: <a href="mailto:your.email@example.com">your.email@example.com</a></p>
      <p>GitHub: <a href="https://github.com/silassdev" target="_blank" rel="noopener">silassdev</a></p>
    </section>
  </main>

  <footer class="container footer">
    <small>© Silas Tyokaha</small>
  </footer>

  <script src="scripts.js" defer></script>
</body>
</html>
