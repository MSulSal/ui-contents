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

let widthHeavy = window.innerWidth >= window.innerHeight;
let TILE_SIZE = widthHeavy
  ? Math.floor(window.innerWidth / 50)
  : Math.floor(window.innerHeight / 50);
let columns = 0,
  rows = 0;

function createGrid() {
  widthHeavy = window.innerWidth >= window.innerHeight;
  TILE_SIZE = widthHeavy
    ? Math.floor(window.innerWidth / 50)
    : Math.floor(window.innerHeight / 50);
  tilesWrapper.innerHTML = "";
  columns = Math.floor(window.innerWidth / TILE_SIZE);
  rows = Math.floor(window.innerHeight / TILE_SIZE);
  tilesWrapper.style.setProperty("--columns", columns);
  tilesWrapper.style.setProperty("--rows", rows);

  const total = columns * rows;
  for (let i = 0; i < total; i++) {
    const t = document.createElement("div");
    t.classList.add("tile");
    t.onclick = () => toggleScreens(i);
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
    this.radius = 1 + Math.random() * 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
    if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fill();
  }
}

const particles = [];
const PARTICLE_COUNT = 100;
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
};

animate();

let nodesVisible = false;

function toggleScreens(index) {
  nodesVisible = !nodesVisible;

  const tiles = document.querySelectorAll(".tile");
  const total = tiles.length;
  const centerIndex = Math.floor(total / 2);

  anime({
    targets: tiles,
    opacity: nodesVisible ? 0 : 1,
    delay: anime.stagger(50, {
      grid: [columns, rows],
      from: index,
    }),
    duration: 50,
    easing: "easeInOutQuad",
  });

  anime({
    targets: "#network-screen",
    opacity: nodesVisible ? 1 : 0,
  });

  anime({
    targets: "#grid-screen",
    opacity: nodesVisible ? 0 : 1,
    duration: 800,
    easing: "easeInOutQuad",
  });

  if (!nodesVisible) {
    anime({
      targets: ".tile",
      opacity: 1,
      scale: [0, 1],
      delay: anime.stagger(50, {
        grid: [columns, rows],
        from: centerIndex,
      }),
      duration: 600,
      easing: "easeInOutQuad",
    });
  }
}

document
  .getElementById("network-screen")
  .addEventListener("click", () => toggleScreens());
