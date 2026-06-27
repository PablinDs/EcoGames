import { getBase } from './config.js';

/**
 * Resolve caminho de asset para localhost e GitHub Pages (subpasta do repositório).
 */
export function assetPath(relativePath) {
  const clean = relativePath.replace(/^\//, '');
  const base = getBase();
  if (base === './') return clean;
  return `${base}${clean}`;
}
