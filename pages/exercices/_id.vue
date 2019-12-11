<template>
  <div class="container" id="Exercise">
    <div class="banner">
      <span>
        {{exercise.title}}
      </span>
      <nuxt-link to="/exercices" tag="span">
        <ArrowSymbol class="reversed-arrow" theme="theme--secondary-color"/>
        Retour à la recherche
      </nuxt-link>
    </div>

    <div class="wrapper">
      <aside class="panel">
        <h3>Détails</h3>

        <div v-for="item in tag_by_categories" :key="item.category">
          <h4>{{item.category}}</h4>
          <ul>
            <li v-for="tag in item.tags" :key="tag + '_' + item.category">{{tag}}</li>
          </ul>
        </div>
      </aside>

      <section class="exercise">
        <h1>{{exercise.title}}</h1>
        <span>Créé le {{$moment(exercise.createdAt).format("DD/MM/YY à H:mm")}}</span> | <span>Mis à jour le {{$moment(exercise.updatedAt).format("DD/MM/YY à H:mm")}}</span>

        <h2>Description</h2>

        <article v-html="$md.render(exercise.description)" class="exercise-article"></article>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import ArrowSymbol from "~/components/Symbols/ArrowSymbol.vue";
    import {Exercise, TagExercise} from "~/types";

    @Component({
        components: {
            ArrowSymbol
        },
        async asyncData({params, error, app: {$axios}}) {
            const id = params.id;

            try {
                const exercise: Exercise = await $axios.$get(`api/exercises/${id}`);
                return {exercise}
            } catch (e) {
                error({statusCode: 404, message: "Cette exercice est introuvable"});
            }


        }
    })
    export default class extends Vue {
        exercise!: Exercise;

        get tag_by_categories() {
            const map: Map<string, string[]> = new Map();

            this.exercise.tags.forEach((tag: TagExercise) => {
                const el: string[] | undefined = map.get(tag.category.category_text);
                if (el !== undefined) {
                    el.push(tag.tag_text)
                } else {
                    map.set(tag.category.category_text, [tag.tag_text])
                }
            });

            const entries = (new Map([...map.entries()].sort((a, b) => a[0] > b[0] ? 1 : -1))).entries();
            new Map([...map.entries()].sort((a, b) => a[0] > b[0] ? 1 : -1));
            let tag_with_categories = entries.next();

            const arrayOfTagByCategories: { category: string, tags: string[] }[] = [];
            while (!tag_with_categories.done) {
                const value = tag_with_categories.value;
                arrayOfTagByCategories.push({category: value[0], tags: value[1]});
                tag_with_categories = entries.next()
            }

            return arrayOfTagByCategories
        }

    }
</script>

<style lang="scss" scoped>

  @import "../../assets/css/_variables";
  @import "../../assets/css/_function";
  @import "../../assets/css/_font";

  #Exercise {

    .banner {
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;


      span:first-child {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }

      span:last-child {
        color: $SECONDARY_COLOR;
        display: block;
        position: relative;
        cursor: pointer;
      }

      .reversed-arrow {
        @include transformHelper(rotate(180deg));
        @include transformOriginHelper(center center);
        height: 15px;
        width: 8px;
        margin-bottom: -1px;
        margin-right: 2px;
      }
    }

    .panel {

      h4 {
        text-transform: capitalize;
        color:$TERNARY_COLOR;
        font-family: $CircularStd;
        margin-top:10px;
        margin-bottom:10px;
      }

      ul {
        list-style-type: none;
        padding: 0;
        font-weight: 300;
      }

      li:not(:last-child) {
        margin-bottom: 5px;
      }
    }

    section {
      width: calc(100% - #{$FILTER_PANEL_WIDTH + $PADDING_CONTENT});
      margin-left: auto;
      height: 100%;
      background-color: white;
      @include box-shadow($SHADOW);
      border-radius: 4px;
      margin-bottom:30px;
      padding: 20px;

      h1 {
        margin-bottom: 5px;
      }

      h2 {
        color: $SECONDARY_COLOR;
        margin-bottom: 10px ;
        margin-top: 30px ;
      }

      article {
        font-size: .875em;
      }
    }
  }
</style>
