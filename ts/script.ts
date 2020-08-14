type TPoint2D = {
  x: number;
  y: number;
  radius: number;
};

const canvas = <HTMLCanvasElement> document.getElementById('canvas1');
const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray: Particle[] = [];

// Handle mouse events
let mouse: TPoint2D = { x: 0, y: 0, radius: 75}
window.addEventListener('mousemove', function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

ctx.fillStyle = 'white';
ctx.font = '20px Verdana';
ctx.fillText('.Hello', 10, 30)
ctx.font = '30px Verdana';
ctx.fillText('world', 10, 60)
const imgCoordinates = ctx.getImageData(0, 0, 100, 100)

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 40) + 5;
  }

  draw() { 
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath();
    ctx.fill();
  };

  update() {
    let dx: number = mouse.x - this.x;
    let dy: number = mouse.y - this.y;
    let distance: number = Math.sqrt(dx * dx + dy * dy)
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 5;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 5;
      }
    }
  }
};

function init() {
  particleArray = [];
  for (let y = 0, y2 = imgCoordinates.height; y < y2; y++){
    for (let x = 0, x2 = imgCoordinates.width; x < x2; x++){
      if (imgCoordinates.data[(y * 4 * imgCoordinates.width) + (x * 4) + 3] > 128) {
        let positionX = x;
        let positionY = y;
        particleArray.push(new Particle(positionX * 10, positionY * 10))
      }
    }
  }
};
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++){
    particleArray[i].draw();
    particleArray[i].update();
  }
  requestAnimationFrame(animate);
}
animate();

