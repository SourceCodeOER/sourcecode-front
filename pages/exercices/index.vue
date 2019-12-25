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
      <transition name="fade" mode="out-in" duration="400">
        <FilterPanel :search-mode="true" :historical-mode="true" @reset="resetInput" v-if="currentAsidePanel === 0"/>
        <HistoricalPanel v-else-if="currentAsidePanel === 1"/>
        <FavoritePanel v-else-if="currentAsidePanel === 2"/>
      </transition>
      <ExercisesPanel/>
    </div>
  </div>
</template>

<script lang="ts">
  import FilterPanel from "~/components/Panel/FilterPanel.vue";
  import HistoricalPanel from '~/components/Panel/HistoricalPanel.vue';
  import FavoritePanel from '~/components/Panel/FavoritePanel.vue';
  import ExercisesPanel from "~/components/Panel/ExercisesPanel.vue";
  import {Component, Ref, Mixins} from "vue-property-decorator";
  import {SearchRequest} from "~/types";
  import FilterPanelMixins from "~/components/Mixins/FilterPanelMixins.vue";
  import Icon from "~/components/Symbols/Icon.vue";

  const debounce = require('lodash.debounce');

  @Component({
    components: {
      FilterPanel,
      ExercisesPanel,
      FavoritePanel,
      HistoricalPanel,
      Icon
    },
    async fetch({app: {$accessor}, $auth}) {
      await $accessor.tags.fetch();
      await $accessor.tags.apply();
      await $accessor.search.fetch({metadata: {size: 20}} as SearchRequest);

      if($auth.loggedIn) {
        await $accessor.favorites.fetch()
      }
    },
    auth: false,
    middleware: 'exercises-store'
  })
  export default class extends Mixins(FilterPanelMixins) {
    @Ref() inputText!: HTMLInputElement;

    debounceInput = debounce((e: any) => {
      const value = e.target.value;
      this.$accessor.search.fetch({data: {title: value}});
      this.$accessor.historical.addHistorical({tags: this.$accessor.tags.selectedTags, title: value})
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
