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
          <FilterPanel strategy="user" :reset-button="true" :search-mode="true" title="Tags"/>
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

  @Component({
    components: {
      FavoriteForm,
      PanelItem,
      Panel,
      ExercisesCheckPanel,
      FilterPanel,
      Icon
    },
    async fetch({app: {$accessor}}) {
      await $accessor.tags.fetch();
      $accessor.search.UPDATE_INCLUDE_OPTIONS({includeDescription: false, includeTags: false});
      $accessor.search.UPDATE_ORDER_BY([{field: "date", value: "DESC"}, {field: 'id', value: 'ASC'}])
      $accessor.search.UPDATE_FILTER_OPTIONS({state:['VALIDATED']})

    },
    middleware: ['auth', 'reset-search-request']
  })
  export default class extends Vue {
  }
</script>
