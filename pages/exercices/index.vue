<template>
  <div class="container--with-menu">
    <div class="banner search-banner">
      <div class="input-wrapper--with-icon">
        <Icon type="search"/>
        <input ref="inputText" class="input--primary-color" type="text" v-on:input="debounceInput"
               placeholder="Rechercher">
      </div>
    </div>

    <div class="wrapper wrapper--with-panel">
      <Panel>
        <PanelItem>
          <FilterPanel :reset-button="true" :radio-button-rating="true" :favorite="true" :search-mode="true" :historical-mode="true"
                       @reset="resetInput"/>
        </PanelItem>
        <PanelItem>
          <HistoricalPanel/>
        </PanelItem>

        <PanelItem :is-active="$auth.loggedIn">
          <FavoritePanel/>
        </PanelItem>
      </Panel>
      <ExercisesPanel/>
    </div>
  </div>
</template>

<script lang="ts">
  import FilterPanel from "~/components/Panel/Item/FilterPanel.vue";
  import HistoricalPanel from '~/components/Panel/Item/HistoricalPanel.vue';
  import FavoritePanel from '~/components/Panel/Item/FavoritePanel.vue';
  import ExercisesPanel from "~/components/Exercise/ExercisesPanel.vue";
  import {Component, Ref, Vue} from "vue-property-decorator";
  import {SearchExerciseRequest} from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import RadioButtonSelecter from "~/components/Search/RadioButtonSelecter.vue";

  const debounce = require('lodash.debounce');

  @Component({
    components: {
      RadioButtonSelecter,
      PanelItem,
      Panel,
      FilterPanel,
      ExercisesPanel,
      FavoritePanel,
      HistoricalPanel,
      Icon
    },
    async fetch({app: {$accessor}, $auth}) {
      await $accessor.tags.fetch();
      await $accessor.tags.apply("default");
      await $accessor.search.fetch({
        metadata: {size: 50},
        includeOptions: {includeDescription: false},
        orderBy: [{field: "date", value: "DESC"}, {field:'id', value:'ASC'}]
      } as SearchExerciseRequest);

      if ($auth.loggedIn) {
        await $accessor.favorites.fetch()
      }
    },
    auth: false,
    middleware: 'exercises-store'
  })
  export default class extends Vue {
    @Ref() inputText!: HTMLInputElement;

    debounceInput = debounce((e: any) => {
      const value = e.target.value;
      this.$accessor.search.fetch({data: {title: value}});
      this.$accessor.historical.addHistorical({
        tags: this.$accessor.tags.selectedTags,
        title: value,
        vote: this.$accessor.search.search_criterion.vote
      })
    }, 300);

    resetInput() {
      this.inputText.value = ''
    }

    mounted() {
      const title = this.$accessor.search.search_criterion.title;
      this.inputText.value = !!title ? title : ''
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";

  .wrapper {
    height: 100vh;
    position: relative;
    overflow-y: hidden;
  }

</style>
