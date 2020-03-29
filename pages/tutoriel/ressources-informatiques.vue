<template>
  <section>
    <h1>Ressources informatiques</h1>
    <div class="exercise-article">
      <p>
        Les ressources informatiques sont le cœur de <b><i>Source Code</i></b>. Elles représentent toutes
        les contributions émises par la communauté. Vous pouvez les consulter depuis la
        <nuxt-link to="bibliotheque">bibliothèque</nuxt-link> en cliquant ensuite sur "voir l'exercice".
      </p>

      <p>Voici à quoi ressemble la structure d'une ressource informatique :</p>

      <img src="/img/tutorial/ressource-informatique.png" class="extra-large" alt="">

      <h2 class="title--secondary-color">Panneau de détails</h2>

      <p>
        Le <i>panneau latéral</i> contient tous les tags qui ont été ajoutés pour identifier la ressource. Plus il y en a, plus
        cette dernière sera favorablement référencée sur la plateforme.
      </p>

      <p>
        Dans la partie <i>sources</i>, vous pourrez télécharger un fichier zip si une archive a été déposée.
        De la même manière, le créateur peut aussi mettre à disposition un lien externe à <b>Source Code</b>.
      </p>

      <h2 class="title--secondary-color">Fiche de la ressource informatique</h2>

      <blockquote>
        Notre plateforme ne fait que référencer des ressources informatiques et des exercices.
        Vous ne pouvez donc pas résoudre directement depuis <b>Source Code</b> l'exercice !
      </blockquote>

      <p>
        Sur la fiche de la ressource, vous pouvez donner une note sur la qualité de la ressource sur 5 étoiles. Il suffit
        de cliquer sur une des étoiles pour donner votre score. (<b>seulement</b> si vous possédez un
        <nuxt-link to="comptes-et-utilisateurs">compte</nuxt-link>)
      </p>

      <p>
        Lorsque l'exercice vous appartient ou que vous êtes un administrateur, un bouton de modification
        apparait dans le coin supérieur droit de la fiche de la ressource. Cliquer sur le bouton vous mènera sur le
        formulaire de modification de la ressource.
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
