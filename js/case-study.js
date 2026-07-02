// ───── Shared case-study behavior ─────
// Used by every case study page: scroll progress bar, TOC scrollspy, reveal-on-scroll.

// Scroll progress bar
var readProgress = document.getElementById('readProgress');
function onScrollProgress() {
  var h = document.documentElement;
  var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
  readProgress.style.width = (Math.min(1, Math.max(0, scrolled)) * 100) + '%';
}
window.addEventListener('scroll', onScrollProgress, { passive: true });
onScrollProgress();

// Section scrollspy for sticky TOC
var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc-link'));
var spyTargets = tocLinks.map(function (a) {
  return document.getElementById(a.getAttribute('href').slice(1));
}).filter(Boolean);
var spy = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      var id = e.target.id;
      tocLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-130px 0px -60% 0px', threshold: 0 });
spyTargets.forEach(function (s) { spy.observe(s); });

// Reveal on scroll
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });