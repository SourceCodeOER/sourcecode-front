<template>
  <div id="ExercisesCheckPanel" class="scroll-bar--grey">

    <div class="disclaimer" v-show="!searched">
      Commencez par remplir <b>le titre</b> de votre exercice ou <b>ajoutez des tags</b> depuis l'onglet tags
    </div>

    <div class="disclaimer" v-show="searched && exercises.length === 0">
      <slot></slot>
    </div>

    <div class="panel-wrapper" v-show="searched && exercises.length !== 0">
      <div class="results">{{nbResults}} résultat(s)</div>

      <ul>
        <li v-for="exercise in exercises" :key="exercise.id">
          <h4 class="title--primary-color__light">{{exercise.title}}</h4>
          <span><i>Nb de votes</i> : {{exercise.metrics.votes}}</span>
          <span><i>Moyenne</i> : {{exercise.metrics.avg_score ? exercise.metrics.avg_score : '-'}}</span>
          <a :href="`/exercices/${exercise.id}`" target="_blank" class="cta-link">
            Voir
            <Icon type="arrowRight" theme="theme--secondary-color"/>
          </a>
        </li>
      </ul>

      <div ref="anchor" id="Anchor"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Ref, Mixins} from "vue-property-decorator";
  import {Exercise} from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import IntersectMixins from "~/components/Mixins/IntersectMixins.vue";

  const ratio = .2;

  @Component({
    components: {Icon}
  })
  export default class ExercisesCheckPanel extends Mixins(IntersectMixins) {
    name = 'exercises-check-panel';

    /**
     * The default title of this panel
     */
    @Prop({type: String, default: "Exercices"}) title!: string;
    /**
     * The default icon of this panel (see Icon component)
     */
    @Prop({type: String, default: "album"}) icon!: string;

    /**
     * A reference to the anchor HTML element to use the intersector event
     */
    @Ref() anchor!: Element;

    intersectionObserverOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: ratio
    };

    /**
     * Get the search exercises
     */
    get exercises(): Exercise[] {
      return this.$accessor.exercises.exercises
    }

    /**
     * Count the total number of exercises
     */
    get nbResults(): number {
      return this.$accessor.exercises.metadata.totalItems
    }

    /**
     * check if a search criteria is used or not. Check if the user searches for something
     */
    get searched(): boolean {
      const tags = this.$accessor.exercises.search_criterion.tags;
      const vote = this.$accessor.exercises.search_criterion.vote;
      return(tags && tags.length !== 0) || this.$accessor.exercises.search_criterion.title !== '' || !!vote
    }

    handleIntersect(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.intersectionRatio > ratio && this.$accessor.exercises.isRemainingPages) {
          this.$accessor.exercises.next()
        }
      });
    }

    targets(): Element[] {
      return [this.anchor]
    }

  }
</script>

<style lang="scss" scoped>
  @import "assets/css/variables";
  @import "assets/css/function";

  #ExercisesCheckPanel {
    padding: 20px 0;
    position: relative;

    .results {
      padding: 0 20px;
      font-weight: bold;
      color: $SECONDARY_COLOR
    }

    .disclaimer {
      padding: 0 20px;
      font-weight: lighter;
      font-style: italic;
      text-align: center;
      margin-top: 80px;

      b {
        color: $PRIMARY_COLOR_LIGHT;
      }
    }


    h3 {
      padding: 0 20px;
      margin-bottom: 5px;
    }

    h4 {
      font-weight: bold;
      margin-bottom: 10px;
      margin-top: 0;

      &:after {
        content: "";
        display: block;
        width: 60px;
        height: 2px;
        margin-top: 10px;
        background-color: $PRIMARY_COLOR;
      }
    }

    ul {
      list-style-type: none;
      padding: 0;

      li {
        border-bottom: 1px solid rgba($GREY, .1);
        padding: 10px 20px;
        position: relative;

        .cta-link {
          position: absolute;
          opacity: 0;
          bottom: 5px;
          right: 5px;
          color: $SECONDARY_COLOR;
          text-decoration: none;
          font-weight: bold;
          @include transitionHelper(opacity .4s ease);

          svg, img {
            width: 20px;
            vertical-align: sub;
          }
        }

        span {
          display: block;
        }

        &:hover {
          background-color: rgba($GREY, .1);

          .cta-link {
            opacity: 1;
          }
        }

      }
    }
  }

</style>
