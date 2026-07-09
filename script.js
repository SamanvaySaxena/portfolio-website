/* ==========================================================================
   PORTFOLIO SCRIPT
   Vanilla JS only. Organized by feature. No external libraries.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initMobileMenu();
  initScrollProgress();
  initCursorGlow();
  initScrollReveal();
  initTimelineProgress();
  initLearningBars();
  initProjectTilt();
  initRipple();
  initActiveNavHighlight();
  initNodeCanvas();
});

/* --------------------------------------------------------------------------
   THEME TOGGLE — persists only for the session (in-memory), smooth transition
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  toggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    root.setAttribute('data-theme', isLight ? 'dark' : 'light');
  });
}

/* --------------------------------------------------------------------------
   NAVBAR — background + padding change on scroll
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   MOBILE MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');

  burger.addEventListener('click', () => {
    const open = navbar.classList.toggle('menu-open');
    burger.classList.toggle('is-open', open);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
      burger.classList.remove('is-open');
    });
  });
}

/* --------------------------------------------------------------------------
   SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   MOUSE-FOLLOWING GLOW (desktop only, disabled on touch via CSS/media check)
   -------------------------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let active = false;
  window.addEventListener('mousemove', (e) => {
    glow.style.setProperty('--mx', e.clientX + 'px');
    glow.style.setProperty('--my', e.clientY + 'px');
    if (!active) {
      glow.classList.add('active');
      active = true;
    }
  });
  window.addEventListener('mouseleave', () => {
    glow.classList.remove('active');
    active = false;
  });
}

/* --------------------------------------------------------------------------
   SCROLL-TRIGGERED FADE-UP REVEALS
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
}

/* --------------------------------------------------------------------------
   JOURNEY TIMELINE — line fill tracks scroll position through the section,
   and each node activates as it enters view (like a build pipeline progressing)
   -------------------------------------------------------------------------- */
function initTimelineProgress() {
  const timeline = document.getElementById('timeline');
  const fill = document.getElementById('timelineFill');
  const items = document.querySelectorAll('.timeline-item');
  if (!timeline || !fill) return;

  const onScroll = () => {
    const rect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.75;
    const total = rect.height;
    const progressed = Math.min(Math.max(viewportCenter - rect.top, 0), total);
    const pct = total > 0 ? (progressed / total) * 100 : 0;
    fill.style.height = pct + '%';
  };

  const nodeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      }
    });
  }, { threshold: 0.5 });

  items.forEach(item => nodeObserver.observe(item));

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}

/* --------------------------------------------------------------------------
   LEARNING PROGRESS BARS — fill in when scrolled into view
   -------------------------------------------------------------------------- */
function initLearningBars() {
  const bars = document.querySelectorAll('.learning-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-filled');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
}

/* --------------------------------------------------------------------------
   PROJECT CARD 3D TILT + GLOW FOLLOW
   -------------------------------------------------------------------------- */
function initProjectTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    const glow = card.querySelector('.project-card-glow');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      if (glow) {
        glow.style.setProperty('--gx', x + 'px');
        glow.style.setProperty('--gy', y + 'px');
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* --------------------------------------------------------------------------
   BUTTON RIPPLE EFFECT
   -------------------------------------------------------------------------- */
function initRipple() {
  const buttons = document.querySelectorAll('.ripple');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      btn.style.setProperty('--y', (e.clientY - rect.top) + 'px');
      btn.classList.remove('is-rippling');
      // Force reflow so the animation restarts on repeated clicks
      void btn.offsetWidth;
      btn.classList.add('is-rippling');
    });
  });
}

/* --------------------------------------------------------------------------
   ACTIVE NAV HIGHLIGHTING — based on which section is in view
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('main .section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   HERO BACKGROUND — lightweight animated node network on canvas,
   evokes a backend service graph / request routing map
   -------------------------------------------------------------------------- */
function initNodeCanvas() {
  const canvas = document.getElementById('nodeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, nodes;
  const NODE_COUNT = 46;
  const LINK_DIST = 130;

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function createNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    // Draw links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(124, 108, 240, ${0.14 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.fillStyle = 'rgba(0, 217, 192, 0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  createNodes();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createNodes();
    if (reduceMotion) draw();
  });
}
