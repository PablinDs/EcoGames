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

## Testar localmente

Sirva a pasta do projeto com qualquer servidor estático (obrigatório para módulos ES):

```bash
npx serve .
```

Abra `http://localhost:3000/` (ou a porta indicada). **Não abra `index.html` direto pelo explorador** (`file://`) — os jogos não carregam.

## Assets dos jogos

Coloque os sprites nas pastas abaixo:

```
assets/
├── reciclagem/
├── flappy-eco/
└── reciclagem-animal/
    ├── cenas/    # praia, escola, city, parque
    ├── boss/     # chefes e danoboss
    ├── extra/    # titulo, menus, ícones
    └── sound/    # áudios .wav
```

Sem esses arquivos, os jogos exibem mensagem de erro ao carregar imagens.

## Deploy (GitHub Pages)

1. Em **Settings → Pages**, escolha **Deploy from branch** → `main` → `/ (root)`.
2. Faça push ou upload do projeto completo.

### Upload pela web (limite: 99 arquivos por vez)

Os sprites do Reciclagem Animal foram organizados em subpastas (`cenas/`, `boss/`, `extra/`, `sound/`) — cada uma com menos de 99 arquivos.

Na pasta `upload-lotes/` há 6 lotes prontos para arrastar ao GitHub. Veja `upload-lotes/LEIA-ME.md` para a ordem e o que cada lote contém.

| Lote | Arquivos | O quê |
|------|----------|-------|
| 01 | 45 | Site (`css`, `js`, HTML, etc.) |
| 02 | 10 | `assets/reciclagem` + `flappy-eco` |
| 03 | 21 | Sons |
| 04 | 46 | Cenários |
| 05 | 82 | Boss / animações de dano |
| 06 | 19 | Ícones e menus |

Não é necessário Node.js, npm ou build.

## Licença

Projeto acadêmico / portfólio.
