const lists = document.getElementsByTagName("ul");
for (const list of lists) {
  for (let i = 0; i < contents.length; i++) {
    list.appendChild(
      document.createElement("li")
    ).innerHTML = `<a href="${contents[i].link}" target="_blank">${contents[i].name}</a>`;
  }
}

const left = document.getElementById("left-side");

const handleOnMove = (e) => {
  const p = (e.clientX / window.innerWidth) * 100;
  left.style.width = `${p}%`;
};

document.onmousemove = (e) => handleOnMove(e);
document.ontouchmove = (e) => handleOnMove(e.touches[0]);
