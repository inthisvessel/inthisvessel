(function () {
  const caseStudies = [
    { title: 'Closing the Care Gap', sub: 'Health equity · service design', href: 'closing-the-care-gap.html' },
    { title: 'Rethink the Remote', sub: 'Accessibility redesign · concept', href: 'propresenter-remote.html' }
  ];
  const here = location.pathname.split('/').pop() || 'index.html';

  // Render dropdown
  const menu = document.getElementById('workMenu');
  if (menu) {
    menu.innerHTML = caseStudies.map(cs => {
      const cur = cs.href === here ? ' is-current' : '';
      const aria = cs.href === here ? ' aria-current="page"' : '';
      return `<a class="work-item${cur}" role="menuitem"${aria} href="${cs.href}" data-hover>${cs.title}<span class="sub">${cs.sub}</span></a>`;
    }).join('');
  }

// Scroll listener: scrolled state + hide on scroll down, show on scroll up
  const nav = document.getElementById('nav');
  const toc = document.getElementById('toc');
  let lastScrollY = window.scrollY;
  const onScroll = () => {
    if (!nav) return;
    const y = window.scrollY;

    // frosted background once we're past the top
    nav.classList.toggle('scrolled', y > 40);
    const setHidden = (hidden) => {
      nav.classList.toggle('nav-hidden', hidden);
      if (toc) toc.classList.toggle('nav-hidden', hidden);
    };

    // fade out scrolling down, fade in scrolling up
    if (y < 80) {
      setHidden(false);                        // always visible near the top
    } else if (y > lastScrollY) {
      setHidden(true);                         // scrolling down
    } else if (y < lastScrollY) {
      setHidden(false);                        // scrolling up
    }

    lastScrollY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Dropdown toggling
  const toggle = document.getElementById('workToggle');
  const dd = document.getElementById('workDD');
  const chev = document.getElementById('workChev');
  const setMenu = (open) => {
    if (menu) menu.classList.toggle('open', open);
    if (chev) chev.style.transform = open ? 'rotate(180deg)' : '';
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  if (toggle && menu && dd) {
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      setMenu(!menu.classList.contains('open'));
    });
    toggle.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setMenu(true);
        const first = menu.querySelector('.work-item');
        if (first) first.focus();
      }
    });
    menu.addEventListener('keydown', e => {
      const items = [...menu.querySelectorAll('.work-item')];
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[idx + 1] || items[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (items[idx - 1] || items[items.length - 1]).focus(); }
      else if (e.key === 'Escape') { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', e => {
      if (!dd.contains(e.target)) setMenu(false);
    });
  }

  // Mobile hamburger menu
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', e => {
      if (e.target.closest('.nav-link, .nav-cta, .work-item')) {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Intercept data-scroll & data-open-about for navigation from case study pages back to home sections
  document.querySelectorAll('[data-scroll]').forEach(el => {
    el.addEventListener('click', e => {
      const target = el.getAttribute('data-scroll');
      if (target) {
        e.preventDefault();
        window.location.href = 'index.html' + target;
      }
    });
  });
  document.querySelectorAll('[data-open-about]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = 'about.html';
    });
  });

  // ESC key to close all nav overlays
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      setMenu(false);
      if (links) links.classList.remove('open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
  });
})();