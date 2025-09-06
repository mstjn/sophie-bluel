import { modal, categorie, getData, setData } from "./config.js";
import { deleteWork, addProject, getWorks } from "./api.js";
import { displayProjects } from "./main.js";

export const modalMenu =  `<div class="card-modal">
        <a class="close-modal" style="align-self: end;"><img src="./assets/icons/close.svg" alt=""></a>
        <h2>Galerie photo</h2>
        <div class="container-modal"></div>
        <hr style="width:70%;">
        <button class="button-class" id="ajout">Ajouter une photo</button>
      </div>`
export const modalAdd = `<div class="card-modal">
<div class="nav-container">
        <a id="back"><img src="./assets/icons/arrow-left.svg" alt=""></a>
        <a class="close-modal"><img src="./assets/icons/close.svg" alt=""></a>
        </div><h2>Ajout photo</h2>
        <form id="form-add" action="">
          <div class="background" id="background">
            <img src="./assets/icons/photo.svg" alt="">
            <input accept="image/png, image/jpeg" type="file" id="file" class="visually-hidden" required>
            <label for="background" id="button-add">+ Ajouter une photo</label>
            <p>jpg, png : 4mo max</p>
          </div>
          <div style="display:flex; flex-direction:column; height:100%; gap:15px; margin-top:10px;">
          <label class="form-label" for="title">Titre</label>
          <input class="form-input" type="text" name="title" id="title" required>
        <label class="form-label" for="categorie">Catégorie</label>
          <select class="form-input" name="categorie" id="categorie" required></select>
          </div>
          <div style="display:flex; flex-direction:column;align-items:center;">
          <hr>
          <button id="valider" class="button-class-add" type="submit">Valider</button>
          </div>
        </form>
      </div>`

// change de vue sur la modale
export function switchModal(showAdd) {
  modal.innerHTML = showAdd ? modalAdd : modalMenu;
  bindCommonModal();

  if (showAdd) {
    initAddView();
  } else {
    initMenuView();
  }
}
// listeners communs
function bindCommonModal() {
  document.querySelector(".card-modal")?.addEventListener("click", (e) => e.stopPropagation());
  document.querySelector(".close-modal")?.addEventListener("click", () => showModal(false));
}

// configure la vue du formulaire
export function initAddView() {
  const select = document.getElementById("categorie");
  const fileInput = document.getElementById("file");
  const background = document.getElementById("background");
  const form = document.getElementById("form-add");
  const submitBtn = document.getElementById("valider");

  select.innerHTML = "";
  categorie.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = String(cat.id);
    opt.textContent = cat.name;
    select.appendChild(opt);
  });

  background.addEventListener("click", () => fileInput.click());

  let previewUrl = null;
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);

    const img = document.createElement("img");
    img.src = previewUrl;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.objectFit = "contain";
    background.style.padding = "0";
    background.innerHTML = "";
    background.appendChild(img);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = fileInput.files?.[0];
    const title = document.getElementById("title").value.trim();
    const categoryId = Number(select.value);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", categoryId);

    submitBtn.disabled = true;
    try {
      const response = await addProject(formData);
      if (!response.ok) {
        console.error("addProject failed:", response.status, await response.text());
        alert("Échec de l’upload (" + response.status + ")");
        return;
      }
      setData(await getWorks());
      displayProjects(getData());
      switchModal(false);
    } catch (err) {
      console.error("Network/JS error:", err);
      alert("Erreur réseau");
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.getElementById("back")?.addEventListener("click", () => switchModal(false), { once: true });
}

// configure la vue du menu
export function initMenuView() {
  displayProjectsModal(getData());

  const container = document.querySelector(".container-modal");
  container?.addEventListener("click", async (e) => {
    const bin = e.target.closest(".delete-img");
    if (!bin) return;

    const id = bin.dataset.id;
    try {
      await deleteWork(id);
      document.getElementById(`image-wrapper${id}`)?.remove();
      setData(await getWorks());

      displayProjects(getData());
    } catch (err) {
      console.error("Suppression échouée :", err);
    }
  });

  document.getElementById("ajout")?.addEventListener("click", () => switchModal(true));
}

// montre ou non la modale
export async function showModal(show) {
  if (show) {
    modal.style.display = "flex";
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth + "px";
    switchModal(false);
  } else {
    modal.style.display = "none";
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
}

export function displayProjectsModal(data) {
  const containerModal = document.querySelector(".container-modal");
  containerModal.innerHTML = "";

  if (!data) return;

  data.forEach((project) => {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("image-wrapper");
    imgWrapper.id = `image-wrapper${project.id}`;

    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.style.maxHeight = "139px";
    image.alt = project.title;

    const bin = document.createElement("img");
    bin.src = "./assets/icons/bin.svg";
    bin.classList.add("delete-img");
    bin.dataset.id = project.id;

    imgWrapper.append(bin, image);
    containerModal.appendChild(imgWrapper);
  });
}
