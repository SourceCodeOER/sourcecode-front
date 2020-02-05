<template>
  <section id="ExercisesPanel" class="exercises-wrapper">
    <header ref="headerExercise">
      <div class="header-wrapper">
        <h1>
          Résultats de recherche
          <span v-if="!isEmptySearchModel"> - {{searchModel}}</span>
        </h1>

        <div class="results">
          {{nbOfResults}} résultats - <span @click.self="reset" class="init">Réinitialiser la recherche</span>
        </div>
      </div>
      <hr>
      <div class="tags-wrapper" v-if="confirmedTags.length > 0 || voteTag">
        <Tag v-for="(tag, id) in confirmedTags" :state="tag.state" :title="tag.tag_text"
             :key="tag.tag_text + '_' + tag.category + '_'+ id" :id="id" @deleteTag="deleteTag($event, tag)"/>

        <Tag v-if="voteTag" :id="voteTag.id" :title="voteTag.title" :state="voteTag.state"
             @deleteTag="removeRatingCriteria"/>
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
  import {Exercise, SelectedTag, TagLabelObjectEmitted} from "~/types";

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

    get confirmedTags(): SelectedTag[] {
      return this.$accessor.tags.selectedTags
    }

    get searchModel() {
      return this.$accessor.search.search_criterion.title
    }

    get isEmptySearchModel(): boolean {
      return this.$accessor.search.search_criterion.title === ""
    }

    get nbOfResults(): number {
      return this.$accessor.search.metadata.totalItems
    }

    get exercises(): Exercise[] {
      return this.$accessor.search.exercises
    }

    get voteTag(): TagLabelObjectEmitted | undefined {
      const vote = this.$accessor.search.search_criterion.vote;
      let title = '';

      if (vote) {
        if (vote.operator === '>=' || vote.operator === '>') {
          title += 'Plus de '
        } else if (vote.operator === '<=' || vote.operator === '<') {
          title += 'Moins de '
        }

        title += vote.value + ' étoiles'

        return {title, id: 0, state: true}
      }
      return undefined
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

    async removeRatingCriteria() {
      await this.$accessor.search.RESET_VOTE();
      await this.$accessor.search.fetch({});

      const search_criterion = this.$accessor.search.search_criterion;
      const selectedTags = this.$accessor.tags.selectedTags;

      await this.$accessor.historical.addHistorical({
        title: search_criterion.title,
        tags: selectedTags,
        vote: search_criterion.vote
      })
    }

    async deleteTag(event: { title: string, id: number, state: boolean }, tag: SelectedTag) {
      await this.$accessor.tags.addOrRemoveTag({...tag, state: event.state});
      await this.$accessor.tags.apply('default');
      await this.$accessor.search.fetch({data: {tags: this.$accessor.tags.tagsRequest}});

      const search_criterion = this.$accessor.search.search_criterion;
      const selectedTags = this.$accessor.tags.selectedTags;

      await this.$accessor.historical.addHistorical({
        title: search_criterion.title,
        tags: selectedTags,
        vote: search_criterion.vote
      })
    }

    async reset() {
      this.$accessor.tags.CLEAR();
      this.$accessor.search.RESET_SEARCH_CRITERION();
      this.$accessor.search.RESET_STATE();
      await this.$accessor.search.fetch({
        filterOptions: {
          state: ["VALIDATED"]
        }
      });
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
  @import "assets/css/variables";
  @import "assets/css/function";
  @import "assets/css/font";

  #ExercisesPanel {
    display: flex;
    flex-direction: column;
    justify-content: stretch;

    .init {
      color: $TERNARY_COLOR;
      text-decoration: underline;
      cursor: pointer;
    }

    header {
      padding-bottom: 20px;

      .tags__wrapper {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
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
