# EcoGames — Educação Ambiental

Plataforma web estilo **fliperama** com três minigames educativos sobre reciclagem, fauna e sustentabilidade. Site estático em **HTML, CSS e JavaScript** — pronto para **GitHub Pages** sem build.

> **Pasta do projeto:** `ATV EXT` — use esta pasta como raiz ao subir no GitHub ou ao rodar `npx serve .`

## Estrutura do projeto

```
├── index.html              # Lobby
├── jogos.html              # Galeria de máquinas
├── ranking.html            # Placar
├── conquistas.html         # Troféus
├── usuario.html            # Perfil do jogador
├── sobre.html              # Sobre a plataforma
├── jogo-*.html             # Páginas de jogo
├── sobre-*.html            # Info de cada jogo
├── css/main.css            # Estilos globais
├── js/                     # Lógica da plataforma e dos jogos
└── assets/                 # Sprites e sons dos minigames
```

## Jogos

- **Jogo da Reciclagem** — coleta de resíduos em 2D
- **Flappy World** — desvie das lixeiras (estilo Flappy)
- **Reciclagem Animal** — narrativa e quiz de separação de materiais

## Persistência de dados

Ranking, XP, avatar e conquistas ficam salvos **apenas na sessão atual do navegador** (`sessionStorage`). Ao fechar a aba ou o navegador, os dados são apagados.

## Licença

Projeto acadêmico / portfólio.
