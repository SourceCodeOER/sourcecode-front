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
        </li>
        <li>
          <nuxt-link to="bibliotheque">
            Bibliothèque
          </nuxt-link>
          <ul>
            <li><nuxt-link to="bibliotheque#Tutorial_preview-exercise">Informations sur la preview d'une ressource</nuxt-link></li>
            <li><nuxt-link to="bibliotheque#Tutorial_panel_library">Le panneau à onglets</nuxt-link></li>
          </ul>
        </li>
        <li><nuxt-link to="ressources-informatiques">Ressources informatiques</nuxt-link></li>
        <li>
          <nuxt-link to="favoris">
            Favoris
          </nuxt-link>
          <ul>
            <li><nuxt-link to="favoris#Tutorial_favorite_home">Accueil de gestion des favoris</nuxt-link></li>
            <li><nuxt-link to="favoris#Tutorial_favorite_form">Formulaire de création/modification d'un favori</nuxt-link></li>
          </ul>
        </li>
        <li>
          <nuxt-link to="mes-exercices">
            Mes exercices
          </nuxt-link>
          <ul>
            <li><nuxt-link to="mes-exercices#Tutorial_gestion_ressources">Gestion des ressources</nuxt-link></li>
            <li><nuxt-link to="mes-exercices#Tutorial_status">Status d'une ressource informatique</nuxt-link></li>
            <li><nuxt-link to="mes-exercices#Tutorial_gestion_status">Gestion du status de la ressource</nuxt-link></li>
            <li><nuxt-link to="mes-exercices#Tutorial_ressource_form">Création/modification d'une ressource</nuxt-link></li>
            <li><nuxt-link to="mes-exercices#Tutorial_submission">Soumission</nuxt-link></li>
          </ul>
        </li>
        <li>
          <nuxt-link to="editeur-de-texte">
            Editeur de texte
          </nuxt-link>
          <ul>
            <li><nuxt-link to="editeur-de-texte#Tutorial_style">Styles de base</nuxt-link></li>
            <li><nuxt-link to="editeur-de-texte#Tutorial_structure">Structurer le texte</nuxt-link></li>
            <li><nuxt-link to="editeur-de-texte#Tutorial_list">Utiliser des listes</nuxt-link></li>
            <li><nuxt-link to="editeur-de-texte#Tutorial_code">Formatter du code</nuxt-link></li>
            <li><nuxt-link to="editeur-de-texte#Tutorial_undo">Undo/redo</nuxt-link></li>
          </ul>
        </li>
        <li>
          <nuxt-link to="administration">
            Administration
          </nuxt-link>
          <ul>
            <li><nuxt-link to="administration#Tutorial_exercises">Gestion des exercices</nuxt-link></li>
            <li><nuxt-link to="administration#Tutorial_tags">Gestion des tags</nuxt-link></li>
            <li><nuxt-link to="administration#Tutorial_categories">Gestion des catégories</nuxt-link></li>
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
