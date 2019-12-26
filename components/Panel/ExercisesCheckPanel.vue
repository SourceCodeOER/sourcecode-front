<template>
  <div id="ExercisesCheckPanel" class="panel scroll-bar--grey">
    <h3>{{title}}</h3>

    <div class="disclaimer" v-if="exercises.length === 0">
      Commencez par remplir <b>le titre</b> de votre exercice ou <b>ajoutez des tags</b> depuis le panneau Tags
    </div>

    <div class="panel-wrapper" v-else>

      <ul>
        <li v-for="exercise in exercises" :key="exercise.id">
          <h4>{{exercise.title}}</h4>
          <span><i>Nb de votes</i> : {{exercise.metrics.votes}}</span>
          <span><i>Moyenne</i> : {{exercise.metrics.avg_vote ? exercise.metrics.avg_vote : '-'}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {Exercise} from "~/types";

  @Component
  export default class ExercisesCheckPanel extends Vue {
    @Prop({type: String, default: "Exercices"}) title!: string;

    get exercises(): Exercise[] {
      return this.$accessor.search.exercises
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/_variables.scss";

  #ExercisesCheckPanel {
    padding: 20px 0;

    .disclaimer {
      padding: 0 20px;
      font-weight: lighter;
      font-style: italic;
      text-align: center;
      margin-top:80px;

      b{
        color:$TERNARY_COLOR;
      }
    }


    h3 {
      padding: 0 20px;
    }

    h4 {
      font-weight: bold;
      margin-bottom: 10px;
      margin-top: 0;

      &:after {
        content:"";
        display: block;
        width: 60px;
        height: 2px;
        margin-top: 10px;
        background-color: $TERNARY_COLOR;
      }
    }

    ul {
      list-style-type: none;
      padding: 0;

      li {
        border-bottom: 1px solid rgba($GREY, .1);
        padding: 10px 20px;

        span {
          display: block;
        }

        &:hover {
          background-color: rgba($GREY, .1);
        }

      }
    }
  }

</style>
