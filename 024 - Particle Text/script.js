window.addEventListener('load', function () {
  /** @type {HTMLCanvasElement} */
  const textInput = document.getElementById('textInput');
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(ctx);

  class Particle {
    constructor() {

    }
    draw() {
        
    }
    update() {

    }
  }

  class Effect {
    constructor(context, canvasWidth, canvasHeight) {
        this.context = context;
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.textX = this.canvasWidth * 0.5
        this.textY = this.canvasHeight * 0.5
    }
    wrapText(text) {
        this.context.fillText(text, this.textX, this.textY)
    }
    convertToParticles() {

    }
    render() {

    }
  }

  const effect = new Effect(ctx, canvas.width, canvas.height)
  effect.wrapText('Hello')

  function animate() {

  }

//   ctx.lineWidth = 3;
//   ctx.strokeStyle = 'red';
//   ctx.beginPath();
//   ctx.moveTo(canvas.width * 0.5, 0);
//   ctx.lineTo(canvas.width * 0.5, canvas.height);
//   ctx.stroke();

//   ctx.strokeStyle = 'green';
//   ctx.beginPath();
//   ctx.moveTo(0, canvas.height * 0.5);
//   ctx.lineTo(canvas.width, canvas.height * 0.5);
//   ctx.stroke();

//   const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
//   gradient.addColorStop(0.3, 'orange')
//   gradient.addColorStop(0.5, 'red')
//   gradient.addColorStop(0.7, 'purple')
//   ctx.fillStyle = gradient;
//   ctx.strokeStyle = 'royalblue';
//   ctx.font = '80px Arial';
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle';

//   const maxTextWidth = canvas.width * 0.8;
//   const lineHeight = 70;

//   function wrapText(text) {
//     let linesArray = [];
//     let lineCounter = 0;
//     let line = '';
//     let words = text.split(' ');
//     for (let i = 0; i < words.length; i++) {
//       let testLine = line + words[i] + ' ';
//       if (ctx.measureText(testLine).width > maxTextWidth) {
//         line = words[i] + ' ';
//         lineCounter++;
//       } else {
//         line = testLine;
//       }
//       linesArray[lineCounter] = line;
//     }
//     let textHeight = lineHeight * lineCounter;
//     let textY = canvas.height * 0.5 - textHeight * 0.5;
//     linesArray.forEach((el, index) => {
//       ctx.fillText(el, canvas.width * 0.5, textY + index * lineHeight);
//     });
//   }

//   textInput.addEventListener('keyup', function (e) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     wrapText(e.target.value);
//   });
});
