<template>
  <section id="ExercisesPanel" class="exercises-wrapper">
    <header ref="headerExercise">
      <h1>Résultats de recherche</h1>
      <hr>
      <div class="tags-wrapper" v-if="confirmedTags.length > 0">
        <Tag v-for="(tag, id) in confirmedTags" :state="tag.state" :title="tag.text" :key="tag.text + '_' + tag.category + '_'+ id"
             :category="tag.category" :id="tag.id"></Tag>
      </div>
    </header>

    <div ref="bodyExercise" class="exercises-content-wrapper">
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
      <div id="Anchor"></div>
    </div>
  </section>
</template>

<script lang="ts">
    import {Vue, Component, Watch, Ref} from "vue-property-decorator";
    import Tag from "~/components/Tag/Tag.vue";


    @Component({
        components: {
            Tag
        }
    })
    export default class ExercisesPanel extends Vue {
        private observer: IntersectionObserver | undefined = undefined;

        @Ref() headerExercise!: HTMLElement;
        @Ref() bodyExercise!: HTMLElement;

        get numberOfFilter() {
            return this.$accessor.tags.selectedTags.length
        }

        get confirmedTags() {
            return this.$accessor.tags.selectedTags
        }

        @Watch('numberOfFilter')
        onNumberOfFilterChange() {
            this.$nextTick(() => {

              const headerHeight: number = this.headerExercise.offsetHeight;
              const parent: HTMLElement | null = this.bodyExercise.parentElement;

              if(!!parent) {
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

    button {
      margin: 0;
      font-size: .625em;
    }

    .exercises-content-wrapper {
      overflow-y: scroll;
      max-height: calc(100% - 66px);
      padding: 15px;
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
