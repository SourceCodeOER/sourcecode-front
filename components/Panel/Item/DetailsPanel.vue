<template>
  <div id="DetailsPanel">

    <div class="panel-wrapper">

      <div>
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

        <a v-if="!!exercise.file" :href="`${cdnLink}/${exercise.file}`" class="button-wrapper" download>
          <button class="button--ternary-color-reverse">
            Télécharger l'exercice
          </button>
        </a>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {Exercise, ExerciseMetrics, ExerciseTag} from "../../../types";
  import Icon from "~/components/Symbols/Icon.vue";
  import Rating from "~/components/Rating/Rating.vue";
  import {BusEvent} from "~/components/Event/BusEvent";
  import {AxiosError} from "axios";

  @Component({
    components: {Rating, Icon}
  })
  export default class DetailsPanel extends Vue {
    name = "details-panel";

    /**
     * The title of this panel
     */
    @Prop({type: String, default: "Détails"}) title!: string;
    /**
     * The default icon of this panel (see Icon component)
     */
    @Prop({type: String, default: "eye"}) icon!: string;
    /**
     * The exercise containing details, tags,...
     */
    @Prop({type: Object, required: true}) exercise!: Exercise;

    private cdnLink!: string;

    /**
     * Classify all tags by categories and sorts the categories
     */
    get tag_by_categories(): { category: string; tags: string[] }[] {
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

    created() {
      const link: string | undefined = this.$accessor.sharedEnv.CDN_SERVER;
      this.cdnLink = link ? link : ''
    }

  }
</script>

<style lang="scss" scoped>
  @import "assets/css/variables";
  @import "assets/css/function";
  @import "assets/css/font";

  #DetailsPanel {

    padding: 20px;

    h4 {
      text-transform: capitalize;
      color: $PRIMARY_COLOR_LIGHT;
      font-family: $CircularStd;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    h3 {
      margin-top: 20px;
    }

    > div:not(:first-of-type) {
      margin-top: 20px
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
</style>
