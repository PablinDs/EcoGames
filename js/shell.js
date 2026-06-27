import { onReady } from './boot.js';
import { PLATFORM_NAME, PLATFORM_TAGLINE, PLATFORM_MARQUEE } from './config.js';
import { icon } from './icons.js';
import { getPlayerName, getProfile, getAvatar, getXpProgress, getTotalPoints } from './player.js';

const NAV = [
  { href: 'index.html', label: 'Lobby', page: 'home' },
  { href: 'jogos.html', label: 'Máquinas', page: 'jogos' },
  { href: 'ranking.html', label: 'Placar', page: 'ranking' },
  { href: 'conquistas.html', label: 'Troféus', page: 'conquistas' },
  { href: 'usuario.html', label: 'Jogador', page: 'usuario' },
  { href: 'sobre.html', label: 'Info', page: 'sobre' },
];

function currentPage() {
  return document.body.dataset.page ?? '';
}

export function initShell() {
  const sidebar = document.getElementById('sidebar');
  const topbar = document.getElementById('topbar');
  const footer = document.getElementById('footer');
  const page = currentPage();

  if (sidebar) {
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
      <div class="brand">
        <span class="brandIconWrap" aria-hidden>${icon('leaf', 'uiIcon uiIcon--brand', 28)}</span>
        <div>
          <h1 class="brandTitle">${PLATFORM_NAME}</h1>
          <p class="brandTag">${PLATFORM_TAGLINE}</p>
        </div>
      </div>
      <nav class="nav">
        ${NAV.map(
          (n) => `
          <a href="${n.href}" class="navLink ${page === n.page ? 'navLinkActive' : ''}">
            ${n.label}
          </a>`,
        ).join('')}
      </nav>
      <p class="coinHint">${icon('coin', 'uiIcon uiIcon--inline')} Insira sua ficha e jogue!</p>
    `;
  }

  if (topbar) {
    const name = getPlayerName() || 'Jogador';
    const profile = getProfile();
    const xp = getXpProgress(profile.xp);
    const points = getTotalPoints(name);
    const marquee = `${PLATFORM_MARQUEE} ${PLATFORM_MARQUEE}`;
    topbar.className = 'topBar';
    topbar.innerHTML = `
      <div class="banner" aria-hidden>
        <span class="bannerIcon">${icon('globe', 'uiIcon', 22)}</span>
        <div class="marqueeTrack"><p class="marqueeText">${marquee}</p></div>
        <span class="bannerIcon">${icon('leaf', 'uiIcon', 22)}</span>
      </div>
      <a href="usuario.html" class="profile">
        <span class="avatar" aria-hidden>${getAvatar(profile)}</span>
        <div class="profileInfo">
          <div class="profileMeta">
            <span class="profileName">${name}</span>
            <span class="profileLevel">LVL ${xp.level}</span>
          </div>
          <div class="xpBar" role="progressbar"><div class="xpFill" style="width:${xp.percent}%"></div></div>
        </div>
        <span class="coins" title="Pontuação acumulada">${icon('coin', 'uiIcon uiIcon--inline')} ${points}</span>
      </a>
    `;
  }

  if (footer) {
    footer.className = 'footer';
    footer.innerHTML = `<span class="icon" aria-hidden>${icon('recycle', 'uiIcon', 18)}</span><p>${PLATFORM_NAME} — jogue, aprenda, recicle. <span class="dim">Educação Ambiental</span></p>`;
  }
}

onReady(initShell);
