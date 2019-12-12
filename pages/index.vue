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

        <h2 class="title--secondary-color">Un peu de contexte</h2>

        <p>
          La <i>programmation</i> est un domaine en pleine expansion. En effet, de plus en plus <b>d’institutions
          pédagogiques</b>
          intègrent une section informatique afin d’enseigner cette discipline. Au-delà de l’aspect théorique, la
          <i>programmation</i> se découvre aussi beaucoup par la pratique, ce pourquoi les chargés de cours constituent
          dans
          leur cursus <b>un catalogue d’exercices de programmation</b> pour que les élèves les résolvent.
        </p>

        <p>
          Créer des énoncés peut prendre plus ou moins de temps et bien souvent, nous ne faisons que réinventer la roue
          car il y a sûrement une autre personne qui aura déjà pensé cet exercice par le passé.
        </p>

        <p>De la même manière que les professeurs de mathématique ont accès à <b>une banque de données d’exercices</b>
          sur tout
          thème relatif à leur discipline, pourquoi ne pas proposer le même type de service dans le domaine de
          <i>l’informatique</i> ? C’est donc ici que démarre notre projet : <strong>Source Code</strong>.</p>


        <h2 class="title--secondary-color">Le but de la plateforme</h2>

        <p>
          À l’instar des <i>Open Educational Resources</i>, <strong>Source Code</strong> offre la possibilité à des
          équipes pédagogiques de collaborer sur la problématique de <b>création et de partage des exercices</b>. Cette
          dernière consiste à référencer des <b>ressources informatiques</b> , en permettant à un public varié de
          profiter de toutes contributions.
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
      background-color: white;
      border-radius: 4px;
      @include box-shadow($SHADOW);
      padding: 20px;

      p {
        max-width: 900px;
      }

      blockquote {
        font-style: italic;
        position: relative;
        margin-left: 20px;
        margin-top: 30px;
        font-family: $CircularStd;

        &:before {
          content: "";
          position: absolute;
          left: -20px;
          width: 5px;
          background-color: $TERNARY_COLOR;
          height: 100%;
        }
      }

      h2 {
        margin-top: 40px;
      }
    }

  }

</style>
