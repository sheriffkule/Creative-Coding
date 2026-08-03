/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Adjust canvas size and reinitialize particles on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// Configuration Settings Object
const settings = {
  particleCount: 100,
  maxRadius: 2.5,
  maxSpeed: 0.5,
  particleColor: '#ffffff',
  glowColor: '#ffffcc',
  trailOpacity: 0.1,
  gravityStrength: 0.0,
  flickerSpeed: 0.0,
};

function hexToRgb(hex) {
  let normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

// Particle class definition
class Particles {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.baseRadius = radius;
    this.radius = radius;
    this.color = color;
    this.speed = Math.hypot(velocity.x, velocity.y) || 0.001;
    this.direction = { x: velocity.x / this.speed, y: velocity.y / this.speed };
    this.angle = Math.random() * Math.PI * 2;
  }

  draw() {
    ctx.beginPath();
    // Luminosity effect using shadow properties
    ctx.shadowBlur = this.radius * 2;
    ctx.shadowColor = settings.glowColor;

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Reset shadow for subsequent drawing
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }

  update() {
    // Apply central gravity/attraction
    if (settings.gravityStrength > 0) {
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      const dx = centerX - this.x;
      const dy = centerY - this.y;

      // Add a small acceleration towards the center
      this.direction.x += dx * settings.gravityStrength * 0.01;
      this.direction.y += dy * settings.gravityStrength * 0.01;
    }

    // Apply Flicker/Pulse
    if (settings.flickerSpeed > 0) {
      this.angle += settings.flickerSpeed;
      // Radius pulses between 50% and 100% of its base size
      this.radius = this.baseRadius * (0.75 + Math.cos(this.angle) * 0.25);
    } else {
      this.radius = this.baseRadius; // Keep static size if flicker is off
    }

    // Move the particles
    this.angle += 0.01;
    const wobble = Math.sin(this.angle) * 1.5;
    const perpX = -this.direction.y;
    const perpY = this.direction.x;
    this.x += this.direction.x * settings.maxSpeed + perpX * wobble;
    this.y += this.direction.y * settings.maxSpeed + perpY * wobble;

    // Simple edge wrapping (only if gravity is zero)
    if (settings.gravityStrength === 0) {
      if (this.x < 0 || this.x > canvas.width) this.direction.x = -this.direction.x;
      if (this.y < 0 || this.y > canvas.height) this.direction.y = -this.direction.y;
    }

    this.draw();
  }
}

// Initialize
let particles = [];

function init() {
  particles = []; // Clear existing particles
  for (let i = 0; i < settings.particleCount; i++) {
    // Radius based on current maxRadius setting
    const radius = Math.random() * settings.maxRadius + 0.5;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    // Velocity based on current maxSpeed settings
    const velocity = {
      x: (Math.random() - 0.5) * settings.maxSpeed,
      y: (Math.random() - 0.5) * settings.maxSpeed,
    };

    const particleRgb = hexToRgb(settings.particleColor || '#ffffff');
    const color = `rgba(${particleRgb}, ${0.5 + Math.random() * 0.5})`;

    particles.push(new Particles(x, y, radius, color, velocity));
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Clear the canvas with partial opacity (creates the trail effect)
  ctx.fillStyle = `rgba(0, 0, 0, ${settings.trailOpacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw all particles
  particles.forEach((particle) => {
    particle.update();
  });
}

// Control
const controls = document.getElementById('controls');

controls.addEventListener('input', (e) => {
  const targetId = e.target.id;
  const value =
    targetId === 'glowColor' || targetId === 'particleColor' ? e.target.value : parseFloat(e.target.value);

  // Helper function for updating display value
  const updateDisplay = (id, val) => {
    const display = document.getElementById(id + 'Value');
    if (!display) return;

    if (typeof val === 'string') {
      display.textContent = val;
      return;
    }

    const decimals =
      id === 'trail' || id === 'gravity' || id === 'flicker'
        ? 2
        : id === 'maxRadius' || id === 'speed'
          ? 1
          : 0;
    display.textContent = val.toFixed(decimals);
  };

  switch (targetId) {
    case 'count':
      settings.particleCount = value;
      updateDisplay(targetId, value);
      init();
      break;
    case 'maxRadius':
      settings.maxRadius = value;
      updateDisplay(targetId, value);
      init();
      break;
    case 'speed':
      settings.maxSpeed = value;
      updateDisplay(targetId, value);
      break;
    case 'particleColor':
      settings.particleColor = value;
      updateDisplay(targetId, value);
      init();
      break;
    case 'glowColor':
      settings.glowColor = value;
      updateDisplay(targetId, value);
      break;
    case 'trail':
      settings.trailOpacity = value;
      updateDisplay(targetId, value);
      break;
    case 'gravity':
      settings.gravityStrength = value;
      updateDisplay(targetId, value);
      break;
    case 'flicker':
      settings.flickerSpeed = value;
      updateDisplay(targetId, value);
      break;
  }
});

// Start the application
init();
animate();

// Toggle controls
const toggle = document.querySelector('.toggle');
toggle.addEventListener('click', function () {
  controls.classList.toggle('show');
});

// Changing colors on input type range track
document.querySelectorAll('input[type="range"]').forEach((input) => {
  const updateTrack = () => {
    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || 100;
    const value = parseFloat(input.value);
    const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const val = ratio * 100;

    input.style.backgroundImage = `linear-gradient(to right, #2575fc 0%, #0034cf ${val}%, #a0a0c0 ${val}%, #a0a0c0 100%)`;
  };
  input.addEventListener('input', updateTrack);
  updateTrack();
});
