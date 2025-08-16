import { BASE_URL, token } from "./config.js";

// fonction asynchrone permettant la récupération des projets
export async function getWorks() {
  const data = await fetch(BASE_URL + "works").then((data) => data.json());
  return data;
}

// fonction asynchrone permettant la récupération des categories
export async function getCategories() {
  const data = await fetch(BASE_URL + "categories").then((data) => data.json());
  return data;
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
    throw new Error("Echec de la connnexion");
  }

  const data = await response.json();

  localStorage.setItem("token", data.token);
  return data;
}

export async function deleteWork(id) {
  const response = await fetch(BASE_URL + "works/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export async function addProject(formData) {
  const response = await fetch(BASE_URL + "works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  return response
}
