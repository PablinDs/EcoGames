import { onReady } from '../boot.js';
import { getGameById } from '../games-registry.js';
import { assetPath } from '../asset-path.js';
import { icon } from '../icons.js';

const GAME_IDS = {
  'sobre-reciclagem': 'reciclagem',
  'sobre-flappy-eco': 'flappy-eco',
  'sobre-reciclagem-animal': 'reciclagem-animal',
};

function readGameId() {
  const fromBody = document.body.dataset.gameId;
  if (fromBody) return fromBody;
  const page = document.body.dataset.page ?? '';
  return GAME_IDS[page] ?? '';
}

const PLAY_URLS = {
  reciclagem: 'jogo-reciclagem.html',
  'flappy-eco': 'jogo-flappy-eco.html',
  'reciclagem-animal': 'jogo-reciclagem-animal.html',
};

function init() {
  const root = document.getElementById('pageRoot');
  if (!root) return;

  const gameId = readGameId();
  const game = getGameById(gameId);
  if (!game) {
    root.innerHTML = `
      <div class="notFound">
        <h1>Jogo não encontrado</h1>
        <a href="jogos.html" class="pixel-btn pixel-btn--green">Voltar</a>
      </div>`;
    return;
  }

  const cover = game.coverImage
    ? `<img src="${assetPath(game.coverImage)}" alt="" class="cover">`
    : `<span class="iconFallback">${icon('gamepad', 'uiIcon', 32)}</span>`;

  root.innerHTML = `
    <article class="page pixel-panel gameAbout">
      <a href="jogos.html" class="back">← Biblioteca de jogos</a>
      <header class="header">
        ${cover}
        <div>
          <h1 class="pixel-heading">${game.name}</h1>
          <p class="pixel-text">${game.shortDescription}</p>
        </div>
      </header>

      <section class="section">
        <h2>Objetivo educativo</h2>
        <p>${game.educationalGoal}</p>
      </section>

      <section class="section">
        <h2>Tema ambiental</h2>
        <p>${game.environmentalTheme}</p>
      </section>

      <section class="section">
        <h2>Como jogar</h2>
        <ol>${game.howToPlay.map((s) => `<li>${s}</li>`).join('')}</ol>
      </section>

      <section class="section">
        <h2>Mecânicas principais</h2>
        <ul>${game.mechanics.map((m) => `<li>${m}</li>`).join('')}</ul>
      </section>

      <section class="section">
        <h2>Controles</h2>
        <p>${game.controls}</p>
      </section>

      <a href="${PLAY_URLS[gameId]}" class="pixel-btn pixel-btn--green">▶ Jogar agora</a>
    </article>`;
}

onReady(init);
