/* =============================================================
   PENUMBRA — main.js
   Toda la lógica de la web. Patrón IIFE clásico (sin módulos)
   para que funcione en file://, FTP y cualquier hosting.
   Cada init* está envuelto en safe() — si uno falla, el resto
   de la web sigue funcionando.
   ============================================================= */
(function () {
  "use strict";

  var data = window.__PENUMBRA__ || {};
  var brand = data.brand || {};

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function escHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  function pad2(n) { return ("0" + n).slice(-2); }

  /* -----------------------------------------------------------
     Geometría de copas — line-art poligonal
     Cada copa es un polígono cerrado (silueta) + un polígono
     interior más simple (cavidad) que se recorta a la altura
     de líquido para dibujar el relleno.
     ViewBox compartido: 0 0 200 340
     ----------------------------------------------------------- */
  var GLASS_SHAPES = {
    coupe: {
      outline: [[38,68],[70,56],[130,56],[162,68],[146,112],[104,170],[104,266],[146,284],[54,284],[96,266],[96,170],[55,112]],
      interior: [[42,70],[158,70],[144,110],[103,168],[97,168],[56,110]],
      liquidTop: 92
    },
    highball: {
      outline: [[50,40],[150,40],[146,170],[142,300],[58,300],[54,170]],
      interior: [[54,44],[146,44],[142,170],[138,296],[62,296],[58,170]],
      liquidTop: 100
    },
    martini: {
      outline: [[30,60],[170,60],[145,122],[103,192],[103,270],[144,272],[154,286],[46,286],[56,272],[97,270],[97,192],[55,122]],
      interior: [[34,64],[166,64],[143,124],[100,188],[57,124]],
      liquidTop: 84
    },
    old_fashioned: {
      outline: [[54,140],[146,140],[144,220],[140,300],[60,300],[56,220]],
      interior: [[58,144],[142,144],[140,222],[136,296],[64,296],[60,222]],
      liquidTop: 220
    },
    rocks: {
      outline: [[50,160],[150,160],[147,230],[142,300],[58,300],[53,230]],
      interior: [[54,164],[146,164],[143,232],[138,296],[62,296],[57,232]],
      liquidTop: 230
    },
    wine: {
      outline: [[60,80],[140,80],[160,150],[103,212],[103,280],[142,282],[150,296],[50,296],[58,282],[97,280],[97,212],[40,150]],
      interior: [[64,84],[136,84],[155,150],[100,206],[45,150]],
      liquidTop: 118
    },
    flute: {
      outline: [[78,50],[122,50],[120,160],[114,270],[140,290],[130,300],[70,300],[60,290],[86,270],[80,160]],
      interior: [[82,54],[118,54],[116,160],[112,266],[88,266],[84,160]],
      liquidTop: 80
    },
    mug: {
      outline: [[60,120],[140,120],[138,180],[136,240],[64,240],[62,180]],
      handle: [[150,150],[172,152],[172,204],[150,206]],
      interior: [[64,124],[136,124],[134,180],[132,236],[68,236],[66,180]],
      liquidTop: 140
    },
    snifter: {
      outline: [[78,90],[122,90],[164,180],[103,232],[103,260],[134,262],[140,272],[60,272],[66,262],[97,260],[97,232],[36,180]],
      interior: [[82,94],[118,94],[158,180],[100,226],[42,180]],
      liquidTop: 190
    },
    hurricane: {
      outline: [[56,50],[144,50],[134,110],[114,170],[128,230],[140,290],[146,300],[54,300],[60,290],[72,230],[86,170],[66,110]],
      interior: [[60,54],[140,54],[130,110],[112,170],[124,228],[136,286],[64,286],[76,228],[88,170],[70,110]],
      liquidTop: 90
    }
  };

  function pathFromPoints(points, close) {
    var d = "M" + points[0][0] + "," + points[0][1];
    for (var i = 1; i < points.length; i++) { d += " L" + points[i][0] + "," + points[i][1]; }
    if (close) d += " Z";
    return d;
  }

  function intersectAtY(a, b, yLine) {
    var t = (yLine - a[1]) / (b[1] - a[1]);
    return [a[0] + t * (b[0] - a[0]), yLine];
  }

  function clipPolygonBelow(points, yLine) {
    var out = [];
    var n = points.length;
    for (var i = 0; i < n; i++) {
      var curr = points[i], prev = points[(i - 1 + n) % n];
      var currIn = curr[1] >= yLine, prevIn = prev[1] >= yLine;
      if (currIn) {
        if (!prevIn) out.push(intersectAtY(prev, curr, yLine));
        out.push(curr);
      } else if (prevIn) {
        out.push(intersectAtY(prev, curr, yLine));
      }
    }
    return out;
  }

  function buildGlassSVG(glassType, liquidColor) {
    var shape = GLASS_SHAPES[glassType] || GLASS_SHAPES.coupe;
    var liquidPts = clipPolygonBelow(shape.interior, shape.liquidTop);
    var liquidD = liquidPts.length > 2 ? pathFromPoints(liquidPts, true) : "";
    var outlineD = pathFromPoints(shape.outline, true);
    var handleD = shape.handle ? pathFromPoints(shape.handle, false) : "";
    var facetA = shape.interior[0], facetB = shape.interior[Math.floor(shape.interior.length / 2)];
    var svg = '<svg class="cocktail-glass" viewBox="0 0 200 340" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">';
    svg += '<path class="glass-liquid" d="' + liquidD + '" fill="' + liquidColor + '"></path>';
    svg += '<path class="glass-outline" d="' + outlineD + '"></path>';
    if (handleD) svg += '<path class="glass-outline glass-handle" d="' + handleD + '"></path>';
    svg += '<line class="glass-facet" x1="' + facetA[0] + '" y1="' + facetA[1] + '" x2="' + facetB[0] + '" y2="' + facetB[1] + '"></line>';
    svg += '</svg>';
    return svg;
  }

  /* -----------------------------------------------------------
     Iconos de sesiones (día de la semana)
     ----------------------------------------------------------- */
  var DAY_ICONS = {
    vinyl: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20"/><circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="8.5"/><circle cx="24" cy="24" r="3" fill="currentColor" stroke="none"/></svg>',
    house: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 22 L24 7 L42 22"/><path d="M11 19 V41 H37 V19"/><path d="M20 41 V27 H28 V41"/></svg>',
    disco: '<svg viewBox="0 0 48 48" aria-hidden="true"><polygon points="24,5 34,11 40,21 40,29 34,39 24,45 14,39 8,29 8,21 14,11"/><path d="M8 21 L40 21 M8 29 L40 29 M14 11 L34 39 M34 11 L14 39"/></svg>',
    wave: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 30 Q12 18 20 30 T36 30 T44 22"/><path d="M4 20 Q12 8 20 20 T36 20 T44 12"/></svg>'
  };

  /* -----------------------------------------------------------
     Mounts idempotentes — pintan desde window.__PENUMBRA__
     ----------------------------------------------------------- */
  function mountCocktails() {
    var track = $("[data-cocktails-track]");
    if (!track || track.children.length > 0 || !data.cocktails) return;
    track.innerHTML = data.cocktails.map(function (c, i) {
      return '' +
        '<article class="cocktail-card" data-cocktail-card data-index="' + i + '" style="--glass-accent:' + escHTML(c.accent) + '">' +
          '<div class="cocktail-card-inner">' +
            '<div class="cocktail-top">' +
              '<span class="cocktail-series cocktail-series--' + (c.series === "Casa" ? "casa" : "temporada") + '">' + escHTML(c.series) + '</span>' +
              '<span class="cocktail-num">' + pad2(i + 1) + '</span>' +
            '</div>' +
            '<div class="cocktail-glass-wrap">' + buildGlassSVG(c.glass, c.liquid) + '</div>' +
            '<div class="cocktail-info">' +
              '<h3 class="cocktail-name">' + escHTML(c.name) + '</h3>' +
              '<p class="cocktail-subtitle">' + escHTML(c.subtitle) + '</p>' +
              '<ul class="cocktail-ingredients">' + c.ingredients.map(function (ing) { return "<li>" + escHTML(ing) + "</li>"; }).join("") + '</ul>' +
              '<p class="cocktail-description">' + escHTML(c.description) + '</p>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join("");

    var totalEl = $("[data-progress-total]");
    if (totalEl) totalEl.textContent = pad2(data.cocktails.length);

    var marqueeTrack = $("[data-ingredients-marquee]");
    if (marqueeTrack && marqueeTrack.children.length === 0) {
      var allIngredients = [];
      data.cocktails.forEach(function (c) { allIngredients = allIngredients.concat(c.ingredients); });
      var frag = allIngredients.map(function (ing) { return '<span class="marquee-item">' + escHTML(ing) + '</span><span class="marquee-dot">·</span>'; }).join("");
      marqueeTrack.innerHTML = frag;
    }
  }

  function mountSessions() {
    var target = $("[data-sessions]");
    if (!target || target.children.length > 0 || !data.sessions) return;
    target.innerHTML = data.sessions.map(function (s, i) {
      return '' +
        '<article class="session-row" data-reveal style="--session-accent:' + escHTML(s.accent) + '">' +
          '<span class="session-index">0' + (i + 1) + '</span>' +
          '<span class="session-icon">' + (DAY_ICONS[s.icon] || "") + '</span>' +
          '<span class="session-day">' + escHTML(s.day) + '</span>' +
          '<span class="session-genre">' + escHTML(s.genre) + '</span>' +
          '<span class="session-line">' + escHTML(s.line) + '</span>' +
        '</article>';
    }).join("");
  }

  function mountGallery() {
    var lanes = [$("[data-gallery-lane='1']"), $("[data-gallery-lane='2']"), $("[data-gallery-lane='3']")];
    if (!lanes[0] || lanes[0].children.length > 0 || !data.gallery || !data.gallery.length) return;
    var items = data.gallery;
    var buckets = [[], [], []];
    items.forEach(function (item, i) { buckets[i % 3].push(item); });
    lanes.forEach(function (lane, laneIndex) {
      if (!lane) return;
      var imgsHTML = buckets[laneIndex].map(function (item) {
        return '<figure class="gallery-item"><img src="assets/img/' + item.id + '.jpg" alt="' + escHTML(item.alt) + '" loading="lazy" decoding="async" /></figure>';
      }).join("");
      lane.innerHTML = imgsHTML + imgsHTML;
    });
  }

  /* -----------------------------------------------------------
     Splash — doble red de seguridad
     ----------------------------------------------------------- */
  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") { setTimeout(hide, 900); }
    else { window.addEventListener("load", function () { setTimeout(hide, 700); }); }
    setTimeout(hide, 3600);
  }

  /* -----------------------------------------------------------
     Cursor personalizado con etiqueta contextual
     ----------------------------------------------------------- */
  function initCursor() {
    var root = $("[data-cursor-root]");
    if (!root || !fineHover) return;
    document.documentElement.classList.add("has-cursor");
    var ring = root.querySelector(".cursor-ring");
    var dot = root.querySelector(".cursor-dot");
    var label = root.querySelector(".cursor-label");
    var tx = 0, ty = 0, rx = 0, ry = 0, firstMove = false;

    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (dot) dot.style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
      if (!firstMove) {
        firstMove = true;
        rx = tx; ry = ty;
        if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
        root.classList.add("is-ready");
      }
    }, { passive: true });

    function tick() {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      if (label) label.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    document.addEventListener("mouseover", function (e) {
      var el = e.target.closest ? e.target.closest("[data-cursor]") : null;
      if (el) {
        root.classList.add("is-interactive");
        if (label) label.textContent = el.getAttribute("data-cursor") || "";
      }
    });
    document.addEventListener("mouseout", function (e) {
      var el = e.target.closest ? e.target.closest("[data-cursor]") : null;
      if (el && (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest("[data-cursor]"))) {
        root.classList.remove("is-interactive");
        if (label) label.textContent = "";
      }
    });
  }

  /* -----------------------------------------------------------
     Navegación — sticky, burger móvil, scroll suave nativo
     ----------------------------------------------------------- */
  function initNav() {
    var nav = $(".nav");
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var burger = $("[data-burger]");
    var mobileNav = $("[data-mobile-nav]");
    if (burger && mobileNav) {
      burger.addEventListener("click", function () {
        var isOpen = mobileNav.classList.toggle("is-open");
        burger.classList.toggle("is-open", isOpen);
        burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
        mobileNav.setAttribute("aria-hidden", isOpen ? "false" : "true");
        document.body.classList.toggle("nav-open", isOpen);
      });
      $$("a", mobileNav).forEach(function (a) {
        a.addEventListener("click", function () {
          mobileNav.classList.remove("is-open");
          burger.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
          mobileNav.setAttribute("aria-hidden", "true");
          document.body.classList.remove("nav-open");
        });
      });
    }
  }

  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navEl = $(".nav");
      var offset = navEl ? navEl.offsetHeight + 8 : 80;
      var top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  /* -----------------------------------------------------------
     Reveals — IntersectionObserver + red de seguridad 6s
     ----------------------------------------------------------- */
  function initReveals() {
    var els = $$("[data-reveal]");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      $$("[data-reveal]:not(.is-revealed)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* -----------------------------------------------------------
     Marquees genéricos (hero, gráficos de galería ya usan CSS)
     ----------------------------------------------------------- */
  function initMarquees() {
    $$("[data-marquee]").forEach(function (track) {
      if (track.dataset.marqueeCloned) return;
      var clone = track.cloneNode(true);
      clone.removeAttribute("data-marquee");
      clone.setAttribute("aria-hidden", "true");
      track.parentNode.appendChild(clone);
      track.dataset.marqueeCloned = "1";
    });
  }

  /* -----------------------------------------------------------
     Carrusel de cócteles — pin horizontal en desktop,
     swipe nativo en móvil. Dibuja cada copa al entrar.
     ----------------------------------------------------------- */
  function initCocktailsCarousel() {
    var section = $("[data-cocktails-section]");
    var viewport = $("[data-cocktails-viewport]");
    var track = $("[data-cocktails-track]");
    if (!section || !viewport || !track) return;

    var cards = $$(".cocktail-card", track);
    if (!cards.length) return;

    // Preparar cada copa: calcular longitud de trazo para el dibujo animado
    cards.forEach(function (card) {
      var outline = card.querySelector(".glass-outline:not(.glass-handle)");
      var handle = card.querySelector(".glass-handle");
      [outline, handle].forEach(function (path) {
        if (!path || typeof path.getTotalLength !== "function") return;
        try {
          var len = path.getTotalLength();
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
        } catch (e) { /* noop */ }
      });
    });

    var currentIndex = 0;
    var prevBtn = $("[data-cocktails-prev]");
    var nextBtn = $("[data-cocktails-next]");

    function updateProgress(index) {
      currentIndex = index;
      var current = $("[data-progress-current]");
      if (current) current.textContent = pad2(index + 1);
      if (prevBtn) prevBtn.disabled = index <= 0;
      if (nextBtn) nextBtn.disabled = index >= cards.length - 1;
    }

    function markSeen(card) {
      if (card.classList.contains("is-seen")) return;
      card.classList.add("is-seen");
      var outline = card.querySelector(".glass-outline:not(.glass-handle)");
      var handle = card.querySelector(".glass-handle");
      [outline, handle].forEach(function (path) {
        if (path) path.style.strokeDashoffset = "0";
      });
    }

    var io = new IntersectionObserver(function (entries) {
      var best = null;
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          markSeen(entry.target);
          if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
        }
      });
      if (best) updateProgress(parseInt(best.target.getAttribute("data-index"), 10) || 0);
    }, { threshold: [0.4, 0.6, 0.8], root: null });
    cards.forEach(function (c) { io.observe(c); });

    setTimeout(function () {
      cards.forEach(function (card) {
        var r = card.getBoundingClientRect();
        if (r.left < window.innerWidth && r.right > 0) markSeen(card);
      });
    }, 6000);

    // Desktop: GSAP pin + traslación horizontal
    var pinST = null;

    function setupDesktopPin() {
      if (!window.gsap || !window.ScrollTrigger) return;
      if (window.innerWidth < 1024) return;
      var distance = track.scrollWidth - viewport.clientWidth;
      if (distance <= 0) return;
      gsap.set(track, { x: 0 });
      var tween = gsap.to(track, {
        x: function () { return -distance; },
        ease: "none",
        scrollTrigger: {
          id: "cocktails-pin",
          trigger: section,
          start: "top top+=72",
          end: function () { return "+=" + (distance + window.innerHeight * 0.4); },
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });
      pinST = tween.scrollTrigger;
    }

    function teardownDesktopPin() {
      if (!window.ScrollTrigger) return;
      ScrollTrigger.getAll().forEach(function (st) { if (st.vars.id === "cocktails-pin") st.kill(); });
      gsap.set(track, { x: 0, clearProps: "transform" });
      pinST = null;
    }

    var isDesktop = window.innerWidth >= 1024;
    if (isDesktop) setupDesktopPin();

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var nowDesktop = window.innerWidth >= 1024;
        if (nowDesktop !== isDesktop) {
          isDesktop = nowDesktop;
          teardownDesktopPin();
          if (isDesktop) setupDesktopPin();
        } else if (isDesktop && window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }, 250);
    });

    // Scroll animado propio — no depende del "smooth" nativo del navegador,
    // que puede quedarse atascado al chocar con el pin de ScrollTrigger.
    // Token de cancelación: si se hace clic varias veces seguidas, solo
    // gana la animación más reciente (evita que compitan entre sí).
    var scrollAnimToken = 0;
    function animatedScrollTo(targetY) {
      var myToken = ++scrollAnimToken;
      var startY = window.scrollY;
      var delta = targetY - startY;
      if (Math.abs(delta) < 2) return;
      var duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 220 : 750;
      var startTime = null;
      function step(ts) {
        if (myToken !== scrollAnimToken) return;
        if (!startTime) startTime = ts;
        var t = Math.min(1, (ts - startTime) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        // behavior:"auto" fuerza salto instantáneo por frame — si no,
        // el scroll-behavior:smooth global del CSS pelea con cada
        // llamada y el scroll nunca llega a su destino.
        window.scrollTo({ top: startY + delta * eased, behavior: "auto" });
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // La fracción de scroll no es "index / n" — el viewport muestra varias
    // tarjetas a la vez, así que hay que centrar cada tarjeta según su
    // posición real dentro del track.
    function cardFrac(card) {
      var distance = track.scrollWidth - viewport.clientWidth;
      if (distance <= 0) return 0;
      var cardCenter = card.offsetLeft + card.offsetWidth / 2;
      var viewportCenter = viewport.clientWidth / 2;
      return Math.max(0, Math.min(1, (cardCenter - viewportCenter) / distance));
    }

    function nearestIndexForProgress(progress) {
      var best = 0, bestDiff = Infinity;
      cards.forEach(function (card, i) {
        var diff = Math.abs(cardFrac(card) - progress);
        if (diff < bestDiff) { bestDiff = diff; best = i; }
      });
      return best;
    }

    // Ir a una copa concreta — botones de flecha (pin en desktop, scroll nativo en móvil)
    function goTo(index) {
      index = Math.max(0, Math.min(cards.length - 1, index));
      var card = cards[index];
      if (!card) return;
      if (isDesktop && pinST) {
        var target = pinST.start + (pinST.end - pinST.start) * cardFrac(card);
        animatedScrollTo(target);
      } else {
        var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", inline: "center", block: "nearest" });
      }
      updateProgress(index);
      markSeen(card);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(currentIndex + 1); });

    // Arrastrar las copas con el ratón o el dedo para pasar a la
    // siguiente/anterior — solo en desktop, donde la sección va pineada
    // (en móvil ya existe el deslizamiento nativo del navegador).
    var drag = null;
    track.addEventListener("pointerdown", function (e) {
      if (!isDesktop || !pinST || e.button === 2) return;
      drag = { startX: e.clientX, startY: window.scrollY, pointerId: e.pointerId, moved: false };
      track.classList.add("is-dragging");
      try { track.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    });
    track.addEventListener("pointermove", function (e) {
      if (!drag || drag.pointerId !== e.pointerId) return;
      var deltaX = e.clientX - drag.startX;
      if (!drag.moved && Math.abs(deltaX) > 4) drag.moved = true;
      if (!drag.moved) return;
      e.preventDefault();
      var distance = track.scrollWidth - viewport.clientWidth;
      if (distance <= 0) return;
      var scale = (pinST.end - pinST.start) / distance;
      window.scrollTo({ top: drag.startY - deltaX * scale, behavior: "auto" });
    });
    function endDrag(e) {
      if (!drag) return;
      var wasDrag = drag.moved;
      track.classList.remove("is-dragging");
      try { track.releasePointerCapture(drag.pointerId); } catch (err) { /* noop */ }
      drag = null;
      if (wasDrag && pinST) {
        var progress = (window.scrollY - pinST.start) / (pinST.end - pinST.start);
        goTo(nearestIndexForProgress(Math.max(0, Math.min(1, progress))));
      }
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    updateProgress(0);
  }

  /* -----------------------------------------------------------
     Aurora reactiva — desplazamiento lento (autónomo, no
     gateado por reduced-motion: es funcional, no intrusivo)
     ----------------------------------------------------------- */
  function initAurora() {
    var aurora = $("[data-aurora]");
    if (!aurora) return;
    var mx = 50, my = 40, tx = 50, ty = 40;
    if (fineHover) {
      window.addEventListener("mousemove", function (e) {
        tx = (e.clientX / window.innerWidth) * 100;
        ty = (e.clientY / window.innerHeight) * 100;
      }, { passive: true });
    }
    function frame() {
      mx += (tx - mx) * 0.02;
      my += (ty - my) * 0.02;
      aurora.style.setProperty("--aurora-x", mx + "%");
      aurora.style.setProperty("--aurora-y", my + "%");
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* -----------------------------------------------------------
     Tilt suave para la tarjeta de eventos privados
     ----------------------------------------------------------- */
  function initEventsTilt() {
    if (!fineHover) return;
    var card = $("[data-tilt]");
    if (!card) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      tx = -py * 4.5; ty = px * 4.5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    card.addEventListener("mouseleave", function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    function loop() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      card.style.setProperty("--tilt-x", cx.toFixed(2) + "deg");
      card.style.setProperty("--tilt-y", cy.toFixed(2) + "deg");
      raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
    }
  }

  /* -----------------------------------------------------------
     Formulario de reserva — abre WhatsApp con el mensaje listo
     ----------------------------------------------------------- */
  function initReserveForm() {
    var form = $("[data-reserve-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var name = (form.elements.nombre && form.elements.nombre.value.trim()) || "";
      var phone = (form.elements.telefono && form.elements.telefono.value.trim()) || "";
      var day = (form.elements.dia && form.elements.dia.value) || "";
      var people = (form.elements.personas && form.elements.personas.value) || "";
      var note = (form.elements.nota && form.elements.nota.value.trim()) || "";

      var lines = [
        "Hola Penumbra, quiero reservar mesa.",
        "Nombre: " + name,
        "Teléfono: " + phone,
        "Día: " + day,
        "Personas: " + people
      ];
      if (note) lines.push("Nota: " + note);

      var msg = encodeURIComponent(lines.join("\n"));
      var wa = "https://wa.me/" + (brand.whatsapp || "34910223344") + "?text=" + msg;
      window.open(wa, "_blank", "noopener");
    });
  }

  /* -----------------------------------------------------------
     Volver arriba
     ----------------------------------------------------------- */
  function initBackToTop() {
    var link = $("[data-back-to-top]");
    if (!link) return;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  /* -----------------------------------------------------------
     Año en el footer / detalles menores
     ----------------------------------------------------------- */
  function initMisc() {
    var yearEls = $$("[data-year]");
    var year = String(new Date().getFullYear());
    yearEls.forEach(function (el) { el.textContent = year; });
  }

  /* -----------------------------------------------------------
     Boot
     ----------------------------------------------------------- */
  function boot() {
    safe(mountCocktails, "mountCocktails");
    safe(mountSessions, "mountSessions");
    safe(mountGallery, "mountGallery");

    safe(initSplash, "initSplash");
    safe(initCursor, "initCursor");
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initMarquees, "initMarquees");
    safe(initAurora, "initAurora");
    safe(initEventsTilt, "initEventsTilt");
    safe(initReserveForm, "initReserveForm");
    safe(initBackToTop, "initBackToTop");
    safe(initMisc, "initMisc");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* noop */ }
      safe(initCocktailsCarousel, "initCocktailsCarousel");
    } else {
      safe(initCocktailsCarousel, "initCocktailsCarousel");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
