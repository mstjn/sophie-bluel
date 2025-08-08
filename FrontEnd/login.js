import { loginFromApi } from "./api.js";

// déclaration des composants du formulaire
const form = document.getElementById("form-login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const errorMessage = document.querySelector(".error");


// listener du formulaire de connexion
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await loginFromApi(email.value, password.value);
    window.location.replace("index.html");
  } catch (e) {
    toogleError(true);
  }
});

// retire le message d'erreur si on est en train d'écrire
email.addEventListener("keyup", () => {
  toogleError(false);
});
password.addEventListener("keyup", () => {
  toogleError(false);
});

// affiche le message d'erreur ou le retire
function toogleError(validation) {
  if (validation) {
    errorMessage.style.display = "block";
  } else {
    errorMessage.style.display = "none";
  }
}
