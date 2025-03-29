
import { handleDocs } from "./script.js"
import { dataMovements, docsProcess } from "./data-movement.js"
import { contentSubject } from "./contentSubject.js"

const containerSubject = document.querySelector("#subject");
const containerDocProcess = document.querySelector("#doc-process");
const containerMovements = document.querySelector("#movements > div");
const detailsMain = document.querySelectorAll(".details-main");
const tabcontent = document.querySelectorAll(".tabcontent");
const tablinks = document.querySelectorAll(".tablinks");

function openCity(evt) {
  let i = 0
  for (i = 0; i < tabcontent.length; i++) {
    tablinks[i].classList.remove("active");
  }
  const open = evt.target.getAttribute('data-open');

  tabcontent.forEach(tab => {
    if (tab.id === open) {
      tab.classList.remove("none");
    } else {
      tab.classList.add("none");
    }
  });

  evt.currentTarget.classList.add("active");
}

const contentLine = (active) => {
  return `<div>
<div class="dot ${active ? "active" : ""}"></div>
<div class="line ${active ? "active" : ""}"></div>
</div>`;
}

const contentMovement = ({ dataHora, fase, texto, open }) => {
  const date = new Date(dataHora);
  const padStart = (text) => String(text).padStart(2, "0");
  return (
    ` <details ${open ? "open" : ""}>
      <summary class="summary" style="width:100%; border: 0; padding: 0;">${padStart(date.getDate()) + "/" + padStart(date.getMonth()) + "/" + date.getFullYear()}
      </summary>
    <div>${fase}</div>
    <p>${texto || ''}</p>
      </details`
  )
}

const insertMovements = ({ dataHora, texto, fase, active }) => {
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = contentLine(active);
  div.innerHTML += contentMovement({ dataHora, fase, texto, open: false });
  return div
}

dataMovements.forEach((item, i) => {
  let active = true;
  if (i === 0) active = false;

  const content = insertMovements({ ...item, active });
  containerMovements.append(content)
});

detailsMain.forEach(item => {
  item.addEventListener("click", function () {
    detailsMain.forEach(dt => {
      if (dt !== this) dt.open = false
    })
  })
});

const inity = async () => {
  await contentSubject(containerSubject)

  const docs = handleDocs(docsProcess);
  containerDocProcess.append(docs);

  tablinks.forEach(tablink => tablink.addEventListener("click", openCity));
}

window.addEventListener("DOMContentLoaded", inity)

