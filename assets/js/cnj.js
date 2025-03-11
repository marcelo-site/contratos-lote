import { showSheet } from "./bottom-sheet.js"
import { dataMovements } from "./data-movement.js"

const btnPlus = document.querySelector(".btn-plus")
const containerSubject = document.querySelector("#subject");
const containerMovements = document.querySelector("#movements > div");
const details = document.querySelectorAll("details")
let showSubject = false

const subject = `DIREITO ADMINISTRATIVO E OUTRAS MATÉRIAS DE DIREITO PÚBLICO - DIREITO CIVIL (899) - Obrigações (7681) - Inadimplemento (7691) - Rescisão / Resolução (10582 - DIREITO CIVIL (899) - Fatos Jurídicos (7947) - Ato / Negócio Jurídico (4701) - Defeito, nulidade ou anulação (4703 - DIREITO PROCESSUAL CIVIL E DO TRABALHO (8826) - Tutela Provisória (9192) - Liminar (9196`

const toggle = () => {
  containerSubject.classList.toggle("show-question")
  containerSubject.classList.toggle("full-screen");
  setTimeout(() => {
    if (showSubject) btnPlus.innerHTML = "Mostrar mais"
    else btnPlus.innerHTML = "Mostrar menos"

    showSubject = !showSubject

    containerSubject.classList.toggle("hide-screen");
  }, 300)
}

details.forEach(item => {
  item.addEventListener("click", function () {
    // toggle()
    btnPlus.innerHTML = "Mostrar mais"
    details.forEach(dt => {
      if (dt !== this) dt.open = false
    })
  })
})

btnPlus.addEventListener("click", (e) => {
  toggle()
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

const contentMovement = ({ date, content }) => {
  return (
    `<div class="timeline-content">
<h4>${date}</h4>
<p>${content}</p>
</div>`
  )
}

const insertMovements = ({ date, content, active }) => {
  const div = document.createElement("div")
  div.classList.add("card")
  div.innerHTML = contentLine(active)
  div.innerHTML += contentMovement({ date, content })

  return div
}

dataMovements.forEach((item, i) => {
  let active = true
  if (i === 0) active = false

  const content = insertMovements({ ...item, active })
  containerMovements.append(content)
})

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
          const div = document.createElement("div");
          if (desc) {
            div.innerHTML += `<div><div><span style="font-weight: 600; font-size:20px; margin: 10px 0; display:inline-block;">Explicação: </span><br />${desc}</div>`
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
  }))
}

inity();
