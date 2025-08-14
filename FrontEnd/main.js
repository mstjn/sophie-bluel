import { getWorks, getCategories, deleteWork } from "./api.js";
import { modalAdd, modalMenu } from "./modal.js";

// récupération des données backend et affichage par défaut
let data = await getWorks();
const categories = await getCategories();
displayProjects(data);
const authButton = document.getElementById("login");
const modal = document.querySelector(".modal");
const edit = document.createElement("a");

// vérifie si un utilisateur est connecté et lance les listeners
if (isConnected()) {
  displayLoginElements();

  edit.addEventListener("click", () => {
    showModal(true);
  });
  modal.addEventListener("click", () => {
    showModal(false);
  });
  authButton.addEventListener("click", () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
  });
} else {
  displayLogoutElements();
}

// affiche les éléments quand il n'y a aucun utilisateur connecté
function displayLogoutElements() {
  authButton.textContent = "login";
  displayFilters(data, categories);
}

// affiche les éléments quand il y a un utilisateur connecté
function displayLoginElements() {
  authButton.textContent = "logout";
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
  document.querySelector(".card-modal")?.addEventListener("click", (e) => e.stopPropagation());
  document.querySelector(".close-modal")?.addEventListener("click", () => showModal(false));

  if (showAdd) {
    document.getElementById("back")?.addEventListener("click", () => switchModal(false));
    return;
  }

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
      displayProjects(data)
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
