window.addEventListener('load', function () {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(ctx);

  class Particle {
    constructor() {}
    draw() {}
    update() {}
  }

  class Effect {
    constructor(context, canvasWidth, canvasHeight) {
      this.context = context;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.textX = this.canvasWidth * 0.5;
      this.textY = this.canvasHeight * 0.5;
      this.fontSize = 100;
      this.lineHeight = this.fontSize * 0.8;
      this.maxTextWidth = this.canvasWidth * 0.8;
      this.textInput = document.getElementById('textInput');
      this.textInput.addEventListener('keyup', (e) => {
        if (e.key !== ' ') {
          this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.wrapText(e.target.value);
        }
      });
      // particle text
      this.particles = [];
      this.gap = 3;
      this.mouse = {
        radius: 20000,
        x: 0,
        y: 0,
      };
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
    }
    wrapText(text) {
      // canvas settings
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0.3, 'yellow');
      gradient.addColorStop(0.5, 'red');
      gradient.addColorStop(0.7, 'purple');
      this.context.fillStyle = gradient;
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.lineWidth = 3;
      this.context.strokeStyle = 'white';
      this.context.font = this.fontSize + 'px Arial';
      // break multiline text
      let linesArray = [];
      let words = text.split(' ');
      let lineCounter = 0;
      let line = '';
      for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        if (this.context.measureText(testLine).width > this.maxTextWidth) {
          line = words[i] + ' ';
          lineCounter++;
        } else {
          line = testLine;
        }
        linesArray[lineCounter] = line;
      }
      let textHeight = this.lineHeight * lineCounter;
      this.textY = this.canvasHeight * 0.5 - textHeight * 0.5;
      linesArray.forEach((el, index) => {
        this.context.fillText(el, this.textX, this.textY + index * this.lineHeight);
        this.context.strokeText(el, this.textX, this.textY + index * this.lineHeight);
      });
      this.convertToParticles();
    }
    convertToParticles() {
      this.particles = [];
      const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
      for (let y = 0; y < this.canvasHeight; y += this.gap) {
        for (let x = 0; x < this.canvasWidth; x += this.gap) {
          const index = (y * this.canvasWidth + x) * 4;
          const alpha = pixels[index + 3];
          if (alpha > 0) {
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];
            const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
          }
        }
      }
    }
    render() {}
  }

  const effect = new Effect(ctx, canvas.width, canvas.height);
  effect.wrapText('how are you. I am fine, thanks');

  function animate() {}

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
