/* HORIZON DOME. Bez zależności i połączeń sieciowych poza lokalnymi mediami. */
'use strict';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let language = 'nl';
let photoIndex = 0;
let returnFocus = null;
const photos = $$('[data-photo]');
const video = $('#hero-video');
const videoToggle = $('#video-toggle');
const form = $('#contact-form');
const header = $('.header');
const navToggle = $('.nav-toggle');
const backToTop = $('.back-to-top');
const desktopNav = window.matchMedia('(min-width: 1180px)');
const configuredEmail = form.dataset.email.trim();
const hasEmail = /^[^\s@\[\]]+@[^\s@\[\]]+\.[^\s@\[\]]+$/.test(configuredEmail);
function message(nl, en) { return language === 'nl' ? nl : en; }
function updateNavButton() {
  if (!header || !navToggle) return;
  const open = header.classList.contains('is-nav-open');
  navToggle.setAttribute('aria-label', open ? message('Menu sluiten', 'Close menu') : message('Menu openen', 'Open menu'));
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.textContent = open ? '×' : '≡';
}
function updateVideoButton() {
  videoToggle.textContent = video.paused ? message('Video afspelen', 'Play video') : message('Video pauzeren', 'Pause video');
}
function updateLightbox() {
  const link = photos[photoIndex];
  const thumb = link.querySelector('img');
  const target = $('#lightbox-image');
  target.onerror = () => { target.onerror = null; target.src = thumb.dataset.fallback; };
  target.src = thumb.currentSrc || thumb.src;
  target.alt = thumb.alt;
  $('#lightbox-caption').textContent = link.parentElement.querySelector('figcaption').textContent;
  $('#lightbox-count').textContent = `${photoIndex + 1} / ${photos.length}`;
}
function setLanguage(next) {
  language = next === 'en' ? 'en' : 'nl';
  document.documentElement.lang = language;
  $$('[data-nl][data-en]').forEach(el => {
    if (el.tagName === 'META') el.content = el.dataset[language];
    else el.textContent = el.dataset[language];
  });
  $$('[data-alt-nl]').forEach(el => { el.alt = el.dataset[language === 'nl' ? 'altNl' : 'altEn']; });
  $$('[data-aria-nl]').forEach(el => { el.setAttribute('aria-label', el.dataset[language === 'nl' ? 'ariaNl' : 'ariaEn']); });
  $$('[data-language]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.language === language)));
  document.title = message('HORIZON DOME — Transparante domes', 'HORIZON DOME — Transparent domes');
  if (hasEmail) $('#email-display').textContent = configuredEmail;
  $('#form-status').textContent = '';
  if ($('#lightbox').open) updateLightbox();
  updateVideoButton();
  updateNavButton();
  try { localStorage.setItem('horizondome-language', language); } catch (_) { /* file:// lub ograniczenia prywatności */ }
}
try { language = localStorage.getItem('horizondome-language') === 'en' ? 'en' : 'nl'; } catch (_) {}
setLanguage(language);
$$('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
function closeNavigation() {
  if (!header || !navToggle) return;
  header.classList.remove('is-nav-open');
  document.body.classList.remove('nav-open');
  updateNavButton();
}
if (header && navToggle && backToTop && typeof window.addEventListener === 'function') {
  header.classList.add('is-nav-ready');
  navToggle.addEventListener('click', () => {
    header.classList.toggle('is-nav-open');
    document.body.classList.toggle('nav-open', header.classList.contains('is-nav-open'));
    updateNavButton();
  });
  $$('#site-navigation a').forEach(link => link.addEventListener('click', closeNavigation));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('is-nav-open')) {
      closeNavigation();
      navToggle.focus();
    }
  });
  desktopNav.addEventListener('change', event => { if (event.matches) closeNavigation(); });

  const pageSections = $$('main > section[id]');
  const sectionLinks = $$('#site-navigation a[href^="#"]');
  let scrollFrame = 0;
  function updatePageControls() {
    scrollFrame = 0;
    const hero = $('#home');
    const headerLine = header.offsetHeight + 24;
    header.classList.toggle('is-scrolled', window.scrollY >= hero.offsetHeight - header.offsetHeight);
    backToTop.hidden = window.scrollY <= window.innerHeight;
    let activeId = pageSections[0]?.id;
    pageSections.forEach(section => {
      if (section.getBoundingClientRect().top <= headerLine) activeId = section.id;
    });
    sectionLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function requestPageControlsUpdate() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updatePageControls);
  }
  window.addEventListener('scroll', requestPageControlsUpdate, {passive:true});
  window.addEventListener('resize', requestPageControlsUpdate);
  backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:motion.matches ? 'auto' : 'smooth'}));
  updatePageControls();
}
// Błędy plików nie chowają treści. Tło SVG jest widoczne również bez JS.
$$('img[data-fallback]').forEach(img => {
  const fallback = () => { if (!img.src.endsWith(img.dataset.fallback)) img.src = img.dataset.fallback; };
  img.addEventListener('error', fallback, {once:true});
  if (img.complete && img.naturalWidth === 0) fallback();
});
const posterCheck = new Image();
posterCheck.onerror = () => { video.poster = video.dataset.fallback; };
posterCheck.src = video.poster;
function failVideo() { video.classList.remove('is-playing'); videoToggle.hidden = true; }
video.addEventListener('error', failVideo);
video.querySelector('source').addEventListener('error', failVideo);
video.addEventListener('playing', () => { video.classList.add('is-playing'); videoToggle.hidden = false; updateVideoButton(); });
video.addEventListener('pause', updateVideoButton);
video.addEventListener('loadeddata', () => { videoToggle.hidden = false; updateVideoButton(); });
videoToggle.addEventListener('click', () => {
  if (video.paused) video.play().catch(failVideo); else video.pause();
});
function handleMotion() {
  if (motion.matches) { video.autoplay = false; video.pause(); }
  $$('.reveal-pending').forEach(el => el.classList.remove('reveal-pending'));
}
if (motion.matches) handleMotion();
else {
  video.muted = true;
  video.play().catch(failVideo);
}
motion.addEventListener('change', handleMotion);
// Animacja jest wyłącznie progresywnym ulepszeniem — bez JS sekcje są widoczne.
if ('IntersectionObserver' in window && !motion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('reveal-pending'); observer.unobserve(entry.target); }
  }), {threshold:0.08});
  $$('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top > innerHeight) el.classList.add('reveal-ready', 'reveal-pending');
    observer.observe(el);
  });
}
function openDialog(dialog, trigger) {
  returnFocus = trigger;
  dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.querySelector('[data-close]').focus();
}
$$('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }});
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); returnFocus?.focus(); });
});
photos.forEach((link, index) => link.addEventListener('click', event => {
  if (typeof $('#lightbox').showModal !== 'function') return;
  event.preventDefault(); photoIndex = index; updateLightbox(); openDialog($('#lightbox'), link);
}));
function advancePhoto(delta) { photoIndex = (photoIndex + delta + photos.length) % photos.length; updateLightbox(); }
$('[data-prev]').addEventListener('click', () => advancePhoto(-1));
$('[data-next]').addEventListener('click', () => advancePhoto(1));
$('#lightbox').addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); advancePhoto(event.key === 'ArrowLeft' ? -1 : 1); }
});
$$('[data-open-privacy]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  if (typeof $('#privacy').showModal === 'function') openDialog($('#privacy'), link);
  else $('#privacy').setAttribute('open', '');
}));
if (hasEmail) form.action = `mailto:${configuredEmail}`;
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (!hasEmail) {
    $('#form-status').textContent = message('Het e-mailadres wordt nog aangevuld. Er is niets verzonden; uw tekst blijft in het formulier.', 'The contact email is still to be added. Nothing was sent; your text remains in the form.');
    return;
  }
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const body = `${message('Naam', 'Name')}: ${name}\r\nEmail: ${email}\r\n\r\n${$('#message').value.trim()}`;
  const subject = message('Aanvraag via HORIZON DOME', 'Enquiry via HORIZON DOME');
  window.location.href = `mailto:${configuredEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $('#form-status').textContent = message('Verzend het bericht in uw e-mailprogramma. Opent dit niet? Kopieer uw bericht en e-mail ons rechtstreeks.', 'Send the message in your email app. If it does not open, copy your message and email us directly.');
});

// Uaktywnij dopiero po zarejestrowaniu bezpiecznej obsługi formularza.
form.querySelector('[type="submit"]').disabled = false;
