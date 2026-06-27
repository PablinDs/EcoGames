export const GAMES = [
  {
    id: 'reciclagem',
    name: 'Jogo da Reciclagem',
    shortDescription: 'Colete resíduos recicláveis e evite a barreira de contaminação.',
    coverImage: 'assets/reciclagem/fundomenu.png',
    educationalGoal: 'Reforçar a coleta seletiva e a destinação correta dos resíduos sólidos.',
    environmentalTheme: 'Reciclagem de materiais e redução do lixo em aterros.',
    howToPlay: [
      'Segure e arraste no cenário para mover o coletor.',
      'Encoste nos itens de lixo para coletá-los (+10 pts).',
      'Evite a barreira vermelha.',
      'Colete todos os resíduos para vencer.',
    ],
    mechanics: ['Movimento livre em 2D', '+10 por item', 'Quantidade configurável', 'Bônus ao limpar o mapa'],
    controls: 'Segure e arraste (toque ou mouse)',
  },
  {
    id: 'flappy-eco',
    name: 'Flappy World',
    shortDescription: 'Desvie das lixeiras e mantenha o pássaro voando.',
    coverImage: 'assets/flappy-eco/thumbFW.png',
    educationalGoal: 'Associar destinação correta do lixo a superar obstáculos urbanos.',
    environmentalTheme: 'Lixeiras, coleta seletiva e resíduos urbanos.',
    howToPlay: [
      'Espaço, clique ou toque para voar.',
      'Desvie das aberturas entre lixeiras.',
      'Cada par ultrapassado = 1 ponto.',
    ],
    mechanics: ['Física estilo Flappy', 'Obstáculos procedurais', 'Recorde na sessão'],
    controls: 'Espaço · Clique · Toque',
  },
  {
    id: 'reciclagem-animal',
    name: 'Reciclagem Animal',
    shortDescription: 'Resgate animais escolhendo a lixeira correta para cada resíduo.',
    coverImage: 'assets/reciclagem-animal/cenas/praia1.png',
    educationalGoal: 'Ensinar separação por material e impacto na fauna.',
    environmentalTheme: 'Poluição, animais afetados e reciclagem.',
    howToPlay: [
      'Leia a história e avance com Espaço.',
      'Escolha a lixeira correta.',
      'Derrote o chefe final.',
    ],
    mechanics: ['Narrativa em capítulos', '5 tipos de material', 'Chefe com 5 fases'],
    controls: 'Setas + Enter · Clique · Espaço',
  },
];

export function getGameById(id) {
  return GAMES.find((g) => g.id === id);
}
