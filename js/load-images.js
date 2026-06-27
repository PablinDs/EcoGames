import { assetPath } from './asset-path.js';

export function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha ao carregar: ${path}`));
    img.src = assetPath(path);
  });
}

export async function loadImages(paths) {
  const entries = Object.entries(paths);
  const loaded = await Promise.all(entries.map(([, p]) => loadImage(p)));
  const out = {};
  entries.forEach(([key], i) => {
    out[key] = loaded[i];
  });
  return out;
}
