<template>
  <article>
    <div class="rating" :class="{'rating--empty': exercise.metrics.votes === 0}">
        {{rating}}
    </div>

    <div class="info-wrapper">
      <h2>{{exercise.title}}</h2>
      <div class="tags">
        {{tagsFormatted}}
      </div>
    </div>

    <div class="cta-wrapper">
      <nuxt-link :to="metaLink" :title="metaTitleLink">
        <button class="button--light-blue-reverse">Voir l'exercice</button>
      </nuxt-link>
    </div>

  </article>
</template>

<script lang="ts">

    import {Vue, Component, Prop} from 'vue-property-decorator'
    import {Exercise, ExerciseTag} from "~/types";

    @Component
    export default class PreviewExercise extends Vue {
        @Prop({type: Object, required: true}) readonly exercise!: Exercise;

      /**
       * Return the meta title of the exercise
       */
      get metaTitleLink() {
            return `${this.exercise.title} | Source Code`
        }

      /**
       * Return the link of the exercise containing its id
       */
      get metaLink() {
            return `/exercices/${this.exercise.id}`
        }

      /**
       * return a formatted list of tags
       * Here's the order :
       * 1) cours
       * 2) difficulté
       * 3) langage
       * 4) type d'exercice
       * 5) thématique
       *
       * If a category does not contain any tag, it will be not display
       */
      get tagsFormatted(): string {
            const tags: ExerciseTag[] = this.exercise.tags;

            if(!tags) return '';

            // 1) Difficulty, 2) language, 3) type of exercise, 4) theme

            let counter = 0;

            const orderedTextTags: string[] = [];

            for (const tag of tags) {
                if (tag.category.category_text === 'cours' && orderedTextTags[0] === undefined) {
                    orderedTextTags[0] = tag.tag_text;
                    counter++
                } else if (tag.category.category_text === 'difficulté' && orderedTextTags[1] === undefined) {
                  orderedTextTags[1] = tag.tag_text;
                  counter++
                } else if (tag.category.category_text === 'langage' && orderedTextTags[2] === undefined) {
                    orderedTextTags[2] = tag.tag_text;
                    counter++
                } else if (tag.category.category_text === "type d'exercice" && orderedTextTags[3] === undefined) {
                    orderedTextTags[3] = tag.tag_text;
                    counter++
                } else if (tag.category.category_text === 'thématique' && orderedTextTags[4] === undefined) {
                    orderedTextTags[4] = tag.tag_text;
                    counter++
                }

                if (counter === 5) break
            }

            let formatted: string = '';

            let firstPrinted:boolean = false;

            for (let i = 0; i < orderedTextTags.length; i++) {
                const value = orderedTextTags[i];
                if (firstPrinted && value !== undefined) {
                    formatted += ' | ' + value
                } else if (!firstPrinted && value !== undefined) {
                    formatted += value;
                    firstPrinted = true;
                }
            }

            return formatted
        }

      /**
       * Return the rating of the exercise
       */
      get rating() {

          const metrics = this.exercise.metrics;

          if(metrics) {
            if(metrics.votes === 0) return '-';
            return metrics.avg_score
          }

          return '-'

        }
    }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";

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
    position: relative;


    .overlay {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0;
      visibility: hidden;
      background: $MAIN_GRADIENT_V;
      color:white;
      border-radius: 4px;
      font-weight: bold;
      font-family: $CircularStd;
      font-size: 0.75em;
      display: flex;
      align-items: center;
      justify-content: center;
      @include transitionHelper(opacity .4s ease);

      span {
        position: relative;

      }
    }


    button {
      margin: 0;
      font-size: .625em;
    }

    .rating {
      grid-area: rating;
      font-family: $CircularStd;
      font-weight: bold;
      color: $SECONDARY_COLOR;
      font-size: 1.75em;
      user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      height: 100%;
      display: flex;
      align-items: center;

      &.rating--empty {
        color:lighten($GREY, 30);
      }
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

</style>
