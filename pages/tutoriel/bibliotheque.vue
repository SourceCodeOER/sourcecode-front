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
        <li><nuxt-link to="#Tutorial_preview-exercise">Informations sur la preview d'une ressource</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_panel_library">Le panneau à onglets</nuxt-link></li>
      </ol>

      <h2 id="Tutorial_preview-exercise" class="title--secondary-color">
        Informations sur la preview d'une ressource
      </h2>

      <p>
        La section de droite représente tous les exercices correspondants à vos critères de
        recherche. Il vous suffit de scroller dans cette section afin de charger les exercices suivants.
      </p>

      <img class="extra-large" src="/img/tutorial/preview-exercise.png" alt="Preview d'une ressource">

      <p>
        La preview d'une ressource contient les informations suivantes :
      </p>

      <ul>
            <li>Le titre de la ressource</li>
        <li>
          Quelques mots clés pour mieux identifier le type de ressource (<b>si présents</b> sur la ressource) :
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
              lorsque'aucun vote n'a été effectué, un tiret (-) grisé est affiché. Nous donnons une grande importance
              au feedback de la communauté ! En évaluant ces ressources, vous contribuez ainsi à maintenir une
              plateforme ayant du contenu de qualité.
            </li>
          </ul>
        </li>
      </ul>

      <h2 id="Tutorial_panel_library" class="title--secondary-color">Le panneau à onglets</h2>

      <blockquote>
        Le panneau à onglets vous permet d'interagir avec votre interface pour charger les <em>ressources informatiques</em>.
      </blockquote>

      <p>
        Il existe dès lors 3 onglets :
      </p>

      <ul>
        <li><nuxt-link :to="{hash: '#Tutorial_filters'}">Filtres</nuxt-link></li>
        <li><nuxt-link :to="{hash: '#Tutorial_historical'}">Historique</nuxt-link></li>
        <li><nuxt-link :to="{hash: '#Tutorial_favorite'}">Favoris</nuxt-link> (<b>seulement</b> lorsque vous êtes connectés !)</li>
      </ul>

      <p><b>Pour réinitialiser votre recherche</b>, cliquez sur "réinitialiser la recherche" juste en dessous du titre
        "Résultats de recherche".
      </p>

      <h3 class="title--ternary-color" id="Tutorial_filters">Filtres</h3>
      <p>
        <i>Les filtres</i> vous permettent d'affiner votre recherche de <em>ressources informatiques</em>.
        Les tags que vous cochez apparaitront juste au dessus des résultats. <b>Si vous voulez retirer un de vos choix</b>,
        il suffit de décocher un des tags en question ou de cliquer sur la croix du label représentant le tag
        que vous avez sélectionné.
      </p>

      <p>Vous pouvez réinitialiser votre recherche en cliquant sur la petite flèche présente dans le coin supérieur
        droit du panneau filtres
      </p>

      <img src="/img/tutorial/panneau-a-onglet-bibliotheque-filtres.png" class="extra-large" alt="">

      <p>
        <b>Vous pouvez choisir plusieurs tags dans une même catégorie</b>. Dans ce cas, la recherche vous donnera des
        résultats comprenant au moins un des tags que vous avez sélectionné.
      </p>

      <p>
        <b>Lorsque vous sélectionnez un tag dans deux catégories différentes</b>, la recherche prendra en compte
        tous les exercices comprenant au moins un tag sélectionné dans chacune des catégories.
      </p>

      <div class="img-wrapper">

        <img src="/img/tutorial/panneau-a-onglet-bibliotheque-filtres-favoris.png" class="small" alt="">

        <div class="content">
        <p><b>Si vous possédez un compte</b>, vous pouvez enregistrer votre sélection actuelle en cliquant
          sur <b><i>"Ajouter aux favoris"</i></b>. Le texte sera alors remplacé par une <i>entrée texte</i>
          où vous pourrez fournir le nom de votre favori. Cliquez sur "Ok" lorsque vous êtes satisfait.
          Votre nouveau favori apparaitra désormais dans <nuxt-link to="/">l'onglet favori</nuxt-link> !
        </p>

        </div>
      </div>



      <h3 class="title--ternary-color" id="Tutorial_historical">Historique</h3>

      <p>
        <i>L'historique</i> vous permet de naviguer à travers les recherches que vous avez précedemment effectuées.
        Il restera disponible tout au long de votre session, après quoi il sera réinitialisé.
      </p>

      <blockquote>
        L'historique est utile pour revenir dans vos précedentes recherches, mais vous pouvez sauvegarder
        votre sélection avec les favoris !
      </blockquote>

      <img src="/img/tutorial/panneau-a-onglet-bibliotheque-historique.png" class="extra-large" alt="">

      <p>
        <i>L'historique</i> <b>affiche vos recherches de la plus récente à la plus ancienne</b>. Le titre de votre recherche
        s'affichera en <i>bleu</i> tandis que les tags que vous avez sélectionnés seront affichés en mode "pêle-mêle",
        séparés par une <i>barre verticale (|)</i>.
      </p>

      <h3 class="title--ternary-color" id="Tutorial_favorite">Favoris</h3>

      <blockquote>Cet onglet est seulement disponible lorsque vous possédez un
        <nuxt-link to="comptes-et-utilisateurs">compte</nuxt-link> et que vous êtes connectés.
      </blockquote>

      <p>
        Vos favoris précédemment créés apparaitront dans ce panneau.
        Pour utiliser un de vos favoris, il suffit de cliquer sur un d'eux et la recherche s'actualisera
        depuis la même page.
      </p>

      <img src="/img/tutorial/panneau-a-onglet-bibliotheque-favoris.png" class="extra-large" alt="">

      <p>
        Vous pouvez supprimer ou modifier vos favoris depuis ce panneau en passant votre souri sur un favori,
        puis en sélectionnant un des deux icônes qui se présentent à vous.
      </p>

      <ul>
        <li>Le crayon vous permet de modifier le favori. Il vous mènera donc sur la page de modification de ce favori.</li>
        <li>Le poubelle vous permet de supprimer votre favori directement depuis le panneau.</li>
      </ul>

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
