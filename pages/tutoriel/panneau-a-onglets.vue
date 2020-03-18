<template>
  <section>
    <h1>Panneau à onglets</h1>
    <div class="exercise-article">
      <p>
        Dans cette section, nous allons parcourir en profondeur <i>le panneau à onglets</i>, présent sur pratiquement
        toutes les pages de la plateforme.
      </p>

      <h2 class="title--secondary-color">Table des matières</h2>

      <ol>
        <li>
          <nuxt-link :to="{hash: 'Tutorial_filter'}">
            Filtres
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{hash: 'Tutorial_filter'}">
            Historique
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{hash: 'Tutorial_filter'}">
            Favoris
          </nuxt-link>
        </li>

        <li>
          <nuxt-link :to="{hash: 'Tutorial_filter'}">
            Similarité de ressources
          </nuxt-link>
        </li>
      </ol>

      <h2 id="Tutorial_filter" class="title--secondary-color">Filtres</h2>
      <h2 id="Tutorial_historical" class="title--secondary-color">Historique</h2>
      <h2 id="Tutorial_favorites" class="title--secondary-color">Favoris</h2>
      <h2 id="Tutorial_similarity" class="title--secondary-color">Similiarité de ressources</h2>
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
