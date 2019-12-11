<template>
  <div class="container" id="Exercises">
    <div class="banner search-banner">
      Une initiative créée par l'UCLouvain
    </div>

    <div class="wrapper">

      <div class="content">
        <h1>Source Code</h1>
        <blockquote>
          le nouveau catalogue open source d’exercices informatiques
        </blockquote>

        <h2 class="title--secondary-color">Le but de la plateforme</h2>

        <p>
          À l’instar des <i>Open Educational Resources</i>, <strong>Source Code</strong> offre la possibilité à des équipes pédagogiques de collaborer sur la problématique de <b>création et de partage des exercices</b>. Cette dernière consiste à référencer des <b>ressources informatiques</b> , en permettant à un public varié de profiter de toutes contributions.
        </p>

        <blockquote>
          À mesure que le catalogue s’étoffera, ce dernier deviendra une ressource incontournable pour tous.
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
        max-width: 900px;
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
