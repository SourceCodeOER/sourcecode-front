<template>
  <div class="container">
    <div class="banner search-banner">
      <div class="input-wrapper">
        <SearchSymbol/>
        <input type="text" v-on:input="debounceInput" placeholder="Rechercher">
      </div>
    </div>

    <div class="wrapper">
      <transition name="fade" mode="out-in" duration="500">
        <FilterPanel v-if="currentAsidePanel === 0"/>
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
    import {Component, Vue} from "vue-property-decorator";
    import {BusEvent} from '~/components/Event/BusEvent'

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
            await $accessor.search.fetch({});
        }
    })
    export default class extends Vue {
        currentAsidePanel: 0 | 1 | 2 = FILTER_PANEL;

        private changePanel(id: 0 | 1 | 2) {
            this.currentAsidePanel = id
        }

        debounceInput = debounce((e: any) => {
            this.$accessor.search.fetch({data: {title: e.target.value}})
        }, 250);

        beforeDestroy() {
            BusEvent.$off('changePanel', this.changePanel)
        }

        created() {
            BusEvent.$on('changePanel', this.changePanel)
        }
    }
</script>

<style lang="scss" scoped>
  @import "./../assets/css/_variables";

  .wrapper {
    height: 100vh;
    position: relative;
    overflow-y: hidden;
  }

</style>
