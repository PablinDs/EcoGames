import { ACHIEVEMENTS, getAchievementById } from './achievements-data.js';
import { GAMES } from './games-registry.js';
import { avatarIcon } from './icons.js';

function uniqueId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const PLAYER_NAME_KEY = 'eco-games-player-name';
const RANKING_KEY = 'eco-games-ranking';
const HISTORY_KEY = 'eco-games-history';
const PROFILE_KEY = 'eco-games-profile';
const ACHIEVEMENTS_KEY = 'eco-games-achievements';
const MAX_RANKING = 50;
const MAX_HISTORY = 100;
const AVATARS = ['user', 'leaf', 'turtle', 'bird', 'recycle', 'tree', 'trophy', 'star'];

function readJson(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function readString(key) {
  try {
    return sessionStorage.getItem(key)?.trim() ?? '';
  } catch {
    return '';
  }
}

function writeString(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function getPlayerName() {
  return readString(PLAYER_NAME_KEY);
}

export function setPlayerName(name) {
  writeString(PLAYER_NAME_KEY, name.trim());
}

export function resolvePlayerName(preferred) {
  const fromArg = preferred?.trim();
  if (fromArg) return fromArg;
  const stored = getPlayerName();
  if (stored) return stored;
  return 'Jogador';
}

export function getRanking() {
  return readJson(RANKING_KEY, []);
}

export function getHistory() {
  return readJson(HISTORY_KEY, []);
}

export function getRankingByGame(gameId) {
  return getRanking()
    .filter((e) => e.gameId === gameId)
    .sort((a, b) => b.score - a.score);
}

export function getProfile() {
  const p = readJson(PROFILE_KEY, { xp: 0, gamesPlayed: [], totalSessions: 0, avatarId: 0 });
  return {
    xp: p.xp ?? 0,
    gamesPlayed: Array.isArray(p.gamesPlayed) ? p.gamesPlayed : [],
    totalSessions: p.totalSessions ?? 0,
    avatarId: p.avatarId ?? 0,
  };
}

function writeProfile(profile) {
  writeJson(PROFILE_KEY, profile);
}

export function getAvatar(profile) {
  return avatarIcon(profile.avatarId);
}

export function setAvatarId(id) {
  const p = getProfile();
  p.avatarId = Math.max(0, Math.min(AVATARS.length - 1, id));
  writeProfile(p);
  return p;
}

export function getXpProgress(xp) {
  const level = Math.floor(xp / 200) + 1;
  const base = (level - 1) * 200;
  const next = level * 200;
  const current = xp - base;
  const needed = next - base;
  return {
    level,
    current,
    needed,
    percent: needed > 0 ? Math.min(100, (current / needed) * 100) : 100,
  };
}

function addXp(amount) {
  const p = getProfile();
  p.xp = Math.max(0, p.xp + amount);
  writeProfile(p);
  return p;
}

function recordSession(gameId) {
  const p = getProfile();
  p.totalSessions += 1;
  if (!p.gamesPlayed.includes(gameId)) p.gamesPlayed = [...p.gamesPlayed, gameId];
  writeProfile(p);
  return p;
}

function getUnlockedIds() {
  return readJson(ACHIEVEMENTS_KEY, []);
}

function unlock(id) {
  const current = getUnlockedIds();
  if (current.includes(id)) return false;
  const def = getAchievementById(id);
  writeJson(ACHIEVEMENTS_KEY, [...current, id]);
  if (def) addXp(def.xpReward);
  return true;
}

function evaluateAchievements(ctx) {
  const newly = [];
  const tryUnlock = (id, condition) => {
    if (condition && !getUnlockedIds().includes(id) && unlock(id)) newly.push(id);
  };
  const profile = getProfile();
  const allGameIds = GAMES.map((g) => g.id);
  tryUnlock('first_game', profile.totalSessions >= 1);
  tryUnlock('first_score', ctx.score > 0);
  tryUnlock('score_100', ctx.score >= 100);
  tryUnlock('high_scorer', ctx.score >= 500);
  tryUnlock('nature_defender', allGameIds.every((id) => profile.gamesPlayed.includes(id)));
  tryUnlock('recycling_master', ctx.gameId === 'reciclagem' && ctx.score > 0);
  tryUnlock('flappy_flyer', ctx.gameId === 'flappy-eco' && ctx.score > 0);
  tryUnlock('animal_hero', ctx.gameId === 'reciclagem-animal' && ctx.score >= 400);
  return newly;
}

export function getAchievementsState() {
  const unlocked = getUnlockedIds();
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: unlocked.includes(a.id) }));
}

export function submitScore(gameId, score, nameOverride) {
  const name = resolvePlayerName(nameOverride ?? getPlayerName());
  const entry = { gameId, playerName: name, score, date: new Date().toISOString() };
  const ranking = [...getRanking(), entry].sort((a, b) => b.score - a.score).slice(0, MAX_RANKING);
  writeJson(RANKING_KEY, ranking);
  const history = [{ ...entry, id: uniqueId() }, ...getHistory()].slice(0, MAX_HISTORY);
  writeJson(HISTORY_KEY, history);
  recordSession(gameId);
  addXp(15 + Math.floor(score / 10));
  const newly = evaluateAchievements({ gameId, score, ranking, playerName: name });
  return { name, newly };
}

export function getTotalPoints(playerName) {
  const name = playerName.trim() || 'Jogador';
  return getRanking()
    .filter((e) => e.playerName === name)
    .reduce((sum, e) => sum + e.score, 0);
}

export { AVATARS };
