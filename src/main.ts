import { mountNetwork } from './network';
import './style.css';
import { createIcons, ArrowUpRight, ArrowDownRight, ArrowDown, ArrowUp, Workflow, Activity, Terminal, Pause, Play, Copy } from 'lucide';
import { profile, type Project } from './profile';

const iconSet = { ArrowUpRight, ArrowDownRight, ArrowDown, ArrowUp, Workflow, Activity, Terminal, Pause, Play, Copy };
const icons = () => createIcons({ icons: iconSet, attrs: { 'stroke-width': 1.5 } });
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
document.documentElement.classList.toggle('js-motion', !reducedMotion.matches);

// Keep identity and external links in one typed content file.
document.querySelectorAll<HTMLElement>('[data-name]').forEach(el => {
  el.textContent = profile.name;
  if (el.classList.contains('footer-name')) {
    el.innerHTML = `${escapeHtml(profile.name)}<span class="accent">.</span>`;
    el.setAttribute('aria-label', profile.name);
  }
});
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
document.querySelectorAll<HTMLAnchorElement>('[data-github-link]').forEach(el => { el.href = profile.github; });
const linkedin = document.querySelector<HTMLAnchorElement>('#linkedin-link')!;
if (profile.linkedin) { linkedin.hidden = false; linkedin.href = profile.linkedin; }
document.querySelectorAll<HTMLAnchorElement>('[data-email-link]').forEach(el => {
  el.href = profile.email ? `mailto:${profile.email}` : profile.linkedin;
  el.setAttribute('aria-label', profile.email ? `Email ${profile.name}` : `Connect with ${profile.name} on LinkedIn`);
  if (!profile.email) { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
});
document.querySelector('#email-label')!.textContent = profile.email || 'Connect on LinkedIn';
const copyButton = document.querySelector<HTMLButtonElement>('#copy-email')!;
copyButton.hidden = !profile.email;
copyButton.addEventListener('click', async () => {
  const toast = document.querySelector<HTMLElement>('#toast')!;
  try {
    await navigator.clipboard.writeText(profile.email);
    toast.textContent = 'Email copied. Say hello!';
  } catch { toast.textContent = `Email: ${profile.email}`; }
  toast.classList.add('visible');
  window.setTimeout(() => toast.classList.remove('visible'), 3500);
});

const techSymbols: Record<string, string> = { 'Azure': 'Az', 'AWS': 'aws', 'Kubernetes': '⎈', 'Docker': '▰', 'Terraform': 'tf', 'Jenkins': 'J', 'GitHub Actions': '⌘', 'Azure DevOps': '∞', 'Prometheus': '♨', 'Grafana': '◉', 'Linux': '>_', 'Ansible': 'A', 'Git': '⑂' };
function marquee(names: string[]) {
  const group = names.map(name => `<span class="tech-item"><span class="tech-symbol" aria-hidden="true">${techSymbols[name] || '&lt;/&gt;'}</span>${escapeHtml(name)}</span>`).join('');
  return `<div class="marquee-group">${group}</div><div class="marquee-group" aria-hidden="true">${group}</div>`;
}
const half = Math.ceil(profile.technologies.length / 2);
document.querySelector('#tech-track-one')!.innerHTML = marquee(profile.technologies.slice(0, half));
document.querySelector('#tech-track-two')!.innerHTML = marquee(profile.technologies.slice(half));

// Original SVG illustrations describe the repository's role rather than inventing screenshots.
function projectIllustration(visual: Project['visual']) {
  if (visual === 'infrastructure') return `<svg viewBox="0 0 600 360" fill="none" aria-hidden="true"><defs><pattern id="infra-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#63879f" opacity=".3"/></pattern></defs><path fill="url(#infra-grid)" d="M0 0h600v360H0z"/><ellipse cx="300" cy="283" rx="157" ry="27" fill="#7399ad" opacity=".2"/><g stroke="#24475f" stroke-width="1.3" stroke-linejoin="round"><path d="m300 64 138 79-138 80-138-80z" fill="#dbeaf1"/><path d="M162 143v35l138 80v-35z" fill="#8db3c8"/><path d="m300 223 138-80v35l-138 80z" fill="#4e7f9b"/><path d="m300 111 80 46-80 47-80-47z" fill="#edf7fb"/><path d="M220 157v34l80 46v-33z" fill="#bed6e3"/><path d="m300 204 80-47v34l-80 46z" fill="#749db3"/><path d="m300 64 138 79M300 223v35" stroke="#24475f" stroke-dasharray="3 4"/><path d="M119 128 69 99h-23m416 50 62-36h36M300 260v39h-46" stroke-dasharray="4 4" opacity=".6"/></g><g fill="#0f4b75"><circle cx="162" cy="143" r="4"/><circle cx="438" cy="143" r="4"/><circle cx="300" cy="64" r="4"/><circle cx="300" cy="223" r="4"/></g><g font-family="Inter Variable, sans-serif" font-size="30" fill="#24475f"><text x="39" y="88">DECLARE</text><text x="560" y="101" text-anchor="end">PROVISION</text><text x="208" y="302">REPEAT</text><text x="278" y="154" font-size="32" fill="#0f4b75">{ }</text></g></svg>`;
  if (visual === 'pipeline') return `<svg viewBox="0 0 600 360" fill="none" aria-hidden="true"><defs><pattern id="pipeline-grid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0v26" stroke="#2b4b61" opacity=".12"/></pattern></defs><path fill="url(#pipeline-grid)" d="M0 0h600v360H0z"/><path d="M90 180h420" stroke="#34576d" stroke-width="1.2" stroke-dasharray="4 5"/><path d="M174 180h64M362 180h64" stroke="#14364d" stroke-width="2"/><g stroke="#214860" stroke-width="1.2"><rect x="76" y="135" width="98" height="90" rx="4" fill="#bdd7e5"/><rect x="250" y="121" width="112" height="118" rx="4" fill="#d9eef7"/><rect x="438" y="135" width="92" height="90" rx="4" fill="#bdd7e5"/></g><g stroke="#214860" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m109 166-12 12 12 12m30-24 12 12-12 12m-20 6 10-35"/><path d="m306 143 23 14v27l-23 14-23-14v-27zm-23 14 23 14 23-14m-23 14v27"/><path d="m467 181 11 11 22-25"/></g><g font-family="Inter Variable, sans-serif" font-size="30" fill="#214860" text-anchor="middle"><text x="125" y="253">COMMIT</text><text x="306" y="268">BUILD + PACKAGE</text><text x="484" y="253">DEPLOY</text><text x="306" y="88" letter-spacing="2">FROM SOURCE TO SERVICE</text></g><circle cx="205" cy="180" r="5" fill="#d5f578"><animate attributeName="cx" from="180" to="244" dur="2.5s" repeatCount="indefinite"/></circle><circle cx="398" cy="180" r="5" fill="#d5f578"><animate attributeName="cx" from="368" to="432" dur="2.5s" begin=".6s" repeatCount="indefinite"/></circle></svg>`;
  return `<svg viewBox="0 0 600 360" fill="none" aria-hidden="true"><defs><pattern id="observe-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0v32" stroke="#7da1b7" opacity=".13"/></pattern></defs><path fill="url(#observe-grid)" d="M0 0h600v360H0z"/><g stroke="#a4c4d7" stroke-width="1.2"><path d="M120 130h100v85H120z" fill="#274d68"/><path d="M380 130h100v85H380z" fill="#274d68"/><path d="M220 173h160" stroke-dasharray="4 5"/><path d="m300 96 45 26v51l-45 26-45-26v-51z" fill="#406c87"/><path d="m255 122 45 27 45-27m-45 27v50"/><path d="M120 235h360" opacity=".3"/><path d="m144 170 12 12 20-27m227 18 12 12 22-25" stroke="#d5f578" stroke-width="2"/></g><g fill="#d5e9f3" font-family="Inter Variable, sans-serif" font-size="30" text-anchor="middle"><text x="170" y="113">SOURCE</text><text x="430" y="113">CLOUD</text><text x="300" y="280" letter-spacing="1">CONTINUOUS DELIVERY</text><text x="300" y="315">CODE → BUILD → RELEASE</text></g><path class="chart-line" d="M122 245h28l12-8 14 16 17-11h30l18-13 18 18 14-8h28l19 9 18-20 16 17h30l17-9 18 11 16-6h38" stroke="#d5f578" opacity=".75"/></svg>`;
}
document.querySelector('#projects')!.innerHTML = profile.projects.map((project, index) => `<article class="project reveal"><a class="project-link" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer" aria-label="Explore ${escapeHtml(project.name)} on GitHub"><div class="project-art ${project.visual}"><div class="project-visual-label"><span>${String(index + 1).padStart(2, '0')} / ${escapeHtml(project.category).toUpperCase()}</span><span>↗</span></div>${projectIllustration(project.visual)}<span class="project-visual-bottom">ARCHITECTURE STUDY / ${escapeHtml(project.tags.slice(0, 2).join(' + ')).toUpperCase()}</span></div><div class="project-content"><p class="project-category"><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(project.category)}</p><h3>${escapeHtml(project.name)}<i data-lucide="arrow-up-right" aria-hidden="true"></i></h3><p class="project-description">${escapeHtml(project.description)}</p><div class="project-tags">${project.tags.map(tag => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('')}</div><span class="project-code-link">EXPLORE REPOSITORY <i data-lucide="arrow-up-right" aria-hidden="true"></i></span></div></a></article>`).join('');
icons();

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const mobileNav = document.querySelector<HTMLElement>('#mobile-nav')!;
function closeMenu() { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); } });
matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .1, rootMargin: '0px 0px -25px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const progress = document.querySelector<HTMLElement>('.scroll-progress')!;
const parallaxElements = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
let scrollQueued = false;
function updateScroll() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${scrollable > 0 ? scrollY / scrollable : 0})`;
  if (!motionPaused) parallaxElements.forEach(el => { el.style.transform = `translate3d(0, ${Math.min(scrollY, 1100) * Number(el.dataset.parallax)}px, 0)`; });
  scrollQueued = false;
}
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
addEventListener('resize', updateScroll);
updateScroll();
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) document.querySelectorAll<HTMLAnchorElement>('.desktop-nav a').forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`));
}), { rootMargin: '-15% 0px -55% 0px' });
document.querySelectorAll('main > section').forEach(el => sectionObserver.observe(el));

const motionButton = document.querySelector<HTMLButtonElement>('#motion-toggle')!;
function applyMotionPreference() {
  document.documentElement.classList.toggle('motion-paused', motionPaused);
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  motionButton.innerHTML = `<i data-lucide="${motionPaused ? 'play' : 'pause'}" aria-hidden="true"></i><span>${motionPaused ? 'RESUME MOTION' : 'PAUSE MOTION'}</span>`;
  document.querySelectorAll<SVGSVGElement>('.project-art svg').forEach(svg => {
    if (motionPaused) svg.pauseAnimations?.(); else svg.unpauseAnimations?.();
  });
  if (motionPaused) parallaxElements.forEach(el => el.style.transform = 'none');
  icons();
}
motionButton.addEventListener('click', () => { motionPaused = !motionPaused; applyMotionPreference(); });
reducedMotion.addEventListener('change', event => { motionPaused = event.matches; document.documentElement.classList.toggle('js-motion', !event.matches); applyMotionPreference(); });
applyMotionPreference();

// Original network illustration; ambient animation follows the shared motion preference.
mountNetwork(document.querySelector<HTMLCanvasElement>('#infrastructure-art')!, () => motionPaused);
