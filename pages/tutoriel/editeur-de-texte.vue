<template>
  <section>
    <h1>Editeur de texte</h1>
    <div class="exercise-article">
      <p>Nous allons parcourir les différentes options disponibles pour éditer la description.</p>

      <h2 class="title--secondary-color">Table des matières</h2>

      <ol>
        <li><nuxt-link to="#Tutorial_style">Styles de base</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_structure">Structurer le texte</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_list">Utiliser des listes</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_code">Formatter du code</nuxt-link></li>
        <li><nuxt-link to="#Tutorial_undo">Undo/redo</nuxt-link></li>
      </ol>

      <h2 class="title--secondary-color" id="Tutorial_style">Styles de base</h2>

      <img src="/img/tutorial/style-de-base.png" class="large" alt="">

      <p>
        Basiquement, <i><b>le premier bloc</b></i> de boutons sert à mettre en <b>gras</b>, <i>italique</i>, <s>barré</s>,
        <u>souligné</u> le texte. Vous pouvez sélectionner la partie de texte que vous souhaitez modifier pour ensuite
        cliquer sur le bouton correspondant au style demandé.
      </p>

      <h2 class="title--secondary-color" id="Tutorial_structure">Structurer le texte</h2>

      <img src="/img/tutorial/structure-de-base.png" class="large" alt="">

      <p>
        <i><b>Le deuxième bloc</b></i> de boutons permet de structurer le texte en y ajoutant (dans l'ordre) <b>paragraphe</b>,
        <b>citation</b> et <b>séparateur horizontal</b>. À noter que lorsque vous utiliser la <b>citation</b>,
        vous devez taper <b>deux fois sur la touche enter</b> pour sortir de ce mode.
      </p>

      <h2 class="title--secondary-color" id="Tutorial_list">Utiliser des listes</h2>

      <img src="/img/tutorial/listes.png" class="large" alt="">

      <p>
        <i><b>Le troisième bloc</b></i> de boutons permet d'interagir avec deux types de listes : à puces ou ordonnées.
        À noter que vous devez taper <b>deux fois sur la touche enter</b> pour quitter le mode liste.
      </p>

      <h2 class="title--secondary-color" id="Tutorial_code">Formatter du code</h2>

      <img src="/img/tutorial/code.png" class="large" alt="">

      <p>
        <i><b>L'avant-dernier bloc</b></i> de boutons permet de styliser du code. Le premier bouton crée un bloc
        de code. Pour insérer le code, <b>cliquez d'abord sur le bouton de création</b> de bloc de code et <b>collez ensuite
        votre code</b> dans la box.
        Il suffit d'insérer du code et l'éditeur reconnaitra automatiquement le langage pour appliquer la
        coloration syntaxique. Actuellement, le bloc de code reconnait : <i>javascript, css, java, python, cmake et
        c</i>. Pour quitter le mode bloc de code, <b>tapez sur shift + enter</b>.
        Le dernier bouton permet de mettre en évidence un mot en le soulignant.
      </p>

      <h2 class="title--secondary-color" id="Tutorial_undo">Undo/redo</h2>

      <p><i><b>Le dernier bloc</b></i> permet de revenir en arrière ou en avant.</p>

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
