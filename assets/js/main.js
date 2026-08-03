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
  // .orn rides the same observer: the section ornaments fade up and draw
  // themselves the moment their section comes into view.
  var revealables = [].slice.call(document.querySelectorAll(".reveal, .orn"));

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

  /* ================================================================
     Scroll motion: headline wipes, staggered grids, parallax,
     counters, and the pinned vision timeline.
     ================================================================ */

  var hasIO = "IntersectionObserver" in window;

  /* ---- headlines wipe up line by line -------------------------------- */
  // Split on the <br> already in the markup, so the designed line breaks are
  // the animation's line breaks. Inner <i> does the moving, outer .ln clips it.
  if (!reduced) {
    [].slice.call(document.querySelectorAll(".title")).forEach(function (title) {
      var lines = title.innerHTML.split(/<br\s*\/?>/i);
      if (!lines.length) return;

      title.innerHTML = lines
        .map(function (l) { return '<span class="ln"><i>' + l.trim() + "</i></span>"; })
        .join("");

      if (hasIO) {
        new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            en.target.classList.add("is-in");
            obs.unobserve(en.target);
          });
        }, { rootMargin: "0px 0px -14% 0px", threshold: 0.2 }).observe(title);
      } else {
        title.classList.add("is-in");
      }
    });
  }

  /* ---- grids arrive one card at a time -------------------------------- */
  var GRIDS = ".ways, .sectors, .roadmap, .paths, .principles, .figures, .tier__list";

  [].slice.call(document.querySelectorAll(GRIDS)).forEach(function (grid) {
    grid.classList.add("stagger");
    [].slice.call(grid.children).forEach(function (child, i) {
      child.style.transitionDelay = (i * 0.075).toFixed(3) + "s";
    });

    if (reduced || !hasIO) { grid.classList.add("is-in"); return; }

    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        obs.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }).observe(grid);
  });

  /* ---- counters ------------------------------------------------------- */
  if (hasIO) {
    [].slice.call(document.querySelectorAll("[data-count]")).forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var pad = parseInt(el.getAttribute("data-pad"), 10) || 0;

      var show = function (v) {
        var s = String(Math.round(v));
        while (s.length < pad) s = "0" + s;
        el.textContent = s;
      };

      show(reduced ? target : 0);
      if (reduced) return;

      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          obs.unobserve(en.target);

          var dur = 1500, t0 = null;
          var tick = function (now) {
            if (!t0) t0 = now;
            var p = Math.min(1, (now - t0) / dur);
            show(target * (1 - Math.pow(1 - p, 3)));   // ease-out
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.5 }).observe(el);
    });
  }

  /* ---- parallax + pinned runs, on one scroll loop --------------------- */

  // How far through the held banner we are, 0 → 1. The scroll loop writes it;
  // the banner film below reads it and quickens as the hold runs on.
  var heroProgress = 0;
  var films = [];
  var filmRate = 1;

  if (!reduced) {
    var parallaxEls = [].slice.call(document.querySelectorAll("[data-parallax]"));
    var heroPin = document.getElementById("heroPin");
    var pin = document.getElementById("visionPin");
    var fill = pin && pin.querySelector(".pin__fill");
    var phases = pin ? [].slice.call(pin.querySelectorAll(".phase")) : [];
    var ticking = false;

    var onFrame = function () {
      ticking = false;
      var vh = window.innerHeight;

      // depth: elements drift against the scroll at their own rate
      for (var i = 0; i < parallaxEls.length; i++) {
        var el = parallaxEls[i];
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var rate = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        var mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = "translate3d(0," + (-mid * rate).toFixed(1) + "px,0)";
      }

      // held banner: the track is taller than the screen, so the banner sticks
      // while that extra height scrolls past. --hp runs the whole hold and
      // drives the film; --ho is the closing hand-off to the next section.
      if (heroPin) {
        var hp = 0;
        if (window.innerWidth > 980) {
          var hspan = heroPin.offsetHeight - vh;
          if (hspan > 0) {
            hp = Math.min(1, Math.max(0, -heroPin.getBoundingClientRect().top / hspan));
          }
        }
        heroProgress = hp;
        heroPin.style.setProperty("--hp", hp.toFixed(4));
        // the copy holds for most of the run, then lifts away exactly as the
        // banner releases, so the hand-off is one movement rather than two
        heroPin.style.setProperty("--ho", Math.min(1, Math.max(0, (hp - 0.78) / 0.22)).toFixed(4));

        // the film runs faster the further into the hold you are, so the city
        // is at its quickest just as the banner hands the page on
        var rate = Math.round((1 + hp * 1.4) * 20) / 20;
        if (rate !== filmRate) {
          filmRate = rate;
          for (var fi = 0; fi < films.length; fi++) { films[fi].playbackRate = rate; }
        }
      }

      // pinned run: progress through the section lights the phases in turn
      if (pin && window.innerWidth > 980) {
        var pr = pin.getBoundingClientRect();
        var span = pin.offsetHeight - vh;
        var p = span > 0 ? Math.min(1, Math.max(0, -pr.top / span)) : 0;

        if (fill) fill.style.width = (p * 100).toFixed(1) + "%";

        var active = Math.min(phases.length, Math.floor(p * phases.length + 0.35) + 1);
        for (var j = 0; j < phases.length; j++) {
          phases[j].classList.toggle("is-on", j < active);
        }
      } else if (phases.length) {
        for (var k = 0; k < phases.length; k++) phases[k].classList.add("is-on");
      }
    };

    var queue = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onFrame);
    };

    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    queue();
  }

  /* ---- magnetic buttons ----------------------------------------------- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    [].slice.call(document.querySelectorAll(".btn")).forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform =
          "translate(" + (dx * 0.22).toFixed(1) + "px," + (dy * 0.3 - 2).toFixed(1) + "px)";
      });

      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
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

  /* ------------------------------------------------------ banner film -
     Two clips carry the banner: Kuwait City from the air, and a business
     district at night. Both loop; the upper one fades in and out over the
     lower, so the picture changes without ever cutting. The stills beneath
     hold the banner until the first frame decodes, and if a file is missing
     or the browser refuses to play, the stills simply carry on.

     Nothing starts under reduced motion — those visitors get the stills. */
  if (!reduced) {
    // one clip is plenty on a phone — the second is another 3.5 MB of mobile
    // data for a banner nobody holds still on
    if (window.innerWidth <= 980) {
      var second = document.querySelector(".hero__video--over");
      if (second) second.remove();
    }

    films = [].slice.call(document.querySelectorAll(".hero__video"));

    films.forEach(function (film) {
      film.addEventListener("canplay", function () { film.classList.add("is-ready"); }, { once: true });
      film.addEventListener("error", function () { film.remove(); }, { once: true });

      var playing = film.play();
      if (playing && typeof playing.catch === "function") { playing.catch(function () {}); }
    });

    // hand the banner from one clip to the other and back, on a slow rotation
    var over = document.querySelector(".hero__video--over");
    if (over) {
      setInterval(function () { over.classList.toggle("is-front"); }, 7000);
    }
  } else {
    // no film for reduced motion — and no reason to fetch several MB of it
    [].slice.call(document.querySelectorAll(".hero__video")).forEach(function (film) {
      film.remove();
    });
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
