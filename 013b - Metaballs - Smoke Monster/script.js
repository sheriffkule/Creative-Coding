/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'white';
ctx.strokeStyle = 'grey';
ctx.lineWidth = 50;

class Ball {
  constructor(effect) {
    this.effect = effect;
    this.x = this.effect.width * 0.5;
    this.y = this.effect.height * 0.5;
    this.radius = Math.random() * 80 + 100;
    this.speedX = Math.random() - 0.5;
    this.speedY = Math.random() - 0.5;
    this.angle = 0;
    this.va = Math.random() * 0.1 - 0.05;
    this.range = Math.random() * 30;
  }
  update() {
    if (this.x < this.radius || this.x > this.effect.width - this.radius) this.speedX *= -1;
    if (this.y < this.radius || this.y > this.effect.height - this.radius) this.speedY *= -1;
    this.angle += this.va;
    this.x += this.speedX * Math.cos(this.angle) * this.range;
    this.y += this.speedY * Math.sin(this.angle) * this.range;
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    ctx.stroke();
    ctx.closePath();
  }
  reset() {
    this.x = this.effect.width * 0.5;
    this.y = this.effect.height * 0.5;
  }
}

class MetaballsEffect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.metaballsArray = [];
  }
  init(numberOfBalls) {
    for (let i = 0; i < numberOfBalls; i++) {
      this.metaballsArray.push(new Ball(this));
    }
  }
  update() {
    this.metaballsArray.forEach((metaball) => metaball.update());
  }
  draw(context) {
    this.metaballsArray.forEach((metaball) => metaball.draw(context));
  }
  reset(newWidth, newHeight) {
    this.width = newWidth;
    this.height = newHeight;
    this.metaballsArray.forEach((metaball) => metaball.reset());
  }
}

const effect = new MetaballsEffect(canvas.width, canvas.height);
effect.init(16);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.update();
  effect.draw(ctx);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = 'white';
  effect.reset(canvas.width, canvas.height);
});
