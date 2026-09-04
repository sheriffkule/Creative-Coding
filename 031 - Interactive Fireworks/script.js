/** @type {HTMLCanvasElement} **/
// Get the canvas element and context
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to fullscreen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Initial canvas size
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// Modal functionality
const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');

openModalBtn.addEventListener('click', () => {
  modalOverlay.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});

// Fireworks system variables
let fireworks = [];
let particles = [];
let autoLaunch = false;
let autoLunchInterval;
let activeFireworksCount = 0;
let activeParticlesCount = 0;
let frameCount = 0;
let lastTime = performance.now();
let fps = 60;

// Configuration
let config = {
  fireworksRate: 3,
  particlesCount: 100,
  explosionSize: 60,
  gravity: 0.1,
  currentColor: '#ff5e7d',
  currentStyle: 'standard',
  colors: [
    '#ff5e7d',
    '#ff8a00',
    '#ffd166',
    '#06d6a0',
    '#1e96fc',
    '#7209b7',
    '#f72585',
    '#4cc9f0',
    '#ff9e00',
    '#9b5de5',
    '#ff006e',
    '#fb5607',
    '#8338ec',
    '#3a86ff',
    '#ffbe0b',
  ],
  styles: [
    { id: 'standard', name: 'Standard', icon: '⭐' },
    { id: 'sparkle', name: 'Sparkle', icon: '✨' },
    { id: 'heart', name: 'Heart', icon: '💖' },
    { id: 'ring', name: 'Ring', icon: '⭕' },
    { id: 'twirl', name: 'Twirl', icon: '🌀' },
    { id: 'fountain', name: 'Fountain', icon: '⛲' },
    { id: 'comet', name: 'Comet', icon: '☄️' },
    { id: 'spiral', name: 'Spiral', icon: '🔄' },
  ],
};

// Initialize color palette
function initColorPalette() {
  const palette = document.getElementById('colorPalette');
  palette.innerHTML = '';

  config.colors.forEach((color) => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';
    if (color === config.currentColor) colorOption.classList.add('active');
    colorOption.style.backgroundColor = color;
    colorOption.addEventListener('click', () => {
      config.currentColor = color;
      document.querySelectorAll('.color-option').forEach((opt) => opt.classList.remove('active'));
      colorOption.classList.add('active');
    });
    palette.appendChild(colorOption);
  });
}

// Initialize style palette
function initStylePalette() {
  const palette = document.getElementById('stylePalette');
  palette.innerHTML = '';

  config.styles.forEach((style) => {
    const styleOption = document.createElement('div');
    styleOption.className = 'style-option';
    if (style.id === config.currentStyle) styleOption.classList.add('active');

    styleOption.innerHTML = `
      <span class="style-icon">${style.icon}</span>
      ${style.name}
    `;

    styleOption.addEventListener('click', () => {
      config.currentStyle = style.id;
      document.querySelectorAll('.style-option').forEach((opt) => opt.classList.remove('active'));
      styleOption.classList.add('active');
    });

    palette.appendChild(styleOption);
  });
}

// Update control displays
function updateControlDisplays() {
  document.getElementById('reteValue').textContent = config.fireworksRate;
  document.getElementById('particlesValue').textContent = config.particlesCount;
  document.getElementById('sizeValue').textContent = config.explosionSize;
  document.getElementById('gravityDisplay').textContent = config.gravity.toFixed(1);
  document.getElementById('fireworksCount').textContent = activeFireworksCount;
  document.getElementById('particlesCount').textContent = activeParticlesCount;
}

// Update FPS counter
function updateFPS() {
  frameCount++;
  const now = performance.now();
  const delta = now - lastTime;

  if (delta >= 1000) {
    fps = Math.round((frameCount * 1000) / delta);
    document.getElementById('fpsCounter').textContent = fps;
    frameCount = 0;
    lastTime = now;
  }
}

