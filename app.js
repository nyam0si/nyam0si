/* ============================================================
   NYAMOSI — Modern Cybersecurity Portfolio · app.js
   ============================================================ */

(function() {
  'use strict';

  // ----- MATRIX RAIN BACKGROUND -----
  (function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01アABCDEF0123456789<>/\\[]{}|HACK';
    const fontSize = 13;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(10, 14, 26, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = i % 5 === 0 ? '#00d4ff' : '#00d4ff';
        ctx.globalAlpha = Math.random() * 0.3 + 0.05;
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

  // ----- CUSTOM CURSOR -----
  (function initCursor() {
    const ring = document.getElementById('cursorRing');
    const dot = document.getElementById('cursorDot');
    if (!ring || !dot) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    function animateCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  })();

  // ----- NAVBAR SCROLL -----
  (function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  })();

  // ----- MOBILE NAV -----
  (function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileOverlay');
    const closeBtn = document.getElementById('mobileClose');
    if (!hamburger || !mobileNav) return;

    function openMobile() {
      mobileNav.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeMobile() {
      mobileNav.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMobile);
    if (closeBtn) closeBtn.addEventListener('click', closeMobile);
    if (overlay) overlay.addEventListener('click', closeMobile);

    document.querySelectorAll('[data-close]').forEach(function(el) {
      el.addEventListener('click', closeMobile);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeMobile();
    });
  })();

  // ----- ACTIVE NAV ON SCROLL -----
  (function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length && navLinks.length) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function(link) {
              link.classList.toggle('active', link.dataset.section === id);
            });
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });

      sections.forEach(function(s) { observer.observe(s); });
    }
  })();

  // ----- SCROLL REVEAL (data-aos) & SKILL BAR ANIMATION -----
  (function initScrollReveal() {
    const aosItems = document.querySelectorAll('[data-aos]');

    if (aosItems.length) {
      const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var target = entry.target;
            // Animate skill bars inside this element
            target.querySelectorAll('.pill-fill, .edu-progress-fill').forEach(function(bar) {
              bar.classList.add('animated');
            });
            target.classList.add('visible');
            revealObserver.unobserve(target);
          }
        });
      }, { threshold: 0.1 });

      aosItems.forEach(function(item) {
        revealObserver.observe(item);
      });
    }
  })();

  // ----- SMOOTH SCROLL for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ----- GLITCH EFFECT on Logo -----
  (function initGlitch() {
    const logo = document.querySelector('.nav-logo');
    if (!logo) return;

    let glitchTimeout;
    function triggerGlitch() {
      logo.style.textShadow = '2px 0 #00d4ff, -2px 0 #7b2ffc';
      setTimeout(function() {
        logo.style.textShadow = '';
      }, 100);

      glitchTimeout = setTimeout(triggerGlitch, Math.random() * 6000 + 3000);
    }
    glitchTimeout = setTimeout(triggerGlitch, 3000);
  })();

  // ----- TERMINAL PULSE -----
  (function terminalPulse() {
    const term = document.querySelector('.home-terminal');
    if (!term) return;
    setTimeout(function() {
      term.style.boxShadow = '0 0 60px rgba(0, 212, 255, 0.05), inset 0 0 40px rgba(0, 212, 255, 0.02)';
    }, 2000);
  })();

  // ----- SERVICE CARD TILT -----
  document.querySelectorAll('.svc-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = 'translateY(-5px) rotateX(' + (-y / 20) + 'deg) rotateY(' + (x / 20) + 'deg)';
      this.style.transformOrigin = 'center';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

})();
