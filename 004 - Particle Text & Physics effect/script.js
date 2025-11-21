/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

// handle mouse
let mouse = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener('mousemove', function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  mouse.radius = 150;
});

window.addEventListener('mouseout', function (event) {
  mouse.x = null;
  mouse.y = null;
  mouse.radius = 0;
});

ctx.fillStyle = 'azure';
ctx.font = '30px Verdana';
// ctx.textAlign = 'left';
ctx.fillText('SheriffKule', 0, 30);
const data = ctx.getImageData(0, 0, 150, 40);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = parseFloat((Math.random() * 30 + 1).toFixed(2));
  }
  draw() {
    ctx.fillStyle = 'skyblue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.hypot(dx, dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    if (distance < 200) {
      this.x -= forceDirectionX * 3;
      this.y -= forceDirectionY * 3;
    } else {
      this.x = this.baseX;
      this.y = this.baseY;
    }
  }
}

function init() {
  particleArray = [];
  for (let i = 0; i < 500; i++) {
    let x = Math.floor(Math.random() * canvas.width);
    let y = Math.floor(Math.random() * canvas.height);
    particleArray.push(new Particle(x, y));
  }
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  requestAnimationFrame(animate);
}
animate();
