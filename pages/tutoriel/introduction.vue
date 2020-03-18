<template>
  <section>
    <h1>Introduction</h1>
    <div class="exercise-article">
      <p>Bienvenue dans l'espace dédié à l'utilisation de cette plateforme ! Vous trouverez ici toutes les informations
        nécessaires et/ou utiles afin de pouvoir profiter de la meilleure expérience utilisateur possible.</p>

      <p>
        Dans <em>le panneau latéral</em>, vous retrouverez toutes les <i>thématiques</i> abordées dans ce tutoriel.
      </p>

      <p>En voici un résumé :</p>

      <ol>
        <li>
          <nuxt-link to="comptes-et-utilisateurs">
            Comptes et utilisateurs
          </nuxt-link>
          <ul>
            <li>Quels sont les avantages d'un compte ?</li>
            <li>Comment se créer un compte ?</li>
            <li>Comment se connecter à son compte ?</li>
            <li>Les différents rôles d'utilisateur</li>
          </ul>
        </li>
        <li>
          <nuxt-link to="bibliotheque">
            Bibliothèque
          </nuxt-link>
          <ul>
            <li>Quel est le but de cette page ?</li>
            <li>Comprendre le système de recherche</li>
            <li>Guider sa recherche avec le panneau latéral</li>
          </ul>
        </li>
        <li>
          <nuxt-link to="panneau-a-onglets">
            Panneau à onglets
          </nuxt-link>
          <ul>
            <li>Filtres</li>
            <li>Historique</li>
            <li>Favoris</li>
            <li>Ressources similaires</li>
          </ul>
        </li>
        <li>
          <nuxt-link to="favoris">
            Favoris
          </nuxt-link>
          <ul>
            <li>L'intérêt des favoris</li>
            <li>Où peut-on les utiliser ?</li>
          </ul>
        </li>
      </ol>
    </div>
  </section>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";


  @Component({
    layout: 'tuto'
  })
  export default class extends Vue {
  }
</script>
