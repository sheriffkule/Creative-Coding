/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseY = canvas.height * 0.5;

// Wave settings
const waveSettings = {
  waveCount: 2,
  amplitude: 50,
  frequency: 0.02,
  speed: 0.05,
  lineWidth: 3,
  gradientFill: true,
  backgroundColor: '#0e0e0e',
  phaseShift: 0,
  wave1Color: '#00ffff',
  wave2Color: '#ff00ff',
};

// Track mouse position
window.addEventListener('mousemove', (e) => {
  mouseY = e.clientY;
});

// Draw waves
let waveOffset = 0;
function drawWave() {
  ctx.fillStyle = waveSettings.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < waveSettings.waveCount; i++) {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5);

    const amplitude = waveSettings.amplitude - i * 10 + (canvas.height * 0.5 - mouseY) * 0.2;
    const frequency = waveSettings.frequency + i * 0.005;
    const speed = waveSettings.speed + i * 0.01;
    const phase = waveSettings.phaseShift * i;

    // Chose color for each wave
    const color = i === 0 ? waveSettings.wave1Color : waveSettings.wave2Color;

    for (let x = 0; x < canvas.width; x++) {
      const y = amplitude * Math.sin(frequency * x + waveOffset + phase) + canvas.height * 0.5;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = waveSettings.lineWidth;
    ctx.stroke();

    // Gradient fill under wave
    if (waveSettings.gradientFill) {
      const gradient = ctx.createLinearGradient(
        0,
        canvas.height * 0.5 - amplitude,
        0,
        canvas.height * 0.5 + amplitude,
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(1, color + '50');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  waveOffset += waveSettings.speed;
  requestAnimationFrame(drawWave);
}

// GUI Controls
const gui = new dat.GUI();
gui.add(waveSettings, 'waveCount', 1, 2, 1).name('Wave Count');
gui.add(waveSettings, 'amplitude', 10, 200).name('Amplitude');
gui.add(waveSettings, 'frequency', 0.005, 0.1).name('Frequency');
gui.add(waveSettings, 'speed', 0.01, 10).name('Speed');
gui.add(waveSettings, 'lineWidth', 1, 10).name('Line Width');
gui.addColor(waveSettings, 'wave1Color').name('Wave 1 Color');
gui.addColor(waveSettings, 'wave2Color').name('Wave 2 Color');
gui.add(waveSettings, 'gradientFill').name('Gradient Fill');
gui.addColor(waveSettings, 'backgroundColor').name('Background Color');
gui.add(waveSettings, 'phaseShift', 0, Math.PI * 2).name('Phase Shift');

drawWave();
