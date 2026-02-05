//#region Variables Globales
let CarteRetourne = []
let bloquage = false;
let tentatives = 0;
let seconde = 0;
let interval;
let jeuLance = false;
let victoire = document.getElementById("victoire");
let totalPokemon = 0
//#endregion

//#region Fonctions de Temps
/**
 * Lance le chronomètre au premier clic si le jeu n'est pas déjà lancé.
 */
function demarrerTimer(){
 if (jeuLance) return;
 jeuLance = true;
 interval = setInterval(() => {
  seconde++;
  document.querySelector("#timer").textContent = `${seconde}`;
 }, 1000);
}

/**
 * Vérifie si la condition de victoire est remplie pour stopper le timer.
 */
function arreterTimer(){
 const cartesTrouvees = document.querySelectorAll(".estRetourne").length; // queryselector ne fonctionne pas ici, il faut all
 if (cartesTrouvees === 16) {
  clearInterval(interval);
  victoire.textContent = `Bravo ! Tu as gagné en ${seconde} s et ${tentatives} tentatives! Tente un nouveau record !`;
  const recommencer = document.createElement("button");
  recommencer.classList.add("recommencer");
  recommencer.textContent = "Recommencer";
  victoire.appendChild(recommencer);
  recommencer.addEventListener("click", () => {location.reload();});
 }
}
//#endregion

//#region Préparation et API
/**
 * Récupère le nombre total de Pokémon via l'API.
 */
async function majNombre() {
 const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/');
 const data = await response.json();

 totalPokemon = data.count;
 console.log(`${totalPokemon}`);
}

/**
 * Gère la sélection aléatoire, l'appel API et le mélange des cartes.
 * @returns {Promise<Array>} Le tableau de cartes prêt pour l'affichage.
 */
async function preparationJeu() {
 try {
  //compter les id dans la db
  await majNombre()
  //preparation des cartes (nouveau)
  const superAleatoire = [];
  //boucle, tant que pas 8 continuer si je veux plus ou moins de cartes c'est ici et plus dans l'url du fetch
  while (superAleatoire.length < 8) {
   let id = Math.floor(Math.random() * totalPokemon + 1); //+1 car sinon avec floor on perd une position.
   if(!superAleatoire.includes(id)) {
    superAleatoire.push(id); // verifier que ça n'existe pas deja et ajouter
   }
  }
  const promesses = superAleatoire.map(id => fetch (`https://pokeapi.co/api/v2/pokemon/${id}`) //id ici pour 8 appelles en même temps en quelque sorte
    .then(res => res.json()));
  const pokemons = await Promise.all(promesses); //comme pour l'autre version

  //"DTO"
  const CartesBase = pokemons.map(p => ({
   nom: p.name,
   image: p.sprites.front_default
  })); //<<<-- saloperie de parentheses

  // double cartes, je remplis CartesJeu avec 2x le meme tab. Merci mdn parceque [CartesBase, CartesBase] ça marche pas
  let cartesJeu = [...CartesBase, ...CartesBase];


  //mélange des cartes, utilisation d'un algo tout fait du net : Fisher-Yates.
  //si je comprends bien il prend une carte dans i et la met au hasard dans J en partant de la derniere ensuite permute les tabs (destructuring comme c'est appelé) a se pencher dessus.
  for (let i = cartesJeu.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [cartesJeu[i], cartesJeu[j]] = [cartesJeu[j], cartesJeu[i]];
  }

  //console.log(cartesJeu);

  return cartesJeu;
 } catch (error) {
  console.log("erreur de création du jeu :", error)
 }
}
//#endregion

//#region Affichage
/**
 * Crée les éléments HTML pour chaque carte et les injecte dans le plateau.
 * @param {Array} cartes - Liste des Pokémon mélangés.
 */
function AfficherCartes(cartes) {
 const plateau = document.querySelector("#plateau");
 plateau.textContent = "";

 cartes.forEach(pok => {
  const carte = document.createElement("div");
  carte.classList.add("carte");
  carte.dataset.name = pok.nom /*.dataset pour stocker les noms dans une variable et les comparer ensuite.
                                  (Plus simple, remplace [if (carteA.querySelector('img').src === carteB.querySelector('img').src) etc..] astuce : Gemini.*/

  const image = document.createElement("img");
  image.src = pok.image;
  image.alt = pok.nom;
  image.classList.add("pokImg");

  carte.appendChild(image); //image dans la carte
  plateau.appendChild(carte); //cartes sur le plateau

  carte.addEventListener("click", retourner); //<- lui il m'a fait chier, attention, pas en dehors.......
 });
}
//#endregion

//#region Logique du Jeu
/**
 * Gère l'événement de clic pour retourner une carte.
 */
function retourner() {
 if (bloquage) return;
 if (this === CarteRetourne[0]) return; //this = qui vient d'etre cliquee dans ce cas. MDN
 demarrerTimer();

 this.classList.add("estRetourne"); //dom blabla
 CarteRetourne.push(this); // ajout de la carte dans carteRetourne[]

 //console.log(this.dataset.name);

 if (CarteRetourne.length === 2){
  tentatives++;
  document.querySelector("#essais").textContent = tentatives;
  verifPaire();
 }
}

/**
 * Vérifie si les deux cartes retournées ont le même dataset.name.
 */
function verifPaire() {
 let estPareil = CarteRetourne[0].dataset.name === CarteRetourne[1].dataset.name // je verifie si la carte dans [0] est pareil que [1] retourne true.

 //console.log("Verif paire:", estPareil ? "ok" : "nok")

 estPareil ? desactiverCartes() : cacherCartes();
}

/**
 * Maintient les cartes visibles et retire l'écouteur de clic.
 */
function desactiverCartes() {
 CarteRetourne[0].removeEventListener("click", retourner);
 CarteRetourne[1].removeEventListener("click", retourner);

 CarteRetourne = []; //clean tab
 arreterTimer();
}

/**
 * Retourne les cartes face cachée après un délai si elles ne sont pas identiques.
 */
function cacherCartes() {
 bloquage = true;

 setTimeout(() => {
  CarteRetourne[0].classList.remove("estRetourne");
  CarteRetourne[1].classList.remove("estRetourne");

  CarteRetourne = []; // clean du tab
  bloquage = false;
 }, 1000); // 1.5 seconde t'attente
}
//#endregion

//#region Execution
// je prends le return "en attente"(promesse) de preparationJeu et la fonction pour afficher les cartes et magiiiie :) trop bien.
preparationJeu().then(cartesJeu => {
 if (cartesJeu) {
  AfficherCartes(cartesJeu);
 }
})
//#endregion