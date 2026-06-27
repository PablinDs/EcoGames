import { PLATFORM_NAME, PLATFORM_TAGLINE } from '../config.js';
import { GAMES } from '../games-registry.js';
import { renderGameCard } from '../game-card.js';
import { icon } from '../icons.js';
import { getRanking, getPlayerName } from '../player.js';
import { onReady } from '../boot.js';

function renderRankingPreview() {
  const ranking = getRanking();
  const aggregated = new Map();
  for (const e of ranking) {
    aggregated.set(e.playerName, (aggregated.get(e.playerName) ?? 0) + e.score);
  }
  const top = [...aggregated.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const displayName = getPlayerName().trim() || 'Jogador';

  if (top.length === 0) {
    return `
      <section class="block pixel-panel">
        <h2 class="title">${icon('trophy', 'uiIcon uiIcon--inline')} High Score</h2>
        <p class="pixel-text">Nenhum recorde ainda. Seja o primeiro!</p>
        <a href="ranking.html" class="pixel-btn pixel-btn--blue pixel-btn--full">Ver placar completo</a>
      </section>`;
  }

  const rows = top
    .map(([name, pts], i) => {
      const cls = [
        'row',
        name === displayName ? 'rowYou' : '',
        i < 3 ? 'rowTop' : '',
      ]
        .filter(Boolean)
        .join(' ');
      return `
        <li class="${cls}">
          <span class="pos">${i + 1}º</span>
          <span class="name">${name}</span>
          <span class="pts">${pts}</span>
        </li>`;
    })
    .join('');

  return `
    <section class="block pixel-panel">
      <h2 class="title">${icon('trophy', 'uiIcon uiIcon--inline')} High Score</h2>
      <ol class="list">${rows}</ol>
      <a href="ranking.html" class="pixel-btn pixel-btn--blue pixel-btn--full">Ver placar completo</a>
    </section>`;
}

function init() {
  const root = document.getElementById('pageRoot');
  if (!root) return;

  root.innerHTML = `
    <div class="page">
      <section class="hero pixel-panel">
        <div class="heroBg" aria-hidden></div>
        <div class="heroContent">
          <span class="pixel-badge">${icon('gamepad', 'uiIcon uiIcon--inline')} ${PLATFORM_TAGLINE}</span>
          <h1 class="heroTitle">${PLATFORM_NAME}</h1>
          <p class="heroLead">
            Três máquinas arcade sobre reciclagem, fauna e sustentabilidade. Insira sua ficha e
            dispute o high score!
          </p>
          <div class="heroActions">
            <a href="jogos.html" class="pixel-btn pixel-btn--green">${icon('play', 'uiIcon uiIcon--inline')} Inserir ficha</a>
            <a href="ranking.html" class="pixel-btn pixel-btn--blue">${icon('trophy', 'uiIcon uiIcon--inline')} Placar</a>
          </div>
        </div>
        <div class="heroDeco" aria-hidden>
          ${icon('recycle', 'uiIcon uiIcon--deco', 28)}
          ${icon('coin', 'uiIcon uiIcon--deco', 28)}
          ${icon('trophy', 'uiIcon uiIcon--deco', 28)}
        </div>
      </section>

      <section class="gamesSection">
        <header class="sectionHead">
          <h2 class="pixel-heading">${icon('sprout', 'uiIcon uiIcon--inline')} As 3 máquinas</h2>
        </header>
        <div class="games-grid">
          ${GAMES.map((g, i) => renderGameCard(g, i + 1)).join('')}
        </div>
      </section>

      ${renderRankingPreview()}
    </div>`;
}

onReady(init);
