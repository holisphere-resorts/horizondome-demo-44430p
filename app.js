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
const configuredEmail = form.dataset.email.trim();
const hasEmail = /^[^\s@\[\]]+@[^\s@\[\]]+\.[^\s@\[\]]+$/.test(configuredEmail);
function message(nl, en) { return language === 'nl' ? nl : en; }
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
  try { localStorage.setItem('horizondome-language', language); } catch (_) { /* file:// lub ograniczenia prywatności */ }
}
try { language = localStorage.getItem('horizondome-language') === 'en' ? 'en' : 'nl'; } catch (_) {}
setLanguage(language);
$$('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
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
