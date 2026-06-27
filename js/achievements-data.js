export const ACHIEVEMENTS = [
  { id: 'first_game', name: 'Primeira Missão', description: 'Jogue qualquer jogo pela primeira vez.', icon: 'gamepad', xpReward: 25 },
  { id: 'first_score', name: 'Primeira Pontuação', description: 'Termine uma partida com pontos no placar.', icon: 'star', xpReward: 30 },
  { id: 'score_100', name: 'Centena Verde', description: 'Alcance pelo menos 100 pontos em uma partida.', icon: 'target', xpReward: 50 },
  { id: 'nature_defender', name: 'Defensor da Natureza', description: 'Jogue os três jogos da plataforma.', icon: 'tree', xpReward: 80 },
  { id: 'recycling_master', name: 'Mestre da Reciclagem', description: 'Pontue no Jogo da Reciclagem.', icon: 'recycle', xpReward: 40 },
  { id: 'flappy_flyer', name: 'Voador do Mundo', description: 'Pontue no Flappy World.', icon: 'bird', xpReward: 40 },
  { id: 'animal_hero', name: 'Herói dos Animais', description: 'Conclua a jornada Reciclagem Animal.', icon: 'turtle', xpReward: 60 },
  { id: 'high_scorer', name: 'Eco Campeão', description: 'Alcance 500 pontos em uma única partida.', icon: 'trophy', xpReward: 100 },
];

export function getAchievementById(id) {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
