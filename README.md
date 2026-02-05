# 🃏 Memory Game - Pokémon Edition

Un jeu de Memory interactif utilisant l'API **PokéAPI** pour récupérer dynamiquement des images de Pokémon. Le but est de trouver toutes les paires en un minimum de temps et d'essais.

## 🚀 Fonctionnalités
- **Récupération dynamique** : Le jeu pioche 8 Pokémon au hasard parmi la base de données complète de PokéAPI.
- **Timer & Score** : Suivi en temps réel du temps écoulé et du nombre de tentatives.
- **Mélange robuste** : Utilisation de l'algorithme de Fisher-Yates pour garantir un mélange aléatoire parfait à chaque partie.
- **Responsive** : Conçu pour s'adapter aux différents écrans (via CSS non inclus dans ce document).

## 🛠️ Structure du Code
Le projet est organisé en plusieurs sections logiques :
1.  **Gestion des données (API)** : Récupération du nombre total de Pokémon et des données spécifiques (images, noms).
2.  **Mélange et Préparation** : Création du deck de 16 cartes (8 paires).
3.  **Logique de jeu** : Gestion du clic, comparaison des cartes et gestion du délai de retournement.
4.  **Interface (DOM)** : Création dynamique des éléments HTML.

## 📝 Documentation
> **Note :** La logique et les commentaires personnels dans le code ont été rédigés par le développeur principal. La documentation formelle des fonctions (format JSDoc) et l'organisation par régions ont été générées par **Gemini**.

### Fonctions principales
- `majNombre()`: Interroge l'API pour connaître le nombre actuel de Pokémon existants.
- `preparationJeu()`: Gère toute la séquence asynchrone pour préparer le plateau.
- `AfficherCartes(cartes)`: Injecte les cartes dans le DOM avec les événements nécessaires.
- `verifPaire()`: Compare les attributs `dataset.name` pour valider une paire.

## 🖥️ Installation
1. Clone le dépôt ou télécharge les fichiers.
2. Assure-toi d'avoir un fichier `index.html` avec les IDs suivants :
    - `#plateau` (pour les cartes)
    - `#timer` (pour le temps)
    - `#essais` (pour les tentatives)
    - `#victoire` (pour le message final)
3. Ouvre le fichier `index.html` dans ton navigateur.

Aussi online ici : https://www.devpassion.be/pokepair/

---
*Projet réalisé avec passion et un peu de combat contre les parenthèses.*
