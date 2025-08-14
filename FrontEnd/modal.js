export const modalMenu =  `<div class="card-modal">
        <a class="close-modal" style="align-self: end;"><img src="./assets/icons/close.svg" alt=""></a>
        <h2>Galerie photo</h2>
        <div class="container-modal"></div>
        <hr style="width:70%;">
        <button class="button-class" id="ajout">Ajouter une photo</button>
      </div>`
export const modalAdd = `<div class="card-modal">
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
      </div>`