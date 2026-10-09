// Global tweaking settings
let maxSnowflakes = 150;
let maxFallSpeed = 1.5;
let maxWindStrength = 0.5;

// New settings
let maxFlakeSize = 3;
let wavyDriftAmplitude = 1.0;
let snowColor = '#ffffff';

// Canvas setup
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

let snowFlakes = [];

// Input references
const densityInput = document.getElementById('maxSnowFlakes');
const speedInput = document.getElementById('maxSpeed');
const windInput = document.getElementById('maxWind');
// New inputs
const sizeInput = document.getElementById('maxSize');
const wavyInput = document.getElementById('wavyMotion');
const colorInput = document.getElementById('snowColor');

// Value spans (for display)
const densityValue = document.getElementById('densityValue');
const speedValue = document.getElementById('speedValue');
const windValue = document.getElementById('windValue');
const sizeValue = document.getElementById('sizeValue');
const wavyValue = document.getElementById('wavyValue');

// Snowflake class definition (highly modified)
class SnowFlake {
  constructor(reset = false) {
    this.x = Math.random() * w;
    // Start above the screen if resetting, otherwise random position
    this.y = reset ? -Math.random() * h : Math.random() * h;

    // Properties using new global settings
    this.radius = Math.random() * maxFlakeSize + 1;
    this.speed = Math.random() * (maxFallSpeed - 0.5) + 0.5;
    this.wind = (Math.random() - 0.5) * maxWindStrength * 2;

    // wavy motion properties used for the horizontal sine wave movement
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = Math.random() * 0.01 + 0.005;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = snowColor;
    ctx.fill();
  }

  update() {
    // 1. Update wavy motion angle
    this.angle += this.angleSpeed;

    // 2. Apply movement
    this.y += this.speed;

    // Linear wind: basic constant drift
    this.x += this.wind;

    // Wavy wind: smooth sine wave drift
    this.x += Math.sin(this.angle) * wavyDriftAmplitude;

    // 3. Reset flake if it goes off screen
    if (this.y > h + this.radius) {
      // Re-initialize using latest settings
      Object.assign(this, new SnowFlake(true));
    }

    // 4. Handle side wrapping (same as before)
    if (this.x > w) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = w;
    }

    this.draw();
  }
}

// Animation and setup
function createSnowFlakes() {
  // Manages adding/removing flakes to match maxSnowflakes
  if (snowFlakes.length < maxSnowflakes) {
    let diff = maxSnowflakes - snowFlakes.length;
    for (let i = 0; i < diff; i++) {
      snowFlakes.push(new SnowFlake());
    }
  } else if (snowFlakes.length > maxSnowflakes) {
    snowFlakes.length = maxSnowflakes;
  }
}

function init() {
  createSnowFlakes();
  animate();
}

function animate() {
  // Clear with a semi-transparent black to create trail effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < snowFlakes.length; i++) {
    snowFlakes[i].update();
  }

  requestAnimationFrame(animate);
}

// Event listeners for controls
function updateSettings() {
  // 1. Update global variables from input values
  maxSnowflakes = parseInt(densityInput.value);
  maxFallSpeed = parseFloat(speedInput.value);
  maxWindStrength = parseFloat(windInput.value);
  maxFlakeSize = parseFloat(sizeInput.value);
  wavyDriftAmplitude = parseFloat(wavyInput.value);
  snowColor = colorInput.value;

  // 2. Update displayed values
  densityValue.textContent = maxSnowflakes;
  speedValue.textContent = maxFallSpeed.toFixed(1);
  windValue.textContent = maxWindStrength.toFixed(1);
  sizeValue.textContent = maxFlakeSize.toFixed(1);
  wavyValue.textContent = wavyDriftAmplitude.toFixed(1);

  // 3. Adjust the number of particles (density)
  createSnowFlakes();
}

// Attach the update function to all relevant input events
densityInput.addEventListener('input', updateSettings);
speedInput.addEventListener('input', updateSettings);
windInput.addEventListener('input', updateSettings);
sizeInput.addEventListener('input', updateSettings);
wavyInput.addEventListener('input', updateSettings);
colorInput.addEventListener('input', updateSettings);

// Resize handler (same as before)
window.addEventListener('resize', function () {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
});

// Start the app and initialize settings
updateSettings();
init();
