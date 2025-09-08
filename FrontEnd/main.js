import { getWorks } from "./api.js";
import { modal, categorie, getData, setData } from "./config.js";
import { showModal } from "./modal.js";

setData(await getWorks());
displayProjects(getData());
isConnected()

// affiche les éléments quand il n'y a aucun utilisateur connecté
function displayLogoutElements() {
  document.getElementById("login").textContent = "login";
  displayFilters(getData(), categorie);
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

  // ajout de la barre d'edit que j'ai oublié
  document.querySelector(".edit-bar").style.display = "flex"
  document.querySelector("header").style.marginTop = "100px"
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
    btn.textContent = value.name;
    btn.id = value.name;
    filters.appendChild(btn);

    //listener de chaque filtre
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((value) => value.classList.remove("active"));
      filter(data, value.name);
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
export function displayProjects(data) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  if (!data) return;

  data.forEach((project) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.style.maxHeight = "489px"
    image.alt = project.title;

    const caption = document.createElement("figcaption");
    caption.textContent = project.title;

    figure.append(image, caption);
    gallery.appendChild(figure);
  });
}

function isConnected() {
  if (localStorage.getItem("token")) {
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
}
