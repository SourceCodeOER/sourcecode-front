<template>
  <article>
    <div class="rating">
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
    import {Exercise, TagExercise} from "~/types";

    @Component
    export default class PreviewExercise extends Vue {
        @Prop({type: Object, required: true}) readonly exercise!: Exercise;

        get metaTitleLink() {
            return `${this.exercise.title} | Source Code`
        }

        get metaLink() {
            return `/exercices/${this.exercise.id}`
        }

        get tagsFormatted() {
            const tags: TagExercise[] = this.exercise.tags;

            // 1) Difficulty, 2) language, 3) type of exercise, 4) theme

            let counter = 0;

            const orderedTextTags: string[] = [];

            for (const tag of tags) {
                if (tag.category.category_text === 'difficulté' && orderedTextTags[0] === undefined) {
                    orderedTextTags[0] = tag.tag_text;
                    counter++
                } else if (tag.category.category_text === 'langage' && orderedTextTags[1] === undefined) {
                    orderedTextTags[1] = tag.tag_text;
                    counter++
                } else if (tag.category.category_text === "type d'exercice" && orderedTextTags[2] === undefined) {
                    orderedTextTags[2] = tag.tag_text;
                    counter++
                } else if (tag.category.category_text === 'thématique' && orderedTextTags[3] === undefined) {
                    orderedTextTags[3] = tag.tag_text;
                    counter++
                }

                if (counter === 4) break
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

        get rating() {
            const avg: number = this.exercise.metrics.avg_vote;

            if(this.exercise.metrics.votes === 0) return '-';

            return parseFloat(avg.toString()) !== 0 ? avg : 0

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
