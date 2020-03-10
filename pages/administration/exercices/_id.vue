<template>
  <div class="container--with-menu" id="CreateExercise">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav banner__nav--with-link">
        <span>
          Administration > Gestion des exercices > {{exercise.title}}
        </span>
        <nuxt-link to="/administration/exercices" tag="span">
          <Icon type="arrowLeft" class="reversed-arrow" theme="theme--primary-color-light"/>
          Gestion des exercices
        </nuxt-link>
      </div>
    </div>

    <div class="wrapper wrapper--with-panel">

      <Panel>
        <PanelItem>
          <ExercisesCheckPanel icon="search" title="Exercices">
            Aucun exercice ne semble correspondre à celui-ci
          </ExercisesCheckPanel>
        </PanelItem>

        <PanelItem>
          <FilterPanel strategy="admin" :reset-button="true" :search-mode="true" mode="strict" title="Tags"/>
        </PanelItem>
      </Panel>

      <ExerciseForm title="Modifier l'exercice" :exercise="exercise" admin back-to-parent-page/>

    </div>
  </div>

</template>


<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {
    Exercise,
    SelectedTag,
    SearchExerciseRequest, IncludeOptionsExerciseRequest
  } from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import FilterPanel from "~/components/Panel/Item/FilterPanel.vue";
  import ExercisesCheckPanel from "~/components/Panel/Item/ExercisesCheckPanel.vue";
  import qs from 'qs'
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import ExerciseForm from "~/components/Gestion/ExerciseForm.vue";

  const debounce = require('lodash.debounce');


  @Component({
    components: {
      ExerciseForm,
      PanelItem,
      Panel,
      Icon,
      FilterPanel,
      ExercisesCheckPanel
    },
    async asyncData({params, error, app: {$axios, $accessor}}) {
      const id = params.id;
      const includeOptions = {
        includeOptions: {
          includeCreator: true
        } as IncludeOptionsExerciseRequest
      };

      const includeOptionsStringify: string = qs.stringify(includeOptions, {arrayFormat: 'repeat'});

      try {
        const exercise: Exercise = await $axios.$get(`api/exercises/${id}?${includeOptionsStringify}`);

        const queryObject: { tags_ids: number[] } = {tags_ids: exercise.tags.map(tag => tag.tag_id)};

        const queryString: string = qs.stringify(queryObject, {arrayFormat: 'repeat'});

        const tags: SelectedTag[] = await $axios.$get(`api/tags?${queryString}`);

        await $accessor.tags.fetch({});
        await $accessor.tags.applyConfirmedTags({confirmedTags: tags, mode: 'strict'});

        const searchRequest: SearchExerciseRequest = {
          data: {
            title: exercise.title,
            tags: $accessor.tags.tagsRequest
          },
          filterOptions: {
            state: ['VALIDATED']
          },
          orderBy: [{field: "date", value: "DESC"}, {field: 'id', value: 'ASC'}],
          includeOptions: {includeDescription: false, includeTags: false}
        };

        await $accessor.exercises.fetch(searchRequest);

        return {exercise}
      } catch (e) {
        error({statusCode: 404, message: "Cet exercice est introuvable"});
      }
    },
    middleware: ['auth', 'admin', 'reset-search-request']
  })
  export default class extends Vue {
    /**
     * The loaded exercise
     */
    exercise!: Exercise;
  }
</script>

<style scoped>
  .wrapper {
    margin-bottom: 40px;
  }
</style>


