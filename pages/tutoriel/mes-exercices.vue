<template>
  <section>
    <h1>Mes exercices</h1>
    <div class="exercise-article">
      <p>
        Lorsque vous possédez un <nuxt-link to="comptes-et-utilisateurs">compte</nuxt-link>, vous pouvez alors
        participer à la création de <nuxt-link to="ressources-informatiques">ressources informatiques</nuxt-link>.
        Afin de gérer vos exercices, rendez-vous sur la page
        <nuxt-link class="external-link" to="/gestion/mes-exercices">mes exercices</nuxt-link>.
      </p>

      <h2 class="title--secondary-color">Table des matières</h2>

      <ol>
        <li><nuxt-link to="#Tutorial_gestion_ressources">Gestion des ressources</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_status">Status d'une ressource informatique</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_gestion_status">Gestion du status de la ressource</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_ressource_form">Création/modification d'une ressource</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_submission">Soumission</nuxt-link></li>
      </ol>

      <h2 class="title--secondary-color" id="Tutorial_gestion_ressources">Gestion des ressources</h2>

      <p>
        La recherche fonctionne de la même manière que dans la <nuxt-link to="bibliotheque">bibliothèque</nuxt-link>,
        à la différence qu'elle est effectuée dans <b>vos</b> exercices seulement.
        Consultez la section du <nuxt-link to="bibliotheque#Tutorial_panel_library">panneau à onglets</nuxt-link>
        pour comprendre son fonctionnement.
      </p>

      <blockquote>
        Pour parcourir toutes vos ressources, scrollez dans le tableau. Arrivé en bas de celui-ci, l'application
        chargera les ressources suivantes (s'il en reste).
      </blockquote>

      <img src="/img/tutorial/accueil-mes-exercices.png" class="extra-large" alt="">

      <p>Plusieurs informations sont disponibles pour identifier les ressources informatiques :</p>

      <ul>
        <li>
          Le titre de la ressource
        </li>
        <li>
          Le nombre de votes émis par la communauté
        </li>
        <li>
          La moyenne (sur 5) des votes émis par la communauté
        </li>
        <li>
          La date de mise à jour de la ressource informatique
        </li>
        <li>
          La présence d'une archive zip pour la ressource informatique
        </li>
        <li>
          Le status de la ressource (voir cette section)
        </li>
      </ul>

      <h2 class="title--secondary-color" id="Tutorial_status">Status d'une ressource informatique</h2>

      <p>
        Voici les différents états que peuvent prendre la ressource informatique :
      </p>

      <ul class="list--with-img">
        <li>
          <Icon type="paper" theme="theme--primary-color-light"/>
          Brouillon
          <ul>
            <li>
              Signifie que la ressource n'est pas encore prête à être validée par l'administration.
              La ressource n'est donc pas disponible depuis la
              <nuxt-link to="bibliotheque">bibliothèque</nuxt-link>.
            </li>
          </ul>
        </li>
        <li>
          <Icon type="send" theme="theme--yellow"/>
          En attente de validation
          <ul>
            <li>
              La ressource est mise en attente pour révision.
              Un administrateur se chargera de la valider ultérieurement.
            </li>
          </ul>
        </li>
        <li>
          <Icon type="check" theme="theme--green"/>
          Valide
          <ul>
            <li>
              Lorsque la ressource est acceptée par l'administration, la ressource est alors validée et disponible
              publiquement dans la <nuxt-link to="bibliotheque">bibliothèque</nuxt-link>.
            </li>
          </ul>
        </li>
        <li>
          <Icon type="close" theme="theme--red-light"/>
          Invalide
          <ul>
            <li>
              Lorsque la ressource n'est pas considérée comme valide (mauvaise qualité d'écriture, doublons,
              incohérences), l'administrateur se réserve le droit d'invalider la ressource. Elle pourra néanmoins être
              modifiée pour la refaire passer en phase de révision.
            </li>
          </ul>
        </li>
        <li>
          <Icon type="archive" theme="theme--red-light"/>
          Archive
          <ul>
            <li>
              Quand une ressource est archivée, elle est alors uniquement accessible par les administrateurs et par
              son créateur.
            </li>
          </ul>
        </li>
      </ul>

      <h2 class="title--secondary-color" id="Tutorial_gestion_status">Gestion du status de la ressource</h2>
      <p>
        Pour modifier l'état d'une ressource, cochez une ou plusieurs ressources. Une liste déroulante d'actions
        apparaitra à côté du bouton de création d'exercice. Vous pourrez alors publier (envoyer pour révision),
        mettre en brouillon ou archiver la/les ressource(s) sélectionnée(s).
      </p>
      <img src="/img/tutorial/selection-mes-exercices.png" class="large" alt="">

      <h2 class="title--secondary-color" id="Tutorial_ressource_form">Création/modification d'une ressource</h2>

      <blockquote>Si vous recherchez des informations sur l'utilisation de <b>l'éditeur de texte</b> pour composer
        la description, reportez-vous <nuxt-link to="editeur-de-texte">ici</nuxt-link>.</blockquote>

      <p>
        La fiche d'une ressource informatique est composée des éléments suivants :
      </p>

      <ul>
        <li>
          Un titre (<b>obligatoire</b>)
        </li>
        <li>
          Une description (<b>obligatoire</b>)
        </li>
        <li>
          Des tags (<b>obligatoire</b>)
        </li>
        <li>
          Une archive zip en guise de fichier
        </li>
        <li>
          Un lien externe (url)
        </li>
      </ul>

      <img src="/img/tutorial/formulaire-exercice.png" class="extra-large" alt="">

      <div class="img-wrapper">
        <img src="/img/tutorial/panel-exercices.png" class="small" alt="">
        <div class="content">
          <p>
            Lorsque vous remplissez le champ <b>titre</b> et/ou ajoutez des <b>tags</b>,
            le <i>panneau à onglets</i> <b>"exercices"</b> affiche tous les exercices similaires (au sens strict) à la fiche
            que vous créez. Cela signifie que tous les exercices contenant le titre entré et <b>TOUS</b> les tags que vous
            avez référencés seront ainsi présents dans ce panneau.
          </p>

          <p>
            Vous pourrez donc consulter ces exercices en passant votre souri sur un d'eux et puis en cliquant sur
            "voir". Ceci ouvrira une autre page dans un nouvel onglet menant vers la
            <nuxt-link to="ressources-informatiques">ressource informatique</nuxt-link>.
          </p>
        </div>
      </div>

      <h3 class="title--ternary-color">Ajout de tags</h3>

      <p>
        Pour ajouter des tags sur la ressource informatique, cliquez sur le bouton <b>"commencez la sélection"</b> ou
        reportez-vous au <b>panneau à onglets</b> en cliquant sur l'onglet avec <b>l'icône de filtre</b>.
      </p>

      <p>Un <i>code couleur</i> vous est présenté pour vous tenir au courant du <b>status des tags</b>.</p>

      <ul>
        <li>Un tag <b>valide</b> pourra être utilisé depuis la bibliothèque pour filtrer les ressources informatiques.
         Ceci garantit un meilleur référencement pour la ressource.</li>
        <li>Un tag <b>obsolète</b> risque d'être remplacé par un autre tag ou d'être supprimé ultérieurement.</li>
        <li>Un tag <b>en attente</b> n'a pas encore passé la validation d'un administrateur.</li>
        <li>Un tag <b>non valide</b> n'a pas été accepté l'administration. Il se peut qu'il soit modifié ultérieurement.</li>
      </ul>

      <h2 class="title--secondary-color" id="Tutorial_submission">Soumission</h2>

      <p>
        Une fois que vous êtes satisfait des changements, deux options s'offrent à vous :
      </p>

      <ul>
        <li><b>Brouillon</b> : Vous estimez que votre ressource informatique n'est pas encore prête pour être validée,
          vous la laissez donc en stand-by pour la modifier plus tard. À noter que vous <b>DEVEZ</b> remplir les
          champs obligatoires pour l'enregistrer sous cet état.</li>
        <li>
          <b>Soumettre</b> : Vous estimez que votre ressource informatique est prête pour inspection. En cliquant sur
          soumettre, la ressource se met automatiquement en mode "en attente", jusqu'à ce qu'un administrateur
          la prenne en charge pour validation.
        </li>
      </ul>

      <p>Si vous possédez un compte <b>administrateur</b>, voici les options qui s'offrent à vous :</p>

      <ul>
        <li>
          <b>Invalider</b> : Vous estimez que votre ressource informatique n'est pas correcte car elle comporte des
          défauts, des incohérences ou est un dupliqué d'une autre ressource informatique.
        </li>
        <li>
          <b>Archiver</b> : Vous estimez que la ressource n'a plus d'utilité à demeurer dans la bibliothèque.
          En choisissant cette option, seul les administrateurs et le créateur de la ressource pourront
          consulter cette ressource dans le futur.
        </li>
        <li>
          <b>Mettre en attente</b> : Vous estimez que votre ressource informatique est prête pour inspection. En cliquant sur
          soumettre, la ressource se met automatiquement en mode "en attente", jusqu'à ce qu'un administrateur
          la prenne en charge pour validation.
        </li>
        <li><b>Brouillon</b> : Vous estimez que votre ressource informatique n'est pas encore prête pour être validée,
          vous la laissez donc en stand-by pour la modifier plus tard. À noter que vous <b>DEVEZ</b> remplir les
          champs obligatoires pour l'enregistrer sous cet état.
        </li>
        <li><b>Valider</b> : Vous estimez que votre ressource informatique est prête à apparaitre publiquement
          dans la bibliothèque.
        </li>
      </ul>
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
