<template>
  <section>
    <h1>Favoris</h1>
    <div class="exercise-article">
      <p>
        <i>Les favoris</i> vous permettent <b>d'enregistrer vos critères de recherche</b> (titre de recherche et
        filtres) pour pouvoir les réutiliser par après, sans devoir parcourir le panneau de filtres pour effectuer
        la même recherche. Vous pouvez uniquement utiliser les favoris si vous possédez un
        <nuxt-link to="comptes-et-utilisateurs">compte</nuxt-link> !
      </p>

      <p>
        Pour consulter vos favoris, rendez-vous sur cette
        <nuxt-link class="external-link" to="/gestion/mes-favoris">page</nuxt-link>.
      </p>

      <h2 class="title--secondary-color">Table des matières</h2>

      <ol>
        <li><nuxt-link to="#Tutorial_favorite_home">Accueil de gestion des favoris</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_favorite_form">Formulaire de création/modification d'un favori</nuxt-link></li>
      </ol>

      <h2 class="title--secondary-color" id="Tutorial_favorite_home">Accueil de gestion des favoris</h2>

      <p>Vous pouvez gérer vos favoris en passant votre souri sur un de vos favoris. Deux icônes apparaitront, le
        crayon permettant de modifier le favori et la poubelle permettant de le supprimer. À noter que
        la modification vous renverra sur le formulaire de modification du favori.
      </p>
      <img src="/img/tutorial/accueil-favoris.png" class="extra-large" alt="">

      <h2 class="title--secondary-color" id="Tutorial_favorite_form">Formulaire de création/modification d'un favori</h2>

      <p>
        Voici les différents champs à remplir :
      </p>

      <ul>
        <li>
          Nom du favori (<b>obligatoire</b>) : Donner un nom au favori.
        </li>

        <li>
          Titre de la sélection : titre de recherche.
        </li>

        <li>
          Tags (<b>obligatoire</b>) : les tags qui vont être appliqués pour votre recherche.
          <b>Pour ajouter des tags</b>, cliquez sur l'onglet avec l'icône de filtre dans le panneau à onglets.
        </li>
      </ul>

      <p>Un <i>code couleur</i> vous est présenté pour vous tenir au courant du <b>status des tags</b>.</p>

      <ul>
        <li>Un tag <b>valide</b> pourra être utilisé depuis la bibliothèque pour filtrer les ressources informatiques.
          Ceci garanti un meilleur référencement pour la ressource.</li>
        <li>Un tag obsolète risque d'être remplacé par un autre tag ou d'être supprimé ultérieurement.</li>
        <li>Un tag en attente n'a pas encore passé la validation d'un administrateur.</li>
        <li>Un tag non valide n'a pas été accepté l'administration. Il se peut qu'il soit modifié ultérieurement.</li>
      </ul>

      <img src="/img/tutorial/gestion-favoris.png" class="extra-large" alt="">

      <div class="img-wrapper">
        <img src="/img/tutorial/favoris-exercices.png" class="small" alt="">

        <div class="content">
          <p>
            Lorsque vous cliquez sur <b>l'onglet "exercices"</b>, vous aurez accès à toutes les ressources informatiques
            correspondant à votre recherche.
          </p>

          <p>Vous pouvez consulter la ressource en passant votre souri sur un des éléments et en cliquant sur "voir".</p>
        </div>
      </div>
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
