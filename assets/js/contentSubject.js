import { showSheet } from "./bottom-sheet.js";

export const subject = `DIREITO ADMINISTRATIVO E OUTRAS MATÉRIAS DE DIREITO PÚBLICO - DIREITO CIVIL (899) - Obrigações (7681) - Inadimplemento (7691) - Rescisão / Resolução (10582 - DIREITO CIVIL (899) - Fatos Jurídicos (7947) - Ato / Negócio Jurídico (4701) - Defeito, nulidade ou anulação (4703 - DIREITO PROCESSUAL CIVIL E DO TRABALHO (8826) - Tutela Provisória (9192) - Liminar (9196`

const baseURL = "https://gateway.cloud.pje.jus.br/tpu"
const icon = `<i class="bi bi-question-circle"></i>`

const getSubject = async (code) => {
  const res = await fetch(baseURL + `/api/v1/publico/consulta/detalhada/assuntos?codigo=${code}`);

  const json = await res.json();
  return json;
}

const contentSubject = async (containerSubject) => {
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
          const containerNormaDesc = document.createElement("div");
          const h3 = document.createElement("h3");
          h3.style.fontWeight = 400;
          h3.innerHTML = `<span class="title-subject">Assunto: </span> ${item.toUpperCase()}`
          containerNormaDesc.append(h3);

          if (desc) {
            containerNormaDesc.innerHTML += `<div><span class="title-subject">Explicação: </span>${desc}</div>`
          }
          if (norma) {
            containerNormaDesc.innerHTML += `<div><span class="title-subject">Norma: </span>${norma}</div>`
          }
          showSheet(containerNormaDesc)
        })

        div.append(button)
      }
    }
    containerSubject.appendChild(div)
  }));
}

export { contentSubject }