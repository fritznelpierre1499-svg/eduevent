# EduEvent — La plateforme des événements de votre campus

> **Projet de Fin de Session**  
> **Unité d'enseignement :** Développement Web Statique (HTML5, CSS3, JavaScript Vanilla)  
> **Établissement :** Faculté des Sciences et de Génie (FSG) — Université d'État d'Haïti (UEH)  
> **Niveau :** Licence 3 Informatique  
> **Campus :** Campus Henri Christophe de Limonade  
> **Année Académique :** 2025 - 2026

---

## Description du Projet

**EduEvent** est une application web moderne, interactive et entièrement responsive destinée à centraliser et promouvoir la vie universitaire du campus. La plateforme permet aux étudiants, enseignants et membres de l'administration de :

- Consulter le catalogue des événements (conférences, ateliers, compétitions sportives, activités culturelles).
- Filtrer et rechercher des événements en temps réel.
- Consulter la fiche détaillée d'un événement avec un compteur de places dynamiques.
- S'inscrire à un événement avec validation de formulaire en JavaScript.
- Consulter et gérer leurs billets d'inscription dans leur espace étudiant (enregistrés via `localStorage`).
- Annuler une réservation en un clic.
- Consulter la Foire Aux Questions (FAQ accordéon) et localiser le campus sur une carte interactive.

---

## Technologies Utilisées

- **HTML5 Sémantique :** Balisage accessible et conforme aux normes W3C (`<header>`, `<main>`, `<article>`, `<section>`, `<footer>`).
- **CSS3 Pur :**
  - Flexbox et CSS Grid Layout pour un design adaptable.
  - Variables CSS (`:root`) pour la gestion unifiée du thème graphique.
  - Transitions et animations `@keyframes` fluides (`css/animations.css`).
  - Media queries avancées pour un rendu responsive sur mobile, tablette et desktop (`css/responsive.css`).
- **JavaScript (Vanilla ES6+) :**
  - Manipulation du DOM sans dépendance ni framework externe.
  - Traitement synchrone des filtres de recherche et bascule de vue (Grille / Liste).
  - Persistance des données d'inscription dans le navigateur grâce à l'API `localStorage`.
- **Ressources Externe & Média :**
  - SVG Vectoriels Inline pour la fidélité des logos et réseaux sociaux.
  - Intégration Google Maps Embed (`<iframe>`) pointant sur le Campus Henri Christophe de Limonade.

---

## Arborescence Officielle du Projet

Le projet respecte strictement la structure de dossiers exigée par le cahier des charges :

EduEvent/
├── index.html # Page 1 : Accueil, Hero section, Événements à la une & Newsletter
├── evenements.html # Page 2 : Catalogue complet, Filtres dynamique & Mode Grille/Liste
├── detail.html # Page 3 : Fiche détaillée, Compteur de places & Formulaire de réservation
├── profil.html # Page 4 : Carte d'identité étudiant & Gestion des billets (localStorage)
├── a-propos.html # Page 5 : Présentation, Équipe, FAQ Accordéon & Carte Google Maps
├── README.md # Documentation officielle du projet
│
├── css/
│ ├── style.css # Feuilles de styles globales et variables CSS
│ ├── responsive.css # Règles adaptatives (Media Queries mobile/tablette)
│ └── animations.css # Keyframes et animations d'apparition
│
├── js/
│ ├── main.js # Navigation, newsletter, accordéon FAQ & formulaires globaux
│ ├── evenements.js # Filtres dynamique, barre de recherche & bascule Grille/Liste
│ ├── detail.js # Injection des infos, calcul de places & système d'inscription
│ └── profil.js # Chargement des réservations depuis LocalStorage & annulations
│
├── data/
│ └── evenements.json # Base de données JSON statique des événements du campus
│
└── images/
├── logo.png # Logo principal d'EduEvent
├── a-propos.png # Photo de profil du développeur
├── accueil.png # L'image d'accueil de reference
└── events/ # Illustrations des différents événements (atelier, conference, sport, etc.)
