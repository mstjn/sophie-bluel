import { getWorks, getCategories } from "./api.js";

// récupération des données backend et affichage par défaut
const data = await getWorks();
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
function switchModal(statut) {
  if (statut) {
    modal.innerHTML = `<div class="card-modal">
<div class="nav-container">
        <a id="back"><img src="./assets/icons/arrow-left.svg" alt=""></a>
        <a class="close-modal"><img src="./assets/icons/close.svg" alt=""></a>
        </div><h2>Ajout photo</h2>
        <form id="form-add" action="">
          <div class="background">
            <img src="./assets/icons/photo.svg" alt="">
            <button id="button-add">+ Ajouter photo</button>
            <p>jpg, png : 4mo max</p>
          </div>
          <div style="display:flex; flex-direction:column; height:100%; gap:15px; margin-top:10px;">
          <label class="form-label" for="title">Titre</label>
          <input class="form-input" type="text" name="title" id="title">
        <label class="form-label" for="categorie">Catégorie</label>
          <select class="form-input" name="categorie" id="categorie"></select>
          </div>
          <div style="display:flex; flex-direction:column;align-items:center;">
          <hr>
          <button class="button-class" style="background-color:#A7A7A7;" type="submit">Valider</button>
          </div>
        </form>
      </div>`;
    document.getElementById("back").addEventListener("click", () => {
      switchModal(false);
    });
  } else {
    modal.innerHTML = `<div class="card-modal">
        <a class="close-modal" style="align-self: end;"><img src="./assets/icons/close.svg" alt=""></a>
        <h2>Galerie photo</h2>
        <div class="container-modal"></div>
        <hr style="width:70%;">
        <button class="button-class" id="ajout">Ajouter une photo</button>
      </div>`;
    displayProjectsModal(data);
    document.getElementById("ajout").addEventListener("click", () => {
      switchModal(true);
    });
  }
  document.querySelector(".card-modal").addEventListener("click", (e) => {
    e.stopPropagation();
  });
  document.querySelector(".close-modal").addEventListener("click", () => {
    showModal(false);
  });
}

// montre ou non la modale
function showModal(show) {
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
  // boucle sur les éléments backend
  if (data) {
    for (let i = 0; i < data.length; i++) {
      // délaration des composants
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      // assignation des éléments backend
      image.src = data[i].imageUrl;
      image.alt = data[i].title;
      figcaption.textContent = data[i].title;

      // placement des éléments
      gallery.appendChild(figure);
      figure.appendChild(image);
      figure.appendChild(figcaption);
    }
  }
}

function displayProjectsModal(data) {
  const containerModal = document.querySelector(".container-modal");
  containerModal.innerHTML = "";
  // boucle sur les éléments backend
  if (data) {
    for (let i = 0; i < data.length; i++) {
      // délaration des composants
      const img_wrapper = document.createElement("div");
      img_wrapper.classList.add("image-wrapper");
      const image = document.createElement("img");

      // assignation des éléments backend
      image.src = data[i].imageUrl;
      image.alt = data[i].title;

      // placement des éléments
      img_wrapper.appendChild(image);
      containerModal.appendChild(img_wrapper);
    }
  }
}
