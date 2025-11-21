/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 10;
let adjustY = 10;

// handle mouse
let mouse = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener('mousemove', function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('mouseout', function (event) {
  mouse.x = undefined;
  mouse.y = undefined;
});

ctx.fillStyle = 'azure';
ctx.font = '20px Bangers';
// ctx.textAlign = 'left';
ctx.fillText('SheriffKule', 0, 30);
const textCoordinates = ctx.getImageData(0, 0, 150, 40);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 5;
  }
  draw() {
    let color = 'skyblue';
    if (mouse.x != null && mouse.y != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.hypot(dx, dy);
      if (dist < mouse.radius && dist > 100) color = 'yellow';
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.hypot(dx, dy);
    if (distance === 0) distance = 0.001;
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    if (force < 0) force = 0;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx * 0.2;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy * 0.2;
      }
    }
  }
}

function init() {
  particleArray = [];
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArray.push(new Particle(positionX * 10, positionY * 10));
      }
    }
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
  connect();
}
animate();

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.hypot(dx, dy);
      // always draw close white connections (<50px)
      if (distance < 50) {
        opacityValue = 1 - distance / 50;
        ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
      //  else {
      //   const mousePresent = mouse.x != null && mouse.y != null;
      //   if (mousePresent) {
      //     let dxA = mouse.x - particleArray[a].x;
      //     let dyA = mouse.y - particleArray[a].y;
      //     let distA = Math.hypot(dxA, dyA);
      //     let dxB = mouse.x - particleArray[b].x;
      //     let dyB = mouse.y - particleArray[b].y;
      //     let distB = Math.hypot(dxB, dyB);
      //     let interacting = distA < mouse.radius || distB < mouse.radius;
      //     if (interacting && distance > 50 && distance <= 100) {
      //       opacityValue = 1 - (distance - 50) / 50;
      //       if (opacityValue > 0) {
      //         let minMouseDist = Math.min(distA, distB);
      //         let color;
      //         if (minMouseDist >= 50 && minMouseDist <= 100) {
      //           color = 'yellow';
      //         } else if (minMouseDist > 100 && minMouseDist <= 150) {
      //           color = 'orange';
      //         } else {
      //           color = null;
      //         }
      //         if (color === 'yellow') {
      //           ctx.strokeStyle = 'rgba(255, 255, 0,' + opacityValue + ')';
      //         } else if (color === 'orange') {
      //           ctx.strokeStyle = 'rgba(255, 165, 0,' + opacityValue + ')';
      //         }
      //         if (color) {
      //           ctx.lineWidth = 1;
      //           ctx.beginPath();
      //           ctx.moveTo(particleArray[a].x, particleArray[a].y);
      //           ctx.lineTo(particleArray[b].x, particleArray[b].y);
      //           ctx.stroke();
      //         }
      //       }
      //     }
      //   }
      // }
    }
  }
}

window.addEventListener('resize', function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});
