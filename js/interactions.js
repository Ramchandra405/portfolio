/**
 * js/interactions.js
 * Lightweight, dependency-free motion polish:
 * - Cursor glow that follows the pointer
 * - Magnetic buttons that nudge toward the cursor
 * - Scroll-reveal for .reveal elements
 * - 3D tilt on the hero photo
 * All respect prefers-reduced-motion.
 */
(function () {
  "use strict";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(hover: none)").matches;

  /* ------------------------------------------------------------------ */
  /* CURSOR GLOW                                                         */
  /* ------------------------------------------------------------------ */
  function initCursorGlow() {
    const glow = document.getElementById("cursorGlow");
    if (!glow || reducedMotion || isCoarsePointer) return;

    let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    let curX = targetX, curY = targetY;

    window.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      glow.classList.add("is-active");
    });
    document.addEventListener("mouseleave", () => glow.classList.remove("is-active"));

    function loop() {
      curX += (targetX - curX) * 0.15;
      curY += (targetY - curY) * 0.15;
      glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ------------------------------------------------------------------ */
  /* MAGNETIC BUTTONS                                                    */
  /* ------------------------------------------------------------------ */
  function initMagneticButtons() {
    if (reducedMotion || isCoarsePointer) return;
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* SCROLL REVEAL                                                       */
  /* ------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
  }

  // Also mark section heads / project cards / cert cards / skill pills as reveal
  // targets even though they weren't hand-annotated in the HTML — this keeps
  // main.js's dynamically-rendered content free of markup churn.
  function autoTagRevealTargets() {
    document
      .querySelectorAll(".project-card, .cert-card, .skill-orb, .stat-card, .section__head")
      .forEach((el) => {
        if (!el.classList.contains("reveal")) el.classList.add("reveal");
      });
  }

  /* ------------------------------------------------------------------ */
  /* HERO PHOTO 3D TILT                                                  */
  /* ------------------------------------------------------------------ */
  function initPhotoTilt() {
    const tilt = document.getElementById("heroPhotoTilt");
    if (!tilt || reducedMotion || isCoarsePointer) return;

    tilt.addEventListener("mousemove", (e) => {
      const rect = tilt.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tilt.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
    });
    tilt.addEventListener("mouseleave", () => {
      tilt.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg)";
    });
  }

  /* ------------------------------------------------------------------ */
  /* HERO TYPEWRITER (type → hold → delete → retype, looping)           */
  /* ------------------------------------------------------------------ */
  function initHeroTypewriter() {
    const P = window.PERSONAL;
    const nameEl = document.getElementById("heroName");
    const roleEl = document.getElementById("heroRoleLine");
    if (!P || !nameEl || !roleEl) return;

    const nameText = `"${P.name}"`;
    const roles = (P.roles && P.roles.length ? P.roles : [P.role]).map((r) => `"${r}"`);

    if (reducedMotion) {
      nameEl.textContent = nameText;
      roleEl.textContent = roles[0];
      return;
    }

    const TYPE_SPEED = 38;
    const DELETE_SPEED = 22;
    const HOLD_AFTER_TYPE = 2200;
    const HOLD_AFTER_DELETE = 300;

    function typeInto(el, text, speed) {
      return new Promise((resolve) => {
        let i = 0;
        el.classList.add("typing-cursor");
        (function step() {
          el.textContent = text.slice(0, i);
          i++;
          if (i <= text.length) setTimeout(step, speed);
          else resolve();
        })();
      });
    }

    function deleteFrom(el, text, speed) {
      return new Promise((resolve) => {
        let i = text.length;
        (function step() {
          el.textContent = text.slice(0, i);
          i--;
          if (i >= 0) setTimeout(step, speed);
          else resolve();
        })();
      });
    }

    function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

    async function loop() {
      // Name is typed once and stays.
      await typeInto(nameEl, nameText, TYPE_SPEED);
      nameEl.classList.remove("typing-cursor");

      let i = 0;
      while (true) {
        const roleText = roles[i % roles.length];
        await typeInto(roleEl, roleText, TYPE_SPEED);
        await wait(HOLD_AFTER_TYPE);
        await deleteFrom(roleEl, roleText, DELETE_SPEED);
        await wait(HOLD_AFTER_DELETE);
        i++;
      }
    }
    loop();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCursorGlow();
    initMagneticButtons();
    initPhotoTilt();
    initHeroTypewriter();

    // Give main.js's async renders (projects, certs, github stats) a beat
    // to land in the DOM before wiring up reveal-on-scroll for them.
    setTimeout(() => {
      autoTagRevealTargets();
      initScrollReveal();
    }, 150);
  });
})();
