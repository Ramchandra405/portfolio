/**
 * js/effects.js
 * Real WebGL via Three.js (loaded from CDN in index.html), no build step.
 * 1) Ambient particle field behind the hero
 * 2) Interactive 3D tech-stack orbit: draggable, hover tooltip, click modal
 */
(function () {
  "use strict";
  if (typeof THREE === "undefined") {
    console.warn("Three.js failed to load — skipping WebGL effects. The rest of the site still works.");
    return;
  }
  const P = window.PERSONAL || {};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* 1) HERO PARTICLE FIELD                                              */
  /* ------------------------------------------------------------------ */
  function initHeroParticles() {
    const canvas = document.getElementById("heroParticles");
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 12;

    const COUNT = window.innerWidth < 700 ? 120 : 260;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xff9f5a,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    let mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      if (!reducedMotion) {
        points.rotation.y += 0.0006;
        points.rotation.x += 0.0002;
        camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
    }
    animate();

    // Pause rendering when hero scrolls out of view (perf)
    const heroSection = document.getElementById("hero");
    if (heroSection && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!raf) animate();
          } else {
            cancelAnimationFrame(raf);
            raf = null;
          }
        });
      });
      io.observe(heroSection);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2) TECH STACK ORBIT                                                 */
  /* ------------------------------------------------------------------ */
  function initTechOrbit() {
    const stage = document.getElementById("orbitStage");
    const canvas = document.getElementById("orbitCanvas");
    const tooltip = document.getElementById("orbitTooltip");
    if (!stage || !canvas) return;

    const techList = (P.techOrbit && P.techOrbit.length) ? P.techOrbit : [
      { name: "JavaScript", level: 70, color: "#F7DF1E" },
      { name: "Python", level: 80, color: "#FFD54A" }
    ];

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.PointLight(0xff9f5a, 1.4, 40);
    key.position.set(6, 6, 10);
    scene.add(key);
    const rim = new THREE.PointLight(0x5ad1b8, 0.8, 40);
    rim.position.set(-8, -4, 6);
    scene.add(rim);

    const radius = 5.2;
    const spheres = [];
    const group = new THREE.Group();
    scene.add(group);

    techList.forEach((tech, i) => {
      const angle = (i / techList.length) * Math.PI * 2;
      const geo = new THREE.SphereGeometry(0.55, 32, 32);
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(tech.color || "#FF9F5A"),
        metalness: 0.1,
        roughness: 0.25,
        transmission: 0.55,
        thickness: 1.2,
        clearcoat: 0.6,
        emissive: new THREE.Color(tech.color || "#FF9F5A"),
        emissiveIntensity: 0.25
      });
      const mesh = new THREE.Mesh(geo, mat);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(i * 1.3) * 1.1;
      mesh.position.set(x, y, z);
      mesh.userData = { tech, baseX: x, baseY: y, baseZ: z, floatOffset: Math.random() * Math.PI * 2 };
      group.add(mesh);
      spheres.push(mesh);

      // Simple sprite label: brand icon (if configured) + tech name, drawn
      // onto a canvas texture. The icon loads async from Simple Icons' CDN;
      // the texture is redrawn once it lands.
      const label = makeLabelSprite(tech.name, tech.icon);
      label.position.set(x, y - 0.95, z);
      group.add(label);
    });

    function makeLabelSprite(text, iconSlug) {
      const cnv = document.createElement("canvas");
      cnv.width = 256; cnv.height = 80;
      const ctx = cnv.getContext("2d");

      function draw(iconImg) {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        const hasIcon = Boolean(iconImg);
        const iconSize = 40;
        const textX = hasIcon ? 140 : 128;

        if (hasIcon) {
          ctx.drawImage(iconImg, 24, 18, iconSize, iconSize);
        }

        ctx.font = "600 30px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#E6E8EB";
        ctx.textAlign = hasIcon ? "left" : "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, hasIcon ? 78 : textX, 40);
      }

      draw(null);
      const tex = new THREE.CanvasTexture(cnv);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.6, 0.8, 1);

      if (iconSlug) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          draw(img);
          tex.needsUpdate = true;
        };
        img.onerror = () => { /* icon failed to load — text-only label remains */ };
        img.src = `https://cdn.simpleicons.org/${iconSlug}/E6E8EB`;
      }

      return sprite;
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    // Drag to rotate
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let velocityY = 0.0012;
    let targetRotX = 0.15;

    canvas.addEventListener("pointerdown", (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });
    window.addEventListener("pointerup", () => (isDragging = false));
    window.addEventListener("pointermove", (e) => {
      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        group.rotation.y += dx * 0.005;
        targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX + dy * 0.003));
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    // Hover detection via raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hovered = null;

    canvas.addEventListener("pointermove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(spheres);
      if (hits.length) {
        const mesh = hits[0].object;
        if (hovered !== mesh) {
          if (hovered) hovered.scale.set(1, 1, 1);
          hovered = mesh;
        }
        hovered.scale.set(1.35, 1.35, 1.35);
        tooltip.hidden = false;
        tooltip.style.left = e.clientX - rect.left + "px";
        tooltip.style.top = e.clientY - rect.top + "px";
        tooltip.innerHTML = `<strong>${escapeHtml(mesh.userData.tech.name)}</strong> — ${mesh.userData.tech.level}% comfort`;
        canvas.style.cursor = "pointer";
      } else {
        if (hovered) { hovered.scale.set(1, 1, 1); hovered = null; }
        tooltip.hidden = true;
        canvas.style.cursor = "grab";
      }
    });

    canvas.addEventListener("click", (e) => {
      if (hovered) openTechModal(hovered.userData.tech);
    });

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    let raf;
    const clock = new THREE.Clock();
    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (!isDragging && !reducedMotion) group.rotation.y += velocityY;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.06;

      spheres.forEach((mesh) => {
        const { baseY, floatOffset } = mesh.userData;
        mesh.position.y = baseY + Math.sin(t * 0.8 + floatOffset) * 0.25;
        if (mesh !== hovered) mesh.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    }
    animate();

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { if (!raf) animate(); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    });
    io.observe(stage);
  }

  function openTechModal(tech) {
    const modal = document.getElementById("techModal");
    if (!modal) return;
    document.getElementById("techModalName").textContent = tech.name;
    document.getElementById("techModalLevel").textContent = `${tech.level}% comfort level`;
    document.getElementById("techModalBar").style.width = tech.level + "%";

    const relatedProjects = (P.projects || []).filter((proj) =>
      proj.stack.some((s) => s.toLowerCase().includes(tech.name.toLowerCase()) || tech.name.toLowerCase().includes(s.toLowerCase()))
    );
    const projEl = document.getElementById("techModalProjects");
    projEl.innerHTML = relatedProjects.length
      ? `<span class="eyebrow">Used in</span><br/>` + relatedProjects.map((p) => p.name).join(", ")
      : `<span style="color:var(--text-muted);">Not yet tied to a specific project on this site.</span>`;

    modal.classList.add("is-open");
  }

  function initTechModalClose() {
    const modal = document.getElementById("techModal");
    const closeBtn = document.getElementById("techModalClose");
    if (!modal || !closeBtn) return;
    closeBtn.addEventListener("click", () => modal.classList.remove("is-open"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("is-open"); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.classList.remove("is-open"); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeroParticles();
    initTechOrbit();
    initTechModalClose();
  });
})();
