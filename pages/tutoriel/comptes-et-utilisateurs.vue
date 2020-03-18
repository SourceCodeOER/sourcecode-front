<template>
  <section>
    <h1>Comptes et utilisateurs</h1>
    <div class="exercise-article">
      <p>
        La création d'un compte vous permet d'accéder à des fonctionnalités supplémentaires comme la création de
        <nuxt-link to="favoris">favoris</nuxt-link> ou de <em>ressources informatiques</em>. Pour vous connecter sur
        la plateforme, accédez au menu latéral et cliquez sur <nuxt-link class="external-link" to="/login">se connecter</nuxt-link>.
        Si vous ne possédez pas encore de compte, vous pouvez vous enregistrer en cliquant sur
        <nuxt-link class="external-link" to="/register">créer un compte</nuxt-link>.
      </p>
      <blockquote>
        Nous vous recommandons de lire attentivement nos <a class="external-link" href="/terms-of-use.pdf" target="_blank">conditions
        d'utilisation</a> afin de prendre connaissance de vos droits et de nos droits.
      </blockquote>

      <h2 class="title--secondary-color">Les rôles utilisateurs</h2>

      <h3 class="title--primary-color__light">Visiteur</h3>
      <p>
        C'est la forme la plus simple pour l'utilisation de la plateforme. Les droits de ce type d'utilisateur se
        limitent à la navigation dans la <nuxt-link to="bibliotheque">bibliothèque</nuxt-link> de
        <em>ressources informatiques</em>. Le système de <nuxt-link to="favoris">favoris</nuxt-link>
        n'est accessible qu'à partir du moment où vous êtes membre de la plateforme. Nous entendons par
        là l'<nuxt-link :to="{hash: 'Tutorial_SimpleUser'}">utilisateur</nuxt-link> ou
        l'<nuxt-link :to="{hash: 'Tutorial_Admin'}">administrateur</nuxt-link>.
      </p>
      <h3 id="Tutorial_SimpleUser" class="title--primary-color__light">Utilisateur</h3>

      <p>
        <i>L'utilisateur</i> est membre de l'application. Il possède donc un compte et peut participer au partage de
        <em>ressources informatiques</em> sur la plateforme. <i>L'utilisateur</i> a la possibilité de créer
        des <nuxt-link to="favoris">favoris</nuxt-link> qu'il pourra ainsi utiliser dans la
        <nuxt-link to="bibliotheque">bibliothèque</nuxt-link> ou depuis
        l'interface de <nuxt-link to="introduction">gestion d'exercices</nuxt-link>.
      </p>
      <h3 id="Tutorial_Admin" class="title--primary-color__light">Administrateur</h3>
      <p>
        <i>L'administrateur</i> est un rôle capital car lui seul permet de garantir du contenu de qualité.
        Il est chargé de valider les <em>ressources informatiques</em> soumises par les
        utilisateurs, de valider les tags et la créer de nouvelles catégories de tags.
        En plus de ces droits ci, <i>l'administrateur</i> possède bien évidement tous les droits
        de l'<nuxt-link :to="{hash: 'Tutorial_SimpleUser'}">utilisateur</nuxt-link> !
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
