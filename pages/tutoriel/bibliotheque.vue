<template>
  <section>
    <h1>Bibliothèque</h1>
    <div class="exercise-article">
      <p>
        la
        <nuxt-link class="external-link" to="/exercices">page bibliothèque</nuxt-link>
        contient toutes les <em>ressources informatiques</em> ayant été validées par les
        <nuxt-link to="/">modérateurs</nuxt-link>
        de la plateforme. Dans cette section, nous allons donc parcourir tout ce qui concerne la recherche.
      </p>

      <h2 class="title--secondary-color">Table des matières</h2>

      <ol>
        <li>
          <nuxt-link :to="{hash: 'Tutorial_preview'}">
            Informations sur la preview d'une ressource
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{hash: 'Tutorial_panel_library'}">
            Le panneau à onglets
          </nuxt-link>
        </li>
      </ol>

      <h2 id="Tutorial_preview-exercise" class="title--secondary-color">
        Informations sur la preview d'une ressource
      </h2>

      <p>
        La section de droite représente tous les exercices correspondants à vos critères de
        recherche. Il vous suffit de scroller dans cette section afin de charger les exercices suivants.
      </p>

      <img class="extra-large" src="" alt="Preview d'une ressource">

      <p>
        La preview d'une ressource contient les informations suivantes :
      </p>

      <ul>
            <li>Le titre de la ressource</li>
        <li>
          Quelques mots clés pour mieux identifier le type de ressource :
          <ul>
            <li>Le cours</li>
            <li>Le langage</li>
            <li>La difficulté</li>
            <li>La thématique</li>
            <li>Le type d'exercice</li>
          </ul>
        </li>
        <li>La cotation de la ressource (sur <em>5</em>)
          <ul>
            <li>
              Le nombre 0 est grisé lorsqu'aucun vote a été effectué. Nous donnons une grande importance au feedback de
              la communauté ! Vous contribuez ainsi à maintenir une plateforme ayant du contenu de qualité.
            </li>
          </ul>
        </li>
      </ul>

      <h2 id="Tutorial_panel_library" class="title--secondary-color">Le panneau à onglets</h2>

      <p>
        Utilisez le <nuxt-link to="panneau-a-onglets">panneau à onglets</nuxt-link> pour naviguer à travers les
        <nuxt-link :to="{name: 'tutoriel-panneau-a-onglets', hash: '#Tutorial_filter'}">filtres</nuxt-link>,
        l'<nuxt-link :to="{name: 'tutoriel-panneau-a-onglets', hash: '#Tutorial_historical'}">historique</nuxt-link>
        ou vos <nuxt-link :to="{name: 'tutoriel-panneau-a-onglets', hash: '#Tutorial_favorites'}">favoris</nuxt-link>
        (<b>seulement</b> si vous êtes <nuxt-link to="comptes-et-utilisateurs">connectés</nuxt-link>)
      </p>
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
