/* RR International Group — homepage behaviour
   Subtle and corporate: sticky header, mobile menu, scroll reveal, hero video handoff. */

(function () {
  "use strict";

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

  // close the mobile menu after a jump
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
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* --------------------------------------------------- hero video */
  // The Ken Burns stills run underneath at all times. The film is revealed only
  // once it genuinely has frames, so a missing file never shows a black panel.
  var video = document.querySelector(".hero__video");
  if (video) {
    video.addEventListener("canplay", function () { video.classList.add("is-ready"); }, { once: true });
    video.addEventListener("error", function () { video.remove(); });

    // some browsers block autoplay until the element is muted + in view
    var play = video.play();
    if (play && typeof play.catch === "function") { play.catch(function () {}); }
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
