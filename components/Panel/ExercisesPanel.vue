<template>
  <section id="ExercisesPanel" class="exercises-wrapper">
    <header>
      <h1>Résultats de recherche</h1>
      <hr>
    </header>

    <article v-for="i in 20" :key="i">
      <div class="rating">4,7</div>

      <div class="info-wrapper">
        <h2>Bitwise operation : high order bits</h2>
        <div class="tags">
          Facile | Java | QCM | Listes chainées
        </div>
      </div>

      <div class="cta-wrapper">
        <button class="button--light-blue-reverse">Voir l'exercice</button>
      </div>
    </article>
  </section>
</template>

<script>
    export default {
        name: "ExercisesPanel"
    }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";

  #ExercisesPanel {
    width: calc(100% - #{$FILTER_PANEL_WIDTH + $PADDING_CONTENT});
    margin-left: auto;

    header {
      margin-bottom: 30px;

      hr {
        border:0;
        border-top:1px solid rgba($GREY, .3);
      }
    }

    button {
      margin: 0;
      font-size: .625em;
    }

    article {
      display: grid;
      grid-template-areas: "rating main-info cta";
      grid-template-columns: 60px 1fr 200px;
      align-items: center;
      background-color: white;
      border-radius: 4px;
      @include box-shadow($SHADOW);
      min-height: 75px;
      margin-bottom: 10px;
      padding: 0 20px;


      .rating {
        grid-area: rating;
        font-family: $CircularStd;
        font-weight: bold;
        color: $SECONDARY_COLOR;
        font-size: 1.75em;
      }

      .tags {
        font-family: $Montserrat;
        font-weight: lighter;
        font-size: .75em;
        margin-top: 5px;
      }

      .info-wrapper {
        grid-area: main-info;
      }

      .cta-wrapper {
        grid-area: cta;
        text-align: right;
      }
    }
  }
</style>
