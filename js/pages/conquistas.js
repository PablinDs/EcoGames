import { onReady } from '../boot.js';
import { icon } from '../icons.js';
import { getAchievementsState } from '../player.js';

function init() {
  const root = document.getElementById('pageRoot');
  if (!root) return;

  const achievements = getAchievementsState();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const locked = achievements.filter((a) => !a.unlocked);
  const unlocked = achievements.filter((a) => a.unlocked);

  function card(a) {
    const cls = a.unlocked ? 'achieveCard achieveCardUnlocked' : 'achieveCard achieveCardLocked';
    const iconHtml = a.unlocked ? icon(a.icon, 'uiIcon uiIcon--achieve', 32) : icon('lock', 'uiIcon uiIcon--achieve', 32);
    return `
      <article class="${cls} pixel-panel">
        <span class="icon" aria-hidden>${iconHtml}</span>
        <div>
          <h3>${a.name}</h3>
          <p>${a.description}</p>
          <span class="xp">+${a.xpReward} XP</span>
        </div>
        ${a.unlocked ? `<span class="status" aria-hidden>${icon('star', 'uiIcon', 18)}</span>` : ''}
      </article>`;
  }

  root.innerHTML = `
    <div class="page pageNarrow">
      <header class="header pixel-panel">
        <h1 class="pixel-heading">${icon('medal', 'uiIcon uiIcon--inline')} Troféus</h1>
        <p class="pixel-text">${unlockedCount}/${achievements.length} desbloqueados nesta sessão.</p>
        <div class="progressBar">
          <div class="progressFill" style="width:${(unlockedCount / achievements.length) * 100}%"></div>
        </div>
      </header>
      ${
        unlocked.length
          ? `<section><h2 class="sectionTitle">Desbloqueadas</h2><div class="grid">${unlocked.map(card).join('')}</div></section>`
          : ''
      }
      <section>
        <h2 class="sectionTitle">Bloqueadas</h2>
        <div class="grid">${locked.map(card).join('')}</div>
      </section>
    </div>`;
}

onReady(init);
