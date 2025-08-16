import { login } from "./api.js";

initView();

// initialise la vue du login et lance les listeners
function initView() {
  const form = document.getElementById("form-login");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await login(email.value, password.value);
      window.location.replace("index.html");
    } catch (e) {
      toogleError(true);
    }
  });

  email.addEventListener("keyup", () => {
    toogleError(false);
  });
  password.addEventListener("keyup", () => {
    toogleError(false);
  });
}

// affiche le message d'erreur ou le retire
function toogleError(validation) {
  const errorMessage = document.querySelector(".error");
  if (validation) {
    errorMessage.style.display = "block";
    email.style.border = "red 1px solid";
    password.style.border = "red 1px solid";
  } else {
    errorMessage.style.display = "none";
    email.style.border = "none";
    password.style.border = "none";
  }
}
