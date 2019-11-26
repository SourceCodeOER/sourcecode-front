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
        <Tag v-for="(tag, id) in confirmedTags" :state="tag.state" :title="tag.tag_text"
             :key="tag.tag_text + '_' + tag.category + '_'+ id"
             :category="tag.category" :id="tag.tag_id"></Tag>
      </div>
    </header>

    <div ref="bodyExercise" class="exercises-content-wrapper">
      <PreviewExercise v-for="(exercise, id) in exercises"
                       :key="exercise.title + '_' + id + '_' + exercise.id"
                       :exercise="exercise"/>
      <div id="Anchor"></div>
    </div>
  </section>
</template>

<script lang="ts">
    import {Vue, Component, Watch, Ref} from "vue-property-decorator";
    import Tag from "~/components/Tag/Tag.vue";
    import PreviewExercise from '~/components/Exercise/PreviewExercise.vue'
    import {Exercise} from "~/types";


    @Component({
        components: {
            Tag,
            PreviewExercise
        }
    })
    export default class ExercisesPanel extends Vue {
        private observer: IntersectionObserver | undefined = undefined;

        /*
        private exercise: Exercise = {
            id: 0,
            title: "Bitwise operation : high order bits",
            createdAt: "",
            updatedAt: "",
            version: 0,
            description: "Lorem ipsum",
            metrics: {
                avg_score: 4.7,
                votes: 200
            },
            tags: [
                {
                    tag_id: 1,
                    tag_text: "Facile",
                    category: {
                        category_id: 1,
                        category_text: "difficulté"
                    }
                },
                {
                    tag_id: 1,
                    tag_text: "Java",
                    category: {
                        category_id: 1,
                        category_text: "langage"
                    }
                },
                {
                    tag_id: 1,
                    tag_text: "QCM",
                    category: {
                        category_id: 1,
                        category_text: "type d'exercice"
                    }
                },
                {
                    tag_id: 1,
                    tag_text: "Listes Chainées",
                    category: {
                        category_id: 1,
                        category_text: "thématique"
                    }
                },
            ],

        }

         */

        @Ref() headerExercise!: HTMLElement;
        @Ref() bodyExercise!: HTMLElement;

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

        beforeDestroy() {
            if (process.client) {
                if (!!this.observer) this.observer.disconnect()
            }
        }

        mounted() {
            if (process.client) {

                const ratio = .2;

                const options = {
                    root: null,
                    rootMargin: '0px',
                    threshold: ratio
                };

                const that = this;

                const handleIntersect = function (entries: any) {
                    entries.forEach((entry: any) => {
                        if (entry.intersectionRatio > ratio && that.$accessor.search.isRemainingPages) {
                            that.$accessor.search.next()
                        }
                    });
                };

                this.observer = new IntersectionObserver(handleIntersect, options);
                const target = document.querySelector('#Anchor');

                if (target !== null) {
                    this.observer.observe(target);
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";

  #ExercisesPanel {
    width: calc(100% - #{$FILTER_PANEL_WIDTH + $PADDING_CONTENT});
    margin-left: auto;
    height: 100%;
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
  }
</style>
