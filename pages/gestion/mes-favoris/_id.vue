<template>
  <div class="container--with-menu" id="MyFavorite">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav banner__nav--with-link">
        <span>
          Gestion > Mes Favoris > {{configuration.name}}
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
          <ExercisesCheckPanel icon="search" title="Exercices"/>
        </PanelItem>

        <PanelItem>
          <FilterPanel strategy="user" :radio-button-rating="true" :reset-button="true" :search-mode="true" title="Tags"/>
        </PanelItem>
      </Panel>

      <FavoriteForm title="Modifier mon favori" :configuration="configuration"/>

    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {
    Configuration,
    SearchExerciseRequest,
    SelectedTag,
    TagExtended,
  } from "~/types";
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
    async asyncData({params, error, app: {$accessor}}) {
      if (!$accessor.favorites.loaded) {
        await $accessor.favorites.fetch()
      }

      const id: number = parseInt(params.id);
      const configuration: Configuration | undefined = $accessor.favorites.favorites.find(config => config.id === id);

      if (!configuration) {
        error({statusCode: 404, message: "Ce favori est introuvable"});
      } else {
        const confirmedTags: SelectedTag[] = configuration.tags.map((tag: TagExtended) => {
          return {...tag, state: true}
        });

        await $accessor.tags.fetch();
        await $accessor.tags.applyConfirmedTags({confirmedTags, mode: "default"});

        const searchRequest: SearchExerciseRequest = {
          data: {
            title: configuration.title,
            tags: $accessor.tags.tagsRequest
          },
          includeOptions: {includeDescription: false, includeTags: false},
          orderBy: [{field: 'date', value: 'DESC'}, {field: 'id', value: 'ASC'}]
        };

        await $accessor.search.fetch(searchRequest);

        return {configuration}

      }
    },
    middleware: ['auth', 'reset-search-request']
  })
  export default class extends Vue {
    configuration!: Configuration;
  }
</script>
