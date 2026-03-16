/* ===================================================
   Portfolio JavaScript — CH V S S Ramachandra Reddy
   =================================================== */

/* ─── Mobile Menu ─── */
const hbg = document.getElementById('hbg');
const mob = document.getElementById('mob');

hbg.addEventListener('click', () => {
  mob.classList.toggle('open');
});

/** Close mobile menu (called inline via onclick="cm()") */
function cm() {
  mob.classList.remove('open');
}

/* ─── Scroll Reveal ─── */
const revEls = document.querySelectorAll('.rev');

const revObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12 }
);

revEls.forEach((el) => revObserver.observe(el));

/* ─── Certification Modal ─── */
const certModal = document.getElementById('certModal');
const certModalImg = document.getElementById('certModalImg');
const certModalTitle = document.getElementById('certModalTitle');

/**
 * Open the cert modal with a given image src and title.
 * Called inline: onclick="openModal('img-src', 'Title')"
 *
 * @param {string} src   - Image source (URL or base64)
 * @param {string} [title] - Optional title shown above the image
 */
function openModal(src, title = '') {
  certModalImg.src = src;
  certModalTitle.textContent = title;
  certModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/** Close the cert modal */
function closeModal() {
  certModal.classList.remove('active');
  certModalImg.src = '';
  document.body.style.overflow = '';
}

// Close modal on backdrop click
certModal.addEventListener('click', (e) => {
  if (e.target === certModal) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ─── Active Nav Link on Scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nlinks a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove('active-nav');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active-nav');
          }
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((sec) => navObserver.observe(sec));

/* ─── Contact Form (basic prevent-default) ─── */
const contactForm = document.querySelector('.cform');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = 'var(--gr)';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}
