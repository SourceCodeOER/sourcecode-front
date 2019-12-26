<template>
  <section id="ExercisesPanel" class="exercises-wrapper">
    <header ref="headerExercise">
      <div class="header-wrapper">
        <h1>
          Résultats de recherche
          <span v-if="!isEmptySearchModel"> - {{searchModel}}</span>
        </h1>

        <div class="results">
          {{nbOfResults}} résultats
        </div>
      </div>
      <hr>
      <div class="tags-wrapper" v-if="confirmedTags.length > 0">
        <Tag v-for="(tag, id) in confirmedTags" :search-mode="true" :historical-mode="true" :store-mode="true" :state="tag.state" :title="tag.tag_text"
             :key="tag.tag_text + '_' + tag.category + '_'+ id"
             :category="tag.category" :id="tag.tag_id"/>
      </div>
    </header>

    <div class="no-result" v-show="nbOfResults === 0">
      Aucun résultat :(
    </div>

    <div v-show="nbOfResults > 0" ref="bodyExercise" class="exercises-content-wrapper">
      <PreviewExercise v-for="(exercise, id) in exercises"
                       :key="exercise.title + '_' + id + '_' + exercise.id"
                       :exercise="exercise"/>
      <div ref="anchor" id="Anchor"></div>
    </div>
  </section>
</template>

<script lang="ts">
  import {Component, Watch, Ref, Mixins} from "vue-property-decorator";
  import Tag from "~/components/Tag/Tag.vue";
  import PreviewExercise from '~/components/Exercise/PreviewExercise.vue'
  import IntersectMixins from "~/components/Mixins/IntersectMixins.vue";

  const ratio = .2;

  @Component({
    components: {
      Tag,
      PreviewExercise
    }
  })
  export default class ExercisesPanel extends Mixins(IntersectMixins) {
    @Ref() headerExercise!: HTMLElement;
    @Ref() bodyExercise!: HTMLElement;
    @Ref() anchor!: Element;

    intersectionObserverOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: ratio
    };


    get numberOfFilter() {
      return this.$accessor.tags.selectedTags.length
    }

    get confirmedTags() {
      return this.$accessor.tags.selectedTags
    }

    get searchModel() {
      return this.$accessor.search.search_criterion.title
    }

    get isEmptySearchModel() {
      return this.$accessor.search.search_criterion.title === ""
    }

    get nbOfResults() {
      return this.$accessor.search.metadata.totalItems
    }

    get exercises() {
      return this.$accessor.search.exercises
    }

    @Watch('numberOfFilter')
    onNumberOfFilterChange() {
      this.$nextTick(() => {

        const headerHeight: number = this.headerExercise.offsetHeight;
        const parent: HTMLElement | null = this.bodyExercise.parentElement;

        if (!!parent) {
          this.bodyExercise.style.height = (parent.offsetHeight - headerHeight) + 'px';
        }
      })
    }

    handleIntersect(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.intersectionRatio > ratio && this.$accessor.search.isRemainingPages) {
          this.$accessor.search.next()
        }
      });
    }

    targets(): Element[] {
      return [this.anchor]
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";

  #ExercisesPanel {
    display: flex;
    flex-direction: column;
    justify-content: stretch;


    header {
      padding-bottom: 20px;

      .tags-wrapper {
        margin-top: 10px;
      }

      hr {
        border: 0;
        border-top: 1px solid rgba($GREY, .3);
      }
    }

    .exercises-content-wrapper {
      overflow-y: scroll;
      max-height: calc(100% - 66px);
      padding: 15px;
    }

    header {
      .results {
        font-weight: lighter;
      }
    }

    .no-result {
      text-align: center;
      font-family: $CircularStd;
      margin-top: 75px;
      font-size: 2.5em;
    }
  }
</style>
