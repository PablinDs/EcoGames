import { icon } from './icons.js';

export function sessionNoticeHtml(compact = false) {
  const cls = compact ? 'notice compact' : 'notice';
  const text = compact
    ? 'Placar e progresso salvos só nesta sessão.'
    : 'Placar, XP e troféus ficam nesta sessão. Ao fechar o navegador, tudo zera.';
  return `
    <aside class="${cls}" role="note">
      <p>${icon('info', 'uiIcon uiIcon--inline')} ${text}</p>
    </aside>`;
}
