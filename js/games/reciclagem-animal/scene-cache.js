import { loadImages } from '../../load-images.js';
import {
  BOSS_PREFIX,
  bossFramePath,
  danoBossFramePath,
  sceneFramePath
} from "./assets.js";
import { BOSS_PHASES, ENCOUNTERS } from "./data.js";
const DANO_KEY = (waste) => `dano-${waste}`;
function sceneKey(encIdx, bossPh) {
  return `${encIdx}-${bossPh}`;
}
function getFramePaths(encIdx, bossPh) {
  const enc = ENCOUNTERS[encIdx];
  let prefix;
  let frameCount = 12;
  if (enc.isBoss) {
    prefix = BOSS_PREFIX[BOSS_PHASES[bossPh].correct];
    frameCount = 6;
  } else {
    prefix = enc.scenePrefix;
    if (prefix === "parque") frameCount = 10;
  }
  const paths = {};
  for (let i = 1; i <= frameCount; i++) {
    paths[`f${i}`] = enc.isBoss ? bossFramePath(prefix, i - 1) : sceneFramePath(prefix, i);
  }
  return paths;
}
function getDanoFramePaths(waste) {
  const paths = {};
  for (let i = 0; i < 10; i++) {
    paths[`f${i}`] = danoBossFramePath(waste, i);
  }
  return paths;
}
async function preloadAllScenes() {
  const cache = /* @__PURE__ */ new Map();
  const tasks = [];
  for (let encIdx = 0; encIdx < ENCOUNTERS.length; encIdx++) {
    const enc = ENCOUNTERS[encIdx];
    const bossIterations = enc.isBoss ? BOSS_PHASES.length : 1;
    for (let bossPh = 0; bossPh < bossIterations; bossPh++) {
      const key = sceneKey(encIdx, bossPh);
      const paths = getFramePaths(encIdx, bossPh);
      tasks.push(
        loadImages(paths).then((loaded) => {
          const frames = Object.keys(paths).sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10)).map((k) => loaded[k]);
          cache.set(key, frames);
        })
      );
    }
  }
  const wasteTypes = ["metal", "papel", "vidro", "plastico", "organico"];
  for (const waste of wasteTypes) {
    const paths = getDanoFramePaths(waste);
    tasks.push(
      loadImages(paths).then((loaded) => {
        const frames = Object.keys(paths).sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10)).map((k) => loaded[k]);
        cache.set(DANO_KEY(waste), frames);
      })
    );
  }
  await Promise.all(tasks);
  return cache;
}
function getSceneFrames(cache, encIdx, bossPh) {
  return cache.get(sceneKey(encIdx, bossPh)) ?? [];
}
function getDanoBossFrames(cache, waste) {
  return cache.get(DANO_KEY(waste)) ?? [];
}
function getFrameCount(encIdx) {
  const enc = ENCOUNTERS[encIdx];
  if (enc.isBoss) return 6;
  if (enc.scenePrefix === "parque") return 10;
  return 12;
}
export {
  getDanoBossFrames,
  getFrameCount,
  getSceneFrames,
  preloadAllScenes
};
