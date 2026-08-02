/* RR International Group — homepage behaviour
   Sticky header, mobile menu, scroll reveal, brand marks,
   and the 3D story that plays in the banner. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- header */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  var onScroll = function () {
    nav.classList.toggle("is-stuck", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });

  /* ------------------------------------------------- active nav item */
  var sections = [].slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = [].slice.call(links.querySelectorAll('a[href^="#"]'));

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------- reveal on scroll */
  var revealables = [].slice.call(document.querySelectorAll(".reveal"));

  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------------------------------------------------- brand marks */
  // Each [data-logo] holds the real artwork plus a coded fallback. The image is
  // hidden until it genuinely loads, so a missing file is never a broken icon.
  [].slice.call(document.querySelectorAll("[data-logo]")).forEach(function (slot) {
    var img = slot.querySelector("img");
    if (!img) return;

    var reveal = function () {
      if (img.naturalWidth > 0) slot.classList.add("has-logo");
    };

    if (img.complete) reveal();
    else img.addEventListener("load", reveal, { once: true });
  });

  /* --------------------------------------- 3D tilt on the brand mark */
  var badge = document.getElementById("heroBadge");
  var hero = document.querySelector(".hero");

  if (badge && hero && !reduced && window.matchMedia("(hover: hover)").matches) {
    var badgeInner = badge.firstElementChild;

    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;

      badge.classList.add("is-tracking");
      badgeInner.style.transform =
        "rotateY(" + (nx * 34).toFixed(2) + "deg) " +
        "rotateX(" + (-ny * 22).toFixed(2) + "deg) translateZ(24px)";
    });

    hero.addEventListener("mouseleave", function () {
      badge.classList.remove("is-tracking");
      badgeInner.style.transform = "";
    });
  }

  /* ------------------------------------------------ banner background */
  var bgVideo = document.querySelector(".hero__video");

  if (bgVideo) {
    bgVideo.addEventListener("canplay", function () { bgVideo.classList.add("is-ready"); }, { once: true });
    bgVideo.addEventListener("error", function () { bgVideo.remove(); }, { once: true });

    var bgPlay = bgVideo.play();
    if (bgPlay && typeof bgPlay.catch === "function") { bgPlay.catch(function () {}); }
  }

  /* ==================================================================
     BANNER — the RR story, told in 3D

     One field of light points is re-formed chapter by chapter while the
     camera moves around it. Nothing is cut; every scene morphs out of
     the one before, which is what makes it read as a story rather than
     a slideshow:

       1  RIGHT PEOPLE     scattered points, each on its own
       2  RIGHT TIME       paths cross, connections strike
       3  RIGHT PRODUCT    connections settle into communities
       4  RIGHT HAND       communities rise into Bengaluru
       5  RIGHT JUSTICE    the camera pulls back — India on the globe
       6  THE CORRIDOR     routes light up to Kuwait and the GCC
       7  THE STAR         everything gathers into the RR compass star

     The five pillars in the headline light up in time with chapters 1-5.
     ================================================================== */

  var canvas = document.getElementById("heroParticles");

  if (canvas && canvas.getContext && !reduced) {
    var ctx = canvas.getContext("2d");

    var N = 460;           // story points
    var TR = 1.7;          // seconds of morph between chapters
    var PERSP = 3.0;

    var CHAPTERS = [
      { key: "people",  dur: 4.4, pillar: 0, cam: { d: 3.30, ry: 0.00, rx:  0.06 } },
      { key: "connect", dur: 4.4, pillar: 1, cam: { d: 3.15, ry: 0.55, rx:  0.10 } },
      { key: "cluster", dur: 4.4, pillar: 2, cam: { d: 3.05, ry: 1.15, rx:  0.16 } },
      { key: "city",    dur: 4.6, pillar: 3, cam: { d: 2.85, ry: 1.75, rx:  0.34 } },
      { key: "globe",   dur: 4.6, pillar: 4, cam: { d: 3.70, ry: 2.65, rx: -0.30 } },
      { key: "routes",  dur: 5.2, pillar: -1, cam: { d: 3.45, ry: 3.70, rx: -0.34 } },
      { key: "star",    dur: 4.8, pillar: -1, cam: { d: 3.60, ry: 4.60, rx:  0.00 } }
    ];

    var LOOP = CHAPTERS.reduce(function (s, c) { return s + c.dur; }, 0);

    /* [lat, lon] — the RR corridor, Bengaluru first */
    var CITIES = [
      [12.97, 77.59], [29.37, 47.98], [25.20, 55.27],
      [24.71, 46.68], [1.35, 103.82], [51.51, -0.13], [25.28, 51.52]
    ];
    var LABELS = ["Bengaluru", "Kuwait City", "Dubai", "Riyadh", "Singapore", "London", "Doha"];
    var ROUTES = [[0, 1], [0, 2], [0, 3], [0, 6], [0, 4], [1, 5]];

    var w = 0, h = 0, dpr = 1, R = 0, cx = 0, cy = 0, showLabels = true;
    var forms = {}, edges = { connect: [], cluster: [] };
    var nodes = [], arcs = [], starOutline = [];
    var t = 0, last = 0, visible = true, litPillar = -1;

    var pillarEls = [].slice.call(document.querySelectorAll(".hero .pillars li"));

    /* One glow sprite, stamped wherever it is needed. Building a radial
       gradient per point per frame is what makes canvas fields stutter. */
    var glow = document.createElement("canvas");
    glow.width = glow.height = 64;
    (function () {
      var g = glow.getContext("2d");
      var rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      rg.addColorStop(0, "rgba(255, 226, 150, 1)");
      rg.addColorStop(0.35, "rgba(232, 199, 102, .45)");
      rg.addColorStop(1, "rgba(232, 199, 102, 0)");
      g.fillStyle = rg;
      g.fillRect(0, 0, 64, 64);
    })();

    var stampGlow = function (x, y, r, alpha) {
      if (alpha <= 0.01) return;
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.drawImage(glow, x - r, y - r, r * 2, r * 2);
      ctx.globalAlpha = 1;
    };

    /* -------------------------------------------------- shapes */

    var rand = function (a, b) { return a + Math.random() * (b - a); };

    var toVec = function (lat, lon) {
      var la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180, c = Math.cos(la);
      return [c * Math.sin(lo), Math.sin(la), c * Math.cos(lo)];
    };

    /* the eight-point compass star from the RR monogram, in the XY plane */
    var starPoints = function (n) {
      var verts = [];
      for (var i = 0; i < 16; i++) {
        var a = (i * Math.PI) / 8;
        var r = i % 2 ? 0.16 : (i % 4 === 0 ? 1.02 : 0.48);
        verts.push([Math.sin(a) * r, Math.cos(a) * r]);
      }
      var lens = [], total = 0, j;
      for (j = 0; j < 16; j++) {
        var p0 = verts[j], p1 = verts[(j + 1) % 16];
        var l = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
        lens.push(l); total += l;
      }
      var out = [], step = total / n, edge = 0, walked = 0;
      for (var k = 0; k < n; k++) {
        var want = k * step;
        while (edge < 15 && walked + lens[edge] < want) { walked += lens[edge]; edge++; }
        var f = lens[edge] ? (want - walked) / lens[edge] : 0;
        var a0 = verts[edge], a1 = verts[(edge + 1) % 16];
        out.push([a0[0] + (a1[0] - a0[0]) * f, a0[1] + (a1[1] - a0[1]) * f, 0]);
      }
      return out;
    };

    var buildForms = function () {
      var i;

      /* 1 — scattered people, each alone in space */
      var people = [];
      for (i = 0; i < N; i++) {
        var u = rand(-1, 1), th = rand(0, Math.PI * 2), rr = Math.pow(Math.random(), 0.4) * 1.5;
        var s = Math.sqrt(1 - u * u);
        people.push([Math.cos(th) * s * rr, u * rr * 0.75, Math.sin(th) * s * rr]);
      }

      /* 2 — paths cross: points settle onto lines between meeting anchors */
      var anchors = [];
      for (i = 0; i < 9; i++) {
        anchors.push([rand(-1.2, 1.2), rand(-0.75, 0.75), rand(-1.1, 1.1)]);
      }
      var connect = [], SEG = 12, per = Math.ceil(N / SEG);
      edges.connect = [];
      for (var s2 = 0; s2 < SEG; s2++) {
        var a = anchors[s2 % anchors.length];
        var b = anchors[(s2 * 3 + 4) % anchors.length];
        for (var q = 0; q < per && connect.length < N; q++) {
          var f = q / (per - 1 || 1);
          connect.push([
            a[0] + (b[0] - a[0]) * f + rand(-0.03, 0.03),
            a[1] + (b[1] - a[1]) * f + rand(-0.03, 0.03),
            a[2] + (b[2] - a[2]) * f + rand(-0.03, 0.03)
          ]);
          if (q > 0) edges.connect.push([connect.length - 2, connect.length - 1]);
        }
      }
      while (connect.length < N) connect.push(people[connect.length]);

      /* 3 — communities: the lines gather into six standing groups */
      var cluster = [], HUBS = 6, hubs = [];
      for (i = 0; i < HUBS; i++) {
        var ang = (i / HUBS) * Math.PI * 2;
        hubs.push([Math.cos(ang) * 0.92, rand(-0.15, 0.15), Math.sin(ang) * 0.92]);
      }
      edges.cluster = [];
      for (i = 0; i < N; i++) {
        var hub = i % HUBS;
        var c = hubs[hub];
        cluster.push([
          c[0] + rand(-0.24, 0.24), c[1] + rand(-0.26, 0.26), c[2] + rand(-0.24, 0.24)
        ]);
        if (i >= HUBS && i % 2 === 0) edges.cluster.push([hub, i]);
      }

      /* 4 — Bengaluru rises: the groups become a skyline */
      var city = [], BARS = 30;
      for (i = 0; i < N; i++) {
        var bar = i % BARS;
        var bx = -1.25 + (bar / (BARS - 1)) * 2.5;
        var seed = Math.abs(Math.sin(bar * 12.9898) * 43758.5453) % 1;
        var tall = 0.18 + seed * 0.95;
        var up = Math.floor(i / BARS) / Math.ceil(N / BARS);
        city.push([bx + rand(-0.02, 0.02), -0.85 + up * tall, rand(-0.35, 0.35)]);
      }

      /* 5 & 6 — the world */
      var globe = [], golden = Math.PI * (3 - Math.sqrt(5));
      for (i = 0; i < N; i++) {
        var y = 1 - (i / (N - 1)) * 2;
        var ring = Math.sqrt(Math.max(0, 1 - y * y));
        var th2 = i * golden;
        globe.push([Math.cos(th2) * ring, y, Math.sin(th2) * ring]);
      }

      /* 7 — the star */
      starOutline = starPoints(N);

      forms = {
        people: people, connect: connect, cluster: cluster,
        city: city, globe: globe, routes: globe, star: starOutline
      };

      /* corridor geometry */
      nodes = CITIES.map(function (c2) { return toVec(c2[0], c2[1]); });
      arcs = ROUTES.map(function (route) {
        var p = nodes[route[0]], q2 = nodes[route[1]], pts = [], STEPS = 40;
        for (var m = 0; m <= STEPS; m++) {
          var fm = m / STEPS;
          var dot = Math.max(-1, Math.min(1, p[0] * q2[0] + p[1] * q2[1] + p[2] * q2[2]));
          var om = Math.acos(dot), sn = Math.sin(om);
          var c1 = sn < 1e-4 ? 1 - fm : Math.sin((1 - fm) * om) / sn;
          var c2b = sn < 1e-4 ? fm : Math.sin(fm * om) / sn;
          var lift = 1 + 0.26 * Math.sin(Math.PI * fm);
          pts.push([
            (p[0] * c1 + q2[0] * c2b) * lift,
            (p[1] * c1 + q2[1] * c2b) * lift,
            (p[2] * c1 + q2[2] * c2b) * lift
          ]);
        }
        return pts;
      });
    };

    var resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      R = Math.min(w * 0.34, h * 0.42);
      cx = w / 2;
      cy = h * 0.52;
      showLabels = w > 720;
    };

    /* -------------------------------------------------- timeline */

    var ease = function (x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    // where we are: chapter index, and how far we have morphed into the next
    var cursor = function () {
      var p = t % LOOP, i = 0;
      while (p >= CHAPTERS[i].dur) { p -= CHAPTERS[i].dur; i++; }
      var d = CHAPTERS[i].dur;
      var f = p > d - TR ? ease((p - (d - TR)) / TR) : 0;
      return { i: i, next: (i + 1) % CHAPTERS.length, f: f, wrapped: i === CHAPTERS.length - 1 };
    };

    var weightOf = function (key, c) {
      var v = 0;
      if (CHAPTERS[c.i].key === key) v += 1 - c.f;
      if (CHAPTERS[c.next].key === key) v += c.f;
      return v;
    };

    /* -------------------------------------------------- drawing */

    var project = function (v, cam) {
      var cosY = cam.cosY, sinY = cam.sinY, cosX = cam.cosX, sinX = cam.sinX;
      var x = v[0] * cosY + v[2] * sinY;
      var z = -v[0] * sinY + v[2] * cosY;
      var y = v[1];
      var y2 = y * cosX - z * sinX;
      var z2 = y * sinX + z * cosX;
      var k = cam.d / Math.max(0.35, cam.d - z2);
      return [cx + x * R * k, cy - y2 * R * k, z2, k];
    };

    var draw = function () {
      var c = cursor();
      var A = CHAPTERS[c.i], B = CHAPTERS[c.next];
      var f = c.f;

      // camera — unwind the loop so the rotation never snaps backwards
      var ryB = c.wrapped ? B.cam.ry + Math.PI * 2 : B.cam.ry;
      var cam = {
        d:  A.cam.d  + (B.cam.d  - A.cam.d)  * f,
        ry: A.cam.ry + (ryB - A.cam.ry) * f + t * 0.035,
        rx: A.cam.rx + (B.cam.rx - A.cam.rx) * f
      };
      cam.cosY = Math.cos(cam.ry); cam.sinY = Math.sin(cam.ry);
      cam.cosX = Math.cos(cam.rx); cam.sinX = Math.sin(cam.rx);

      var from = forms[A.key], to = forms[B.key];
      var wGlobe = weightOf("globe", c) + weightOf("routes", c);
      var wRoutes = weightOf("routes", c);
      var wStar = weightOf("star", c);
      var wConnect = weightOf("connect", c);
      var wCluster = weightOf("cluster", c);
      var wCity = weightOf("city", c);

      ctx.clearRect(0, 0, w, h);

      /* --- the body of the world, while we are on it --- */
      if (wGlobe > 0.02) {
        var g = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.05);
        g.addColorStop(0, "rgba(23, 85, 160, " + (0.3 * wGlobe).toFixed(3) + ")");
        g.addColorStop(1, "rgba(15, 61, 116, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
        ctx.fill();
      }

      /* --- morph and plot every point --- */
      var pos = new Array(N);
      for (var i = 0; i < N; i++) {
        var a = from[i], b = to[i];
        var v = [
          a[0] + (b[0] - a[0]) * f,
          a[1] + (b[1] - a[1]) * f,
          a[2] + (b[2] - a[2]) * f
        ];
        pos[i] = project(v, cam);
      }

      /* --- connective tissue: beams, then spokes --- */
      var drawEdges = function (list, weight, colour) {
        if (weight < 0.03) return;
        ctx.lineWidth = 0.8;
        for (var e = 0; e < list.length; e++) {
          var p1 = pos[list[e][0]], p2 = pos[list[e][1]];
          if (!p1 || !p2) continue;
          var dd = (Math.max(p1[2], p2[2]) + 1) / 2;
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.strokeStyle = colour + (weight * (0.1 + dd * 0.36)).toFixed(3) + ")";
          ctx.stroke();
        }
      };

      drawEdges(edges.connect, wConnect, "rgba(226, 190, 94, ");
      drawEdges(edges.cluster, wCluster, "rgba(150, 196, 240, ");

      /* --- the corridor lights up --- */
      if (wRoutes > 0.02) {
        for (var r2 = 0; r2 < arcs.length; r2++) {
          var pts = arcs[r2], prev = null;
          for (var s3 = 0; s3 < pts.length; s3++) {
            var qq = project(pts[s3], cam);
            if (prev && (qq[2] > -0.25 || prev[2] > -0.25)) {
              var dd2 = (Math.max(qq[2], prev[2]) + 1) / 2;
              ctx.beginPath();
              ctx.moveTo(prev[0], prev[1]);
              ctx.lineTo(qq[0], qq[1]);
              ctx.strokeStyle = "rgba(226, 190, 94, " + (wRoutes * (0.1 + dd2 * 0.55)).toFixed(3) + ")";
              ctx.lineWidth = 0.7 + dd2;
              ctx.stroke();
            }
            prev = qq;
          }

          var fl = (t * 0.24 + r2 * 0.19) % 1;
          var pulse = project(pts[Math.floor(fl * (pts.length - 1))], cam);
          if (pulse[2] > -0.25) {
            var pr = 2.2 * pulse[3];
            stampGlow(pulse[0], pulse[1], pr * 5, 0.9 * wRoutes);
            ctx.beginPath();
            ctx.arc(pulse[0], pulse[1], pr, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 250, 235, " + wRoutes.toFixed(3) + ")";
            ctx.fill();
          }
        }
      }

      /* --- city nodes and their names --- */
      if (wGlobe > 0.05) {
        for (var n2 = 0; n2 < nodes.length; n2++) {
          var cnode = project(nodes[n2], cam);
          if (cnode[2] < -0.15) continue;

          var cd = (cnode[2] + 1) / 2;
          var home = n2 === 0;
          var base = (home ? 3.2 : 2.1) * cnode[3] * 0.8;

          var ring = (t * 0.5 + n2 * 0.4) % 1;
          ctx.beginPath();
          ctx.arc(cnode[0], cnode[1], base + ring * base * 4.5, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(226, 190, 94, " + ((1 - ring) * 0.35 * cd * wGlobe).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cnode[0], cnode[1], base, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 245, 218, " + ((0.55 + cd * 0.45) * wGlobe).toFixed(3) + ")";
          ctx.fill();

          if (!showLabels || cnode[2] < 0.12) continue;

          var fade = Math.min(1, (cnode[2] - 0.12) / 0.3) * (0.55 + cd * 0.45) * wGlobe;
          var flip = cnode[0] > w * 0.72;
          var lx = cnode[0] + (flip ? -1 : 1) * (base + 9);

          ctx.font = (home ? "600 12" : "500 10.5") + 'px "Inter", system-ui, sans-serif';
          ctx.textAlign = flip ? "right" : "left";
          ctx.textBaseline = "middle";
          if ("letterSpacing" in ctx) ctx.letterSpacing = home ? "0.18em" : "0.14em";

          ctx.beginPath();
          ctx.moveTo(cnode[0] + (flip ? -1 : 1) * base * 1.5, cnode[1]);
          ctx.lineTo(lx - (flip ? -1 : 1) * 3, cnode[1]);
          ctx.strokeStyle = "rgba(226, 190, 94, " + (fade * 0.5).toFixed(3) + ")";
          ctx.stroke();

          ctx.fillStyle = home
            ? "rgba(255, 243, 214, " + fade.toFixed(3) + ")"
            : "rgba(214, 231, 248, " + (fade * 0.82).toFixed(3) + ")";
          ctx.fillText(LABELS[n2].toUpperCase(), lx, cnode[1]);
          if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
        }
      }

      /* --- the points themselves --- */
      var warm = wCity + wStar + wConnect;
      for (var p3 = 0; p3 < N; p3++) {
        var pt = pos[p3];
        var depth = (pt[2] + 1) / 2;
        var size = Math.max(0.5, (0.55 + depth * 1.5) * pt[3] * 0.72 * (1 + wStar * 0.55));
        var alpha = (0.1 + depth * depth * 0.5) * (0.7 + wStar * 0.3);

        if (warm > 0.35 && depth > 0.45) {
          stampGlow(pt[0], pt[1], size * 4, alpha * 0.7 * warm);
        }

        ctx.beginPath();
        ctx.arc(pt[0], pt[1], size, 0, Math.PI * 2);
        ctx.fillStyle = warm > 0.35
          ? "rgba(255, 243, 214, " + Math.min(1, alpha * 1.6).toFixed(3) + ")"
          : "rgba(150, 196, 240, " + alpha.toFixed(3) + ")";
        ctx.fill();
      }

      /* --- the star closes the loop --- */
      if (wStar > 0.12) {
        ctx.beginPath();
        for (var s4 = 0; s4 < starOutline.length; s4++) {
          var sp = project(starOutline[s4], cam);
          if (s4 === 0) ctx.moveTo(sp[0], sp[1]); else ctx.lineTo(sp[0], sp[1]);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(232, 199, 102, " + ((wStar - 0.12) * 0.5).toFixed(3) + ")";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      /* --- light the matching pillar in the headline --- */
      var want = f > 0.5 ? B.pillar : A.pillar;
      if (want !== litPillar) {
        litPillar = want;
        pillarEls.forEach(function (el, idx) {
          el.classList.toggle("is-lit", idx === want);
        });
      }
    };

    var frame = function (now) {
      if (!last) last = now;
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (visible) { t += dt; draw(); }
      requestAnimationFrame(frame);
    };

    resize();
    buildForms();
    if (hero) hero.classList.add("story-on");
    requestAnimationFrame(frame);

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    });

    document.addEventListener("visibilitychange", function () {
      visible = !document.hidden;
      last = 0;
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting && !document.hidden;
        last = 0;
      }).observe(canvas);
    }
  }

  /* --------------------------------------------------- contact form */
  // No backend yet — wire the submit handler to the chosen mail/CRM endpoint.
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();

      if (!name || !email || email.indexOf("@") === -1) {
        status.textContent = "Please add your name and a valid email address.";
        return;
      }

      status.textContent =
        "Form is not connected yet — submissions will be delivered once the email endpoint is configured.";
    });
  }
})();
