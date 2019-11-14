<template>
  <div class="container">
    <div class="search-banner">
      <div class="input-wrapper">
        <SearchSymbol/>
        <input type="text" v-model="searchModel" placeholder="Rechercher">
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
            try {
                await $accessor.tags.fetchTags()
            } catch (e) {
                $accessor.tags.INIT([])
            }
        }
    })
    export default class extends Vue {
        searchModel: string = '';
        currentAsidePanel: 0 | 1 | 2 = FILTER_PANEL;

        private changePanel(id: 0|1|2) {
            this.currentAsidePanel = id
        }

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
  @import "./../assets/css/_function";
  @import "./../assets/css/_font";


  .container {
    width: calc(100% - #{$MENU_WIDTH});
    margin-left: auto;
    position: relative;
  }

  .wrapper {
    padding-left: $PADDING_CONTENT;
    padding-right: $PADDING_CONTENT;
    padding-top: $PADDING_TOP_CONTENT;
  }

  .search-banner {
    background-color: white;
    height: $BANNER_LOGO_HEIGHT;
    position: fixed;
    top: 0;
    width: calc(100% - #{$MENU_WIDTH});
    padding-left: $PADDING_CONTENT;
    padding-right: $PADDING_CONTENT;
    display: flex;
    align-items: center;

    .input-wrapper {
      width: 100%;
      position: relative;
    }

    input {
      width: 100%;
      padding-left: 50px;
    }

    svg {
      width: 15px;
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
    }
  }
</style>
