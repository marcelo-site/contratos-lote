const bottomSheet = document.querySelector(".bottom-sheet");
const overlay = document.querySelector(".overlay");
const containerBottom = document.querySelector(".container-bottom");
const content = document.querySelector("#content");
const dragIcon = document.querySelector(".drag-icon")

let isDragging = false
let startY
const windowHeight = window.innerHeight

const updateHeight = (height) => {
  containerBottom.style.height = `${height}px`;
  bottomSheet.classList.toggle("fullscreen", height === windowHeight * 0.9);
};

export const showSheet = (data) => {
  bottomSheet.classList.add("show");
  updateHeight(windowHeight * 0.6);
  content.appendChild(data)
  document.body.style.overflow = "hidden";

};

const hideSheet = () => {
  bottomSheet.classList.remove("show");
  document.body.style.overflow = "auto";
  content.innerHTML = ""
};

const dragStart = (e) => {
  isDragging = true;
  bottomSheet.classList.add("dragging");
  startY = e.pageY || e.touches?.[0].pageY;
};

const dragging = (e) => {
  if (!isDragging) return;

  const delta = startY - (e.pageY || e.touches?.[0].pageY);
  const newHeight = ((windowHeight - startY) + delta);

  const move = Math.abs(newHeight - startY)

  if (move > 8) {
    updateHeight(newHeight);
  }
};

const dragStop = () => {
  isDragging = false;
  bottomSheet.classList.remove("dragging");
  const sheetHeight = parseInt(containerBottom.style.height);

  sheetHeight < windowHeight / 4
    ? hideSheet()
    : sheetHeight > windowHeight * 0.6
      ? updateHeight(windowHeight * 0.9)
      : updateHeight(windowHeight * 0.6);
};

dragIcon.addEventListener("mousedown", dragStart, { passive: true });
document.addEventListener("mousemove", dragging, { passive: true });
document.addEventListener("mouseup", dragStop, { passive: true });

dragIcon.addEventListener("touchstart", dragStart, { passive: true });
document.addEventListener("touchmove", dragging, { passive: true });
document.addEventListener("touchend", dragStop, { passive: true });

overlay.addEventListener("click", hideSheet);