/* ═══════════════════════════════════════════
   JACOB PHOTO — main.js (shared)
═══════════════════════════════════════════ */

/* ── Navbar ── */
const nav = document.getElementById('nav');
const hasHero = !!document.querySelector('.home-hero');

function updateNav() {
  if (!hasHero || window.scrollY > 60) {
    nav.classList.add('solid');
  } else {
    nav.classList.remove('solid');
  }
}
if (hasHero) {
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* ── Hero slideshow ── */
(function () {
  const slides   = document.querySelectorAll('.slide');
  const counterEl = document.getElementById('heroCurrent');
  const totalEl   = document.getElementById('heroTotal');
  const prevBtn   = document.getElementById('heroPrev');
  const nextBtn   = document.getElementById('heroNext');
  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  if (totalEl) totalEl.textContent = String(total).padStart(2, '0');

  function goTo(idx) {
    slides[current].classList.remove('active');
    current = (idx + total) % total;
    slides[current].classList.add('active');
    if (counterEl) counterEl.textContent = String(current + 1).padStart(2, '0');
  }

  let timer = setInterval(() => goTo(current + 1), 5000);
  prevBtn?.addEventListener('click', () => { clearInterval(timer); goTo(current - 1); timer = setInterval(() => goTo(current + 1), 5000); });
  nextBtn?.addEventListener('click', () => { clearInterval(timer); goTo(current + 1); timer = setInterval(() => goTo(current + 1), 5000); });

  const hero = document.querySelector('.home-hero');
  hero?.addEventListener('mouseenter', () => clearInterval(timer));
  hero?.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(current + 1), 5000); });

  let touchX = 0;
  hero?.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  hero?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { clearInterval(timer); goTo(dx < 0 ? current + 1 : current - 1); timer = setInterval(() => goTo(current + 1), 5000); }
  });
})();

/* ── Mobile menu ── */
const burger    = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
const navClose  = document.getElementById('navClose');

burger?.addEventListener('click', () => navMobile.classList.add('open'));
navClose?.addEventListener('click', () => navMobile.classList.remove('open'));
navMobile?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMobile.classList.remove('open'));
});

/* ── Gallery filter ── */
(function () {
  const fBtns = document.querySelectorAll('.f-btn');
  const grid  = document.getElementById('galleryGrid');
  if (!fBtns.length || !grid) return;

  const gItems = grid.querySelectorAll('.g-item');

  function applyFilter(filter) {
    fBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    gItems.forEach(item => {
      if (filter === 'all') {
        item.style.display = item.dataset.featured === 'true' ? '' : 'none';
      } else {
        item.style.display = item.dataset.cat === filter ? '' : 'none';
      }
    });
  }

  // Initial state
  const params = new URLSearchParams(window.location.search);
  const preFilter = params.get('filter') || 'all';
  applyFilter(preFilter);

  fBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  /* ── Lightbox ── */
  const lightbox = document.getElementById('lightbox');
  const lbClose  = document.getElementById('lbClose');
  const lbImg    = lightbox?.querySelector('.lb-img');

  gItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (lightbox) {
        lbImg.innerHTML = src
          ? `<img src="${src}" alt="">`
          : '<span>No image available.</span>';
        lightbox.classList.add('open');
      }
    });
  });

  // Also observe dynamically added items
  const observer = new MutationObserver(() => {
    grid.querySelectorAll('.g-item:not([data-lb])').forEach(item => {
      item.dataset.lb = '1';
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src;
        if (lightbox) {
          lbImg.innerHTML = src
            ? `<img src="${src}" alt="">`
            : '<span>No image available.</span>';
          lightbox.classList.add('open');
        }
      });
    });
  });
  observer.observe(grid, { childList: true });
  lbClose?.addEventListener('click', () => lightbox?.classList.remove('open'));
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox?.classList.remove('open');
  });
})();

/* ── Investment accordion ── */
function toggleInv(btn) {
  const item = btn.closest('.inv-item');
  const id   = item.dataset.id;
  const isActive = item.classList.contains('active');

  document.querySelectorAll('.inv-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.inv-photo').forEach(el => el.classList.remove('active'));

  if (!isActive) {
    item.classList.add('active');
    const photo = document.querySelector(`.inv-photo[data-id="${id}"]`);
    if (photo) photo.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const first = document.querySelector('.inv-item.active');
  if (first) {
    const photo = document.querySelector(`.inv-photo[data-id="${first.dataset.id}"]`);
    if (photo) photo.classList.add('active');
  }
});

/* ── FAQ ── */
function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const wasOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });
  if (!wasOpen) {
    btn.classList.add('open');
    ans.classList.add('open');
  }
}

/* ── Contact form ── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  const ok  = document.getElementById('formOk');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    e.target.reset();
    btn.textContent = 'Send Inquiry';
    btn.disabled = false;
    ok.classList.add('show');
    setTimeout(() => ok.classList.remove('show'), 6000);
  }, 1200);
}

/* ── Scroll reveal ── */
const revealTargets = document.querySelectorAll(
  '.svc-card, .i-card, .t-card, .p-step, .i-step, .faq-item, .hg-item, .about-split, .contact-wrap'
);
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity = '1';
        en.target.style.transform = 'translateY(0)';
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });

  revealTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity 0.65s ease ${(i % 8) * 0.07}s, transform 0.65s ease ${(i % 8) * 0.07}s`;
    io.observe(el);
  });
}