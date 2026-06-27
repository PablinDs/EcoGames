const FLAPPY = {
  WIDTH: 384,
  HEIGHT: 512,
  SCENARIO_WIDTH: 288,
  GROUND_WIDTH: 308,
  GROUND_HEIGHT: 112,
  BG_SCROLL: 25,
  GROUND_SCROLL: 100,
  MAX_DT: 0.1
};
const G = 1200;
const FLAP = -350;
const BIRD_W = 34;
const BIRD_H = 24;
const BIRD_SPRITE_X = [528, 528, 446];
const BIRD_SPRITE_Y = [128, 180, 248];
const BIRD_STATES = [0, 1, 2, 1];
const SCORE_DIGITS = [
  [576, 200],
  [578, 236],
  [578, 268],
  [578, 300],
  [574, 346],
  [574, 370],
  [330, 490],
  [350, 490],
  [370, 490],
  [390, 490]
];
class Hitbox {
  x0;
  y0;
  x1;
  y1;
  constructor(x0, y0, x1, y1) {
    [this.x0, this.x1] = x0 < x1 ? [x0, x1] : [x1, x0];
    [this.y0, this.y1] = y0 < y1 ? [y0, y1] : [y1, y0];
  }
  move(dx, dy) {
    this.x0 += dx;
    this.x1 += dx;
    this.y0 += dy;
    this.y1 += dy;
  }
  intersects(other) {
    const w = (this.x1 - this.x0 + (other.x1 - other.x0)) / 2;
    const h = (this.y1 - this.y0 + (other.y1 - other.y0)) / 2;
    const dx = (this.x1 + this.x0 - (other.x1 + other.x0)) / 2;
    const dy = (this.y1 + this.y0 - (other.y1 + other.y0)) / 2;
    return Math.abs(dx) <= w && Math.abs(dy) <= h;
  }
}
class Timer {
  constructor(limite, repete, acao) {
    this.limite = limite;
    this.repete = repete;
    this.acao = acao;
  }
  tempo = 0;
  fim = false;
  tick(dt) {
    if (this.fim) return;
    this.tempo += dt;
    if (this.tempo > this.limite) {
      this.acao();
      if (this.repete) this.tempo -= this.limite;
      else this.fim = true;
    }
  }
}
class Bird {
  x;
  y;
  vy = 0;
  box;
  spriteState = 0;
  spriteTimer;
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.box = new Hitbox(x, y, x + BIRD_W, y + BIRD_H);
    this.spriteTimer = new Timer(0.1, true, () => {
      this.spriteState = (this.spriteState + 1) % BIRD_STATES.length;
    });
  }
  update(dt) {
    this.vy += G * dt;
    this.y += this.vy * dt;
    this.box.move(0, this.vy * dt);
  }
  updateSprite(dt) {
    this.spriteTimer.tick(dt);
  }
  flap() {
    this.vy = FLAP;
  }
  draw(ctx, sprite) {
    const idx = BIRD_STATES[this.spriteState];
    const sx = BIRD_SPRITE_X[idx];
    const sy = BIRD_SPRITE_Y[idx];
    const angle = Math.atan(this.vy / 200);
    ctx.save();
    ctx.translate(this.x + BIRD_W / 2, this.y + BIRD_H / 2);
    ctx.rotate(angle);
    ctx.drawImage(sprite, sx, sy, BIRD_W, BIRD_H, -BIRD_W / 2, -BIRD_H / 2, BIRD_W, BIRD_H);
    ctx.restore();
  }
}
class Lixeira {
  static xspeed = -100;
  static HOLE = 94;
  static WIDTH = 52;
  x;
  y;
  counted = false;
  boxTop;
  boxBottom;
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.boxTop = new Hitbox(x, y - 490, x + Lixeira.WIDTH, y);
    this.boxBottom = new Hitbox(
      x,
      y + Lixeira.HOLE,
      x + Lixeira.WIDTH,
      y + Lixeira.HOLE + 442
    );
  }
  tick(dt) {
    const dx = Lixeira.xspeed * dt;
    this.x += dx;
    this.boxTop.move(dx, 0);
    this.boxBottom.move(dx, 0);
  }
  draw(ctx, sprite) {
    const { x, y } = this;
    const h = Lixeira.HOLE;
    ctx.drawImage(sprite, 660, 0, 52, 242, x, y + h, 52, 242);
    ctx.drawImage(sprite, 660, 42, 52, 200, x, y + h + 242, 52, 200);
    ctx.drawImage(sprite, 604, 0, 52, 270, x, y - 270, 52, 270);
    ctx.drawImage(sprite, 604, 0, 52, 220, x, y - 490, 52, 220);
  }
}
class FlappyEngine {
  bird;
  score = 0;
  record = 0;
  gameState = 0;
  scenarioOffset = 0;
  groundOffset = 0;
  lixeiras = [];
  groundBox;
  pipeTimer;
  isRunning = false;
  auxTimer;
  width = FLAPPY.WIDTH;
  height = FLAPPY.HEIGHT;
  groundY = FLAPPY.HEIGHT - FLAPPY.GROUND_HEIGHT;
  halfWidth = FLAPPY.WIDTH / 2;
  halfHeight = FLAPPY.HEIGHT / 2;
  constructor() {
    this.bird = new Bird(50, this.height / 4);
    this.groundBox = new Hitbox(0, this.groundY, this.width, this.height);
    this.pipeTimer = new Timer(2, true, () => this.spawnPipe());
    const saved = sessionStorage.getItem("flappy-eco-record");
    if (saved) this.record = parseInt(saved, 10) || 0;
  }
  spawnPipe() {
    const maxY = this.height - FLAPPY.GROUND_HEIGHT - Lixeira.HOLE;
    const y = Math.floor(Math.random() * maxY);
    this.lixeiras.push(new Lixeira(this.width, y));
  }
  nextScene() {
    this.gameState = (this.gameState + 1) % 4;
  }
  gameOver() {
    if (this.score > this.record) {
      this.record = this.score;
      sessionStorage.setItem("flappy-eco-record", String(this.record));
    }
    this.lixeiras = [];
    this.bird = new Bird(50, this.height / 4);
    this.nextScene();
  }
  handleInput() {
    switch (this.gameState) {
      case 0:
        this.auxTimer = new Timer(1.6, false, () => this.nextScene());
        this.nextScene();
        this.isRunning = true;
        break;
      case 2:
        this.bird.flap();
        break;
      case 3:
        this.score = 0;
        this.nextScene();
        break;
    }
  }
  tick(dt) {
    if (this.gameState === 0 && this.isRunning) {
      this.isRunning = false;
      this.scenarioOffset = 0;
      this.groundOffset = 0;
      return this.score;
    }
    if (this.gameState === 1 || this.gameState === 2) {
      this.scenarioOffset = (this.scenarioOffset + dt * FLAPPY.BG_SCROLL) % FLAPPY.SCENARIO_WIDTH;
      this.groundOffset = (this.groundOffset + dt * FLAPPY.GROUND_SCROLL) % FLAPPY.GROUND_WIDTH;
    }
    switch (this.gameState) {
      case 1:
        this.auxTimer?.tick(dt);
        this.bird.updateSprite(dt);
        break;
      case 2:
        this.pipeTimer.tick(dt);
        this.bird.update(dt);
        this.bird.updateSprite(dt);
        if (this.groundBox.intersects(this.bird.box) || this.bird.y < -5) {
          this.gameOver();
          return this.score;
        }
        for (let i = this.lixeiras.length - 1; i >= 0; i--) {
          const lx = this.lixeiras[i];
          lx.tick(dt);
          if (lx.boxTop.intersects(this.bird.box) || lx.boxBottom.intersects(this.bird.box)) {
            this.gameOver();
            return this.score;
          }
          if (!lx.counted && lx.x < this.bird.x) {
            lx.counted = true;
            this.score++;
          }
          if (lx.x < -70) this.lixeiras.splice(i, 1);
        }
        break;
    }
    return this.score;
  }
  draw(ctx, sprite) {
    const { width, height, groundY, halfWidth, halfHeight } = this;
    ctx.clearRect(0, 0, width, height);
    let bgX = -this.scenarioOffset;
    while (bgX < width) {
      ctx.drawImage(
        sprite,
        0,
        0,
        FLAPPY.SCENARIO_WIDTH,
        height,
        bgX,
        0,
        FLAPPY.SCENARIO_WIDTH,
        height
      );
      bgX += FLAPPY.SCENARIO_WIDTH;
    }
    for (const lx of this.lixeiras) lx.draw(ctx, sprite);
    const offset = Math.floor(this.groundOffset % FLAPPY.GROUND_WIDTH);
    ctx.imageSmoothingEnabled = false;
    for (let i = -1; i <= 2; i++) {
      ctx.drawImage(
        sprite,
        292,
        0,
        FLAPPY.GROUND_WIDTH,
        FLAPPY.GROUND_HEIGHT,
        i * FLAPPY.GROUND_WIDTH - offset,
        groundY,
        FLAPPY.GROUND_WIDTH,
        FLAPPY.GROUND_HEIGHT
      );
    }
    ctx.imageSmoothingEnabled = true;
    switch (this.gameState) {
      case 0:
        ctx.drawImage(sprite, 292, 346, 192, 44, halfWidth - 96, 100, 192, 44);
        ctx.drawImage(sprite, 352, 306, 70, 36, halfWidth - 35, 175, 70, 36);
        ctx.drawImage(sprite, 528, 128, 34, 24, halfWidth - 34, halfHeight - 24, 68, 48);
        break;
      case 1:
        this.bird.draw(ctx, sprite);
        ctx.drawImage(sprite, 292, 442, 174, 44, halfWidth - 87, height / 3, 174, 44);
        this.drawScore(ctx, sprite, this.score, 5, 5);
        break;
      case 2:
        this.drawScore(ctx, sprite, this.score, 5, 5);
        this.bird.draw(ctx, sprite);
        break;
      case 3:
        ctx.drawImage(sprite, 292, 398, 188, 38, halfWidth - 94, 100, 188, 38);
        ctx.drawImage(sprite, 292, 116, 226, 116, halfWidth - 113, halfHeight - 58, 226, 116);
        this.drawScore(ctx, sprite, this.score, halfWidth + 50, halfHeight - 25);
        this.drawScore(ctx, sprite, this.record, halfWidth + 55, halfHeight + 16);
        break;
    }
  }
  drawScore(ctx, sprite, n, x, y) {
    const s = String(n);
    for (let i = 0; i < s.length; i++) {
      const digit = +s[i];
      const [sx, sy] = SCORE_DIGITS[digit];
      ctx.drawImage(sprite, sx, sy, 14, 20, x + 15 * i, y, 14, 20);
    }
  }
}
export {
  FLAPPY,
  FlappyEngine
};
