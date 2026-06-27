import { onReady } from '../boot.js';
import { GAMES } from '../games-registry.js';
import { renderGameCard } from '../game-card.js';
import { icon } from '../icons.js';

function init() {
  const root = document.getElementById('pageRoot');
  if (!root) return;

  root.innerHTML = `
    <div class="page">
      <header class="header pixel-panel">
        <h1 class="pixel-heading">${icon('gamepad', 'uiIcon uiIcon--inline')} Galeria de máquinas</h1>
        <p class="pixel-text">Três fliperamas educativos. Escolha uma máquina e pressione START.</p>
      </header>
      <div class="games-grid">
        ${GAMES.map((g, i) => renderGameCard(g, i + 1)).join('')}
      </div>
    </div>`;
}

onReady(init);
