/* HORIZON DOME — local media, no form backend or third-party scripts. */
'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = $('.header');
const navToggle = $('.nav-toggle');
const form = $('#contact-form');
const lightbox = $('#lightbox');
const photos = $$('[data-photo]');
const slides = $$('.hero-slide');
const slideToggle = $('#slideshow-toggle');
const backToTop = $('.back-to-top');
let language = 'nl';
let photoIndex = 0;
let returnFocus = null;
let slideIndex = 0;
let slideTimer = null;
let userPaused = false;
let inquiry = 'quote';
const message = (nl, en, de) => ({nl,en,de})[language];
const configuredEmail = form?.dataset.email.trim() || '';
const hasEmail = /^[^\s@\[\]]+@[^\s@\[\]]+\.[^\s@\[\]]+$/.test(configuredEmail);
function updateNavButton() {
  if (!navToggle) return;
  const open = header.classList.contains('is-nav-open');
  navToggle.setAttribute('aria-label', open ? message('Menu sluiten','Close menu','Menü schließen') : message('Menu openen','Open menu','Menü öffnen'));
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.textContent = open ? '×' : '≡';
}
function updateSlideButton() {
  if (!slideToggle) return;
  slideToggle.hidden = motion.matches;
  slideToggle.textContent = userPaused ? message('Hervat foto’s','Resume slideshow','Bildwechsel fortsetzen') : message('Pauzeer foto’s','Pause slideshow','Bildwechsel pausieren');
  slideToggle.setAttribute('aria-pressed', String(userPaused));
}
function updateLightbox() {
  const link = photos[photoIndex];
  if (!link) return;
  const thumb = link.querySelector('img');
  const target = $('#lightbox-image');
  target.onerror = () => { target.onerror = null; target.src = thumb.dataset.fallback; };
  target.src = thumb.currentSrc || thumb.src;
  target.alt = thumb.alt;
  $('#lightbox-caption').textContent = link.parentElement.querySelector('figcaption').textContent;
  $('#lightbox-count').textContent = `${photoIndex + 1} / ${photos.length}`;
}
function setLanguage(next) {
  language = ['nl','en','de'].includes(next) ? next : 'nl';
  document.documentElement.lang = language;
  $$('[data-nl][data-en][data-de]').forEach(el => {
    if (el.tagName === 'META') el.content = el.dataset[language];
    else el.textContent = el.dataset[language];
  });
  const suffix = {nl:'Nl',en:'En',de:'De'}[language];
  $$('[data-alt-nl]').forEach(el => { el.alt = el.dataset[`alt${suffix}`] || el.dataset.altNl; });
  $$('[data-aria-nl]').forEach(el => el.setAttribute('aria-label', el.dataset[`aria${suffix}`] || el.dataset.ariaNl));
  // Legal Dutch/English originals stay intact; German summaries are separate.
  $$('[data-language-content]').forEach(el => {
    el.hidden = !el.dataset.languageContent.split(' ').includes(language);
    if (!el.hidden) el.lang = language;
  });
  $$('[data-language-content="nl en"] [data-nl][data-en]').forEach(el => {
    if (language !== 'de') el.textContent = el.dataset[language];
  });
  $$('[data-language]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.language === language)));
  document.title = document.body.dataset[`title${suffix}`] || message('HORIZON DOME — Transparante domes','HORIZON DOME — Transparent domes','HORIZON DOME — Transparente Domes');
  if (hasEmail && $('#email-display')) $('#email-display').textContent = configuredEmail;
  if ($('#form-status')) $('#form-status').textContent = '';
  if ($('#contact-tooltip')) $('#contact-tooltip').hidden = true;
  if (lightbox?.open) updateLightbox();
  updateNavButton(); updateSlideButton();
  try { localStorage.setItem('horizondome-language',language); } catch (_) { /* Restricted storage: keep the current language in memory. */ }
}
try { language = localStorage.getItem('horizondome-language') || 'nl'; } catch (_) {}
const queryLanguage = new URLSearchParams(window.location.search).get('lang');
setLanguage(queryLanguage || language);
$$('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
function closeNavigation() {
  header?.classList.remove('is-nav-open');
  document.body.classList.remove('nav-open');
  updateNavButton();
}
if (navToggle) {
  header.classList.add('is-nav-ready');
  navToggle.addEventListener('click', () => {
    header.classList.toggle('is-nav-open');
    document.body.classList.toggle('nav-open',header.classList.contains('is-nav-open'));
    updateNavButton();
  });
  $$('#site-navigation a').forEach(link => link.addEventListener('click',closeNavigation));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('is-nav-open')) { closeNavigation(); navToggle.focus(); }
  });
  window.matchMedia('(min-width:1180px)').addEventListener('change', event => { if (event.matches) closeNavigation(); });
}
if (backToTop) {
  let frame = 0;
  const sections = $$('main > section[id]');
  function updateControls() {
    frame = 0;
    header.classList.toggle('is-scrolled',window.scrollY > 40);
    backToTop.hidden = window.scrollY <= window.innerHeight;
    let active = sections[0]?.id;
    sections.forEach(section => { if (section.getBoundingClientRect().top <= header.offsetHeight + 24) active = section.id; });
    $$('#site-navigation a[href^="#"]').forEach(link => {
      const match = link.getAttribute('href') === `#${active}`;
      link.classList.toggle('is-active',match);
      if (match) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
    });
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(updateControls); };
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:motion.matches ? 'auto' : 'smooth'}));
  updateControls();
}
function showSlide(index) {
  slideIndex = index;
  slides.forEach((slide,i) => slide.classList.toggle('is-active',i === index));
}
function syncSlideshow() {
  clearInterval(slideTimer); slideTimer = null;
  if (motion.matches) showSlide(0);
  else if (slides.length > 1 && !userPaused && !document.hidden) {
    slideTimer = setInterval(() => showSlide((slideIndex + 1) % slides.length),6000);
  }
  updateSlideButton();
}
slideToggle?.addEventListener('click', () => { userPaused = !userPaused; syncSlideshow(); });
motion.addEventListener('change',syncSlideshow);
document.addEventListener('visibilitychange',syncSlideshow);
syncSlideshow();
$$('img[data-fallback]').forEach(img => {
  const fallback = () => { if (!img.src.endsWith(img.dataset.fallback)) img.src = img.dataset.fallback; };
  img.addEventListener('error',fallback,{once:true});
  if (img.complete && img.naturalWidth === 0) fallback();
});
if (lightbox) {
  lightbox.querySelector('[data-close]').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('close', () => { document.body.classList.remove('modal-open'); returnFocus?.focus(); });
  lightbox.addEventListener('click', event => {
    const r = lightbox.getBoundingClientRect();
    if (event.target === lightbox && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) lightbox.close();
  });
  photos.forEach((link,i) => link.addEventListener('click', event => {
    if (typeof lightbox.showModal !== 'function') return;
    event.preventDefault(); photoIndex = i; returnFocus = link; updateLightbox();
    lightbox.showModal(); document.body.classList.add('modal-open'); lightbox.querySelector('[data-close]').focus();
  }));
  const advance = delta => { photoIndex = (photoIndex + delta + photos.length) % photos.length; updateLightbox(); };
  $('[data-prev]').addEventListener('click', () => advance(-1));
  $('[data-next]').addEventListener('click', () => advance(1));
  lightbox.addEventListener('keydown',event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); advance(event.key === 'ArrowLeft' ? -1 : 1); }
  });
}
let tooltipTimer;
$$('[data-contact-placeholder]').forEach(link => {
  // Guard the actual destination, so adding a real number enables the link.
  if (!link.getAttribute('href').includes('[DO UZUPEŁNIENIA')) { link.removeAttribute('aria-disabled'); return; }
  const notify = event => {
    event.preventDefault();
    const tooltip = $('#contact-tooltip');
    tooltip.textContent = message('binnenkort','coming soon','bald verfügbar');
    tooltip.hidden = false;
    clearTimeout(tooltipTimer); tooltipTimer = setTimeout(() => { tooltip.hidden = true; },3500);
  };
  link.addEventListener('click',notify);
  link.addEventListener('auxclick',notify);
  link.addEventListener('contextmenu',notify);
});
$$('a[href="#contact"]').forEach(link => link.addEventListener('click', () => {
  inquiry = link.dataset.inquiry === 'advice' ? 'advice' : 'quote';
  if (link.dataset.model && $('#model')) $('#model').value = link.dataset.model;
}));
if (form) {
  form.addEventListener('submit',event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const status = $('#form-status');
    if (!hasEmail) {
      status.textContent = message('Het e-mailadres wordt nog aangevuld. Er is niets verzonden; uw tekst blijft in het formulier.','The contact email is still to be added. Nothing was sent; your text remains in the form.','Die E-Mail-Adresse wird noch ergänzt. Es wurde nichts gesendet; Ihre Angaben bleiben im Formular.');
      return;
    }
    const fields = ['name','email','customer-type','city','country','model','timing','message'];
    const body = fields.map(id => {
      const field = document.getElementById(id);
      const label = document.querySelector(`label[for="${id}"]`).textContent.trim();
      const value = field.tagName === 'SELECT' ? field.selectedOptions[0].textContent : field.value.trim();
      return `${label}: ${value}`;
    }).join('\r\n');
    const subject = inquiry === 'advice' ? message('Adviesgesprek — HORIZON DOME','Consultation — HORIZON DOME','Beratungsgespräch — HORIZON DOME') : message('Offerteaanvraag — HORIZON DOME','Quote request — HORIZON DOME','Angebotsanfrage — HORIZON DOME');
    window.location.href = `mailto:${configuredEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = message('Verzend het bericht in uw e-mailprogramma. Opent dit niet? Kopieer uw bericht en e-mail ons rechtstreeks.','Send the message in your email app. If it does not open, copy your message and email us directly.','Senden Sie die Nachricht in Ihrem E-Mail-Programm. Falls es sich nicht öffnet, kopieren Sie Ihre Angaben und schreiben Sie uns direkt.');
  });
  form.querySelector('[type="submit"]').disabled = false;
}
