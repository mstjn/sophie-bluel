import { getWorks, getCategoriesNames, deleteWork, getCategories, addProject } from "./api.js";
import { modalAdd, modalMenu } from "./config.js";

// récupération des données backend et affichage par défaut
let data = await getWorks();
const categoriesNames = await getCategoriesNames();
const categorie = await getCategories();
displayProjects(data);
const modal = document.querySelector(".modal");

// vérifie si un utilisateur est connecté et lance les listeners
if (isConnected()) {
  displayLoginElements();

  document.getElementById("edit").addEventListener("click", () => {
    showModal(true);
  });
  modal.addEventListener("click", () => {
    showModal(false);
  });
  document.getElementById("login").addEventListener("click", () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
  });
} else {
  displayLogoutElements();
}

// affiche les éléments quand il n'y a aucun utilisateur connecté
function displayLogoutElements() {
  document.getElementById("login").textContent = "login";
  displayFilters(data, categoriesNames);
}

// affiche les éléments quand il y a un utilisateur connecté
function displayLoginElements() {
  const edit = document.createElement("a");
  edit.id = "edit";
  document.getElementById("login").textContent = "logout";
  document.getElementById("projet").style.marginBottom = "0";
  const title = document.querySelector(".title");
  edit.href = "#";
  edit.style.display = "flex";
  edit.style.gap = "10px";
  const image = document.createElement("img");
  image.src = "./assets/icons/Group.svg";
  edit.appendChild(image);
  const modifier = document.createElement("p");
  modifier.textContent = "modifier";
  edit.appendChild(modifier);
  title.appendChild(edit);
}

// change de vue sur la modale
function switchModal(showAdd) {
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
function initAddView() {
  const select      = document.getElementById("categorie");
  const fileInput   = document.getElementById("file");
  const background  = document.getElementById("background");
  const form        = document.getElementById("form-add");
  const errorMsg    = document.getElementById("error-message");
  const submitBtn   = document.getElementById("valider");


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
    errorMsg.style.display = "none";
    background.style.border = "none";
    submitBtn.style.backgroundColor = "#1d6154";

    const file = fileInput.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);

    const img = document.createElement("img");
    img.src = previewUrl;
    Object.assign(img.style, { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" });
    background.style.padding = "0";
    background.innerHTML = "";
    background.appendChild(img);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = fileInput.files?.[0];
    if (!file) {
      errorMsg.style.display = "block";
      background.style.border = "1px solid red";
      return;
    }

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
      data = await getWorks();
      displayProjects(data);
      switchModal(false);
    } catch (err) {
      console.error("Network/JS error:", err);
      alert("Erreur réseau");
    } finally {
      submitBtn.disabled = false;
    }
  });

  // (5) Retour vers le menu
  document.getElementById("back")?.addEventListener("click", () => switchModal(false), { once: true });
}

// configure la vue du menu
function initMenuView() {
  displayProjectsModal(data);

  const container = document.querySelector(".container-modal");
  container?.addEventListener("click", async (e) => {
    const bin = e.target.closest(".delete-img");
    if (!bin) return;

    const id = bin.dataset.id;
    try {
      await deleteWork(id);
      document.getElementById(`image-wrapper${id}`)?.remove();
      data = await getWorks();
      displayProjects(data);
    } catch (err) {
      console.error("Suppression échouée :", err);
    }
  });

  document.getElementById("ajout")?.addEventListener("click", () => switchModal(true));
}

// montre ou non la modale
async function showModal(show) {
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

// renvoie si un utilisateur est connecté ou non
function isConnected() {
  if (localStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
}

// affiche les filtres
function displayFilters(data, categories) {
  // configuration du filtre "tous"
  const filters = document.querySelector(".filters");
  const tous = document.createElement("button");
  tous.classList.add("filter-btn");
  tous.textContent = "Tous";
  tous.classList.add("active");
  tous.id = "Tous";
  filters.appendChild(tous);

  // listener du filtre "tous"
  tous.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((value) => value.classList.remove("active"));
    filter(data);
  });

  // configuration des autres filtres provenant de la base de données
  categories.forEach((value) => {
    const btn = document.createElement("button");
    btn.classList.add("filter-btn");
    btn.textContent = value;
    btn.id = value;
    filters.appendChild(btn);

    //listener de chaque filtre
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((value) => value.classList.remove("active"));
      filter(data, value);
    });
  });
}

// filtre les projets par catégorie et change le focus bouton
function filter(data, category) {
  if (category) {
    const dataFilter = data.filter((item) => item.category.name === category);
    displayProjects(dataFilter);
    document.getElementById(category).classList.add("active");
  } else {
    displayProjects(data);
    document.getElementById("Tous").classList.add("active");
  }
}

// affiche les projets à partir d'une liste
function displayProjects(data) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  if (!data) return;

  data.forEach((project) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.alt = project.title;

    const caption = document.createElement("figcaption");
    caption.textContent = project.title;

    figure.append(image, caption);
    gallery.appendChild(figure);
  });
}

function displayProjectsModal(data) {
  const containerModal = document.querySelector(".container-modal");
  containerModal.innerHTML = "";

  if (!data) return;

  data.forEach((project) => {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("image-wrapper");
    imgWrapper.id = `image-wrapper${project.id}`;

    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.alt = project.title;

    const bin = document.createElement("img");
    bin.src = "./assets/icons/bin.svg";
    bin.classList.add("delete-img");
    bin.dataset.id = project.id;

    imgWrapper.append(bin, image);
    containerModal.appendChild(imgWrapper);
  });
}
