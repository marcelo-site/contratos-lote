const bottomSheet = document.querySelector(".bottom-sheet");
const overlay = document.querySelector(".overlay");
const containerBottom = document.querySelector(".container-bottom");
const content = document.querySelector("#content");
const dragIcon = document.querySelector(".drag-icon")

let isDragging = false
let startY
// let windowHeight = window.innerHeight

const updateHeight = (height) => {
  containerBottom.style.height = `${height}px`;
};

export const showSheet = (data) => {
  const windowHeight = window.innerHeight
  bottomSheet.classList.add("show");
  updateHeight(windowHeight * 0.9);
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
  startY = (e.pageY || e.touches?.[0].pageY)
};

const dragging = (e) => {
  if (!isDragging) return;
  const windowHeight = window.innerHeight
  const delta = startY - (e.pageY || e.touches?.[0].pageY) + window.scrollY;
  const newHeight = ((windowHeight - startY) + delta);

  const move = Math.abs(newHeight - startY)

  if (move > 8) {
    updateHeight(newHeight);
  }
};

const dragStop = () => {
  isDragging = false;
  const windowHeight = window.innerHeight
  bottomSheet.classList.remove("dragging");
  const sheetHeight = parseInt(containerBottom.style.height);

  sheetHeight < windowHeight * 0.7
    ? hideSheet()
    : updateHeight(windowHeight * 0.9);
};

dragIcon.addEventListener("mousedown", dragStart, { passive: true });
document.addEventListener("mousemove", dragging, { passive: true });
document.addEventListener("mouseup", dragStop, { passive: true });

dragIcon.addEventListener("touchstart", dragStart, { passive: true });
document.addEventListener("touchmove", dragging, { passive: true });
document.addEventListener("touchend", dragStop, { passive: true });

overlay.addEventListener("click", hideSheet);