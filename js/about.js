// ── Scroll Reveal ──
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        obs.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('in');
      obs.unobserve(el);
    }
  });
}

// ── Bookshelf Widget ──
function initShelf() {
  const stage = document.getElementById('shelfStage');
  const titleEl = document.getElementById('shelfTitle');
  const authorEl = document.getElementById('shelfAuthor');
  if (!stage) return;
  const books = [
    { title: 'Bunny', author: 'Mona Awad' },
    { title: 'Lapvona', author: 'Ottessa Moshfegh' },
    { title: 'Dune', author: 'Frank Herbert' },
    { title: 'Project Hail Mary', author: 'Andy Weir' },
  ];
  const cards = [...stage.querySelectorAll('.shelf-book')];
  const spread = [-57, -19, 19, 57];
  cards.forEach((c, i) => {
    c.style.setProperty('--x', spread[i] + 'px');
    c.style.setProperty('--z', String(i + 1));
  });
  function feature(i) {
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
    titleEl.textContent = books[i].title;
    authorEl.textContent = books[i].author;
  }
  cards.forEach((c, i) => {
    c.addEventListener('mouseenter', () => feature(i));
    c.addEventListener('focus', () => feature(i));
    c.setAttribute('tabindex', '0');
  });
  feature(0);
}
// ── Nav ──
function initNav() {
  const nav = document.getElementById('nav');
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  const workDD = document.getElementById('workDD');
  const workToggle = document.getElementById('workToggle');
  const workMenu = document.getElementById('workMenu');
  const workChev = document.getElementById('workChev');

// Scrolled state + hide on scroll down, show on scroll up
  let lastScrollY = window.scrollY;
  function updateNav() {
    if (!nav) return;
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    if (y < 80) {
      nav.classList.remove('nav-hidden');      // always visible near the top
    } else if (y > lastScrollY) {
      nav.classList.add('nav-hidden');         // scrolling down
    } else if (y < lastScrollY) {
      nav.classList.remove('nav-hidden');      // scrolling up
    }
    lastScrollY = y;
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Mobile hamburger
  if (navBurger && navLinks) {
    navBurger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Case studies dropdown toggle
  function setWork(open) {
    if (!workMenu || !workToggle || !workChev) return;
    workMenu.classList.toggle('open', open);
    workToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    workChev.style.transform = open ? 'rotate(180deg)' : '';
  }

  if (workToggle) {
    workToggle.addEventListener('click', () => {
      const isOpen = workMenu.classList.contains('open');
      setWork(!isOpen);
    });
  }

  // Close dropdown when clicking anywhere outside it
  document.addEventListener('click', e => {
    if (workDD && !workDD.contains(e.target)) setWork(false);
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      setWork(false);
      if (navLinks) navLinks.classList.remove('open');
      if (navBurger) navBurger.setAttribute('aria-expanded', 'false');
    }
  });

  // Home button goes back to homepage
  document.querySelectorAll('[data-scroll="#top"]').forEach(el => {
    el.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  });
}

// ── Case Studies Nav Dropdown ──
const caseStudies = [
  { title: 'Closing the Care Gap', fullLabel: 'Health Equity · Service Design', href: 'closing-the-care-gap.html' },
  { title: 'Rethink the Remote', fullLabel: 'Accessibility · Redesign · Concept', href: 'propresenter-remote.html' },
];

function renderNavMenu() {
  const menu = document.getElementById('workMenu');
  if (!menu) return;
  menu.innerHTML = caseStudies.map(cs => `
    <a class="work-item" href="${cs.href}" role="menuitem">
      ${cs.title}
      <span class="sub">${cs.fullLabel}</span>
    </a>`).join('');
}

// ── Boot ──
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initShelf();
  initNav();
  renderNavMenu();
});