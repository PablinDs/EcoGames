import { loadImage } from '../../load-images.js';
import { icon } from '../../icons.js';
import {
  CANVAS_W,
  SCENE_CANVAS_H,
  bossDamageFrameSequence,
  drawSceneFrame,
  getAnimationSequence,
} from './assets.js';
import { BINS, BOSS_PHASES, ENCOUNTERS, STORY_CHAPTERS } from './data.js';
import { getDanoBossFrames, getFrameCount, getSceneFrames, preloadAllScenes } from './scene-cache.js';
import { animalSoundEngine } from './sound-engine.js';

const BIN_META = {
  metal: { color: '#e9c46a', icon: 'metal' },
  papel: { color: '#4cc9f0', icon: 'paper' },
  vidro: { color: '#52b788', icon: 'glass' },
  plastico: { color: '#f4a261', icon: 'plastic' },
  organico: { color: '#8b7355', icon: 'organic' },
};

export function mountReciclagemAnimalGame(container, { onScoreChange, onGameEnd }) {
  container.innerHTML = '<p class="loading">Carregando cenários...</p>';

  let cleanup = null;
  let sceneCache = null;
  let tituloImg = null;
  let bossDerrotadoImg = null;
  let bgFrames = [];
  let animSeq = [1];
  let frameIdx = 0;
  let lastAnim = 0;
  let phase = 'title';
  let selectedBin = 0;
  let score = 0;
  let encounterIndex = 0;
  let bossPhase = 0;
  let rescued = false;
  let bossDamage = false;
  let bossDamageDone = null;
  let bossDamageHold = false;
  let bossAnimating = false;
  let storyFull = '';
  let storyDone = false;
  let storyText = '';
  let storyInterval = null;
  let lastTextSfx = 0;
  let soundMuted = animalSoundEngine.isMuted();
  let frameId = 0;
  let keyHandler = null;
  let canvas = null;
  let ctx = null;
  let gameEnded = false;

  const el = { hud: null, sceneTarja: null, sceneOverlay: null };

  function encounter() {
    return ENCOUNTERS[encounterIndex];
  }

  function isBoss() {
    return encounter().isBoss === true;
  }

  function bossRound() {
    return isBoss() ? BOSS_PHASES[bossPhase] : null;
  }

  function questText() {
    const enc = encounter();
    if (phase === 'success') return enc.successMessage;
    if (isBoss()) return bossRound().waste;
    return enc.encounterText;
  }

  function applyScene(encIdx, bossPh, isRescued) {
    if (!sceneCache) return;
    const enc = ENCOUNTERS[encIdx];
    bgFrames = getSceneFrames(sceneCache, encIdx, bossPh);
    const fc = getFrameCount(encIdx);
    animSeq = getAnimationSequence(enc.scenePrefix, isRescued, fc, enc.isBoss);
    frameIdx = 0;
    lastAnim = 0;
  }

  function finishBossDamage() {
    if (!bossDamage) return;
    bossDamage = false;
    bossDamageHold = false;
    bossAnimating = false;
    const done = bossDamageDone;
    bossDamageDone = null;
    done?.();
    renderUI();
  }

  function advanceBossPhase() {
    bossPhase += 1;
    applyScene(encounterIndex, bossPhase, false);
    selectedBin = 0;
    window.setTimeout(() => renderUI(), 400);
  }

  function playBossDefeated(onDone) {
    if (!bossDerrotadoImg) {
      onDone();
      return;
    }
    bossDamage = true;
    bossAnimating = true;
    bgFrames = [bossDerrotadoImg];
    animSeq = [1];
    frameIdx = 0;
    lastAnim = 0;
    renderUI();
    window.setTimeout(() => {
      bossDamage = false;
      bossAnimating = false;
      onDone();
      renderUI();
    }, 1500);
  }

  function playBossDamage(waste, onDone) {
    if (!sceneCache) {
      onDone();
      return;
    }
    const frames = getDanoBossFrames(sceneCache, waste);
    if (!frames.length) {
      onDone();
      return;
    }
    bossDamage = true;
    bossDamageHold = false;
    bossAnimating = true;
    bossDamageDone = onDone;
    bgFrames = frames;
    animSeq = bossDamageFrameSequence();
    frameIdx = 0;
    lastAnim = 0;
    renderUI();
  }

  function clearStoryInterval() {
    if (storyInterval) {
      clearInterval(storyInterval);
      storyInterval = null;
    }
  }

  function updateStoryDisplay() {
    const textEl = el.sceneTarja?.querySelector('.tarjaText');
    if (textEl) textEl.textContent = storyText || '\u00A0';
  }

  function startStoryTyping() {
    clearStoryInterval();
    const full = STORY_CHAPTERS[encounterIndex] ?? '';
    storyFull = full;
    storyDone = false;
    lastTextSfx = 0;
    storyText = '';
    animalSoundEngine.playStoryMusic();
    renderPanel();
    let i = 0;
    storyInterval = setInterval(() => {
      if (storyDone) return;
      if (i < full.length) {
        i += 1;
        storyText = full.slice(0, i);
        if (i - lastTextSfx >= 3) {
          lastTextSfx = i;
          animalSoundEngine.playSfx('texto', 0.35);
        }
        updateStoryDisplay();
      } else {
        clearStoryInterval();
        storyDone = true;
        storyText = storyFull;
        renderPanel();
      }
    }, 16);
  }

  function selectBin(index) {
    if (bossDamage) return;
    if (index !== selectedBin) {
      animalSoundEngine.unlock();
      animalSoundEngine.playSfx('select');
    }
    selectedBin = index;
    renderPanel();
  }

  function toggleSound() {
    soundMuted = animalSoundEngine.toggleMute();
    if (!soundMuted) {
      animalSoundEngine.unlock();
      if (phase === 'title') animalSoundEngine.playTitleMusic();
      else if (phase === 'story') animalSoundEngine.playStoryMusic();
      else if (phase === 'battle') animalSoundEngine.playEncounterMusic(encounterIndex);
    }
    renderUI();
  }

  function addScore(delta) {
    score = Math.max(0, score + delta);
    onScoreChange?.(score);
    renderUI();
  }

  function confirmBin() {
    if (phase !== 'battle' || bossDamage) return;
    animalSoundEngine.unlock();

    const chosen = BINS[selectedBin].id;
    const enc = encounter();
    const boss = isBoss() ? BOSS_PHASES[bossPhase] : null;
    const correct = isBoss() ? boss.correct : enc.correctBin;

    if (chosen === correct) {
      animalSoundEngine.playSfx('certo');
      addScore(isBoss() ? 50 : 100);

      if (isBoss() && bossPhase < BOSS_PHASES.length - 1) {
        if (bossPhase === 0) animalSoundEngine.playSfx('hahaha', 0.5);
        const hitWaste = BOSS_PHASES[bossPhase].correct;
        playBossDamage(hitWaste, () => advanceBossPhase());
        renderPanel('Correto!', 'success', selectedBin);
        return;
      }

      if (isBoss()) {
        const hitWaste = BOSS_PHASES[bossPhase].correct;
        playBossDamage(hitWaste, () => {
          playBossDefeated(() => {
            rescued = true;
            animalSoundEngine.stopMusic();
            animalSoundEngine.playBossFinalMusic();
            phase = 'success';
            renderUI();
          });
        });
        renderPanel('Correto!', 'success', selectedBin);
        return;
      }

      rescued = true;
      applyScene(encounterIndex, bossPhase, true);
      animalSoundEngine.stopMusic();
      phase = 'success';
      renderUI();
    } else {
      animalSoundEngine.playSfx('som', 0.45);
      addScore(-10);
      renderPanel('Resposta incorreta — escolha outra lixeira.', 'error', null);
      window.setTimeout(() => renderPanel(), 650);
    }
  }

  function startGame() {
    animalSoundEngine.unlock();
    animalSoundEngine.stopMusic();
    encounterIndex = 0;
    score = 0;
    bossPhase = 0;
    rescued = false;
    gameEnded = false;
    onScoreChange?.(0);
    phase = 'story';
    applyScene(encounterIndex, bossPhase, false);
    startStoryTyping();
    renderUI();
  }

  function goBattle() {
    animalSoundEngine.stopMusic();
    animalSoundEngine.playEncounterMusic(encounterIndex);
    rescued = false;
    bossDamage = false;
    bossDamageHold = false;
    bossDamageDone = null;
    bossAnimating = false;
    selectedBin = 0;
    phase = 'battle';
    applyScene(encounterIndex, bossPhase, false);
    renderUI();
  }

  function nextChapter() {
    if (encounterIndex >= ENCOUNTERS.length - 1) {
      score += 200;
      onScoreChange?.(score);
      if (!gameEnded) {
        gameEnded = true;
        onGameEnd?.(score);
      }
      phase = 'victory';
      animalSoundEngine.playVictoryMusic();
      renderUI();
      return;
    }
    encounterIndex += 1;
    bossPhase = 0;
    rescued = false;
    phase = 'story';
    applyScene(encounterIndex, bossPhase, false);
    startStoryTyping();
    renderUI();
  }

  function handleStoryContinue() {
    if (!storyDone) {
      storyDone = true;
      clearStoryInterval();
      storyText = storyFull;
      renderPanel();
      return;
    }
    goBattle();
  }

  function renderPanel(feedback = null, feedbackKind = null, highlight = null) {
    const slot = el.sceneTarja;
    if (!slot) return;
    const enc = encounter();
    const showPanel = ['story', 'battle', 'success', 'victory'].includes(phase);
    if (!showPanel) {
      slot.innerHTML = '';
      slot.hidden = true;
      return;
    }
    slot.hidden = false;

    if (phase === 'story') {
      const skipBtn = storyDone
        ? `<button type="button" class="pixel-btn pixel-btn--green pixel-btn--sm" data-action="story-continue">Começar missão</button>`
        : `<button type="button" class="pixel-btn pixel-btn--ghost pixel-btn--sm" data-action="story-continue">${icon('skip', 'uiIcon uiIcon--inline', 16)} Pular</button>`;
      slot.innerHTML = `
        <div class="tarjaPanel tarjaPanel--story">
          <p class="tarjaText">${storyText || '\u00A0'}</p>
          <div class="tarjaActions">${skipBtn}</div>
        </div>`;
    } else if (phase === 'battle') {
      const fbClass =
        feedbackKind === 'success' ? 'tarjaFeedback tarjaFeedback--ok' : 'tarjaFeedback tarjaFeedback--err';
      slot.innerHTML = `
        <div class="tarjaPanel tarjaPanel--battle">
          <p class="tarjaQuest">${questText()}</p>
          ${feedback ? `<p class="${fbClass}" role="alert">${feedback}</p>` : ''}
          <div class="binRow">
            ${BINS.map((bin, i) => {
              const meta = BIN_META[bin.id];
              const active = highlight === i ? 'binCardCorrect' : i === selectedBin ? 'binCardActive' : '';
              return `
                <button type="button" class="binCard ${active}" style="--bin-accent:${meta.color}"
                  data-bin="${i}" aria-pressed="${i === selectedBin}" title="${bin.label}">
                  <span class="binIcon">${icon(meta.icon, 'uiIcon uiIcon--bin', 22)}</span>
                  <span class="binLabel">${bin.label}</span>
                </button>`;
            }).join('')}
          </div>
          <div class="tarjaActions tarjaActions--battle">
            <button type="button" class="pixel-btn pixel-btn--green pixel-btn--sm" data-action="confirm" ${bossAnimating ? 'disabled' : ''}>Confirmar</button>
            <span class="tarjaHint">← → · Enter</span>
          </div>
        </div>`;
    } else if (phase === 'success') {
      slot.innerHTML = `
        <div class="tarjaPanel tarjaPanel--success">
          <p class="tarjaText">${enc.successMessage}</p>
          <div class="tarjaActions">
            <button type="button" class="pixel-btn pixel-btn--green pixel-btn--sm" data-action="next-chapter">
              ${encounterIndex >= ENCOUNTERS.length - 1 ? 'Ver resultado' : 'Próximo capítulo'}
            </button>
          </div>
        </div>`;
    } else if (phase === 'victory') {
      slot.innerHTML = `
        <div class="tarjaPanel tarjaPanel--victory">
          ${icon('trophy', 'uiIcon uiIcon--inline', 22)}
          <p class="tarjaVictory">Jornada completa! <strong>${score} pts</strong></p>
        </div>`;
    }
  }

  function bindTarjaActions() {
    el.sceneTarja?.addEventListener('click', (e) => {
      const binBtn = e.target.closest('[data-bin]');
      if (binBtn) {
        selectBin(+binBtn.dataset.bin);
        return;
      }
      const btn = e.target.closest('[data-action]');
      if (!btn || btn.disabled) return;
      if (btn.dataset.action === 'story-continue') handleStoryContinue();
      if (btn.dataset.action === 'confirm') confirmBin();
      if (btn.dataset.action === 'next-chapter') nextChapter();
    });
  }

  function renderUI() {
    if (!el.hud) return;
    const enc = encounter();
    el.hud.innerHTML = `
      <span class="hudChapter">Capítulo ${Math.min(encounterIndex + 1, 5)}/5</span>
      <span class="hudTitle">${enc.title}</span>
      <span class="hudScore">${score} pts</span>
      <button type="button" class="soundBtn" data-action="sound" aria-pressed="${soundMuted}"
        title="${soundMuted ? 'Ativar som' : 'Desativar som'}">${soundMuted ? icon('volumeOff', 'uiIcon', 18) : icon('volume', 'uiIcon', 18)}</button>`;
    el.hud.querySelector('[data-action="sound"]')?.addEventListener('click', toggleSound);

    if (el.sceneOverlay) {
      const showTitle = phase === 'title';
      el.sceneOverlay.hidden = !showTitle;
      el.sceneOverlay.style.display = showTitle ? '' : 'none';
    }

    renderPanel();
  }

  function bindKeys() {
    keyHandler = (e) => {
      if (phase === 'title' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        startGame();
      }
      if (phase === 'story' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleStoryContinue();
      }
      if (phase === 'battle') {
        if (e.code === 'ArrowLeft') {
          e.preventDefault();
          selectBin((selectedBin - 1 + BINS.length) % BINS.length);
        }
        if (e.code === 'ArrowRight') {
          e.preventDefault();
          selectBin((selectedBin + 1) % BINS.length);
        }
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          confirmBin();
        }
      }
      if (phase === 'success' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        nextChapter();
      }
    };
    window.addEventListener('keydown', keyHandler);
  }

  function startDrawLoop() {
    const draw = (now) => {
      if (now - lastAnim >= 100) {
        if (bossDamage && bossDamageDone && animSeq.length > 1) {
          if (frameIdx < animSeq.length - 1) frameIdx += 1;
          if (frameIdx >= animSeq.length - 1 && !bossDamageHold) {
            bossDamageHold = true;
            window.setTimeout(() => finishBossDamage(), 120);
          }
        } else if (!bossDamage) {
          frameIdx = (frameIdx + 1) % animSeq.length;
        }
        lastAnim = now;
      }

      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0, 0, CANVAS_W, SCENE_CANVAS_H);

      if (phase === 'title' && tituloImg) {
        ctx.drawImage(tituloImg, CANVAS_W * 0.12, 24, CANVAS_W * 0.76, SCENE_CANVAS_H * 0.28);
      } else if (['battle', 'success', 'story'].includes(phase) && bgFrames.length) {
        const frameNum = animSeq[frameIdx % animSeq.length];
        const bg = bgFrames[Math.min(frameNum - 1, bgFrames.length - 1)];
        if (bg) drawSceneFrame(ctx, bg, CANVAS_W, SCENE_CANVAS_H);
      }

      if (phase === 'victory') {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, CANVAS_W, SCENE_CANVAS_H);
      }

      frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);
  }

  Promise.all([
    preloadAllScenes(),
    loadImage('assets/reciclagem-animal/extra/titulo.png'),
    loadImage('assets/reciclagem-animal/boss/bossderrotado.png'),
  ])
    .then(([cache, titulo, bossDerrotado]) => {
      sceneCache = cache;
      tituloImg = titulo;
      bossDerrotadoImg = bossDerrotado;
      animalSoundEngine.preload();

      container.innerHTML = `
        <div class="animalGameShell">
          <header class="hud"></header>
          <div class="sceneFrame">
            <div class="sceneViewport">
              <canvas width="${CANVAS_W}" height="${SCENE_CANVAS_H}" class="sceneCanvas" aria-hidden></canvas>
            </div>
            <aside class="sceneTarja" aria-live="polite" hidden></aside>
            <div class="sceneOverlay">
              <button type="button" class="pixel-btn pixel-btn--green pixel-btn--lg" data-action="start">Iniciar jornada</button>
            </div>
          </div>
        </div>`;

      el.hud = container.querySelector('.hud');
      el.sceneTarja = container.querySelector('.sceneTarja');
      el.sceneOverlay = container.querySelector('.sceneOverlay');
      canvas = container.querySelector('canvas');
      ctx = canvas.getContext('2d');

      container.querySelector('[data-action="start"]')?.addEventListener('click', startGame);
      bindTarjaActions();
      bindKeys();
      renderUI();
      startDrawLoop();
      animalSoundEngine.unlock();
      animalSoundEngine.playTitleMusic();
    })
    .catch(() => {
      container.innerHTML = '<p class="loading">Erro ao carregar cenários.</p>';
    });

  return () => {
    cancelAnimationFrame(frameId);
    clearStoryInterval();
    if (keyHandler) window.removeEventListener('keydown', keyHandler);
    animalSoundEngine.dispose();
    cleanup?.();
  };
}
