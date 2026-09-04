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
}
