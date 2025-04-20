const menu = document.getElementById("menu-list");
contents.forEach((item) => {
  const li = document.createElement("li");
  li.innerHTML = `<a href="${item.link}" target="_blank">${item.name}</a>`;
  menu.appendChild(li);
});

const grid = document.getElementById("grid-screen");
const tilesWrapper = document.createElement("div");
tilesWrapper.id = "tiles";
grid.appendChild(tilesWrapper);

const TILE_SIZE = 50;
let columns = 0,
  rows = 0;

function createGrid() {
  tilesWrapper.innerHTML = "";
  columns = Math.floor(window.innerWidth / TILE_SIZE);
  rows = Math.floor(window.innerHeight / TILE_SIZE);
  tilesWrapper.style.setProperty("--columns", columns);
  tilesWrapper.style.setProperty("--rows", rows);

  const total = columns * rows;
  for (let i = 0; i < total; i++) {
    const t = document.createElement("div");
    t.classList.add("tile");
    t.onclick = () => onTileClick(i);
    tilesWrapper.appendChild(t);
  }
}

window.addEventListener("resize", createGrid);
createGrid();

const canvas = document.getElementById("network-screen");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = 1 + Math.random() * 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();
  }
}

const particles = [];
const PARTICLE_COUNT = 100;
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = particles[i];
    p.update();
    p.draw();
    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
      const q = particles[j];
      const dx = p.x - q.x,
        dy = p.y - q.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 100})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

let nodesVisible = false;
function onTileClick(index) {
  if (nodesVisible) return;
  nodesVisible = true;

  anime({
    targets: "#grid-screen",
    opacity: [1, 0],
    duration: 800,
    easing: "easeInOutQuad",
  });
  anime({
    targets: "#network-screen",
    opacity: [0, 1],
    duration: 800,
    easing: "easeInOutQuad",
  });
}
