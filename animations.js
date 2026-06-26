/**
 * THE METALLIC STANDARD — Motion Engine
 * Custom motion system. Editorial, deliberate, no library.
 */
(function() {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarse = window.matchMedia('(pointer: coarse)').matches;

  document.body.classList.add('loaded');
  if (reducedMotion) return;

  // ─── CURSOR RULE (thin copper rule follower) ────────────────────────
  function initCursor() {
    if (isCoarse) return;
    var dot = document.createElement('div');
    dot.className = 'cursor-rule__dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-rule__ring';
    var wrap = document.createElement('div');
    wrap.className = 'cursor-rule';
    wrap.appendChild(ring);
    document.body.appendChild(wrap);
    document.body.appendChild(dot);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var dx = mx, dy = my, rx = mx, ry = my;
    document.addEventListener('mousemove', function(e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    function tick() {
      dx += (mx - dx) * 0.35; dy += (my - dy) * 0.35;
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(tick);
    }
    tick();

    // Active states for interactive elements
    document.addEventListener('mouseover', function(e) {
      var t = e.target.closest('a, button, .story-card, .story-row, .side-item, .info-card, [data-cursor="hover"]');
      if (t) wrap.classList.add('is-active');
    });
    document.addEventListener('mouseout', function(e) {
      var t = e.target.closest('a, button, .story-card, .story-row, .side-item, .info-card, [data-cursor="hover"]');
      if (t) wrap.classList.remove('is-active');
    });
    document.addEventListener('mouseover', function(e) {
      var t = e.target.closest('p, h1, h2, h3, h4, h5, li, .article__body, .legal-block');
      if (t) wrap.classList.add('is-text');
    });
    document.addEventListener('mouseout', function(e) {
      var t = e.target.closest('p, h1, h2, h3, h4, h5, li, .article__body, .legal-block');
      if (t) wrap.classList.remove('is-text');
    });
  }

  // ─── INTERSECTION REVEAL ────────────────────────────────────────────
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function(el) { io.observe(el); });
  }

  // ─── STAGGER CHILDREN ───────────────────────────────────────────────
  function initStagger() {
    var groups = document.querySelectorAll('[data-stagger]');
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        var children = e.target.querySelectorAll('[data-stagger-child]');
        children.forEach(function(c, i) {
          c.style.transitionDelay = (i * 0.06) + 's';
          c.classList.add('stagger-visible');
        });
        io.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    groups.forEach(function(g) { io.observe(g); });
  }

  // ─── TEXT MASK REVEAL ───────────────────────────────────────────────
  function initTextMask() {
    var els = document.querySelectorAll('[data-text-mask]');
    if (!els.length) return;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    els.forEach(function(el) { io.observe(el); });
  }

  // ─── DRAW-X (hairline rules) ─────────────────────────────────────────
  function initDrawX() {
    var els = document.querySelectorAll('[data-draw-x], [data-draw-x-c]');
    if (!els.length) return;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    els.forEach(function(el) { io.observe(el); });
  }

  // ─── CLICK RIPPLE ───────────────────────────────────────────────────
  function initRipple() {
    document.addEventListener('click', function(e) {
      var t = e.target.closest('.ripple-host, .story-card, .story-row, .subscribe-cta, .submit-btn, .summarize-btn, .info-card, .bignum, .side-item, .theme-toggle');
      if (!t) return;
      if (getComputedStyle(t).position === 'static') t.style.position = 'relative';
      if (getComputedStyle(t).overflow === 'visible') t.style.overflow = 'hidden';
      var rect = t.getBoundingClientRect();
      var r = document.createElement('span');
      r.className = 'ripple-flash';
      var size = Math.max(rect.width, rect.height) * 2.4;
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size / 2) + 'px';
      r.style.top = (e.clientY - rect.top - size / 2) + 'px';
      t.appendChild(r);
      setTimeout(function() { r.remove(); }, 800);
    });
  }

  // ─── 3D CARD TILT (subtle) ──────────────────────────────────────────
  function initTilt() {
    if (isCoarse) return;
    var cards = document.querySelectorAll('.tilt-card');
    cards.forEach(function(card) {
      var inner = card.querySelector('.tilt-card__inner') || card;
      var visual = card.querySelector('.story-card__plate, .article__hero');
      var frame = false;
      card.addEventListener('mousemove', function(e) {
        if (frame) return;
        frame = true;
        requestAnimationFrame(function() {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = 'perspective(1000px) rotateY(' + (x * 3) + 'deg) rotateX(' + -(y * 3) + 'deg) translateZ(0)';
          if (visual) visual.style.transform = 'translate(' + (x * -6) + 'px,' + (y * -6) + 'px)';
          frame = false;
        });
      });
      card.addEventListener('mouseleave', function() {
        card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        if (visual) {
          visual.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
          visual.style.transform = '';
        }
        card.style.transform = '';
        setTimeout(function() {
          card.style.transition = '';
          if (visual) visual.style.transition = '';
        }, 600);
      });
    });
  }

  // ─── MAGNETIC BUTTONS ───────────────────────────────────────────────
  function initMagnetic() {
    if (isCoarse) return;
    var els = document.querySelectorAll('.magnetic, .subscribe-cta, .submit-btn');
    els.forEach(function(el) {
      el.addEventListener('mousemove', function(e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (x * 0.18) + 'px,' + (y * 0.18) + 'px)';
      });
      el.addEventListener('mouseleave', function() {
        el.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
        el.style.transform = '';
        setTimeout(function() { el.style.transition = ''; }, 400);
      });
    });
  }

  // ─── SCROLL PROGRESS ────────────────────────────────────────────────
  function initProgress() {
    var fill = document.getElementById('progressFill');
    if (!fill) return;
    var update = function() {
      var p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      fill.style.width = Math.min(Math.max(p, 0), 100) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ─── ORB PARALLAX (slow depth) ───────────────────────────────────────
  function initOrbParallax() {
    if (isCoarse) return;
    var orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;
    var mx = 0, my = 0, cx = [], cy = [];
    orbs.forEach(function(_, i) { cx[i] = 0; cy[i] = 0; });
    document.addEventListener('mousemove', function(e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    function tick() {
      orbs.forEach(function(orb, i) {
        var speed = 22 + i * 10;
        cx[i] += (mx * speed - cx[i]) * 0.03;
        cy[i] += (my * speed - cy[i]) * 0.03;
        orb.style.transform = 'translate(' + cx[i] + 'px,' + cy[i] + 'px)';
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  // ─── SCROLL-TRIGGERED COUNTERS ───────────────────────────────────────
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var duration = 1500;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var v = target * eased;
          var display = (target >= 100) ? Math.floor(v).toLocaleString() : v.toFixed(1);
          el.textContent = prefix + display + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = prefix + (target >= 100 ? target.toLocaleString() : target) + suffix;
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function(c) { io.observe(c); });
  }

  // ─── HORIZONTAL WORD STAGGER (for hero) ──────────────────────────────
  function initWordStagger() {
    var els = document.querySelectorAll('[data-word-stagger]');
    els.forEach(function(el) {
      var html = el.innerHTML;
      // wrap words but preserve <br>, tags
      var wrapped = html.replace(/(<br\s*\/?>)|(<[^>]+>)|(\S+)/g, function(m, br, tag, word) {
        if (br) return br;
        if (tag) return tag;
        return '<span class="word">' + word + '</span>';
      });
      el.innerHTML = wrapped;
      var words = el.querySelectorAll('.word');
      words.forEach(function(w, i) { w.style.transitionDelay = (i * 0.05) + 's'; });
    });
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    els.forEach(function(el) { io.observe(el); });
  }

  // ─── PARALLAX DEPTH (scroll-driven translateY) ───────────────────────
  function initParallax() {
    var items = document.querySelectorAll('[data-parallax]');
    if (!items.length) return;
    var scrollY = 0, frame = false;
    window.addEventListener('scroll', function() { scrollY = window.scrollY; }, { passive: true });
    function tick() {
      items.forEach(function(el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - window.innerHeight / 2) * speed;
        el.style.transform = 'translateY(' + (-offset) + 'px)';
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  // ─── SECTION FADE (subtle, based on viewport position) ───────────────
  function initSectionFade() {
    var sections = document.querySelectorAll('[data-fade-section]');
    if (!sections.length) return;
    window.addEventListener('scroll', function() {
      sections.forEach(function(sec) {
        var rect = sec.getBoundingClientRect();
        var vh = window.innerHeight;
        var p = 1 - Math.max(0, Math.min(1, rect.top / vh));
        sec.style.opacity = Math.max(0.4, Math.min(1, p));
      });
    }, { passive: true });
  }

  // ─── MASTHEAD SHRINK ON SCROLL ───────────────────────────────────────
  function initMastheadScroll() {
    var mast = document.querySelector('.masthead');
    if (!mast) return;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 80) mast.classList.add('is-scrolled');
      else mast.classList.remove('is-scrolled');
    }, { passive: true });
  }

  // ─── THEME TOGGLE ────────────────────────────────────────────────────
  function initTheme() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var html = document.documentElement;
    var icon = btn.querySelector('svg');
    function setIcon(light) {
      if (light) {
        icon.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
      } else {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      }
    }
    var saved = localStorage.getItem('tms-theme');
    if (saved === 'light') { html.setAttribute('data-theme', 'light'); setIcon(true); }
    btn.addEventListener('click', function() {
      var isLight = html.getAttribute('data-theme') === 'light';
      html.setAttribute('data-theme', isLight ? '' : 'light');
      localStorage.setItem('tms-theme', isLight ? '' : 'light');
      setIcon(!isLight);
    });
  }

  // ─── AD CLOSE ────────────────────────────────────────────────────────
  function initAdClose() {
    var btn = document.getElementById('closeAnchor');
    var anchor = document.getElementById('anchorAd');
    if (btn && anchor) btn.addEventListener('click', function() { anchor.classList.add('closed'); });
  }

  // ─── SUBSCRIBE MODAL ─────────────────────────────────────────────────
  function initSubscribe() {
    var btn = document.getElementById('subscribeBtn');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      // Create a refined inline modal instead of alert
      var existing = document.getElementById('subscribe-modal');
      if (existing) { existing.remove(); return; }
      var modal = document.createElement('div');
      modal.id = 'subscribe-modal';
      modal.innerHTML = '<div class="modal-backdrop"></div>' +
        '<div class="modal-box">' +
          '<button class="modal-close" aria-label="Close">✕</button>' +
          '<div class="modal-plate">Nº 01</div>' +
          '<h3 class="modal-title">The Brief<span>.</span></h3>' +
          '<p class="modal-deck">Weekly dispatch on AI, tech, and policy. Sharp analysis. No fluff.</p>' +
          '<form class="modal-form">' +
            '<input type="email" placeholder="your@email.com" required>' +
            '<button type="submit">Subscribe</button>' +
          '</form>' +
          '<p class="modal-foot">We respect your inbox. Unsubscribe anytime.</p>' +
        '</div>';
      document.body.appendChild(modal);
      requestAnimationFrame(function() { modal.classList.add('visible'); });
      var close = function() {
        modal.classList.remove('visible');
        setTimeout(function() { modal.remove(); }, 400);
      };
      modal.querySelector('.modal-backdrop').addEventListener('click', close);
      modal.querySelector('.modal-close').addEventListener('click', close);
      modal.querySelector('.modal-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var input = modal.querySelector('input');
        var btn = modal.querySelector('button[type="submit"]');
        btn.textContent = 'WELCOME ABOARD';
        btn.disabled = true;
        setTimeout(close, 1600);
      });
    });
  }

  // ─── FOUNDRY CURTAIN PRELOADER ───────────────────────────────────────
  function initCurtain() {
    if (sessionStorage.getItem('metallic-curtain-seen')) return;
    sessionStorage.setItem('metallic-curtain-seen', '1');
    var curtain = document.createElement('div');
    curtain.className = 'foundry-curtain';
    curtain.innerHTML =
      '<div class="foundry-curtain__seal"><span>Forging</span></div>' +
      '<div class="foundry-curtain__panel"></div>' +
      '<div class="foundry-curtain__panel"></div>' +
      '<div class="foundry-curtain__panel"></div>' +
      '<div class="foundry-curtain__panel"></div>' +
      '<div class="foundry-curtain__panel"></div>';
    document.body.appendChild(curtain);
    setTimeout(function() { curtain.classList.add('is-dismissed'); }, 1700);
  }

  // ─── SVG LINE DRAW (engraving) ───────────────────────────────────────
  function initLineDraw() {
    var hosts = document.querySelectorAll('[data-line-draw]');
    if (!hosts.length) return;
    hosts.forEach(function(host) {
      var shapes = host.querySelectorAll('path, line, circle, rect, polygon, polyline, ellipse');
      shapes.forEach(function(s) {
        var len = 0;
        try { len = s.getTotalLength(); } catch (e) { len = 600; }
        if (len) s.style.setProperty('--len', Math.ceil(len));
      });
    });
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          setTimeout(function() { e.target.classList.add('is-visible'); }, 200);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });
    hosts.forEach(function(el) { io.observe(el); });
  }

  // ─── FLOATING EMBERS ─────────────────────────────────────────────────
  function initEmbers() {
    var count = window.innerWidth < 700 ? 6 : 14;
    var container = document.createElement('div');
    container.className = 'embers';
    for (var i = 0; i < count; i++) {
      var spark = document.createElement('div');
      spark.className = 'embers__spark';
      var size = 1.5 + Math.random() * 2.5;
      spark.style.left = (Math.random() * 100) + 'vw';
      spark.style.width = size + 'px';
      spark.style.height = size + 'px';
      spark.style.setProperty('--duration', (7 + Math.random() * 7) + 's');
      spark.style.setProperty('--delay', (Math.random() * 10) + 's');
      spark.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
      container.appendChild(spark);
    }
    document.body.appendChild(container);
  }

  // ─── BLUEPRINT GRID ──────────────────────────────────────────────────
  function initBlueprintGrid() {
    var grid = document.createElement('div');
    grid.className = 'blueprint-grid';
    document.body.appendChild(grid);
  }

  // ─── HAMMER STRIKE (button feedback) ─────────────────────────────────
  function initHammerStrike() {
    var sels = '.submit-btn, .subscribe-cta, .side-cta, .summarize-btn, .hero-lead__cta, [data-hammer]';
    document.querySelectorAll(sels).forEach(function(btn) {
      if (btn.classList.contains('hammer-strike')) return;
      btn.classList.add('hammer-strike');
      btn.addEventListener('click', function() {
        btn.classList.remove('is-struck', 'stamping');
        void btn.offsetWidth; // restart animations
        btn.classList.add('is-struck', 'stamping');
        setTimeout(function() { btn.classList.remove('stamping'); }, 500);
      });
    });
  }

  // ─── PLATE TILT (3D follow on cards) ─────────────────────────────────
  function initPlateTilt() {
    if (isCoarse) return;
    var hosts = document.querySelectorAll('.tilt-host');
    if (!hosts.length) return;
    hosts.forEach(function(host) {
      host.addEventListener('mousemove', function(e) {
        var rect = host.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        host.classList.add('is-tilting');
        host.style.transform = 'perspective(1000px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 5).toFixed(2) + 'deg) translateZ(0)';
      });
      host.addEventListener('mouseleave', function() {
        host.classList.remove('is-tilting');
        host.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      });
    });
  }

  // ─── GLOW PULSE TRIGGER (auto-apply to copper accents) ──────────────
  function initGlowPulse() {
    var sels = '.subscribe-cta, .article__hero-num, .side-block--cta .side-cta';
    document.querySelectorAll(sels).forEach(function(el) {
      if (!el.classList.contains('glow-pulse')) el.classList.add('glow-pulse');
    });
  }

  // ─── BOOT ────────────────────────────────────────────────────────────
  function boot() {
    initCurtain();
    initBlueprintGrid();
    initEmbers();
    initCursor();
    initReveal();
    initStagger();
    initTextMask();
    initDrawX();
    initRipple();
    initTilt();
    initPlateTilt();
    initMagnetic();
    initHammerStrike();
    initGlowPulse();
    initProgress();
    initOrbParallax();
    initCounters();
    initWordStagger();
    initParallax();
    initSectionFade();
    initMastheadScroll();
    initTheme();
    initAdClose();
    initSubscribe();
    // Line-draw runs after reveal observer is set up
    requestAnimationFrame(initLineDraw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
