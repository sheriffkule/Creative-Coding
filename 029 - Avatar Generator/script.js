/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('avatarCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 400;

// Avatar options
const options = {
  skinTone: 0,
  hair: 0,
  eyes: 0,
  mouth: 0,
  eyewear: 0,
  hairColor: 0,
  shirtColor: 0,
};

const skinTones = ['#ffcc99', '#e0ac69', '#c68642', '#8d5524'];
const hairColors = ['#000', '#6b4423', '#d4af37', '#b55239'];
const shirtColors = ['#4a90e2', '#27ae60', '#e74c3c', '#2c2c2c', '#f5f5f5', '#8e44ad'];

function pickColor(index, colors) {
  return colors[Math.abs(parseInt(index) || 0) % colors.length];
}

function drawHead() {
  ctx.fillStyle = pickColor(options.skinTone, skinTones);
  ctx.beginPath();
  ctx.arc(150, 150, 80, 0, Math.PI * 2);
  ctx.fill();
}

function drawBody() {
  ctx.fillStyle = pickColor(options.shirtColor, shirtColors);
  ctx.fillRect(90, 230, 120, 120);
}

function drawHair(style, layer = 'front') {
    ctx.fillStyle = pickColor(options.hairColor, hairColors);

  if (style === 0 && layer === 'front') {
    ctx.beginPath();
    ctx.arc(150, 140, 90, Math.PI, 0, false);
    ctx.fill();
  } else if (style === 1) {
    if (layer === 'back') {
      ctx.beginPath();
      ctx.arc(150, 160, 95, Math.PI, 0, false);
      ctx.rect(60, 160, 180, 130);
      ctx.fill();
    } else if (layer === 'front') {
      ctx.beginPath();
      ctx.rect(70, 110, 160, 35);
      ctx.fill();
    }
  } else if (style === 2) {
    return;
  } else if (style === 3 && layer === 'back') {
    ctx.beginPath();
    ctx.arc(150, 130, 90, Math.PI, 0, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(150, 70, 30, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 4 && layer === 'front') {
    ctx.beginPath();
    ctx.arc(150, 120, 100, Math.PI, 0, false);
    ctx.fill();
    ctx.fillRect(70, 105, 160, 35);
  }
}

function drawEyes(style) {
  ctx.fillStyle = 'black';
  if (style === 0) {
    ctx.beginPath();
    ctx.arc(120, 150, 10, 0, Math.PI * 2);
    ctx.arc(180, 150, 10, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 1) {
    ctx.beginPath();
    ctx.arc(120, 150, 15, 0, Math.PI * 2);
    ctx.arc(180, 150, 15, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 2) {
    ctx.fillRect(110, 145, 20, 5);
    ctx.fillRect(170, 145, 20, 5);
  }
}

function drawMouth(style) {
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'black';

  if (style === 0) {
    ctx.beginPath();
    ctx.arc(150, 190, 25, 0, Math.PI, false);
    ctx.stroke();
  } else if (style === 1) {
    ctx.beginPath();
    ctx.arc(150, 190, 15, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 2) {
    ctx.fillRect(130, 185, 40, 5);
  }
}

function drawEyewear(style) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;

  if (style === 1) {
    ctx.strokeRect(100, 135, 40, 30);
    ctx.strokeRect(160, 135, 40, 30);
    ctx.beginPath();
    ctx.moveTo(140, 150);
    ctx.moveTo(160, 150);
    ctx.stroke();
  } else if (style === 2) {
    ctx.fillStyle = 'black';
    ctx.fillRect(100, 135, 40, 30);
    ctx.fillRect(160, 135, 40, 30);
    ctx.fillRect(140, 145, 20, 10);
  }
}

function drawAvatar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBody();

  if (options.hair === 1 || options.hair === 3) {
    drawHair(options.hair, 'back');
  }

  drawHead();

  if (options.hair !== 2) {
    drawHair(options.hair, 'front');
  }

  drawEyes(options.eyes);
  drawMouth(options.mouth);
  drawEyewear(options.eyewear);
}

function randomizeAvatar() {
  options.skinTone = Math.floor(Math.random() * skinTones.length);
  options.hair = Math.floor(Math.random() * 5);
  options.eyes = Math.floor(Math.random() * 3);
  options.mouth = Math.floor(Math.random() * 3);
  options.eyewear = Math.floor(Math.random() * 3);
  options.hairColor = Math.floor(Math.random() * hairColors.length);
  options.shirtColor = Math.floor(Math.random() * shirtColors.length);
  drawAvatar();
}

function changeOption(part) {
  const maxValues = {
    skinTone: skinTones.length,
    hair: 5,
    hairColor: hairColors.length,
    eyes: 3,
    mouth: 3,
    eyewear: 3,
    shirtColor: shirtColors.length,
  };
  options[part] = (options[part] + 1) % maxValues[part];
  drawAvatar();
}

function downloadAvatar() {
  const link = document.createElement('a');
  link.download = 'avatar.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

drawAvatar();
