/* RR International Group — homepage behaviour
   Header, mobile menu, scroll reveal, counters, the brand-structure slider,
   the principles accordion and the banner film. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ---------------------------------------------------------- header */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  var onScroll = function () {
    nav.classList.toggle("is-stuck", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
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

  if (hasIO && sections.length) {
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

  if (reduced || !hasIO) {
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );
    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* ---- grids arrive one card at a time -------------------------------- */
  var GRIDS = ".stats, .track, .values, .sectors, .paths, .chips";

  [].slice.call(document.querySelectorAll(GRIDS)).forEach(function (grid) {
    grid.classList.add("stagger");
    [].slice.call(grid.children).forEach(function (child, i) {
      child.style.transitionDelay = (Math.min(i, 8) * 0.06).toFixed(3) + "s";
    });

    if (reduced || !hasIO) { grid.classList.add("is-in"); return; }

    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        obs.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }).observe(grid);
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

          var dur = 1300, t0 = null;
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

  /* ================================================================
     Brand structure slider
     One slide per stage of the group. Arrows, dots, drag and the
     arrow keys all move the same track; it advances on its own until
     the visitor touches it, and pauses while the pointer is over it.
     ================================================================ */
  (function () {
    var root = document.getElementById("brandSlider");
    var track = document.getElementById("brandTrack");
    var dotWrap = document.getElementById("brandDots");
    if (!root || !track) return;

    var slides = [].slice.call(track.children);
    if (!slides.length) return;

    var index = 0;
    var timer = null;
    var stopped = false;
    var DELAY = 6500;

    /* dots */
    var dots = slides.map(function (_, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "dot";
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.addEventListener("click", function () { stop(); go(i); });
      dotWrap.appendChild(d);
      return d;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translate3d(" + (-index * 100) + "%,0,0)";
      dots.forEach(function (d, n) {
        d.classList.toggle("is-on", n === index);
        d.setAttribute("aria-current", n === index ? "true" : "false");
      });
      slides.forEach(function (s, n) {
        s.classList.toggle("is-current", n === index);
        // only the visible slide is reachable by tab / screen reader
        s.setAttribute("aria-hidden", n === index ? "false" : "true");
      });
    }

    function next(step) { go(index + step); }

    function play() {
      if (reduced || stopped || timer) return;
      timer = setInterval(function () { next(1); }, DELAY);
    }

    function pause() { clearInterval(timer); timer = null; }

    /* once the visitor drives it, it stops driving itself */
    function stop() { stopped = true; pause(); }

    [].slice.call(root.querySelectorAll(".sbtn")).forEach(function (b) {
      b.addEventListener("click", function () {
        stop();
        next(parseInt(b.getAttribute("data-dir"), 10) || 1);
      });
    });

    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop);

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { stop(); next(1); }
      else if (e.key === "ArrowLeft") { stop(); next(-1); }
    });

    /* drag / swipe */
    var startX = 0, dragging = false;

    root.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
    });

    root.addEventListener("pointerup", function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 45) { stop(); next(dx < 0 ? 1 : -1); }
    });

    root.addEventListener("pointercancel", function () { dragging = false; });

    go(0);

    /* only runs while it is actually on screen */
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? play() : pause(); });
      }, { threshold: 0.35 }).observe(root);
    } else {
      play();
    }
  })();

  /* ================================================================
     Five Principles — accordion
     One panel open at a time, so the whole section stays inside a
     single screen.
     ================================================================ */
  (function () {
    var acc = document.getElementById("wayAcc");
    if (!acc) return;

    var items = [].slice.call(acc.querySelectorAll(".acc__item"));

    items.forEach(function (item) {
      var btn = item.querySelector(".acc__btn");
      if (!btn) return;

      btn.addEventListener("click", function () {
        var open = item.classList.contains("is-open");

        items.forEach(function (other) {
          other.classList.remove("is-open");
          var b = other.querySelector(".acc__btn");
          if (b) b.setAttribute("aria-expanded", "false");
        });

        if (!open) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  })();

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
     Two clips carry the banner: the business district at speed, with the
     Gulf skyline crossfading over it every few seconds. The still beneath
     holds the banner until the first frame decodes, and if a file is
     missing the still simply carries on.

     Nothing starts under reduced motion — those visitors get the still. */
  if (!reduced) {
    // one clip is plenty on a phone — the second is megabytes of mobile data
    // for a banner nobody holds still on
    if (window.innerWidth <= 980) {
      var second = document.querySelector(".hero__video--over");
      if (second) second.remove();
    }

    var small = window.innerWidth <= 980;

    [].slice.call(document.querySelectorAll(".hero__video")).forEach(function (film) {
      film.addEventListener("canplay", function () { film.classList.add("is-ready"); }, { once: true });
      film.addEventListener("error", function () { film.remove(); }, { once: true });

      // the source is chosen here, not in the markup — a phone takes the 720p
      // cut, and nothing is fetched at all until this runs
      var src = (small && film.getAttribute("data-src-sm")) || film.getAttribute("data-src");
      if (!src) return;
      film.src = src;
      film.load();

      var playing = film.play();
      if (playing && typeof playing.catch === "function") { playing.catch(function () {}); }
    });

    var over = document.querySelector(".hero__video--over");
    if (over) {
      setInterval(function () { over.classList.toggle("is-front"); }, 7000);
    }
  } else {
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
