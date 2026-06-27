import { loadImages } from '../load-images.js';

const W = 1024;
const H = 728;
const TRASH_SPEED = 4;
const POINTS = 10;

const ASSETS = {
  fundo: 'assets/reciclagem/FUNDO.png',
  player: 'assets/reciclagem/Player.png',
  papel: 'assets/reciclagem/papel.png',
  barreira: 'assets/reciclagem/Quadrado.png',
  win: 'assets/reciclagem/Win3.png',
  gameOver: 'assets/reciclagem/Gamer Over.png',
  fundoMenu: 'assets/reciclagem/fundomenu.png',
};

function rectHit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function draw(ctx, imgs, s, end) {
  ctx.drawImage(imgs.fundo, 0, 0, W, H);
  if (s.barrier.visible) ctx.drawImage(imgs.barreira, s.barrier.x, s.barrier.y, s.barrier.w, s.barrier.h);
  for (const t of s.trashes) {
    if (t.visible) ctx.drawImage(imgs.papel, t.x, t.y, t.w, t.h);
  }
  if (s.player.visible) ctx.drawImage(imgs.player, s.player.x, s.player.y, s.player.w, s.player.h);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px VT323, monospace';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.strokeText(`Pontuação: ${s.score}`, 10, 24);
  ctx.fillText(`Pontuação: ${s.score}`, 10, 24);
  if (end === 'win') {
    ctx.drawImage(imgs.win, 0, 0, W, H);
    ctx.fillText(`Pontuação Final: ${s.score}`, 10, 40);
  } else if (end === 'lose') {
    ctx.drawImage(imgs.gameOver, 0, 0, W, H);
    ctx.fillText(`Pontuação Final: ${s.score}`, 10, 40);
  }
}

export function mountReciclagemGame(container, { onScoreChange, onGameEnd }) {
  container.innerHTML = '<p class="loading">Carregando sprites...</p>';
  let cleanup = null;

  loadImages(ASSETS).then((imgs) => {
    let trashCount = 12;
    let started = false;
    let dragActive = false;
    let endState = null;
    const state = {
      player: { x: -50, y: 330, w: Math.floor(imgs.player.naturalWidth / 2), h: Math.floor(imgs.player.naturalHeight / 2), visible: true },
      barrier: { x: -98, y: 0, w: imgs.barreira.naturalWidth, h: imgs.barreira.naturalHeight, visible: true },
      trashes: [],
      score: 0,
      playing: false,
    };

    function initTrashes(count) {
      state.trashes = [];
      for (let i = 0; i < count; i++) {
        state.trashes.push({
          x: Math.random() * 8000 + 1024,
          y: Math.random() * 650 + 30,
          w: imgs.papel.naturalWidth,
          h: imgs.papel.naturalHeight,
          visible: true,
        });
      }
    }

    function renderSetup() {
      container.innerHTML = `
        <div class="setup" style="background-image:url('${imgs.fundoMenu.src}')">
          <div class="setupPanel">
            <h2>O Jogo da Reciclagem</h2>
            <p>Colete todos os resíduos e evite a barreira.</p>
            <label>Quantidade de lixos
              <input type="range" min="5" max="25" value="${trashCount}" id="trashRange">
              <span id="trashVal">${trashCount}</span>
            </label>
            <button type="button" class="startBtn pixel-btn pixel-btn--green" id="startBtn">Jogar</button>
          </div>
        </div>`;
      container.querySelector('#trashRange').addEventListener('input', (e) => {
        trashCount = +e.target.value;
        container.querySelector('#trashVal').textContent = trashCount;
      });
      container.querySelector('#startBtn').addEventListener('click', startGame);
    }

    function movePlayer(clientX, clientY, canvas) {
      if (!state.playing) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const cx = (clientX - rect.left) * scaleX;
      const cy = (clientY - rect.top) * scaleY;
      const p = state.player;
      p.x = Math.max(-20, Math.min(W - p.w, cx - p.w / 2));
      p.y = Math.max(0, Math.min(H - p.h, cy - p.h / 2));
    }

    function startGame() {
      state.player = { x: -50, y: 330, w: state.player.w, h: state.player.h, visible: true };
      state.barrier = { x: -98, y: 0, w: state.barrier.w, h: state.barrier.h, visible: true };
      state.score = 0;
      state.playing = true;
      endState = null;
      dragActive = false;
      initTrashes(trashCount);
      onScoreChange?.(0);
      started = true;
      renderGame();
    }

    function renderGame() {
      container.innerHTML = `
        <div class="wrap">
          <div class="game-canvas-wrap" style="max-width:1024px;margin:0 auto">
            <canvas width="${W}" height="${H}" class="canvasFill dragCanvas"></canvas>
          </div>
          <p class="dragHint">Toque e arraste no cenário para mover o coletor</p>
        </div>`;
      const canvas = container.querySelector('canvas');
      const ctx = canvas.getContext('2d');

      const onDown = (e) => {
        if (!state.playing) return;
        dragActive = true;
        canvas.setPointerCapture(e.pointerId);
        movePlayer(e.clientX, e.clientY, canvas);
      };
      const onUp = (e) => {
        if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
        dragActive = false;
      };
      const onMove = (e) => {
        if (dragActive) movePlayer(e.clientX, e.clientY, canvas);
      };

      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointerup', onUp);
      canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointermove', onMove);

      let frameId = 0;
      const loop = () => {
        if (state.playing) {
          for (const t of state.trashes) {
            if (t.visible) t.x -= TRASH_SPEED;
            if (t.x < -200) t.visible = false;
          }
          const pb = state.player;
          const bb = state.barrier;
          for (const t of state.trashes) {
            if (!t.visible) continue;
            if (rectHit(pb, t) && t.x > 0) {
              t.visible = false;
              state.score += POINTS;
              onScoreChange?.(state.score);
            }
            if (rectHit(bb, t) && t.visible) {
              state.playing = false;
              endState = 'lose';
              onGameEnd?.(state.score);
            }
          }
          if (state.trashes.every((t) => !t.visible)) {
            state.playing = false;
            state.score += 50;
            onScoreChange?.(state.score);
            endState = 'win';
            onGameEnd?.(state.score);
          }
        }
        draw(ctx, imgs, state, endState);
        frameId = requestAnimationFrame(loop);
      };
      frameId = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(frameId);
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointerup', onUp);
        canvas.removeEventListener('pointercancel', onUp);
        window.removeEventListener('pointermove', onMove);
      };
    }

    renderSetup();
  }).catch(() => {
    container.innerHTML = '<p class="loading">Erro ao carregar sprites.</p>';
  });

  return () => cleanup?.();
}
