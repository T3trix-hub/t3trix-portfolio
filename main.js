// ── Active nav link ──────────────────────────
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── Burger ───────────────────────────────────
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
burger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ── Fade in on scroll ─────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
