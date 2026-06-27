const BINS = [
  { id: "metal", label: "Metal", menuIndex: 0 },
  { id: "papel", label: "Papel", menuIndex: 1 },
  { id: "vidro", label: "Vidro", menuIndex: 2 },
  { id: "plastico", label: "Pl\xE1stico", menuIndex: 3 },
  { id: "organico", label: "Org\xE2nico", menuIndex: 4 }
];
const ENCOUNTERS = [
  {
    id: 0,
    title: "Praia \u2014 Copacabana",
    animal: "Tartaruga marinha",
    waste: "Sacola pl\xE1stica",
    correctBin: "plastico",
    scenePrefix: "praia",
    storyIntro: "\xC0 beira-mar de Copacabana, voc\xEA encontra uma tartaruga marinha com uma sacola pl\xE1stica. Escolha a lixeira correta!",
    encounterText: "Voc\xEA v\xEA uma TARTARUGA com uma SACOLA PL\xC1STICA!",
    successMessage: "Parab\xE9ns! Voc\xEA ajudou a tartaruga. Aperte Espa\xE7o para continuar."
  },
  {
    id: 1,
    title: "Escola",
    animal: "Cachorro",
    waste: "Pap\xE9is",
    correctBin: "papel",
    scenePrefix: "escola",
    storyIntro: "Na frente da escola, um cachorro est\xE1 cheio de pap\xE9is. Recicle corretamente!",
    encounterText: "Voc\xEA achou um CACHORRO com PAP\xC9IS grudados nele!",
    successMessage: "Boa! Voc\xEA ajudou o cachorro. Aperte Espa\xE7o para continuar."
  },
  {
    id: 2,
    title: "Cidade",
    animal: "Gata",
    waste: "Pote de vidro",
    correctBin: "vidro",
    scenePrefix: "city",
    storyIntro: "Na rua, uma gata est\xE1 com a cabe\xE7a presa em um pote de vidro.",
    encounterText: "Voc\xEA encontrou uma GATA presa em um POTE DE VIDRO!",
    successMessage: "Parab\xE9ns! Voc\xEA ajudou a gata. Aperte Espa\xE7o para continuar."
  },
  {
    id: 3,
    title: "Parque",
    animal: "Capivara",
    waste: "Latinha",
    correctBin: "metal",
    scenePrefix: "parque",
    storyIntro: "No parque, uma capivara est\xE1 com uma latinha.",
    encounterText: "Voc\xEA encontrou uma CAPIVARA com uma LATINHA!",
    successMessage: "Voc\xEA ajudou a capivara! Aperte Espa\xE7o para continuar."
  },
  {
    id: 4,
    title: "Casa \u2014 Chefe final",
    animal: "Inimigo da Reciclagem",
    waste: "Res\xEDduos mistos",
    correctBin: "papel",
    scenePrefix: "boss",
    isBoss: true,
    storyIntro: "Sua lixeira virou um campo de batalha! Derrote o Inimigo da Reciclagem!",
    encounterText: "INIMIGO DA RECICLAGEM! Ele est\xE1 segurando um panfleto!",
    successMessage: "Voc\xEA venceu o Inimigo da Reciclagem!"
  }
];
const BOSS_PHASES = [
  { waste: "Panfleto de papel", correct: "papel" },
  { waste: "Sacola pl\xE1stica", correct: "plastico" },
  { waste: "Garrafa de vidro", correct: "vidro" },
  { waste: "Lata de metal", correct: "metal" },
  { waste: "Restos de comida", correct: "organico" }
];
const STORY_CHAPTERS = [
  "\xC0 beira-mar de Copacabana, sob o sol dourado do Rio, voc\xEA caminha pela areia e encontra uma tartaruga que precisa de ajuda. APERTE ESPA\xC7O PARA CONTINUAR.",
  "Depois de ajudar a tartaruga, na frente da escola voc\xEA v\xEA um cachorro cheio de pap\xE9is! APERTE ESPA\xC7O PARA CONTINUAR.",
  "Saindo da escola, na cidade voc\xEA encontra uma gata com a cabe\xE7a presa em um pote de vidro. APERTE ESPA\xC7O PARA CONTINUAR.",
  "No novo parque de divers\xF5es voc\xEA encontra uma capivara com uma latinha. APERTE ESPA\xC7O PARA CONTINUAR.",
  "Ao voltar para casa, algo aconteceu com sua lixeira! APERTE ESPA\xC7O PARA CONTINUAR."
];
export {
  BINS,
  BOSS_PHASES,
  ENCOUNTERS,
  STORY_CHAPTERS
};
