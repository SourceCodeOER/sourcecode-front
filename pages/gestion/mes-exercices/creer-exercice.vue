<template>
  <div class="container--with-menu" id="CreateExercise">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav banner__nav--with-link">
        <span>
          Gestion > Mes exercices > Créer un exercice
        </span>
        <nuxt-link to="/gestion/mes-exercices" tag="span">
          <Icon type="arrowLeft" class="reversed-arrow" theme="theme--primary-color-light"/>
          Mes exercices
        </nuxt-link>
      </div>
    </div>

    <div class="wrapper wrapper--with-panel">

      <Panel>
        <PanelItem>
          <ExercisesCheckPanel icon="search" title="Exercices">
            Aucun exercice ne semble correspondre au vôtre !
          </ExercisesCheckPanel>
        </PanelItem>

        <PanelItem>
          <FilterPanel strategy="user" :reset-button="true" :search-mode="true" mode="strict" title="Tags"/>
        </PanelItem>
      </Panel>

      <ExerciseForm title="Créer un exercice"/>
    </div>
  </div>

</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import Icon from "~/components/Symbols/Icon.vue";
  import FilterPanel from "~/components/Panel/Item/FilterPanel.vue";
  import ExercisesCheckPanel from "~/components/Panel/Item/ExercisesCheckPanel.vue";
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import ExerciseForm from "~/components/Gestion/ExerciseForm.vue";
  import {AxiosError} from "axios";

  @Component({
    components: {
      ExerciseForm,
      PanelItem,
      Panel,
      Icon,
      FilterPanel,
      ExercisesCheckPanel,
    },
    async fetch({app: {$accessor}, error}) {
      try {
        await $accessor.tags.fetch();
        $accessor.exercises.UPDATE_INCLUDE_OPTIONS({includeDescription: false, includeTags: false});
        $accessor.exercises.UPDATE_ORDER_BY([{field: "date", value: "DESC"}, {field: 'id', value: 'ASC'}])
        $accessor.exercises.UPDATE_FILTER_OPTIONS({state: ['VALIDATED']})
      } catch (e) {
        const errorAxios = e as AxiosError;

        if (errorAxios.response) {
          const status: number = errorAxios.response.status;

          if (status === 400) {
            error({statusCode: status, message: "Une erreur est survenue."});
          } else if (status === 500) {
            error({
              statusCode: status,
              message: `Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`
            });
          }
        } else {
          error({statusCode: 400, message: "Une erreur est survenue."});
        }
      }
    },
    middleware: ['auth', 'reset-search-request']
  })
  export default class extends Vue {
  }
</script>

<style scoped>
  .wrapper {
    margin-bottom: 40px;
  }
</style>
