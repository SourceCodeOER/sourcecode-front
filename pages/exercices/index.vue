<template>
  <div class="container--with-menu">
    <div class="banner search-banner">
      <div class="input-wrapper--with-icon">
        <SearchSymbol/>
        <input ref="inputText" class="input--primary-color" type="text" v-on:input="debounceInput" placeholder="Rechercher">
      </div>
    </div>

    <div class="wrapper wrapper--with-panel">
      <transition name="fade" mode="out-in" duration="400">
        <FilterPanel @reset="resetInput" v-if="currentAsidePanel === 0"/>
        <HistoricalPanel v-else-if="currentAsidePanel === 1"/>
      </transition>
      <ExercisesPanel/>
    </div>
  </div>
</template>

<script lang="ts">
  import FilterPanel from "~/components/Panel/FilterPanel.vue";
  import HistoricalPanel from '~/components/Panel/HistoricalPanel.vue'
  import ExercisesPanel from "~/components/Panel/ExercisesPanel.vue";
  import SearchSymbol from "~/components/Symbols/SearchSymbol.vue";
  import {Component, Ref, Vue} from "vue-property-decorator";
  import {BusEvent} from '~/components/Event/BusEvent'
  import {SearchRequest} from "~/types";

  const debounce = require('lodash.debounce');

  const FILTER_PANEL = 0;
  const HISTORICAL_PANEL = 1;
  const FAVORITE_PANEL = 2;

  @Component({
    components: {
      FilterPanel,
      ExercisesPanel,
      SearchSymbol,
      HistoricalPanel
    },
    async fetch({app: {$accessor}}) {
      await $accessor.tags.fetch();
      await $accessor.tags.apply();
      await $accessor.search.fetch({metadata: {size:20}} as SearchRequest);
    },
    auth:false,
    middleware: 'exercises-store'
  })
  export default class extends Vue {
    currentAsidePanel: 0 | 1 | 2 = FILTER_PANEL;

    @Ref() inputText!: HTMLInputElement;

    private changePanel(id: 0 | 1 | 2) {
      this.currentAsidePanel = id
    }

    debounceInput = debounce((e: any) => {

      const value = e.target.value;
      this.$accessor.search.fetch({data: {title: value}});
      this.$accessor.historical.addHistorical({tags:this.$accessor.tags.selectedTags, title: value})
    }, 300);

    resetInput() {
      this.inputText.value = ''
    }

    beforeDestroy() {
      BusEvent.$off('changePanel', this.changePanel)
    }

    mounted() {
      const title = this.$accessor.search.search_criterion.title;
      this.inputText.value = !!title ? title : ''
    }

    created() {
      BusEvent.$on('changePanel', this.changePanel)
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
