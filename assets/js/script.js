import { showSheet } from "./bottom-sheet.js"
import { data } from "./data-lote.js"
const table = document.querySelector("table")
const tbody = table.querySelector("tbody")

function greeting() {
  const date = new Date()
  const hrs = date.getHours()

  if (hrs >= 0 && hrs < 12) {
    return `Olá, bom dia`
  } else if (hrs >= 12 && hrs < 18) {
    return `Olá, boa tarde`
  }
  else if (hrs >= 18 && hrs < 23) {
    return `Olá, boa noite`
  }
}

function viewPDF(doc) {
  window.open(doc, '_blank')
}

function render({ name, pay, data }) {
  const tr = document.createElement("tr")
  tr.classList.add("primary")
  // tr.style.background = background ? "#f8f8f8" : ""
  const tdName = document.createElement("td")
  tdName.classList.add("ellipsis")
  tdName.innerText = name
  tr.append(tdName)

  const tdPay = document.createElement("td")
  tdPay.classList.add("pay")
  tdPay.innerHTML = pay ? '<i class="bi bi-check-circle-fill"></i>' : '<i class="bi bi-x-circle-fill"></i>'

  tdPay.style.color = pay ? "green" : "red"
  tr.append(tdPay)

  const tdEye = document.createElement("td")
  tdEye.classList.add("eye", "show-btn")
  tdEye.innerHTML = "<i class='bi bi-file-earmark-text'>"

  tdEye.addEventListener("click", () => {
    const content = contentInfo(data)
    showSheet(content)
  })
  tr.append(tdEye)

  return tr
}

function contentInfo(data) {
  const { descrpition, documents, contact, name } = data;
  const containerInfo = document.createElement("div");

  const containerName = document.createElement("div")
  containerName.innerHTML = `<h3>${name}</h3>`
  containerName.classList.add("name")
  containerName.innerHTML += contact ? `<a class="btn-zap" target=_blank href="https://api.whatsapp.com/send?phone=55${contact.replace(/\D/g, "")}&text=${greeting()}">
   <span><i class="bi bi-whatsapp"></i></span>
    </a>` : "<span>Sem número</span>"

  containerInfo.append(containerName)

  const containerDesc = document.createElement("div");
  const divDesc = document.createElement("div");

  const divBtnDocument = document.createElement("div");
  const buttonDesc = document.createElement("button");
  buttonDesc.classList.add("active", "btn");

  const buttonDocument = document.createElement("button")
  buttonDocument.classList.add("btn")

  buttonDesc.innerText = "Notas"
  containerInfo.append(buttonDesc)

  const divButtons = document.createElement("div")
  divButtons.classList.add("btn-document")
  divButtons.classList.add("none")

  buttonDesc.addEventListener("click", ({ target }) => {
    target.classList.add("active")
    buttonDocument.classList.remove("active")
    divButtons.classList.add("none")
    divDesc.classList.remove("none")
  })

  buttonDocument.addEventListener("click", ({ target }) => {
    target.classList.add("active")
    buttonDesc.classList.remove("active")
    divButtons.classList.remove("none")
    divDesc.classList.add("none")
  })

  buttonDocument.innerText = "Documentos"
  containerInfo.append(buttonDocument)

  divDesc.innerText = descrpition || "Sem notas"
  divDesc.classList.add("description")
  containerDesc.append(divDesc)
  containerInfo.append(containerDesc)

  const pdfURL = (doc) => `https://docs.google.com/gview?url=${window.location.origin}/contratos-lote/assets/documents/${doc}&embedded=true`

  documents.forEach(doc => {
    const documentDiv = document.createElement("div")

    documentDiv.innerHTML = `<span>${doc}</span>
        <span> <i class="bi bi-download"></i></span>`
    divBtnDocument.append(documentDiv);

    documentDiv.addEventListener("click", () => viewPDF(pdfURL(doc)));

    divButtons.append(documentDiv);
  })

  containerInfo.append(divButtons)

  return containerInfo
}

(function () {
  data.forEach((item, i) => {
    const { name, pay } = item
    const tr = render({ name, pay, data: item })
    tbody.append(tr)
  })
})()