// Event listeners for controls
document.getElementById('fireworksRate').addEventListener('input', function () {
  config.fireworksRate = parseInt(this.value);
  updateControlDisplays();
});

document.getElementById('particlesCount').addEventListener('input', function () {
  config.particlesCount = parseInt(this.value);
  updateControlDisplays();
});

document.getElementById('explosionSize').addEventListener('input', function () {
  config.explosionSize = parseInt(this.value);
  updateControlDisplays();
});

document.getElementById('gravityValue').addEventListener('input', function () {
  config.gravity = parseInt(this.value) / 10;
  updateControlDisplays();
});

// Fireworks base class
class Firework {
  constructor(x, y, targetX, targetY, color, style) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.style = style;
    this.distanceToTarget = Math.hypot(targetX - x, targetY - y);
    this.distanceTraveled = 0;
    this.speed = 8;
    this.brightness = Math.random() * 50 + 50;
    this.radius = 2;
    this.trail = [];
    this.maxTrailLength = 5;
    this.exploded = false;
    this.time = 0;
  }

  update() {
    this.time += 0.1;

    // Move towards target
    const dx = this.targetX - this.startX;
    const dy = this.targetY - this.startY;

    this.distanceTraveled += this.speed;
    const progress = this.distanceTraveled / this.distanceToTarget;

    this.x = this.startX + dx * progress;
    this.y = this.startY + dy * progress;

    // Add to trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Check if reached target
    if (progress >= 1) this.explode();
  }

  explode() {
    this.exploded = true;
    activeFireworksCount--;

    // Create explosion particles based on style
    this.createExplosion();
  }

  createExplosion() {
    switch (this.style) {
      case 'standard':
        this.createStandardExplosion();
        break;
      case 'sparkle':
        this.createSparkleExplosion();
        break;
      case 'heart':
        this.createHeartExplosion();
        break;
      case 'ring':
        this.createRingExplosion();
        break;
      case 'twirl':
        this.createTwirlExplosion();
        break;
      case 'fountain':
        this.createFountainExplosion();
        break;
      case 'comet':
        this.createCometExplosion();
        break;
      case 'spiral':
        this.createSpiralExplosion();
        break;
      default:
        this.createStandardExplosion();
    }
  }

  createStandardExplosion() {
    for (let i = 0; i < config.particlesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };

      const size = Math.random() * 3 + 1;
      const color = this.getColorVariant(this.color);

      particles.push(new Particle(this.x, this.y, velocity, color, size, config.explosionSize, this.style));
    }
  }

  createSparkleExplosion() {
    for (let i = 0; i < config.particlesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };

      const size = Math.random() * 2 + 0.5;
      const color = this.getColorVariant(this.color);

      particles.push(new SparkleParticle(this.x, this.y, velocity, color, size, convig.explosionSize));
    }
  }

  createHeartExplosion() {
    const heartPoints = 30;
    for (let i = 0; i < heartPoints; i++) {
      const t = (i / heartPoints) * Math.PI * 2;
      // heart parametric equation
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      const speed = Math.random() * 2 + 1;
      const velocity = {
        x: (x / 16) * speed,
        y: (y / 16) * speed,
      };

      const size = Math.random() * 4 + 2;

      particles.push(
        new Particle(this.x, this.y, velocity, this.color, size, config.explosionSize * 0.8, 'heart'),
      );
    }
  }

  createRingExplosion() {
    const ringPoints = config.particlesCount;
    for (let i = 0; i < ringPoints; i++) {
      const angle = (i / ringPoints) * Math.PI * 2;
      const speed = Math.random() * 2 + 3;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };

      const size = Math.random() * 2 + 1;
      const color = this.getColorVariant(this.color);

      particles.push(new Particle(this.x, this.y, velocity, color, size, config.explosionSize, 'ring'));
    }
  }

  createTwirlExplosion() {
    for (let i = 0; i < config.particlesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };

      const size = Math.random() * 2 + 1;
      const color = this.getColorVariant(this.color);

      particles.push(new Particle(this.x, this.y, velocity, color, size, config.explosionSize));
    }
  }

  createFountainExplosion() {
    for (let i = 0; i < config.particlesCount; i++) {
      const angle = Math.random() * Math.PI - Math.PI / 2;
      const speed = Math.random() * 6 + 2;
      const velocity = {
        x: Math.cos(angle) * speed * 0.7,
        y: Math.sin(angle) * speed,
      };

      const size = Math.random() * 3 + 1;
      const color = this.getColorVariant(this.color);

      particles.push(new Particle(this.x, this.y, velocity, color, size, config.explosionSize, 'fountain'));
    }
  }

  createCometExplosion() {
    for (let i = 0; i < config.particlesCount; i++) {
      // Create a comet with a trail
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };

      const size = Math.random() * 4 + 1;
      const color = this.getColorVariant(this.color);

      particles.push(new Particle(this.x, this.y, velocity, color, size, config.explosionSize));
    }
  }

  createSpiralExplosion() {
    const spiralTurns = 5;
    const pointsPerTurn = config.particlesCount / spiralTurns;

    for (let turn = 0; turn < pointsPerTurn; turn++) {
      for (let i = 0; i < pointsPerTurn; i++) {
        const progress = i / pointsPerTurn;
        const angle = progress * Math.PI * 2 + turn * Math.PI * 2;
        const radius = progress * config.explosionSize * 0.5;

        const xOffset = Math.cos(angle) * radius;
        const yOffset = Math.sin(angle) * radius;

        const speed = Math.random() * 2 + 1;
        const velocity = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        };

        const size = Math.random() * 2 + 1;
        const color = this.getColorVariant(this.color);

        particles.push(new Particle(this.x, this.y, velocity, color, size, config.explosionSize, 'spiral'));
      }
    }
  }

  getColorVariant(baseColor) {
    // Return a slightly varied color
    return baseColor;
  }

  draw() {
    // Draw trail
    for (let i = 0; i < this.trail.length; i++) {
      const point = this.trail[i];
      const alpha = i / this.trail.length;
      const radius = this.radius * alpha;

      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = alpha * 0.7;
      ctx.fill();
    }

    // Draw firework head
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Add glow effect
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Base Particle class
class Particle {
  constructor(x, y, velocity, color, size, explosionSize, style) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.color = color;
    this.size = size;
    this.life = 1;
    this.decay = Math.random() * 0.02 * 0.01;
    this.gravity = config.gravity;
    this.explosionSize = explosionSize;
    this.wind = (Math.random() - 0.5) * 0.2;
    this.style = style;
    this.time = 0;
    activeParticlesCount++;
  }

  update() {
    this.time += 0.05;
    this.velocity.y += this.gravity;
    this.velocity.x += this.wind;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.life -= this.decay;

    // Apply air resistance
    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;

    if (this.life <= 0) activeParticlesCount--;

    return this.life > 0;
  }

  draw() {
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Specialized particle types
class SparkleParticle extends Particle {
  draw() {
    const sparkleIntensity = Math.sin(this.time * 10) * 0.5 + 0.5;
    ctx.globalAlpha = this.life * sparkleIntensity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.Pi * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Add cross lines for sparkle effect
    ctx.beginPath();
    ctx.moveTo(this.x - this.size * 2, this.y);
    ctx.lineTo(this.x + this.size * 2, this.y);
    ctx.moveTo(this.x, this.y - this.size * 2);
    ctx.lineTo(this.x, this.y + this.size * 2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

class TwirlParticle extends Particle {
  draw() {
    // Add swirling motion
    const swirl = 0.1;
    const angle = Math.atan2(this.velocity.y, this.velocity.x);
    const newAngle = angle + swirl;
    const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

    this.velocity.x = Math.cos(newAngle) * speed;
    this.velocity.y = Math.sin(newAngle) * speed;

    return super.update();
  }
}

class CometParticle extends Particle {
  draw() {
    // Draw comet with trail
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Draw trail
    const tailLength = 10;
    ctx.beginPath();
    ctx.moveTo(this.x - this.velocity.x * tailLength, this.y - this.velocity.y * tailLength);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size / 2;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

// Launch a firework
function launchFirework(targetX, targetY) {
  const startX = Math.random() * canvas.width;
  const startY = canvas.height;

  // If target not specified, create a random target
  if (!targetX || !targetY) {
    targetX = Math.random() * canvas.width;
    targetY = Math.random * (canvas.height / 2) + 50;
  }

  fireworks.push(new Firework(startX, startY, targetX, targetY, config.currentColor, config.currentStyle));

  activeFireworksCount++;
  updateControlDisplays();
}

// Launch multiple fireworks automatically
function autoLaunchFireworks() {
  if (!autoLaunch) return;

  for (let i = 0; i < config.fireworksRate; i++) {
    if (Math.random() < 0.7) launchFirework();
  }
}

// Clear all fireworks and particles
function clearAll() {
  fireworks = [];
  particles = [];
  activeFireworksCount = 0;
  activeParticlesCount = 0;
  updateControlDisplays();
}

// Draw background starts
function drawStars() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < 100; i++) {
    // Static stars
    const x = (i * 53) % canvas.width;
    const y = (i * 37) % canvas.height;
    const size = Math.random() * 1.5;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Twinkling stars
  const time = Date.now() * 0.001;
  for (let i = 0; i < 30; i++) {
    const x = (i * 71) % canvas.width;
    const y = (i * 59) % canvas.height;
    const alpha = 0.5 + 0.5 * Math.sin(time * 3 + i);
    const size = 1 + Math.sin(time * 4 + 1) * 0.5;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();
  }
}

// Apply preset
function applyPreset(presetName) {
  switch (presetName) {
    case 'rainbow':
      config.fireworksRate = 5;
      config.particlesCount = 120;
      config.explosionSize = 70;
      config.gravity = 0.05;
      config.currentColor = '#ff5e7d';
      config.currentStyle = 'sparkle';
      break;
    case 'gentle':
      config.fireworksRate = 2;
      config.particlesCount = 60;
      config.explosionSize = 40;
      config.gravity = 0.2;
      config.currentColor = '#4cc9f0';
      config.currentStyle = 'fountain';
      break;
    case 'intense':
      config.fireworksRate = 8;
      config.particlesCount = 150;
      config.explosionSize = 80;
      config.gravity = 0.15;
      config.currentColor = '#ff8a00';
      config.currentStyle = 'standard';
      break;
    case 'sparkle':
      config.fireworksRate = 4;
      config.particlesCount = 200;
      config.explosionSize = 50;
      config.gravity = 0.1;
      config.currentColor = '#9b5de5';
      config.currentStyle = 'sparkle';
      break;
    case 'galaxy':
      config.fireworksRate = 6;
      config.particlesCount = 180;
      config.explosionSize = 90;
      config.gravity = 0.08;
      config.currentColor = '#7209b7';
      config.currentStyle = 'spiral';
      break;
    case 'heart':
      config.fireworksRate = 3;
      config.particlesCount = 80;
      config.explosionSize = 60;
      config.gravity = 0.12;
      config.currentColor = '#ff006e';
      config.currentStyle = 'heart';
      break;
  }

  // Update UI controls
  document.getElementById('fireworksRate').value = config.fireworksRate;
  document.getElementById('particlesCount').value = config.particlesCount;
  document.getElementById('explosionSize').value = config.explosionSize;
  document.getElementById('gravityValue').value = config.gravity * 10;

  initColorPalette();
  initStylePalette();
  updateControlDisplays();

  // Launch a few fireworks to demonstrate
  for (let i = 0; i < 3; i++) {
    setTimeout(() => launchFirework(), i * 400);
  }
}
