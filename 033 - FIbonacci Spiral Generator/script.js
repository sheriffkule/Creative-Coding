/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let animationId;

function generate() {
  const n = Number(document.getElementById('terms').value);
  const output = document.getElementById('output');
  const sumText = document.getElementById('sum');
  const error = document.getElementById('error');

  cancelAnimationFrame(animationId);
  animationId = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  output.textContent = '';
  sumText.textContent = '';
  error.textContent = '';

  if (!Number.isInteger(n) || n < 1 || n > 50) {
    error.textContent = 'Please enter a whole number between 1 and 50';
    return;
  }

  let fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }

  const sequence = fib.slice(0, n);
  output.textContent = sequence.join(', ');
  sumText.textContent = 'Sum: ' + sequence.reduce((a, b) => a + b, 0);

  const radii = sequence.slice(1);
  if (radii.length > 0) {
    animateSpiral(radii);
  }
}

function animateSpiral(radii) {
  const arcs = [];
  let centerX = 0;
  let centerY = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  radii.forEach((radius, index) => {
    const startAngle = index * Math.PI / 2;
    const endAngle = startAngle + Math.PI / 2;
    arcs.push({ centerX, centerY, radius, startAngle });

    const angles = [startAngle, endAngle];
    for (let quarter = Math.ceil(startAngle / (Math.PI / 2)); quarter <= Math.floor(endAngle / (Math.PI / 2)); quarter++) {
      angles.push(quarter * Math.PI / 2);
    }

    angles.forEach((angle) => {
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    if (index < radii.length - 1) {
      centerX += (radius - radii[index + 1]) * Math.cos(endAngle);
      centerY += (radius - radii[index + 1]) * Math.sin(endAngle);
    }
  });

  const padding = 12;
  const scale = Math.min(
    (canvas.width - padding / 2) / (maxX - minX),
    (canvas.height - padding / 2) / (maxY - minY)
  );
  const offsetX = (canvas.width - (maxX - minX) * scale) / 2 - minX * scale;
  const offsetY = (canvas.height - (maxY - minY) * scale) / 2 - minY * scale;
  let index = 0;
  let progress = 0;

  ctx.lineWidth = 2;

  function draw() {
    if (index >= arcs.length) {
      animationId = null;
      return;
    }

    const arc = arcs[index];
    const x = arc.centerX * scale + offsetX;
    const y = arc.centerY * scale + offsetY;
    const radius = arc.radius * scale;
    progress = Math.min(progress + 0.05, Math.PI / 2);

    ctx.strokeStyle = `hsl(${index * 20}, 70%, 45%)`;

    ctx.beginPath();
    ctx.arc(x, y, radius, arc.startAngle, arc.startAngle + progress);
    ctx.stroke();

    if (progress >= Math.PI / 2) {
      progress = 0;
      index++;
    }

    animationId = requestAnimationFrame(draw);
  }

  draw();
}

function resetApp() {
  cancelAnimationFrame(animationId);
  animationId = null;
  document.getElementById('terms').value = '';
  document.getElementById('output').textContent = '';
  document.getElementById('sum').textContent = '';
  document.getElementById('error').textContent = '';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
