/* Nyamosi Opera portfolio interactions */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Lightweight matrix background. Disabled for reduced-motion preferences.
  function initMatrix() {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "01ABCDEF<>[]{}";
    const fontSize = 14;
    let columns = 0;
    let drops = [];
    let frame = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(window.innerWidth / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -40);
    }

    function draw() {
      ctx.fillStyle = "rgba(8, 13, 24, 0.12)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = fontSize + "px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#00d4ff";
      for (let i = 0; i < drops.length; i++) {
        if (i % 3 === 0) {
          ctx.globalAlpha = 0.22;
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
        }
        if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.985) drops[i] = 0;
        drops[i] += 0.35;
      }
      ctx.globalAlpha = 1;
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    // Draw less often than the original to reduce CPU use.
    const timer = window.setInterval(() => {
      frame++;
      if (frame % 2 === 0) draw();
    }, 50);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) window.clearInterval(timer);
    }, { once: true });
  }

  function initNavbar() {
    const nav = document.getElementById("navbar");
    if (!nav) return;
    const update = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initMobileNav() {
    const hamburger = document.getElementById("hamburger");
    const mobileNav = document.getElementById("mobileNav");
    const overlay = document.getElementById("mobileOverlay");
    const closeBtn = document.getElementById("mobileClose");
    if (!hamburger || !mobileNav || !overlay) return;

    function open() {
      mobileNav.classList.add("open");
      overlay.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      hamburger.setAttribute("aria-label", "Open navigation menu");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }
    function close() {
      mobileNav.classList.remove("open");
      overlay.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    hamburger.addEventListener("click", () => mobileNav.classList.contains("open") ? close() : open());
    if (closeBtn) closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);
    mobileNav.querySelectorAll("[data-close]").forEach(link => link.addEventListener("click", close));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && mobileNav.classList.contains("open")) {
        close();
        hamburger.focus();
      }
    });
  }

  function initActiveNavigation() {
    const sections = document.querySelectorAll("main section[id]");
    const links = document.querySelectorAll(".nav-link");
    if (!("IntersectionObserver" in window) || !sections.length || !links.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const active = link.dataset.section === entry.target.id;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => observer.observe(section));
  }

  function initReveal() {
    const items = document.querySelectorAll("[data-aos]");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(item => item.classList.add("visible"));
      document.querySelectorAll(".edu-progress-fill").forEach(bar => bar.classList.add("animated"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        entry.target.querySelectorAll(".edu-progress-fill").forEach(bar => bar.classList.add("animated"));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", event => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    });
  }

  function initCardHover() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || reduceMotion) return;
    document.querySelectorAll(".svc-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        card.style.transform = "translateY(-3px) rotateX(" + (-y / 45) + "deg) rotateY(" + (x / 45) + "deg)";
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  function initSplunkDemo() {
    const tableBody = document.getElementById("eventRows");
    const searchInput = document.getElementById("eventSearch");
    const severityFilter = document.getElementById("severityFilter");
    const resetButton = document.getElementById("resetEvents");
    const noEvents = document.getElementById("noEvents");
    if (!tableBody || !searchInput || !severityFilter) return;

    const initialRows = Array.from(tableBody.querySelectorAll("tr")).map(row => {
      const cells = Array.from(row.cells).map(cell => cell.textContent.trim());
      return { time: cells[0], severity: cells[1], event: cells[2], source: cells[3], user: cells[4], action: cells[5] };
    });
    const severityClass = value => value.toLowerCase();
    const render = () => {
      const term = searchInput.value.trim().toLowerCase();
      const severity = severityFilter.value;
      const filtered = initialRows.filter(event => {
        const matchesTerm = [event.time, event.severity, event.event, event.source, event.user, event.action]
          .some(value => value.toLowerCase().includes(term));
        return matchesTerm && (severity === "all" || event.severity === severity);
      });
      tableBody.replaceChildren();
      filtered.forEach(event => {
        const row = document.createElement("tr");
        [event.time, event.severity, event.event, event.source, event.user, event.action].forEach((value, index) => {
          const cell = document.createElement("td");
          if (index === 1) {
            const badge = document.createElement("span");
            badge.className = "severity " + severityClass(value);
            badge.textContent = value;
            cell.appendChild(badge);
          } else {
            cell.textContent = value;
          }
          row.appendChild(cell);
        });
        tableBody.appendChild(row);
      });
      if (noEvents) noEvents.hidden = filtered.length > 0;
      const eventTotal = document.getElementById("eventTotal");
      const highTotal = document.getElementById("highTotal");
      const sourceTotal = document.getElementById("sourceTotal");
      if (eventTotal) eventTotal.textContent = String(filtered.length);
      if (highTotal) highTotal.textContent = String(filtered.filter(e => e.severity === "High").length);
      if (sourceTotal) sourceTotal.textContent = String(new Set(filtered.map(e => e.source)).size);
    };
    searchInput.addEventListener("input", render);
    severityFilter.addEventListener("change", render);
    if (resetButton) resetButton.addEventListener("click", () => {
      searchInput.value = "";
      severityFilter.value = "all";
      render();
      searchInput.focus();
    });
    render();

    const copyButton = document.getElementById("copyQuery");
    const copyStatus = document.getElementById("copyStatus");
    if (copyButton) copyButton.addEventListener("click", async () => {
      const query = "index=security\\n| stats count by user, src_ip, action\\n| sort - count";
      try {
        await navigator.clipboard.writeText(query);
        if (copyStatus) copyStatus.textContent = "Query copied. Run it inside your own authorized Splunk environment.";
      } catch (_) {
        if (copyStatus) copyStatus.textContent = "Clipboard access is unavailable. Select and copy the query shown above.";
      }
    });
  }

  initMatrix();
  initNavbar();
  initMobileNav();
  initActiveNavigation();
  initReveal();
  initSmoothScroll();
  initCardHover();
  initSplunkDemo();
})();
