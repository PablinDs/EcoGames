import { onReady } from './boot.js';
import { getGameById } from './games-registry.js';
import { icon } from './icons.js';
import {
  getPlayerName,
  setPlayerName,
  submitScore,
} from './player.js';

const MOUNTERS = {
  reciclagem: () => import('./games/reciclagem-game.js').then((m) => m.mountReciclagemGame),
  'flappy-eco': () => import('./games/flappy-game.js').then((m) => m.mountFlappyGame),
  'reciclagem-animal': () =>
    import('./games/reciclagem-animal/game.js').then((m) => m.mountReciclagemAnimalGame),
};

const ABOUT_PAGES = {
  reciclagem: 'sobre-reciclagem.html',
  'flappy-eco': 'sobre-flappy-eco.html',
  'reciclagem-animal': 'sobre-reciclagem-animal.html',
};

function readGameId() {
  return document.body.dataset.gameId ?? '';
}

function renderNotFound(root) {
  root.innerHTML = `
    <div class="notFound">
      <h1>Jogo não encontrado</h1>
      <a href="jogos.html" class="pixel-btn pixel-btn--green">Voltar</a>
    </div>`;
}

function renderOverlay(finalScore, savedAsName, newAchievements) {
  const achieveHtml =
    newAchievements.length > 0
      ? `<p class="achieve">${icon('medal', 'uiIcon uiIcon--inline')} Novo troféu${newAchievements.length > 1 ? 's' : ''}! Veja em Troféus.</p>`
      : '';

  return `
    <div class="overlay" role="alertdialog" aria-labelledby="overlayTitle" aria-modal="true">
      <div class="overlayCard">
        <h2 id="overlayTitle">Partida encerrada</h2>
        <p class="finalScore">${finalScore} pontos</p>
        <p class="saved">Pontuação salva no placar como <strong>${savedAsName}</strong>.</p>
        ${achieveHtml}
        <div class="overlayActions">
          <button type="button" class="pixel-btn pixel-btn--green pixel-btn--full" id="replayBtn">
            Jogar novamente
          </button>
          <a href="ranking.html" class="pixel-btn pixel-btn--blue pixel-btn--full">Ver placar</a>
          <a href="jogos.html" class="pixel-btn pixel-btn--ghost pixel-btn--full">Sair para o lobby</a>
        </div>
      </div>
    </div>`;
}

async function initGamePlay() {
  const root = document.getElementById('pageRoot');
  if (!root) return;

  const gameId = readGameId();
  const game = getGameById(gameId);
  if (!game || !MOUNTERS[gameId]) {
    renderNotFound(root);
    return;
  }

  const playerName = getPlayerName();
  const aboutUrl = ABOUT_PAGES[gameId] ?? 'jogos.html';

  root.innerHTML = `
    <div class="page" id="gamePlayRoot">
      <div class="toolbar">
        <div>
          <h1>${game.name}</h1>
          <p class="sessionHint">Sessão local — placar zera ao fechar o navegador.</p>
        </div>
        <div class="scorePanel">
          <label class="nameLabel">
            Nome
            <input type="text" id="playerName" value="${playerName}" placeholder="Seu nome" maxlength="24" aria-label="Nome no placar">
          </label>
          <span class="score">Pontos: <span id="liveScore">0</span></span>
          <a href="jogos.html" class="pixel-btn pixel-btn--ghost pixel-btn--sm">Sair</a>
        </div>
      </div>
      <div class="gameWrap frame-arcade">
        <div class="frame" id="gameFrame"></div>
      </div>
      <p class="hint"><a href="${aboutUrl}">Como jogar e objetivo educativo →</a></p>
    </div>`;

  const playRoot = root.querySelector('#gamePlayRoot');
  const nameInput = playRoot.querySelector('#playerName');
  const scoreEl = playRoot.querySelector('#liveScore');
  const frameEl = playRoot.querySelector('#gameFrame');

  let ended = false;
  let unmount = null;

  nameInput?.addEventListener('input', (e) => setPlayerName(e.target.value));

  function setScore(s) {
    if (scoreEl) scoreEl.textContent = String(s);
  }

  function handleGameEnd(finalScore) {
    if (ended) return;
    ended = true;
    const name = nameInput?.value?.trim() || getPlayerName();
    let savedAsName = name;
    let newly = [];
    try {
      const result = submitScore(gameId, finalScore, name);
      savedAsName = result.name;
      newly = result.newly;
    } catch (err) {
      console.error('Erro ao salvar pontuação:', err);
    }
    document.body.insertAdjacentHTML('beforeend', renderOverlay(finalScore, savedAsName, newly));
    document.body.querySelector('#replayBtn')?.addEventListener('click', () => window.location.reload());
  }

  const mount = await MOUNTERS[gameId]();
  unmount = mount(frameEl, {
    onScoreChange: setScore,
    onGameEnd: handleGameEnd,
  });

  window.addEventListener('beforeunload', () => unmount?.());
}

onReady(initGamePlay);
