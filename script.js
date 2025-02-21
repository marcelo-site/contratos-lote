import { data } from "./data.js"
const containerEmbed = document.querySelector("#modal-pdf")
const embed = containerEmbed.querySelector("iframe")
const replyViewDocument = document.querySelector("#reply")
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

function render({
  name, contact, pay, containerDesc, background
}) {
  const tr = document.createElement("tr")
  tr.classList.add("primary")
  tr.style.background = background ? "#f8f8f8" : ""
  const tdName = document.createElement("td")
  tdName.innerText = name
  tr.append(tdName)

  const tdPay = document.createElement("td")
  tdPay.classList.add("pay")
  tdPay.innerHTML = pay ? '<i class="bi bi-check-circle-fill"></i>' : '<i class="bi bi-x-circle-fill"></i>'

  tdPay.style.color = pay ? "green" : "red"

  tr.append(tdPay)

  const tdContact = document.createElement("td")
  tdContact.innerHTML = contact ? `<a class="btn-zap" target=_blank href="https://api.whatsapp.com/send?phone=55${contact.replace(/\D/g, "")}&text=${greeting()}">
<span>${contact}</span>
<span>
    <i class="bi bi-whatsapp"></i>
</span>
  </a>` : "Sem número"
  tr.append(tdContact)

  const tdEye = document.createElement("td")
  tdEye.classList.add("eye")

  tdEye.innerHTML = "<i class='bi bi-file-earmark-text'>"

  tdEye.addEventListener("click", () => {
    containerDesc.classList.toggle("none")
  })
  tr.append(tdEye)

  return tr
}

function renderInfo({ descrpition, documents }) {
  const tr = document.createElement("tr")
  tr.classList.add("container-description", "none")
  const td = document.createElement("td")
  td.colSpan = 4

  const containerInfo = document.createElement("div")
  const containerDesc = document.createElement("div")
  const divDesc = document.createElement("div")

  const divBtnDocument = document.createElement("div")
  const buttonDesc = document.createElement("button")
  const buttonDocument = document.createElement("button")

  buttonDesc.classList.add("active")
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

  documents.forEach(doc => {
    const documentDiv = document.createElement("div")

    documentDiv.innerHTML = `<span>${doc}</span>
        <span> <i class="bi bi-download"></i></span>`
    divBtnDocument.append(documentDiv)
    documentDiv.addEventListener("click", () => {
      embed.src = "./assets/documents/" + doc
      containerEmbed.style.display = ""
    })
    divButtons.append(documentDiv);
  })

  containerInfo.append(divButtons)
  td.append(containerInfo)

  tr.append(td)

  return tr
}

replyViewDocument.addEventListener("click", () => {
  containerEmbed.style.display = "none"
  embed.src = ""
});

(function () {
  data.forEach((item, i) => {
    const { contact, descrpition, documents, name, pay } = item

    const trInfo = renderInfo({ descrpition, documents })
    const tr = render({ contact, name, pay, containerDesc: trInfo, background: i % 2 === 0 })

    tbody.append(tr)
    tbody.append(trInfo)
  })
})()