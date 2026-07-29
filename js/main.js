/**
 * js/main.js
 * All interactivity is driven off window.PERSONAL (config/personal.js).
 * Sections: render, theme, github stats, projects, contact form, utilities.
 */
(function () {
  "use strict";
  const P = window.PERSONAL;
  if (!P) {
    console.error("config/personal.js failed to load — check the script tag order in index.html.");
    return;
  }

  /* ------------------------------------------------------------------ */
  /* THEME                                                              */
  /* ------------------------------------------------------------------ */
  function initTheme() {
    const stored = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (systemDark ? "dark" : "dark"); // default dark to match brand
    applyTheme(theme);

    document.getElementById("themeToggle").addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const label = document.getElementById("themeToggleLabel");
    if (label) label.textContent = theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode";
  }

  /* ------------------------------------------------------------------ */
  /* MOBILE NAV                                                         */
  /* ------------------------------------------------------------------ */
  function initMobileNav() {
    const btn = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("sidenav");
    btn.addEventListener("click", () => {
      const isOpen = nav.style.display === "flex";
      nav.style.display = isOpen ? "none" : "flex";
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
    // Close menu after navigating on mobile
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        if (window.innerWidth <= 900) nav.style.display = "none";
      })
    );
  }

  /* ------------------------------------------------------------------ */
  /* SCROLLSPY (highlight active nav item)                              */
  /* ------------------------------------------------------------------ */
  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll(".sidenav__tree a"));
    const sections = links
      .map((l) => document.querySelector(l.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ------------------------------------------------------------------ */
  /* RENDER: HERO / IDENTITY                                             */
  /* ------------------------------------------------------------------ */
  function renderIdentity() {
    document.title = P.seo.siteTitle;
    setMeta('meta[name="description"]', "content", P.seo.siteDescription);

    // heroName / heroRoleLine are now animated by the hero typewriter in
    // interactions.js, which reads P.name / P.role directly.
    byId("heroDisplayName").textContent = P.name;
    byId("heroRole").textContent = `${P.role} · ${P.degree}, ${P.university}`;
    byId("heroTagline").textContent = P.tagline;

    const ghBtn = byId("heroGithubBtn");
    ghBtn.href = P.social.github;

    const liBtn = byId("heroLinkedinBtn");
    if (liBtn) liBtn.href = P.social.linkedin;

    // Footer
    byId("footerName").textContent = `© ${new Date().getFullYear()} ${P.name}. Built with intent.`;
    renderSocialIcons(byId("footerSocials"));

    // Contact block
    byId("emailDisplay").textContent = P.email;
    byId("phoneDisplay").textContent = P.phone;
    byId("mailtoLink").href = `mailto:${P.email}`;
    byId("telLink").href = `tel:${P.phone.replace(/\s+/g, "")}`;

    // Map embed (OpenStreetMap, no API key required)
    const { lat, lng } = P.locationCoords;
    const delta = 0.2;
    const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
    byId("mapEmbed").src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

    // Profile photo fallback (no build step required — just try loading it)
    const img = new Image();
    img.onload = () => setBackgroundPhoto(P.photo);
    img.onerror = () => setBackgroundPhoto(P.photoPlaceholder);
    img.src = P.photo;
  }

  function setBackgroundPhoto(src) {
    // Hook left open for a future <img> profile element; currently unused
    // by the hero (which is code-editor led), but kept available globally.
    window.__resolvedProfilePhoto = src;
  }

  function renderSocialIcons(container) {
    const icons = {
      github: "GH", linkedin: "in", leetcode: "LC", gfg: "GfG",
      instagram: "IG", twitter: "X", portfolio: "🔗"
    };
    container.innerHTML = "";
    Object.entries(P.social).forEach(([key, url]) => {
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "icon-btn";
      a.style.width = "auto";
      a.style.padding = "0 10px";
      a.textContent = icons[key] || key;
      a.setAttribute("aria-label", key);
      a.dataset.track = `social-${key}`;
      container.appendChild(a);
    });
  }

  /* ------------------------------------------------------------------ */
  /* PROJECTS                                                            */
  /* ------------------------------------------------------------------ */
  function renderProjects() {
    const grid = byId("projectsGrid");
    grid.innerHTML = "";

    P.projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";

      const hasDemo = Boolean(project.demoUrl && project.demoUrl.trim());
      const hasCaseStudy = Boolean(project.caseStudyUrl && project.caseStudyUrl.trim());

      card.innerHTML = `
        <div class="project-card__media" data-full="${escapeAttr(project.image)}" data-name="${escapeAttr(project.name)}">
          <img src="${escapeAttr(project.image)}" alt="${escapeAttr(project.name)} screenshot" loading="lazy"
               onerror="this.onerror=null; this.src='assets/projects/placeholder.png';" />
        </div>
        <div class="project-card__body">
          <h3 class="project-card__name">${escapeHtml(project.name)}</h3>
          <p class="project-card__desc">${escapeHtml(project.description)}</p>
          <div class="project-card__stack">
            ${project.stack.map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join("")}
          </div>
          <details class="project-card__details">
            <summary>Features & challenges</summary>
            <ul>${project.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
            <p>${escapeHtml(project.challenges)}</p>
          </details>
          <div class="project-card__actions">
            <a class="btn" href="${escapeAttr(project.githubUrl)}" target="_blank" rel="noopener noreferrer" data-track="github-project-${escapeAttr(project.id)}">GitHub</a>
            ${
              hasDemo
                ? `<a class="btn btn--primary" href="${escapeAttr(project.demoUrl)}" target="_blank" rel="noopener noreferrer">Live Demo</a>`
                : `<button class="btn" disabled aria-disabled="true" title="Live demo not available yet">Coming Soon</button>`
            }
            ${hasCaseStudy ? `<a class="btn" href="${escapeAttr(project.caseStudyUrl)}" target="_blank" rel="noopener noreferrer">Case Study</a>` : ""}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // Lightbox preview
    grid.querySelectorAll(".project-card__media").forEach((media) => {
      media.addEventListener("click", () => {
        openLightbox(media.dataset.full, media.dataset.name);
      });
    });
  }

  function openLightbox(src, alt) {
    const lightbox = byId("lightbox");
    byId("lightboxImg").src = src;
    byId("lightboxImg").alt = alt;
    lightbox.classList.add("is-open");
  }

  function initLightbox() {
    const lightbox = byId("lightbox");
    byId("lightboxClose").addEventListener("click", () => lightbox.classList.remove("is-open"));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.remove("is-open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") lightbox.classList.remove("is-open");
    });
  }

  /* ------------------------------------------------------------------ */
  /* SKILLS / EXPERIENCE / CERTIFICATES                                  */
  /* ------------------------------------------------------------------ */
  function renderSkills() {
    const orbit = byId("skillsOrbit");
    const stage = byId("skillsOrbitStage");
    if (!orbit) return;

    const items = P.skills;
    const count = items.length;
    // Radius scales with item count so the ring doesn't get too cramped.
    const radius = Math.max(180, count * 26);

    orbit.innerHTML = items
      .map((s, i) => {
        const angle = (360 / count) * i;
        return `
        <div class="skill-orb" style="transform: rotateY(${angle}deg) translateZ(${radius}px);">
          <div class="skill-orb__name">${escapeHtml(s.name)}</div>
          <div class="skill-orb__level">${escapeHtml(s.level)}</div>
        </div>`;
      })
      .join("");

    // Pause the ring while a specific orb is hovered/focused (not just the stage),
    // so reading a label doesn't require chasing a still-moving target.
    if (stage) {
      orbit.querySelectorAll(".skill-orb").forEach((orb) => {
        orb.addEventListener("mouseenter", () => stage.classList.add("is-focused"));
        orb.addEventListener("mouseleave", () => stage.classList.remove("is-focused"));
      });
    }
  }

  function renderExperience() {
    const list = byId("experienceList");
    list.innerHTML = P.experience
      .map(
        (e) => `
      <div class="contact-row" style="align-items:flex-start; flex-direction:column; gap:4px;">
        <strong>${escapeHtml(e.role)} — ${escapeHtml(e.org)}</strong>
        <span class="eyebrow">${escapeHtml(e.period)}</span>
        <p style="margin:6px 0 0; color:var(--text-muted);">${escapeHtml(e.description)}</p>
      </div>`
      )
      .join("");

    const edu = byId("educationList");
    if (P.education?.length) {
      edu.innerHTML =
        `<span class="eyebrow">Education</span>` +
        P.education
          .map(
            (e) => `
        <div class="contact-row" style="align-items:flex-start; flex-direction:column; gap:2px;">
          <strong>${escapeHtml(e.school)}</strong>
          <span style="color:var(--text-muted); font-size:0.85rem;">${escapeHtml(e.location)}</span>
          <span style="font-size:0.9rem;">${escapeHtml(e.detail)}</span>
          <span class="eyebrow">${escapeHtml(e.period)}</span>
        </div>`
          )
          .join("");
    }

    const certs = byId("certificatesList");
    if (certs) certs.remove(); // certificates now render as a dedicated gallery (renderCertificates)

    const achievements = byId("achievementsList");
    if (P.achievements?.length) {
      achievements.innerHTML =
        `<span class="eyebrow">Achievements</span>` +
        `<ul style="margin:10px 0 0; padding-left:18px; color:var(--text-muted);">` +
        P.achievements.map((a) => `<li>${escapeHtml(a)}</li>`).join("") +
        `</ul>`;
    }
  }

  /* ------------------------------------------------------------------ */
  /* CERTIFICATES GALLERY                                                */
  /* ------------------------------------------------------------------ */
  function renderCertificates() {
    const grid = byId("certGrid");
    if (!grid || !P.certificates?.length) return;

    grid.innerHTML = P.certificates
      .map((c) => {
        const hasImage = Boolean(c.image && c.image.trim());
        return `
        <article class="cert-card">
          <div class="cert-card__media ${hasImage ? "" : "cert-card__media--empty"}" ${hasImage ? `data-full="${escapeAttr(c.image)}" data-name="${escapeAttr(c.name)}"` : ""}>
            ${
              hasImage
                ? `<img src="${escapeAttr(c.image)}" alt="${escapeAttr(c.name)} certificate" loading="lazy" />`
                : `<span class="cert-card__icon">🎓</span>`
            }
          </div>
          <div class="cert-card__body">
            <h3 class="cert-card__name">${escapeHtml(c.name)}</h3>
            <p class="cert-card__meta">${escapeHtml(c.issuer)} · ${escapeHtml(c.year)}</p>
            ${c.url ? `<a class="btn" style="margin-top:8px;" href="${escapeAttr(c.url)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}
          </div>
        </article>`;
      })
      .join("");

    grid.querySelectorAll(".cert-card__media[data-full]").forEach((media) => {
      media.addEventListener("click", () => openLightbox(media.dataset.full, media.dataset.name));
    });
  }

  /* ------------------------------------------------------------------ */
  /* CONTACT FORM (EmailJS) + VALIDATION + RATE LIMIT                    */
  /* ------------------------------------------------------------------ */
  function initContactForm() {
    const form = byId("contactForm");
    const status = byId("formStatus");
    const submitBtn = byId("submitBtn");
    const msgField = byId("fieldMessage");
    const charCount = byId("msgCharCount");

    msgField.addEventListener("input", () => {
      charCount.textContent = msgField.value.length;
    });

    if (window.emailjs && P.emailjs.publicKey && P.emailjs.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY") {
      emailjs.init({ publicKey: P.emailjs.publicKey });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors();

      // Honeypot spam check
      if (byId("companyWebsite").value.trim() !== "") {
        return; // silently drop — likely a bot
      }

      // Rate limiting: one submission per 60s, stored client-side
      const lastSubmit = Number(localStorage.getItem("lastContactSubmit") || 0);
      const now = Date.now();
      if (now - lastSubmit < 60000) {
        showStatus("error", `Please wait ${Math.ceil((60000 - (now - lastSubmit)) / 1000)}s before sending another message.`);
        return;
      }

      const values = {
        name: byId("fieldName").value.trim(),
        email: byId("fieldEmail").value.trim(),
        subject: byId("fieldSubject").value.trim(),
        message: msgField.value.trim()
      };

      if (!validateForm(values)) return;

      submitBtn.disabled = true;
      showStatus("loading", "Sending message…");

      try {
        if (window.location.protocol === "file:") {
          throw new Error(
            "This page is open as a local file (file://). Browsers block cross-site requests from local files, so the form can't send yet — this will work once the site is deployed (Vercel, GitHub Pages, Netlify, etc.) or served over http(s), e.g. via a local dev server."
          );
        }

        if (P.contactMethod === "emailjs") {
          if (!P.emailjs.serviceId || P.emailjs.serviceId === "YOUR_EMAILJS_SERVICE_ID") {
            throw new Error("EmailJS isn't configured yet — add serviceId/templateId/publicKey in config/personal.js, or set contactMethod to \"formsubmit\".");
          }
          await emailjs.send(P.emailjs.serviceId, P.emailjs.templateId, {
            from_name: values.name,
            reply_to: values.email,
            subject: values.subject,
            message: values.message,
            to_email: P.email
          });
        } else {
          // FormSubmit.co — zero-config email relay. First-ever submission
          // to a given address sends a one-time confirmation link that must
          // be clicked before messages start arriving; until that's clicked,
          // FormSubmit responds with success:false rather than delivering.
          const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(P.email)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              name: values.name,
              email: values.email,
              _subject: `Portfolio contact: ${values.subject}`,
              subject: values.subject,
              message: values.message
            })
          });

          let data = null;
          try { data = await res.json(); } catch { /* non-JSON response */ }

          if (!res.ok || (data && data.success === "false")) {
            const reason = (data && (data.message || data.error)) || `HTTP ${res.status}`;
            throw new Error(
              `FormSubmit didn't accept the message (${reason}). If this is the first message ever sent to ${P.email} via FormSubmit, check that inbox for a one-time confirmation email and click it — then try again.`
            );
          }
        }

        localStorage.setItem("lastContactSubmit", String(now));
        showStatus("success", "✔ Message Sent Successfully");
        form.reset();
        charCount.textContent = "0";
      } catch (err) {
        console.error("Contact form send failed:", err);
        const isNetworkError = err instanceof TypeError;
        const detail = isNetworkError
          ? `Couldn't reach the mail service (network/CORS error — check your connection or an ad blocker isn't blocking formsubmit.co).`
          : err.message || "Something went wrong sending your message.";
        showStatus(
          "error",
          `${detail} <a href="mailto:${P.email}?subject=${encodeURIComponent(values.subject || "Hello")}&body=${encodeURIComponent(values.message || "")}" style="color:inherit; text-decoration:underline;">Email me directly instead →</a>`
        );
      } finally {
        submitBtn.disabled = false;
      }
    });

    function validateForm(values) {
      let valid = true;
      if (!values.name) {
        setError("errName", "Name is required.");
        valid = false;
      }
      if (!values.email) {
        setError("errEmail", "Email is required.");
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        setError("errEmail", "Enter a valid email address.");
        valid = false;
      }
      if (!values.subject) {
        setError("errSubject", "Subject is required.");
        valid = false;
      }
      if (!values.message) {
        setError("errMessage", "Message is required.");
        valid = false;
      } else if (values.message.length > 1000) {
        setError("errMessage", "Message must be 1000 characters or fewer.");
        valid = false;
      }
      return valid;
    }

    function setError(id, msg) {
      byId(id).textContent = msg;
    }
    function clearErrors() {
      ["errName", "errEmail", "errSubject", "errMessage"].forEach((id) => (byId(id).textContent = ""));
    }
    function showStatus(type, msg) {
      status.className = `form-status is-visible form-status--${type}`;
      status.innerHTML = type === "loading" ? `<span class="spinner"></span> ${msg}` : msg;
    }
  }

  /* ------------------------------------------------------------------ */
  /* COPY EMAIL / SHARE                                                  */
  /* ------------------------------------------------------------------ */
  function initCopyAndShare() {
    byId("copyEmailBtn").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(P.email);
        showToast("✓ Email Copied");
      } catch {
        showToast("Couldn't copy — email is " + P.email);
      }
    });

    byId("shareBtn").addEventListener("click", async () => {
      const shareData = {
        title: P.seo.siteTitle,
        text: P.tagline,
        url: P.seo.siteUrl
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch {
          /* user cancelled — no-op */
        }
      } else {
        try {
          await navigator.clipboard.writeText(P.seo.siteUrl);
          showToast("🔗 Portfolio link copied");
        } catch {
          showToast("Copy this link: " + P.seo.siteUrl);
        }
      }
    });
  }

  let toastTimer;
  function showToast(msg) {
    const toast = byId("toast");
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  /* ------------------------------------------------------------------ */
  /* ANALYTICS (lightweight click tracking hook)                        */
  /* ------------------------------------------------------------------ */
  function initAnalytics() {
    if (P.analytics.googleAnalyticsId) {
      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${P.analytics.googleAnalyticsId}`;
      document.head.appendChild(s1);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      gtag("js", new Date());
      gtag("config", P.analytics.googleAnalyticsId);
    }

    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-track]");
      if (!el) return;
      const label = el.dataset.track;
      if (window.gtag) gtag("event", "click", { event_category: "engagement", event_label: label });
      if (window.va) va("event", { name: label });
    });
  }

  /* ------------------------------------------------------------------ */
  /* UTILITIES                                                           */
  /* ------------------------------------------------------------------ */
  function byId(id) { return document.getElementById(id); }
  function setMeta(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }
  function escapeHtml(str = "") {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(str = "") { return escapeHtml(str); }

  /* ------------------------------------------------------------------ */
  /* INIT                                                                */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileNav();
    initScrollSpy();
    renderIdentity();
    renderProjects();
    initLightbox();
    renderSkills();
    renderCertificates();
    renderExperience();
    initContactForm();
    initCopyAndShare();
    initAnalytics();
  });
})();
