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
let mouseX = 0,
  mouseY = 0;
let hitCount = 0;

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

document.addEventListener("pointermove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

const networkScreen = document.getElementById("network-screen");

let currentColors = [
  [0, 0, 0, 0.7],
  [0, 0, 0, 0.7],
];
let targetColors = null;
let transitionStart = 0;
const transitionDuration = 500;

function startColorTransition() {
  targetColors = [
    [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      0.7,
    ],
    [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      0.7,
    ],
  ];
  transitionStart = performance.now();
}

function updateBackground(now) {
  if (!targetColors) return;
  let t = (now - transitionStart) / transitionDuration;
  if (t >= 1) {
    t = 1;
  }
  const interp = currentColors.map((start, i) => {
    const end = targetColors[i];
    return start.map((c, idx) => c + (end[idx] - c) * t);
  });
  networkScreen.style.background = `linear-gradient(45deg, rgba(${interp[0].join(
    ","
  )}), rgba(${interp[1].join(",")}))`;
  if (t === 1) {
    currentColors = targetColors;
    targetColors = null;
  }
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = 1 + Math.random() * 5;
    this.color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.7)`;
  }

  update() {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 200) {
      const force = (200 - dist) * 0.0005;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }
    this.x += this.vx;
    this.y += this.vy;
    if (this.x <= 0 || this.x >= canvas.width) {
      hitCount++;
      if (hitCount % 10 === 0) startColorTransition();
      this.vx *= -1;
    }
    if (this.y <= 0 || this.y >= canvas.height) {
      hitCount++;
      if (hitCount % 10 === 0) startColorTransition();
      this.vy *= -1;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const particles = [];
const PARTICLE_COUNT = window.innerWidth * window.innerHeight * 0.000075;
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

const animate = (now) => {
  updateBackground(now);
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
