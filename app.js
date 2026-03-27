/* ============================================================
   NYAMOSI — Hacker Portfolio · app.js
   ============================================================ */

// ── MATRIX RAIN ───────────────────────────────────────────
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01アABCDEF0123456789<>/\\[]{}|HACK';
  const fontSize = 13;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(2, 10, 5, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = i % 5 === 0 ? '#00e5ff' : '#00ff88';
      ctx.globalAlpha = Math.random() * 0.6 + 0.2;
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      ctx.globalAlpha = 1;

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(drawMatrix, 50);
})();

// ── CUSTOM CURSOR ─────────────────────────────────────────
(function initCursor() {
  const ring = document.getElementById('cursorRing');
  const dot  = document.getElementById('cursorDot');
  if (!ring || !dot) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
})();

// ── NAVBAR SCROLL ─────────────────────────────────────────
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

// ── MOBILE NAV ────────────────────────────────────────────
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay   = document.getElementById('mobileOverlay');
  const closeBtn  = document.getElementById('mobileClose');
  if (!hamburger || !mobileNav) return;

  function open() {
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();

// ── TYPING EFFECT ─────────────────────────────────────────
(function initTyping() {
  const el = document.getElementById('typing-role');
  if (!el) return;

  const words = [
    'Security Analyst',
    'Ethical Hacker',
    'Web Developer',
    'Tech Educator',
    'IT Specialist',
    'Social Media Manager'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting  = false;
  let paused    = false;

  function tick() {
    const word = words[wordIndex];

    if (!deleting && charIndex <= word.length) {
      el.textContent = word.slice(0, charIndex);
      charIndex++;
      setTimeout(tick, 100);
    } else if (!deleting && charIndex > word.length) {
      paused = true;
      setTimeout(() => { deleting = true; paused = false; tick(); }, 1800);
    } else if (deleting && charIndex >= 0) {
      el.textContent = word.slice(0, charIndex);
      charIndex--;
      setTimeout(tick, 55);
    } else {
      deleting  = false;
      wordIndex = (wordIndex + 1) % words.length;
      charIndex = 0;
      setTimeout(tick, 300);
    }
  }
  setTimeout(tick, 2200); // start after terminal reveal animations
})();

// ── ACTIVE NAV ON SCROLL ──────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ── SCROLL REVEAL (data-aos) ──────────────────────────────
(function initScrollReveal() {
  const items = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger within parent
        const siblings = Array.from(entry.target.parentNode.querySelectorAll('[data-aos]'));
        const delay    = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
          // Trigger skill bar animations
          entry.target.querySelectorAll('.pill-fill, .edu-progress-fill').forEach(bar => {
            bar.classList.add('animated');
          });
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(item => observer.observe(item));
})();

// ── GLITCH EFFECT on Logo ─────────────────────────────────
(function initGlitch() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;

  let glitchTimeout;
  function triggerGlitch() {
    logo.style.textShadow = `2px 0 #00e5ff, -2px 0 #ff005c`;
    setTimeout(() => {
      logo.style.textShadow = '';
    }, 100);

    glitchTimeout = setTimeout(triggerGlitch, Math.random() * 6000 + 3000);
  }
  glitchTimeout = setTimeout(triggerGlitch, 3000);
})();

// ── SMOOTH SCROLL for anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── TERMINAL TYPING SOUND (optional visual feedback) ──────
// Adds a subtle pulse to the terminal on load
(function terminalPulse() {
  const term = document.querySelector('.home-terminal');
  if (!term) return;
  setTimeout(() => {
    term.style.boxShadow = '0 0 60px rgba(0,255,136,0.12), inset 0 0 40px rgba(0,255,136,0.03)';
  }, 2000);
})();

// ── SERVICE CARD TILT ─────────────────────────────────────
document.querySelectorAll('.svc-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    this.style.transform = `translateY(-5px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg)`;
    this.style.transformOrigin = 'center';
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// ── EXP CARD SUBTLE HOVER ────────────────────────────────
document.querySelectorAll('.exp-dot').forEach(dot => {
  dot.parentElement.querySelector('.exp-card').addEventListener('mouseenter', () => {
    dot.style.boxShadow = '0 0 20px rgba(0,255,136,0.7)';
  });
  dot.parentElement.querySelector('.exp-card').addEventListener('mouseleave', () => {
    dot.style.boxShadow = '0 0 10px rgba(0,255,136,0.4)';
  });
});
