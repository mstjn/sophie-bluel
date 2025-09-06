import { getCategories } from "./api.js";

export const BASE_URL = "http://localhost:5678/api/";
export const token = localStorage.getItem("token");
export const categorie = await getCategories();
export const modal = document.querySelector(".modal");

let data = []

export function getData(){
  return data
}
export function setData(newData) {
  data = newData
}

