const BASE_URL = "http://localhost:5678/api/";

// fonction asynchrone permettant la récupération des projets
export async function getWorks() {
  const data = await fetch(BASE_URL + "works").then((data) => data.json());
  return data;
}

// fonction asynchrone permettant la récupération des categories
export async function getCategories() {
  const data = await fetch(BASE_URL + "categories").then((data) => data.json());
  let dataNames = new Set(data.map((item) => item.name));
  return dataNames;
}

// fonction asynchrone permettant d'envoyer une requete post a l'api pour se connecter
export async function login(email, password) {
  const donnees = {
    email: email,
    password: password,
  };

  const response = await fetch(BASE_URL + "users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(donnees),
  });

  if (!response.ok) {
    throw new Error("Echec de la connnexion")
  }
  
  const data = await response.json();

  localStorage.setItem("token", data.token);
  return data;
}
