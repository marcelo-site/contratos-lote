
import { handleDocs } from "./script.js"
import { showSheet } from "./bottom-sheet.js"
import { dataMovements, docsProcess } from "./data-movement.js"

const btnSubject = document.querySelector("#btn-subject");
const btnDocProcess = document.querySelector("#btn-doc-process");
const containerSubject = document.querySelector("#subject");
const containerDocProcess = document.querySelector("#doc-process");
const containerMovements = document.querySelector("#movements > div");
const detailsMain = document.querySelectorAll(".details-main");

const subject = `DIREITO ADMINISTRATIVO E OUTRAS MATÉRIAS DE DIREITO PÚBLICO - DIREITO CIVIL (899) - Obrigações (7681) - Inadimplemento (7691) - Rescisão / Resolução (10582 - DIREITO CIVIL (899) - Fatos Jurídicos (7947) - Ato / Negócio Jurídico (4701) - Defeito, nulidade ou anulação (4703 - DIREITO PROCESSUAL CIVIL E DO TRABALHO (8826) - Tutela Provisória (9192) - Liminar (9196`

const toggle = (e) => {
  const { id } = e.target

  if (id === "btn-doc-process") {
    btnSubject.classList.remove("active");
    containerSubject.classList.add("none");

    btnDocProcess.classList.add("active");
    containerDocProcess.classList.remove("none");
  } else if (id === "btn-subject") {
    btnSubject.classList.add("active");
    containerSubject.classList.remove("none");

    btnDocProcess.classList.remove("active");
    containerDocProcess.classList.add("none");
  }
}

btnDocProcess.addEventListener("click", toggle)

btnSubject.addEventListener("click", (e) => {
  toggle(e)
  e.stopPropagation()
})

const baseURL = "https://gateway.cloud.pje.jus.br/tpu"
const icon = `<i class="bi bi-question-circle"></i>`

const getSubject = async (code) => {
  const res = await fetch(baseURL + `/api/v1/publico/consulta/detalhada/assuntos?codigo=${code}`)

  const json = await res.json()

  return json
}

const contentLine = (active) => {
  return `<div>
<div class="dot ${active ? "active" : ""}"></div>
<div class="line ${active ? "active" : ""}"></div>
</div>`
}

const contentMovement = ({ date, content, open }) => {
  return (
    ` <details ${open ? "open" : ""}>
      <summary class="summary" style="width:100%; border: 0; padding: 0;">${date}</summary>
    <p>${content}</p>
      </details`
    //     `<div class="timeline-content">
    // <h4>${date}</h4>
    // <p>${content}</p>
    // <span></span>
    // </div>`
  )
}

const insertMovements = ({ date, content, active }) => {
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = contentLine(active);
  div.innerHTML += contentMovement({ date, content, open: !active });
  return div
}

dataMovements.forEach((item, i) => {
  let active = true
  if (i === 0) active = false

  const content = insertMovements({ ...item, active })
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
  const subjectSplit = subject.split("-")
  const arraySubject = Array.from(subjectSplit)

  await Promise.all(arraySubject.map(async (item) => {
    const div = document.createElement("div")
    div.innerHTML = `<span>${item}</span>`
    const code = item.replace(/\D/g, "")

    if (code) {
      const contentSubject = await getSubject(code)
      const desc = contentSubject[0].descricao_glossario
      const norma = contentSubject[0].norma
      if (desc || norma) {
        const button = document.createElement("button")
        button.innerHTML = `<sup>${icon}</sup>`

        button.addEventListener("click", () => {
          const div = document.createElement("span");
          if (desc) {
            div.innerHTML += `<div><span style="font-weight: 600; font-size:20px; margin: 10px 0; display:inline-block;">Explicação: </span><br />${desc}</div>`
          }
          if (norma) {
            div.innerHTML += `<div><span style="font-weight: 600; font-size:20px; margin: 10px 0; display:inline-block;">Norma: </span><br />${norma}</div>`
          }
          showSheet(div)
        })

        div.append(button)
      }
    }
    containerSubject.appendChild(div)
  }));

  const docs = handleDocs(docsProcess);
  containerDocProcess.append(docs)
}

inity();
