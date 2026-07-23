/* Kirste Cleaning — Shared JavaScript */

AOS.init({ duration: 700, once: true, offset: 60 });

// Navbar scroll
const navbar = document.getElementById('navbar');
if (navbar) {
  if (!document.getElementById('hero')) navbar.classList.add('scrolled');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else if (document.getElementById('hero')) navbar.classList.remove('scrolled');
    const st = document.getElementById('scrollTop');
    if (st) { if (window.scrollY > 400) st.classList.add('visible'); else st.classList.remove('visible'); }
  });
}

// Animated counters
const counters = document.querySelectorAll('.counter');
if (counters.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target, target = parseInt(el.dataset.target), step = Math.ceil(target / 125);
        let cur = 0;
        const t = setInterval(() => { cur += step; if (cur >= target) { cur = target; clearInterval(t); } el.textContent = cur.toLocaleString(); }, 16);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// Before/After slider
const baWrap = document.getElementById('baWrap');
if (baWrap) {
  const baBefore = document.getElementById('baBefore'), baHandle = document.getElementById('baHandle');
  let drag = false;
  function updateBA(x) { const r = baWrap.getBoundingClientRect(), p = Math.max(2, Math.min(98, ((x - r.left) / r.width) * 100)); baBefore.style.width = p + '%'; baHandle.style.left = p + '%'; }
  baHandle.addEventListener('mousedown', () => drag = true);
  baWrap.addEventListener('touchstart', e => { drag = true; updateBA(e.touches[0].clientX); });
  window.addEventListener('mousemove', e => { if (drag) updateBA(e.clientX); });
  window.addEventListener('touchmove', e => { if (drag) updateBA(e.touches[0].clientX); });
  window.addEventListener('mouseup', () => drag = false);
  window.addEventListener('touchend', () => drag = false);
}

// Swiper testimonials
if (document.querySelector('.testimonialSwiper')) {
  new Swiper('.testimonialSwiper', { slidesPerView: 1, spaceBetween: 24, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }, autoplay: { delay: 4500, disableOnInteraction: false }, loop: true });
}

// FAQ
function toggleFaq(item) {
  const was = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!was) item.classList.add('open');
}

// Lightbox
function openLightbox(src) {
  const lb = document.getElementById('lightbox'), img = document.getElementById('lb-img');
  if (lb && img) { img.src = src; lb.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) { lb.classList.remove('active'); document.body.style.overflow = ''; }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

function showToast(msg) {
  const el = document.getElementById('mainToast'), m = document.getElementById('toastMsg');
  if (el && m) { m.textContent = msg; new bootstrap.Toast(el, { delay: 4000 }).show(); }
}

// Gallery filter
const gf = document.querySelector('.gallery-filters');
if (gf) {
  gf.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      gf.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const f = this.dataset.filter;
      document.querySelectorAll('.masonry-item').forEach(item => { item.style.display = (f === 'all' || item.dataset.cat === f) ? '' : 'none'; });
    });
  });
}

// Pricing toggle
const pt = document.getElementById('pricingToggle');
if (pt) {
  pt.addEventListener('change', function() {
    const m = this.checked;
    document.querySelectorAll('[data-price-one]').forEach(el => { el.textContent = m ? el.dataset.priceMonthly : el.dataset.priceOne; });
    document.querySelectorAll('[data-period]').forEach(el => { el.textContent = m ? '/mo' : '/ session'; });
    document.querySelector('.toggle-label[data-label="one"]')?.classList.toggle('active', !m);
    document.querySelector('.toggle-label[data-label="monthly"]')?.classList.toggle('active', m);
  });
}

// Multi-step booking
const steps = document.querySelectorAll('.step-panel');
if (steps.length) {
  let cur = 1;
  document.querySelectorAll('.service-selector-card').forEach(c => {
    c.addEventListener('click', function() {
      document.querySelectorAll('.service-selector-card').forEach(x => x.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('selectedService').value = this.dataset.service;
    });
  });
  function showStep(n) {
    steps.forEach(p => p.classList.remove('active'));
    document.querySelector(`.step-panel[data-step="${n}"]`)?.classList.add('active');
    document.querySelectorAll('.step-dot').forEach((d, i) => { d.classList.remove('active','done'); if (i+1===n) d.classList.add('active'); else if (i+1<n) d.classList.add('done'); });
    document.querySelectorAll('.step-line').forEach((l, i) => l.classList.toggle('done', i+1<n));
    cur = n;
  }
  function nextStep() {
    if (cur === 1 && !document.getElementById('selectedService')?.value) { showToast('Please select a service to continue.'); return; }
    if (cur === 2) { const f = document.getElementById('step2Form'); if (f && !f.checkValidity()) { f.reportValidity(); return; } buildReview(); }
    if (cur < steps.length) showStep(cur + 1);
  }
  function prevStep() { if (cur > 1) showStep(cur - 1); }
  function buildReview() {
    const g = id => document.getElementById(id)?.value || '';
    const budget = document.getElementById('bBudgetVal')?.value || '—';
    const el = document.getElementById('bookingReview');
    if (el) el.innerHTML = `<div class="row g-3"><div class="col-6"><strong>Service:</strong><br>${g('selectedService')}</div><div class="col-6"><strong>Name:</strong><br>${g('bName')}</div><div class="col-6"><strong>Email:</strong><br>${g('bEmail')}</div><div class="col-6"><strong>Phone:</strong><br>${g('bPhone')}</div><div class="col-6"><strong>Date:</strong><br>${g('bDate')}</div><div class="col-6"><strong>Time:</strong><br>${g('bTime')}</div><div class="col-6"><strong>Bedrooms:</strong><br>${g('bBedrooms')||'—'}</div><div class="col-6"><strong>Bathrooms:</strong><br>${g('bBathrooms')||'—'}</div><div class="col-6"><strong>Budget:</strong><br><span style="color:var(--primary);font-weight:700;font-size:1.1rem">$${budget}</span></div><div class="col-12"><strong>Address:</strong><br>${g('bAddress')}</div>${g('bNotes')?`<div class="col-12"><strong>Notes:</strong><br>${g('bNotes')}</div>`:''}</div>`;
  }
  function submitBooking() {
    document.getElementById('bookingFormWrapper').style.display = 'none';
    document.getElementById('bookingSuccess')?.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.nextStep = nextStep; window.prevStep = prevStep; window.submitBooking = submitBooking;
  showStep(1);
}

// Contact form
document.getElementById('contactForm')?.addEventListener('submit', function(e) { e.preventDefault(); showToast("✅ Message sent! We'll get back to you shortly."); this.reset(); });

// Newsletter
function handleNewsletterSubmit(e) { e.preventDefault(); showToast('📧 Subscribed! Great deals are on the way.'); e.target.reset(); }

// Active nav link
(function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navbar .nav-link').forEach(l => { if (l.getAttribute('href')?.includes(page)) l.classList.add('active'); });
})();
