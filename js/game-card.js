import { assetPath } from './asset-path.js';
import { icon } from './icons.js';
import { getRankingByGame } from './player.js';

const PLAY_URLS = {
  reciclagem: 'jogo-reciclagem.html',
  'flappy-eco': 'jogo-flappy-eco.html',
  'reciclagem-animal': 'jogo-reciclagem-animal.html',
};

const ABOUT_URLS = {
  reciclagem: 'sobre-reciclagem.html',
  'flappy-eco': 'sobre-flappy-eco.html',
  'reciclagem-animal': 'sobre-reciclagem-animal.html',
};

export function renderGameCard(game, slot) {
  const top = getRankingByGame(game.id)[0];
  const playUrl = PLAY_URLS[game.id] ?? '#';
  const aboutUrl = ABOUT_URLS[game.id] ?? '#';
  const cover = game.coverImage
    ? `<img src="${assetPath(game.coverImage)}" alt="" class="cover">`
    : `<span class="iconFallback">${icon('gamepad', 'uiIcon', 32)}</span>`;

  return `
    <article class="gameCard pixel-panel arcade-cabinet">
      ${slot != null ? `<span class="slot">MÁQ. ${slot}</span>` : ''}
      ${top ? `<span class="record" title="Recorde da sessão">HI ${top.score}</span>` : ''}
      <div class="thumb">${cover}</div>
      <div class="body">
        <h3>${game.name}</h3>
        <p>${game.shortDescription}</p>
        <div class="actions">
          <a href="${playUrl}" class="pixel-btn pixel-btn--green pixel-btn--full">▶ START</a>
          <a href="${aboutUrl}" class="pixel-btn pixel-btn--ghost pixel-btn--full">${icon('info', 'uiIcon uiIcon--inline')} Info</a>
        </div>
      </div>
    </article>`;
}
