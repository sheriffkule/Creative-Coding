/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// canvas settings
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.speedX = Math.random() * 5 - 2.5;
    this.speedY = Math.random() * 5 - 2.5;
    this.history = [{ x: this.x, y: this.y }];
    this.maxLength = Math.floor(Math.random() * 100 + 10);
    this.angle = 0;
  }
  draw(context) {
    context.fillRect(this.x, this.y, 10, 10);
    context.beginPath();
    context.moveTo(this.history[0], this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.stroke();
  }
  update() {
    let x = Math.floor(this.x / this.effect.cellSize);
    let y = Math.floor(this.y / this.effect.cellSize);
    let index = y * this.this.effect.cols;
    this.angle = this.effect.flowField[index];

    this.x += this.speedX + Math.sin(this.angle) * 7;
    this.y += this.speedY + Math.cos(this.angle) * 10;
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.maxLength) {
      this.history.shift();
    }
  }
}

class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.numberOfParticles = 50;
    this.cellSize = 20;
    this.rows;
    this.cols;
    this.flowField = [];
    this.init();
  }
  init() {
    // create flow field
    this.rows = Math.floor(this.height / this.cellSize);
    this.cols = Math.floor(this.width / this.cellSize);
    this.flowField = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let angle = Math.cos(x) + Math.sin(y);
        this.flowField.push(angle);
      }
    }
    console.log(this.flowField);
    // create particles
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }
  render(context) {
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
}

const effect = new Effect(canvas.width, canvas.height);
effect.render(ctx);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  // effect.render(ctx);
}
animate();
