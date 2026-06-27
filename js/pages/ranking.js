import { onReady } from '../boot.js';
import { GAMES } from '../games-registry.js';
import { assetPath } from '../asset-path.js';
import { icon } from '../icons.js';
import {
  getRanking,
  getHistory,
  getPlayerName,
  setPlayerName,
} from '../player.js';
import { sessionNoticeHtml } from '../session-notice.js';

function init() {
  const root = document.getElementById('pageRoot');
  if (!root) return;

  const ranking = getRanking();
  const history = getHistory();
  const playerName = getPlayerName();

  const blocks = GAMES.map((game) => {
    const entries = ranking.filter((e) => e.gameId === game.id).slice(0, 10);
    const thumb = game.coverImage
      ? `<img src="${assetPath(game.coverImage)}" alt="" class="rankingThumb">`
      : icon('gamepad', 'uiIcon', 28);
    const list =
      entries.length === 0
        ? '<p class="pixel-text">Nenhuma pontuação ainda.</p>'
        : `<ol class="list">${entries
            .map(
              (e, i) => `
            <li class="${i < 3 ? 'top' : ''}">
              <span class="pos">${i + 1}º</span>
              <span class="name">${e.playerName || 'Jogador'}</span>
              <span class="pts">${e.score} pts</span>
            </li>`,
            )
            .join('')}</ol>`;

    return `
      <section class="block pixel-panel">
        <div class="blockHead">${thumb}<h2>${game.name}</h2></div>
        ${list}
      </section>`;
  }).join('');

  const historyHtml =
    history.length === 0
      ? '<p class="pixel-text">Nenhuma partida registrada.</p>'
      : `<ul class="history">${history
          .slice(0, 15)
          .map((h) => {
            const g = GAMES.find((x) => x.id === h.gameId);
            return `
            <li>
              <span>${g?.name ?? h.gameId}</span>
              <span>${h.playerName || 'Jogador'}</span>
              <span>${h.score} pts</span>
              <time>${new Date(h.date).toLocaleString('pt-BR')}</time>
            </li>`;
          })
          .join('')}</ul>`;

  root.innerHTML = `
    <div class="page pageNarrow">
      <header class="header pixel-panel">
        <h1 class="pixel-heading">${icon('trophy', 'uiIcon uiIcon--inline')} Placar Geral</h1>
        ${sessionNoticeHtml(true)}
        <label class="nameField">
          Nome nas próximas partidas
          <input type="text" id="playerName" value="${playerName}" placeholder="Seu nome" maxlength="24" class="input">
        </label>
        <button type="button" class="pixel-btn pixel-btn--wood" id="refreshBtn">Atualizar</button>
      </header>
      ${blocks}
      <section class="block pixel-panel">
        <h2 class="pixel-heading">Histórico recente</h2>
        ${historyHtml}
      </section>
      <a href="index.html" class="pixel-btn pixel-btn--ghost">← Voltar ao início</a>
    </div>`;

  root.querySelector('#playerName')?.addEventListener('input', (e) => setPlayerName(e.target.value));
  root.querySelector('#refreshBtn')?.addEventListener('click', () => window.location.reload());
}

onReady(init);
