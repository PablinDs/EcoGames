import { onReady } from '../boot.js';
import { PLATFORM_NAME, PLATFORM_TAGLINE } from '../config.js';

function init() {
  const root = document.getElementById('pageRoot');
  if (!root) return;

  root.innerHTML = `
    <article class="page pageNarrow">
      <header class="hero pixel-panel">
        <h1 class="pixel-title">${PLATFORM_NAME}</h1>
        <p class="sub">${PLATFORM_TAGLINE}</p>
      </header>

      <section class="block pixel-panel">
        <h2 class="pixel-heading">O fliperama eco</h2>
        <p class="pixel-text">
          Três máquinas arcade educativas sobre reciclagem, fauna e sustentabilidade. Cada jogo
          ensina por meio de desafios, feedback imediato e placar de high score — diversão de
          fliperama com propósito ambiental.
        </p>
      </section>

      <section class="block pixel-panel">
        <h2 class="pixel-heading">Como funciona</h2>
        <ul class="list">
          <li>Escolha uma das 3 máquinas e pressione START</li>
          <li>Acumule pontos e desbloqueie troféus</li>
          <li>Dispute o placar da sessão</li>
          <li>Dados zeram ao fechar o navegador</li>
        </ul>
      </section>

      <div class="actions">
        <a href="jogos.html" class="pixel-btn pixel-btn--green">▶ Galeria de máquinas</a>
        <a href="index.html" class="pixel-btn pixel-btn--blue">Voltar ao lobby</a>
      </div>
    </article>`;
}

onReady(init);
