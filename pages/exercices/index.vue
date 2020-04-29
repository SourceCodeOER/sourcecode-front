<template>
  <div class="container--with-menu">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav">
        <span>
          Bibliothèque
        </span>
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
      <ExercisesPanel ref="exercisesPanel"/>
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

    @Ref() exercisesPanel!: ExercisesPanel;

    resetInput() {
      // @ts-ignore
      this.exercisesPanel.resetInput();
    }

    refreshInput() {
      // @ts-ignore
      this.exercisesPanel.refreshInput();
    }

    setInput() {
      // @ts-ignore
      this.exercisesPanel.setInput();
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
