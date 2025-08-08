import { getWorks, getCategories } from "./api.js";

// récupération des données backend et affichage par défaut
const data = await getWorks();
const categories = await getCategories();
displayProjects(data);
displayFilters(data, categories);

// vérifie si un utilisateur est connecté pour gérer l'affichage du bon bouton et pouvoir se déconnecter 
const authButton = document.getElementById("login")
if (localStorage.getItem("token")){
  authButton.textContent = 'logout'
} else {
  authButton.textContent = 'login'
}
authButton.addEventListener("click", () => {
  if (localStorage.getItem("token")){
    localStorage.removeItem("token")
  }
})

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
