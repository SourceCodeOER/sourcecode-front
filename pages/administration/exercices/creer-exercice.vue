<template>
  <div class="container--with-menu" id="CreateExercise">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav banner__nav--with-link">
        <span>
          Administration > Gestion des exercices > Créer un exercice
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

      <ExerciseForm title="Créer un exercice" admin/>
    </div>
  </div>

</template>


<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import ExercisesCheckPanel from "~/components/Panel/Item/ExercisesCheckPanel.vue";
  import FilterPanel from "~/components/Panel/Item/FilterPanel.vue";
  import ExerciseForm from "~/components/Gestion/ExerciseForm.vue";
  import Icon from "~/components/Symbols/Icon.vue";
  import {AxiosError} from "axios";

  @Component({
    components: {Icon, ExerciseForm, FilterPanel, ExercisesCheckPanel, PanelItem, Panel},
    async fetch({app: {$accessor}}) {
        await $accessor.tags.fetch({});
        $accessor.exercises.UPDATE_INCLUDE_OPTIONS({includeDescription: false, includeTags: false});
        $accessor.exercises.UPDATE_ORDER_BY([{field: "date", value: "DESC"}, {field: 'id', value: 'ASC'}]);
        $accessor.exercises.UPDATE_FILTER_OPTIONS({state: ['VALIDATED']})
    },
    middleware: ['auth', 'admin', 'reset-search-request']
  })
  export default class extends Vue {
  }
</script>

