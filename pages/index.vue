<template>
  <div class="container" id="Exercises">
    <div class="banner search-banner">
      Une initiative créée par l'UCLouvain
    </div>

    <div class="wrapper">

      <div class="content">
        <h1>Source Code</h1>
        <blockquote>
          la nouvelle bibliothèque open source d’exercices informatiques
        </blockquote>

        <h2 class="title--secondary-color">Le but de la plateforme</h2>

        <p>
          A l’instar des projets open source, <i>Source Code</i> offre la possibilité à un public varié de collaborer ensemble sur la problématique des exercices en informatique. Celle ci consistant en la volonté de référencer des ressources informatiques, tout en profitant de la contribution des autres sur cette même plateforme.
        </p>

        <blockquote>
          À mesure que la bibliothèque s’étoffera, cette dernière deviendra une grande source d’inspiration.
        </blockquote>

      </div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
  @import "./../assets/css/_function";
  @import "./../assets/css/_variables";
  @import "./../assets/css/_font";

  #Exercises {

    .content {
      background-color:white;
      border-radius: 4px;
      @include box-shadow($SHADOW);
      padding:20px;
      p {
        max-width: 850px;
      }

      blockquote {
        font-style:italic;
        position: relative;
        margin-left: 20px;
        margin-top:30px;
        font-family: $CircularStd;

        &:before {
          content:"";
          position: absolute;
          left: -20px;
          width: 5px;
          background-color: $TERNARY_COLOR;
          height: 100%;
        }
      }

      h2 {
        margin-top:40px;
      }
    }

  }

</style>
