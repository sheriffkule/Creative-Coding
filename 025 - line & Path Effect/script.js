/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 850;

// global Settings
ctx.lineWidth = 10;
ctx.strokeStyle = 'magenta';

class Line {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.history = [{ x: this.x, y: this.y }];
    this.lineWidth = Math.floor(Math.random() * 15 + 1);
    this.hue = Math.floor(Math.random() * 360);
    this.maxLength = 10;
    this.speedX = 10;
    this.speedY = 5;
  }
  draw(context) {
    context.strokeStyle = 'hsl(' + this.hue + ', 100%, 50%)';
    context.lineWidth = this.lineWidth;
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.stroke();
  }
  update() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.maxLength) {
        this.history.shift()
    }
  }
}

const linesArray = [];
const numberOfLines = 1;
for (let i = 0; i < numberOfLines; i++) {
  linesArray.push(new Line(canvas));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  linesArray.forEach((line) => {
    // line.draw(ctx);
    // line.update();
  });
  requestAnimationFrame(animate);
}
animate();
