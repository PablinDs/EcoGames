const CANVAS_W = 800;
const SCENE_SRC_H = 600;
/** Faixa de diálogo embutida nos PNGs originais — recortada do sprite */
const SCENE_DIALOGUE_RATIO = 0.18;
const SCENE_VIEW_RATIO = 1 - SCENE_DIALOGUE_RATIO;
/** Tarja interativa HTML (parte inferior do quadro do jogo) */
const TARJA_RATIO = 0.34;
const FRAME_H = SCENE_SRC_H;
const TARJA_H = Math.floor(FRAME_H * TARJA_RATIO);
const SCENE_CANVAS_H = FRAME_H - TARJA_H;
const BOSS_PREFIX = {
  metal: "bossmetal",
  papel: "bosspapel",
  vidro: "bossvidro",
  plastico: "bossplastico",
  organico: "bossorganico"
};
function sceneFramePath(prefix, frame) {
  return `assets/reciclagem-animal/cenas/${prefix}${frame}.png`;
}
function bossFramePath(prefix, frame) {
  return `assets/reciclagem-animal/boss/${prefix}${frame}.png`;
}
const DANO_BOSS_SLUG = {
  metal: "metal",
  papel: "papel",
  vidro: "vidro",
  plastico: "plastico",
  organico: "organico"
};
function danoBossFramePath(waste, index) {
  const num = String(index).padStart(2, "0");
  return `assets/reciclagem-animal/boss/danoboss${DANO_BOSS_SLUG[waste]}${num}.png`;
}
function bossDamageFrameSequence() {
  return Array.from({ length: 10 }, (_, i) => i + 1);
}
function idleFrameSequence(max = 6) {
  const up = Array.from({ length: max }, (_, i) => i + 1);
  if (max <= 2) return up;
  const down = Array.from({ length: max - 2 }, (_, i) => max - 1 - i);
  return [...up, ...down];
}
function rescuedFrameSequence(maxFrame) {
  const start = Math.min(7, maxFrame);
  const end = maxFrame;
  const up = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  if (up.length <= 1) return up;
  const down = Array.from({ length: end - start - 1 }, (_, i) => end - 1 - i);
  return [...up, ...down];
}
function getAnimationSequence(scenePrefix, rescued, frameCount, isBoss = false) {
  if (isBoss) {
    const max = Math.min(6, frameCount);
    return rescued ? [max] : idleFrameSequence(max);
  }
  if (scenePrefix === "parque") {
    return rescued ? [6, 7, 8, 9, 10, 10, 9, 8, 7, 6] : [1, 2, 3, 4, 5, 5, 4, 3, 2, 1];
  }
  return rescued ? rescuedFrameSequence(frameCount) : idleFrameSequence(Math.min(6, frameCount));
}
/** Desenha só a parte de cenário do sprite (sem a tarja embutida no PNG). */
function drawSceneFrame(ctx, img, destW, destH) {
  ctx.imageSmoothingEnabled = false;
  const srcW = img.naturalWidth || destW;
  const srcH = img.naturalHeight || SCENE_SRC_H;
  const cropH = Math.floor(srcH * SCENE_VIEW_RATIO);
  ctx.drawImage(img, 0, 0, srcW, cropH, 0, 0, destW, destH);
}
export {
  BOSS_PREFIX,
  CANVAS_W,
  FRAME_H,
  SCENE_CANVAS_H,
  SCENE_SRC_H,
  SCENE_VIEW_RATIO,
  TARJA_H,
  TARJA_RATIO,
  bossDamageFrameSequence,
  bossFramePath,
  danoBossFramePath,
  drawSceneFrame,
  getAnimationSequence,
  idleFrameSequence,
  rescuedFrameSequence,
  sceneFramePath
};
