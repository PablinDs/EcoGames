/** Textos globais da plataforma EcoGames */
export const PLATFORM_NAME = 'EcoGames';
export const PLATFORM_TAGLINE = 'Fliperama de Educação Ambiental';
export const PLATFORM_MARQUEE =
  '★ SALA ECO ★ RECICLE · PROTEJA A FAUNA · INSIRA SUA FICHA · HIGH SCORE ★';

/** Caminho base relativo (funciona em GitHub Pages subpasta) */
export function getBase() {
  const path = window.location.pathname;
  const lastSlash = path.lastIndexOf('/');
  if (lastSlash <= 0) return './';
  return path.slice(0, lastSlash + 1);
}
