const wrapper = document.getElementById("tiles");
const tileSize = 50;

const colors = [
  "rgb(229, 57, 53)",
  "rgb(244, 81, 30)",
  "rgb(253, 216, 53)",
  "rgb(76, 175, 80)",
  "rgb(33, 150, 243)",
  "rgb(156, 39, 176)",
];

let columns = 0;
let rows = 0;
let toggled = false;

const handleOnClick = (index) => {
  toggled = !toggled;
  anime({
    targets: ".tile",
    opacity: toggled ? 0 : 1,
    delay: anime.stagger(50, {
      grid: [columns, rows],
      from: index,
    }),
  });
};

const createTile = (index) => {
  const tile = document.createElement("div");

  tile.classList.add("tile");
  tile.onclick = (e) => handleOnClick(index);
  return tile;
};

const createTiles = (quantity) => {
  Array.from(Array(quantity)).map((tile, index) => {
    wrapper.appendChild(createTile(index));
  });
};

const createGrid = () => {
  wrapper.innerHTML = "";
  columns = Math.floor(document.body.clientWidth / tileSize);
  rows = Math.floor(document.body.clientHeight / tileSize);

  wrapper.style.setProperty("--columns", columns);
  wrapper.style.setProperty("--rows", rows);

  createTiles(columns * rows);
};
createGrid();
window.onresize = () => createGrid();

const lists = document.getElementsByTagName("ul");
for (const list of lists) {
  for (let i = 0; i < contents.length; i++) {
    list.appendChild(
      document.createElement("li")
    ).innerHTML = `<a href="${contents[i].link}" target="_blank">${contents[i].name}</a>`;
  }
}

const left = document.getElementById("left-side");

// const handleOnMove = (e) => {
//   const p = (e.clientX / window.innerWidth) * 100;
//   left.style.width = `${p}%`;
// };

// document.onmousemove = (e) => handleOnMove(e);
// document.ontouchmove = (e) => handleOnMove(e.touches[0]);

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("network-canvas");
  const ctx = canvas.getContext("2d");

  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

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
});
