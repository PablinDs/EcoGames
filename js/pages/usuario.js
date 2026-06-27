import { onReady } from '../boot.js';
import { GAMES } from '../games-registry.js';
import {
  getPlayerName,
  setPlayerName,
  getProfile,
  getAvatar,
  getXpProgress,
  getTotalPoints,
  getAchievementsState,
  getHistory,
  setAvatarId,
  AVATARS,
} from '../player.js';
import { avatarIcon, icon } from '../icons.js';
import { sessionNoticeHtml } from '../session-notice.js';

function init() {
  const root = document.getElementById('pageRoot');
  if (!root) return;

  const playerName = getPlayerName();
  const profile = getProfile();
  const xp = getXpProgress(profile.xp);
  const totalPoints = getTotalPoints(playerName);
  const achievements = getAchievementsState();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const history = getHistory();
  const gamesPlayed = profile.gamesPlayed.length;

  const avatarGrid = AVATARS.map(
    (_, i) => `
    <button type="button" class="pixel-btn avatarPickBtn ${profile.avatarId === i ? 'pixel-btn--green' : 'pixel-btn--ghost'}"
      data-avatar="${i}" aria-pressed="${profile.avatarId === i}">${avatarIcon(i)}</button>`,
  ).join('');

  const gameList = GAMES.map(
    (g) => `
    <li class="${profile.gamesPlayed.includes(g.id) ? 'played' : ''}">
      ${icon('gamepad', 'uiIcon uiIcon--inline')} ${g.name}
      ${profile.gamesPlayed.includes(g.id) ? `<span class="check">${icon('star', 'uiIcon', 16)}</span>` : ''}
    </li>`,
  ).join('');

  const recent =
    history.length > 0
      ? `<section class="recent pixel-panel">
          <h2 class="pixel-heading">Últimas partidas</h2>
          <ul>${history
            .slice(0, 8)
            .map((h) => {
              const g = GAMES.find((x) => x.id === h.gameId);
              return `<li><span>${g?.name ?? h.gameId}</span><span>${h.score} pts</span>
                <time>${new Date(h.date).toLocaleDateString('pt-BR')}</time></li>`;
            })
            .join('')}</ul>
        </section>`
      : '';

  root.innerHTML = `
    <div class="page pageNarrow">
      ${sessionNoticeHtml(true)}
      <section class="profileCard pixel-panel">
        <div class="avatarWrap">
          <span class="avatarBig" aria-hidden>${getAvatar(profile)}</span>
        </div>
        <div class="profileMain">
          <label class="nameField">
            Nome no placar
            <input type="text" id="playerName" value="${playerName}" placeholder="Seu nome" maxlength="24" class="input">
          </label>
          <p class="level">Nível <strong>${xp.level}</strong> · ${profile.xp} XP total</p>
          <div class="xpBar"><div class="xpFill" style="width:${xp.percent}%"></div></div>
          <p class="xpLabel">${xp.current} / ${xp.needed} XP para o próximo nível</p>
        </div>
      </section>

      <section class="stats">
        <div class="stat pixel-panel"><span class="statIcon">${icon('coin', 'uiIcon', 28)}</span><strong>${totalPoints}</strong><span>Pontos totais</span></div>
        <div class="stat pixel-panel"><span class="statIcon">${icon('gamepad', 'uiIcon', 28)}</span><strong>${gamesPlayed}</strong><span>Máquinas jogadas</span></div>
        <div class="stat pixel-panel"><span class="statIcon">${icon('medal', 'uiIcon', 28)}</span><strong>${unlockedCount}</strong><span>Conquistas</span></div>
        <div class="stat pixel-panel"><span class="statIcon">${icon('clipboard', 'uiIcon', 28)}</span><strong>${profile.totalSessions}</strong><span>Partidas</span></div>
      </section>

      <section class="avatarPick pixel-panel">
        <h2 class="pixel-heading">Avatar</h2>
        <div class="avatarGrid">${avatarGrid}</div>
      </section>

      <section class="gamesPlayed pixel-panel">
        <h2 class="pixel-heading">Máquinas jogadas</h2>
        <ul class="gameList">${gameList}</ul>
      </section>

      ${recent}
    </div>`;

  root.querySelector('#playerName')?.addEventListener('input', (e) => setPlayerName(e.target.value));
  root.querySelectorAll('[data-avatar]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setAvatarId(+btn.dataset.avatar);
      init();
    });
  });
}

onReady(init);
