import { loadImage } from '../load-images.js';
import { FlappyEngine, FLAPPY } from './flappy-engine.js';

export function mountFlappyGame(container, { onScoreChange, onGameEnd }) {
  container.innerHTML = '<p class="loading">Carregando sprites...</p>';

  let cleanup = null;

  loadImage('assets/flappy-eco/flappy.png')
    .then((sprite) => {
      container.innerHTML = `
        <div class="game-canvas-wrap" style="max-width:420px;margin:0 auto">
          <canvas width="${FLAPPY.WIDTH}" height="${FLAPPY.HEIGHT}" class="canvasFill" aria-label="Flappy World"></canvas>
          <p class="touchHint">Toque ou Espaço para voar</p>
        </div>`;
      const canvas = container.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      const engine = new FlappyEngine();
      let prevState = engine.gameState;
      let ended = false;

      const onInput = (e) => {
        e?.preventDefault();
        engine.handleInput();
      };
      const onKey = (e) => {
        if (e.code === 'Space') onInput(e);
      };
      canvas.addEventListener('click', onInput);
      canvas.addEventListener('touchstart', onInput, { passive: false });
      window.addEventListener('keydown', onKey);

      let last = performance.now();
      let frameId = 0;
      const loop = (now) => {
        const dt = Math.min((now - last) / 1000, FLAPPY.MAX_DT);
        last = now;
        if (dt > 0) {
          const score = engine.tick(dt);
          onScoreChange?.(score);
          if (prevState === 2 && engine.gameState === 3 && !ended) {
            ended = true;
            onGameEnd?.(score);
          }
          prevState = engine.gameState;
          engine.draw(ctx, sprite);
        }
        frameId = requestAnimationFrame(loop);
      };
      frameId = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(frameId);
        canvas.removeEventListener('click', onInput);
        canvas.removeEventListener('touchstart', onInput);
        window.removeEventListener('keydown', onKey);
      };
    })
    .catch(() => {
      container.innerHTML = '<p class="loading">Erro ao carregar sprites.</p>';
    });

  return () => cleanup?.();
}
