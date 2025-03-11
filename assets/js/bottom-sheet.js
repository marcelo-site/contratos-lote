let bottomSheet = document.querySelector(".bottom-sheet");
let overlay = document.querySelector(".overlay");
let containerBottom = document.querySelector(".container-bottom");
let content = document.querySelector("#content");
let dragIcon = document.querySelector(".drag-icon")

let isDragging = false,
  startY,
  startHeight;

let updateHeight = (height) => {
  containerBottom.style.height = `${height}vh`;
  bottomSheet.classList.toggle("fullscreen", height === 100);
};

export const showSheet = (data) => {
  bottomSheet.classList.add("show");
  updateHeight(60);
  content.appendChild(data)
  document.body.style.overflow = "hidden";

};

const hideSheet = () => {
  bottomSheet.classList.remove("show");
  document.body.style.overflow = "auto";
  content.innerHTML = ""
};

let dragStart = (e) => {
  isDragging = true;
  bottomSheet.classList.add("dragging");
  startY = e.pageY || e.touches?.[0].pageY;
  startHeight = parseInt(containerBottom.style.height);
};

let dragging = (e) => {
  if (!isDragging) return;

  let delta = startY - (e.pageY || e.touches?.[0].pageY);
  let newHeight = startHeight + (delta / window.innerHeight) * 100;

  updateHeight(newHeight);
};

let dragStop = () => {
  isDragging = false;
  bottomSheet.classList.remove("dragging");

  let sheetHeight = parseInt(containerBottom.style.height);

  sheetHeight < 25
    ? hideSheet()
    : sheetHeight > 75
      ? updateHeight(90)
      : updateHeight(60);
};

dragIcon.addEventListener("mousedown", dragStart);
dragIcon.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);

dragIcon.addEventListener("touchstart", dragStart);
dragIcon.addEventListener("touchmove", dragging);
document.addEventListener("touchend", dragStop);

overlay.addEventListener("click", hideSheet);