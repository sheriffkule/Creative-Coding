function main() {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Bar {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
    }
    update(micInput) {
      // this.height = micInput
      this.x++;
    }
    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  const bar1 = new Bar(10, 10, 100, 200, 'blue');

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bar1.draw(ctx);
    // generates audio samples from microphone
    // animate bars based on microphone data
    requestAnimationFrame(animate);
  }
  animate();
}
