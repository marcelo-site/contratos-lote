import { showSheet } from "./bottom-sheet.js"
import { data } from "./data-lote.js"
const table = document.querySelector("table")
const tbody = table.querySelector("tbody")

function greeting() {
  const date = new Date()
  const hrs = date.getHours()

  if (hrs >= 0 && hrs < 12) {
    return `Olá, bom dia!\n`
  } else if (hrs >= 12 && hrs < 18) {
    return `Olá, boa tarde!\n`
  }
  else if (hrs >= 18 && hrs < 23) {
    return `Olá, boa noite!\n`
  }
}

function viewPDF(doc) {
  const url = `https://docs.google.com/gview?url=${window.location.origin}/contratos-lote/assets/documents/${doc}&embedded=true`;

  window.open(url, '_blank');
}

function renderTable({ name, pay, data }) {
  const tr = document.createElement("tr");
  const tdName = document.createElement("td");
  tdName.classList.add("ellipsis")
  tdName.innerText = name
  tr.append(tdName)

  const tdPay = document.createElement("td")
  tdPay.classList.add("pay")
  tdPay.innerHTML = pay ?
    '<i class="bi bi-check-circle-fill"></i>' :
    '<i class="bi bi-x-circle-fill"></i>'

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

function handleDocs(data) {
  const divBtnDocument = document.createElement("div");
  divBtnDocument.classList.add("btn-document")

  data.forEach(doc => {
    const btn = document.createElement("div")
    btn.addEventListener("click", () => viewPDF(doc));

    btn.innerHTML = `<span>${doc}</span>
<span><i class="bi bi-download"></i></span>`
    divBtnDocument.append(btn);
  });

  return divBtnDocument
}

function contentInfo(data) {
  const { descrpition, documents, contact, name } = data;
  const containerInfo = document.createElement("div");

  const containerName = document.createElement("div")
  containerName.innerHTML = `<h3>${name}</h3>`
  containerName.classList.add("name")
  containerName.innerHTML += contact ? `<a class="btn-zap" target=_blank href="https://api.whatsapp.com/send?phone=55${contact.replace(/\D/g, "")}&text=${greeting()}">
   <span><i class="bi bi-whatsapp"></i></span>
    </a>` : ""

  containerInfo.append(containerName)

  const containerDesc = document.createElement("div");
  const divDesc = document.createElement("div");

  const buttonDesc = document.createElement("button");
  buttonDesc.classList.add("active", "btn");

  const buttonDocument = document.createElement("button")
  buttonDocument.classList.add("btn")

  buttonDesc.innerText = "Notas"
  containerInfo.append(buttonDesc)

  const divButtons = document.createElement("div")
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

  const buttons = handleDocs(documents);

  divButtons.append(buttons)

  containerInfo.append(divButtons)

  return containerInfo
}

(function () {
  data.forEach((item) => {
    const { name, pay } = item
    const tr = renderTable({ name, pay, data: item })
    tbody.append(tr)
  })
})();

export { handleDocs }