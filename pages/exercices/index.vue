<template>
  <div class="container--with-menu">
    <div class="banner search-banner">
      <div class="input-wrapper--with-icon one-third input-with--enter-icon">
        <Icon type="search"/>
        <input ref="inputText" class="input--primary-color" type="text" @input="resetIfEmpty" @keydown.enter="debounceInput"
               placeholder="Rechercher">
      </div>
    </div>

    <div class="wrapper wrapper--with-panel">
      <Panel>
        <PanelItem>
          <FilterPanel :radio-button-rating="true" :favorite="true" :search-mode="true"
                       :historical-mode="true"
                       @reset="resetInput"/>
        </PanelItem>
        <PanelItem>
          <HistoricalPanel @refresh="refreshInput"/>
        </PanelItem>

        <PanelItem :is-active="$auth.loggedIn">
          <FavoritePanel @fetch="setInput"/>
        </PanelItem>
      </Panel>
      <ExercisesPanel @reset="resetInput"/>
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
    async fetch({app: {$accessor}, $auth, error}) {
      await $accessor.tags.fetch({state: ["VALIDATED"], countStates: ["VALIDATED"]});
      await $accessor.tags.apply("default");

      await $accessor.exercises.fetch({
        metadata: {size: 30},
        includeOptions: {includeDescription: false},
        orderBy: [{field: "date", value: "DESC"}, {field: 'id', value: 'ASC'}],
        filterOptions: {
          state: ["VALIDATED"]
        }
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

    debounceInput(e: any) {
      const value = e.target.value;
      this.$accessor.exercises.fetch({data: {title: value}});
      this.$accessor.historical.addHistorical({
        tags: this.$accessor.tags.selectedTags,
        title: value,
        vote: this.$accessor.exercises.search_criterion.vote
      })
    }

    resetInput() {
      this.inputText.value = ""
    }

    resetIfEmpty(e:any) {
      const value:string =  e.target.value;

      if(value === '') {
        this.$accessor.exercises.fetch({data: {title: ""}});
      }
    }

    refreshInput() {
      this.inputText.value = this.$accessor.exercises.search_criterion.title || '';
    }

    setInput() {
      const title = this.$accessor.exercises.search_criterion.title;
      this.inputText.value = !!title ? title : '';
    }

    mounted() {
      this.setInput();
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
