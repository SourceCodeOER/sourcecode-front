<template>
  <div class="container--with-menu" id="Exercise">
    <div class="banner banner--with-shadow-bottom banner__nav banner__nav--with-link">
      <span>
        Exercices > {{exercise.title}}
      </span>
      <nuxt-link to="/exercices" tag="span">
        <Icon type="arrowLeft" class="reversed-arrow" theme="theme--secondary-color"/>
        Retour à la recherche
      </nuxt-link>
    </div>

    <div class="wrapper wrapper--with-panel">
      <aside class="panel">
        <div>

          <h3>Détails</h3>

          <div v-for="item in tag_by_categories" :key="item.category">
            <h4>{{item.category}}</h4>
            <ul>
              <li v-for="tag in item.tags" :key="tag + '_' + item.category">{{tag}}</li>
            </ul>
          </div>
        </div>

        <div v-if="!!exercise.url || !!exercise.file" class="sources">
          <h3>Sources</h3>

          <a v-if="!!exercise.url" :href="exercise.url" target="_blank" class="button-wrapper">
            <button class=" button--ternary-color-reverse">
              Lien vers l'exercice
            </button>
          </a>

          <a v-if="!!exercise.file" :href="`${cdnLink}/${exercise.file}`" target="_blank" class="button-wrapper">
            <button class=" button--ternary-color-reverse">
              Télécharger l'exercice
            </button>
          </a>

        </div>

      </aside>

      <section class="exercise">
        <h1>{{exercise.title}}</h1>
        <span>Créé le {{$moment(exercise.createdAt).format("DD/MM/YY à H:mm")}}</span> | <span>Mis à jour le {{$moment(exercise.updatedAt).format("DD/MM/YY à H:mm")}}</span>

        <h2>Description</h2>

        <article v-html="exercise.description" class="exercise-article"></article>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {Exercise, ExerciseTag} from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import hljs from 'highlight.js/lib/highlight';
  import javascript from 'highlight.js/lib/languages/javascript';
  import css from 'highlight.js/lib/languages/css'
  import java from 'highlight.js/lib/languages/java'
  import python from 'highlight.js/lib/languages/python'
  import cmake from 'highlight.js/lib/languages/cmake'
  import cs from 'highlight.js/lib/languages/cs'

  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('java', java);
  hljs.registerLanguage('python', python);
  hljs.registerLanguage('cmake', cmake);
  hljs.registerLanguage('cs', cs);

  @Component({
    components: {
      Icon
    },
    async asyncData({params, error, app: {$axios}}) {
      const id = params.id;

      try {
        const exercise: Exercise = await $axios.$get(`api/exercises/${id}`);
        return {exercise}
      } catch (e) {
        error({statusCode: 404, message: "Cette exercice est introuvable"});
      }


    },
    middleware: ['exercises-store']

  })
  export default class extends Vue {
    exercise!: Exercise;
    private cdnLink!:string;

    get tag_by_categories() {
      const map: Map<string, string[]> = new Map();

      this.exercise.tags.forEach((tag: ExerciseTag) => {
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

    mounted() {
      if(process.client) {
        const exercise: Element | null = document.querySelector("#Exercise");

        if(exercise) {
            exercise.querySelectorAll('pre code').forEach((block) => {
              console.log(block);
              hljs.highlightBlock(block);
            });
        }
      }
    }

    created() {
      const link: string | undefined = process.env.CDN_SERVER;
      this.cdnLink = link ? link : ''
    }

  }
</script>

<style lang="scss" scoped>

  @import "../../assets/css/_variables";
  @import "../../assets/css/_function";
  @import "../../assets/css/_font";

  #Exercise {

    .panel {

      h4 {
        text-transform: capitalize;
        color: $TERNARY_COLOR;
        font-family: $CircularStd;
        margin-top: 10px;
        margin-bottom: 10px;
      }

      > div:not(:first-of-type) {
        margin-top:20px
      }

      ul {
        list-style-type: none;
        padding: 0;
        font-weight: 300;
        @include hyphens(true);

      }

      li:not(:last-child) {
        margin-bottom: 5px;
      }

      .sources {
        button {
          font-size: .725em;
          width: 100%;
        }
      }
    }

    section {
      background-color: white;
      @include box-shadow($SHADOW);
      border-radius: 4px;
      margin-bottom: 30px;
      padding: 20px;

      h1 {
        margin-bottom: 5px;
      }

      h2 {
        color: $SECONDARY_COLOR;
        margin-bottom: 10px;
        margin-top: 30px;
      }

      article {
        font-size: .875em;
      }
    }
  }
</style>
