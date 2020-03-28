<template>
  <div class="container--with-menu" id="MyFavorite">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav banner__nav--with-link">
        <span>
          Gestion > Mes Favoris > Créer un favori
        </span>
        <nuxt-link to="/gestion/mes-favoris" tag="span">
          <Icon type="arrowLeft" class="reversed-arrow" theme="theme--primary-color-light"/>
          Mes favoris
        </nuxt-link>
      </div>
    </div>

    <div class="wrapper wrapper--with-panel">

      <Panel>
        <PanelItem>
          <ExercisesCheckPanel icon="search" title="Exercices">
            Aucun exercice ne semble correspondre à cette sélection.
          </ExercisesCheckPanel>
        </PanelItem>

        <PanelItem>
          <FilterPanel strategy="user" :search-mode="true" title="Tags"/>
        </PanelItem>
      </Panel>

      <FavoriteForm title="Créer un favori"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import ExercisesCheckPanel from "~/components/Panel/Item/ExercisesCheckPanel.vue";
  import FilterPanel from "~/components/Panel/Item/FilterPanel.vue";
  import Icon from "~/components/Symbols/Icon.vue";
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import FavoriteForm from "~/components/Gestion/FavoriteForm.vue";
  import {AxiosError} from "axios";

  @Component({
    components: {
      FavoriteForm,
      PanelItem,
      Panel,
      ExercisesCheckPanel,
      FilterPanel,
      Icon
    },
    async fetch({app: {$accessor}, error}) {
      try {
        await $accessor.tags.fetch({countStates: ["VALIDATED"]});
        $accessor.exercises.UPDATE_INCLUDE_OPTIONS({includeDescription: false, includeTags: false});
        $accessor.exercises.UPDATE_ORDER_BY([{field: "date", value: "DESC"}, {field: 'id', value: 'ASC'}])
        $accessor.exercises.UPDATE_FILTER_OPTIONS({state:['VALIDATED']})

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
