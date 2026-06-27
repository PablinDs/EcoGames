import { assetPath } from '../../asset-path.js';

const SOUND_DIR = 'assets/reciclagem-animal/sound';

const ANIMAL_SOUNDS = {
  inicio: 'inicio.wav',
  mover: 'mover.wav',
  select: 'select.wav',
  som: 'som.wav',
  texto: 'texto.wav',
  certo: 'certo.wav',
  plasticoinicio: 'plasticoinicio.wav',
  plasticoloop: 'plasticoloop.wav',
  papelinicio: 'papelinicio.wav',
  papelloop: 'papelloop.wav',
  vidroinicio: 'vidroinicio.wav',
  vidroloop: 'vidroloop.wav',
  metalinicio: 'metalinicio.wav',
  metalloop: 'metalloop.wav',
  bossinicio: 'bossinicio.wav',
  bossloop: 'bossloop.wav',
  bossfinal: 'bossfinal.wav',
  cutscene: 'cutscene.wav',
  win: 'win.wav',
  hahaha: 'hahaha.wav',
};

const ENCOUNTER_TRACKS = [
  { intro: 'plasticoinicio', loop: 'plasticoloop' },
  { intro: 'papelinicio', loop: 'papelloop' },
  { intro: 'vidroinicio', loop: 'vidroloop' },
  { intro: 'metalinicio', loop: 'metalloop' },
  { intro: 'bossinicio', loop: 'bossloop' },
];

const MUTE_KEY = 'eco-games-animal-sound-muted';

class AnimalSoundEngine {
  cache = new Map();
  currentMusic = null;
  currentMusicId = null;
  musicEndHandler = null;
  unlocked = false;
  volume = 0.55;
  muted = false;

  constructor() {
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      this.muted = false;
    }
  }

  preload() {
    for (const id of Object.keys(ANIMAL_SOUNDS)) this.get(id);
  }

  unlock() {
    this.unlocked = true;
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = muted;
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (muted) this.stopMusic();
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  src(id) {
    return assetPath(`${SOUND_DIR}/${ANIMAL_SOUNDS[id]}`);
  }

  get(id) {
    let audio = this.cache.get(id);
    if (!audio) {
      audio = new Audio(this.src(id));
      audio.preload = 'auto';
      this.cache.set(id, audio);
    }
    return audio;
  }

  playSfx(id, vol = 0.65) {
    if (this.muted || !this.unlocked) return;
    const clone = this.get(id).cloneNode(true);
    clone.volume = Math.min(1, vol * this.volume);
    clone.play().catch(() => {});
  }

  playMusic(id, loop = true) {
    if (this.muted || !this.unlocked) return;
    if (this.currentMusicId === id && this.currentMusic && !this.currentMusic.paused) return;
    this.clearMusicHandler();
    this.stopMusic();
    const audio = this.get(id);
    audio.loop = loop;
    audio.volume = Math.min(1, 0.4 * this.volume);
    audio.currentTime = 0;
    this.currentMusic = audio;
    this.currentMusicId = id;
    audio.play().catch(() => {});
  }

  playIntroThenLoop(intro, loop) {
    if (this.muted || !this.unlocked) return;
    this.clearMusicHandler();
    this.stopMusic();
    const introAudio = this.get(intro);
    introAudio.loop = false;
    introAudio.volume = Math.min(1, 0.4 * this.volume);
    introAudio.currentTime = 0;
    this.currentMusic = introAudio;
    this.currentMusicId = intro;
    const onEnd = () => {
      introAudio.removeEventListener('ended', onEnd);
      this.musicEndHandler = null;
      this.playMusic(loop, true);
    };
    this.musicEndHandler = onEnd;
    introAudio.addEventListener('ended', onEnd);
    introAudio.play().catch(() => {});
  }

  playEncounterMusic(encounterIndex) {
    const tracks = ENCOUNTER_TRACKS[encounterIndex];
    if (!tracks) return;
    this.playIntroThenLoop(tracks.intro, tracks.loop);
  }

  playBossFinalMusic() {
    this.playMusic('bossfinal', false);
  }

  playTitleMusic() {
    this.playMusic('inicio', true);
  }

  playStoryMusic() {
    this.playMusic('cutscene', true);
  }

  playVictoryMusic() {
    this.stopMusic();
    this.playSfx('win', 0.8);
  }

  stopMusic() {
    this.clearMusicHandler();
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic.loop = false;
    }
    this.currentMusic = null;
    this.currentMusicId = null;
  }

  clearMusicHandler() {
    if (this.currentMusic && this.musicEndHandler) {
      this.currentMusic.removeEventListener('ended', this.musicEndHandler);
    }
    this.musicEndHandler = null;
  }
}

export const animalSoundEngine = new AnimalSoundEngine();
