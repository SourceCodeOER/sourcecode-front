<template>
  <section>
    <h1>Administration</h1>
    <div class="exercise-article">
      <p>
        <b>Source Code</b> ne serait rien sans son équipe d'administrateurs garantissant la maintenance de
        contenus qualitatifs. Dans cette section nous allons aborder les différentes interfaces qu'un administrateur
        pourra utiliser.
      </p>


      <h2 class="title--secondary-color">Table des matières</h2>

      <ol>
        <li><nuxt-link to="#Tutorial_exercises">Gestion des exercices</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_tags">Gestion des tags</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_categories">Gestion des catégories</nuxt-link></li>
      </ol>

      <h2 class="title--secondary-color" id="Tutorial_exercises">Gestion des exercices</h2>

      <p>
        <b>La gestion d'exercices</b> fonctionne exactement comme la gestion de ses propres exercices. Reportez-vous donc à la
        section <nuxt-link to="mes-exercices">mes exercices</nuxt-link> !
      </p>

      <img src="/img/tutorial/admin-exercises.png" class="extra-large" alt="">


      <p>
        En tant qu'administrateur, vous possédez néanmoins des fonctionnalités additionnelles.
        Laissez-nous vous les introduire.
      </p>

      <h3 class="title--ternary-color">Export des résultats de recherche</h3>

      <p>
        Lorsque vous filtrez les ressources informatiques par tags et/ou par titre de recherche, vous pouvez exporter
        tous les résultats correspondant à votre filtrage dans un fichier <i>JSON</i>.
      </p>

      <div class="img-wrapper">
        <img src="/img/tutorial/export.png" class="small" alt="">

        <div class="content">
          <p>
            Vous pouvez exporter les résultats de recherche en cliquant sur "exporter les résultats".
          </p>
        </div>
      </div>

      <h3 class="title--ternary-color">Actions supplémentaires dans "plus d'actions"</h3>

      <p>
        Par rapport un à utilisateur classique, vous pouvez changer l'état d'une ressource informatique comme bon
        vous semble (valide, non valide, en attente, archive, brouillon).
      </p>

      <p>
        Vous pouvez aussi exporter sous format JSON toutes les ressources cochées.
      </p>

      <h3 class="title--ternary-color">Champ supplémentaire dans le tableau des ressources</h3>

      <ul>
        <li>
          <b>Créateur</b> : le créateur de le la ressource informatique.
        </li>
      </ul>

      <h2 class="title--secondary-color" id="Tutorial_tags">Gestion des tags</h2>

      <p>
        Vous pouvez créer, modifier ou valider des tags depuis l'interface de gestion
        <nuxt-link to="/administration/tags" class="external-link">tags</nuxt-link>
      </p>

      <p>Utilisez le panneau latéral pour filtrer les tags par catégories ou par status. Vous pouvez aussi rechercher
        des tags en utilisant le champ de recherche.</p>

      <p>Plusieurs informations sont disponibles pour identifier les tags :</p>

      <ul>
        <li>
          Le <b>nom</b> du tag.
        </li>
        <li>
          La <b>catégorie</b> à laquelle il appartient.
        </li>
        <li>
          Le nombre de ressources informatiques utilisant ce tag (<b>exercices tagués</b>).
        </li>
        <li>
          Le nombre de fois que le tag a subi une modification (<b>version</b>).
        </li>
        <li>
          Le <b>status</b> du tag.
        </li>
      </ul>

      <img src="/img/tutorial/admin-tags.png" class="extra-large" alt="">

      <h3 class="title--ternary-color">Status des tags</h3>

      <ul class="list--with-img">
        <li>
          <Icon type="send" theme="theme--yellow"/>
          En attente de validation
          <ul>
            <li>
              Le tag est mis en attente pour révision.
              Un administrateur se chargera de le valider ultérieurement.
            </li>
          </ul>
        </li>
        <li>
          <Icon type="check" theme="theme--green"/>
          Valide
          <ul>
            <li>
              Lorsque le tag est accepté par l'administration, le tag est alors validé et disponible
              publiquement dans la <nuxt-link to="bibliotheque">bibliothèque</nuxt-link>.
            </li>
          </ul>
        </li>
        <li>
          <Icon type="close" theme="theme--red-light"/>
          Invalide
          <ul>
            <li>
              Lorsque le tag n'est pas considérée comme valide (faute de frappe, doublons,
              incohérences), l'administrateur se réserve le droit d'invalider le tag. Il pourra néanmoins être
              modifié (par un admin) pour le revalider plus tard.
            </li>
          </ul>
        </li>
        <li>
          <Icon type="archive" theme="theme--red-light"/>
          Obsolète
          <ul>
            <li>
              Quand un tag n'est plus d'utilité ou est remplacé par un autre.
            </li>
          </ul>
        </li>
      </ul>

      <h3 class="title--ternary-color">Création/modification de tags</h3>

      <p>La création de tag implique un <b>nom</b> et une <b>catégorie</b> à laquelle il appartient.</p>

      <img src="/img/tutorial/admin-tag-form.png" class="extra-large" alt="">


      <h2 class="title--secondary-color"  id="Tutorial_categories">Gestion des catégories</h2>

      <p>
        La gestion des catégories se limite uniquement à la modification du titre ou la création d'une nouvelle
        catégorie. La suppression est réservée au super-administrateur.
      </p>

      <img src="/img/tutorial/admin-category.png" class="extra-large" alt="">
    </div>
  </section>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import Icon from "~/components/Symbols/Icon.vue";


  @Component({
    components: {Icon},
    layout: 'tuto'
  })
  export default class extends Vue {
  }
</script>
