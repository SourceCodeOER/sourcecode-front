<template>
  <div class="container--with-menu" id="MyExercises">
    <div class="banner banner--with-shadow-bottom banner--nav">
      <span>
        Gestion > Mes exercices
      </span>
      <nuxt-link to="/exercices" tag="span">
        <ArrowSymbol class="reversed-arrow" theme="theme--secondary-color"/>
        Retour
      </nuxt-link>
    </div>

    <div class="wrapper wrapper--with-panel">
      <transition name="fade" mode="out-in" duration="400">
        <FilterPanel @reset="resetInput" v-if="currentAsidePanel === 0"/>
        <HistoricalPanel v-else-if="currentAsidePanel === 1"/>
      </transition>

      <section>

        <h1>Mes exercices</h1>

        <div class="search-bar">
          <div class="input-wrapper--with-icon">
            <SearchSymbol/>
            <input ref="inputText" class="input--primary-color" type="text" v-on:input="debounceInput"
                   placeholder="Rechercher">
          </div>
        </div>

        <table class="table--with-sticky-header">
          <thead>
          <tr>
            <th class="item-left">Titre</th>
            <th>Nb de votes</th>
            <th>Moyenne</th>
            <th>Mis à jour</th>
            <th class="item-centered">Fichier(s)</th>
            <th class="item-centered">Validé</th>
            <th class="item-centered">Supprimer</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="exercise in exercises" :key="exercise.id">
            <td class="item-left">{{exercise.title}}</td>
            <td>{{exercise.metrics.votes}}</td>
            <td>{{!!exercise.metrics.avg_vote ? exercise.metrics.avg_vote : '-'}}</td>
            <td>{{$moment(exercise.updatedAt).format("DD/MM/YY à H:mm")}}</td>
            <td class="item-centered">
              <CheckSymbol class="table-icon" theme="theme--green" v-if="!!exercise.file"/>
              <CloseSymbol class="table-icon" theme="theme--red-light" v-else/>
            </td>
            <td class="item-centered">
              <CheckSymbol class="table-icon" theme="theme--green" v-if="exercise.isValidated"/>
              <CloseSymbol class="table-icon" theme="theme--red-light" v-else/>
            </td>
            <td class="item-centered">
              <TrashSymbol class="table-icon" theme="theme--primary-color-light"/>
            </td>
          </tr>
          <tr id="Anchor"/>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins, Ref} from 'vue-property-decorator'
  import ArrowSymbol from "~/components/Symbols/ArrowSymbol.vue";
  import SearchSymbol from "~/components/Symbols/SearchSymbol.vue";
  import TrashSymbol from "~/components/Symbols/TrashSymbol.vue";
  import CloseSymbol from "~/components/Symbols/CloseSymbol.vue";
  import CheckSymbol from "~/components/Symbols/CheckSymbol.vue";
  import {SearchRequest} from "~/types";
  import FilterPanel from "~/components/Panel/FilterPanel.vue";
  import HistoricalPanel from "~/components/Panel/HistoricalPanel.vue";
  import FavoritePanel from "~/components/Panel/FavoritePanel.vue";
  import FilterPanelMixins from '~/components/Mixins/FilterPanelMixins.vue'
  import IntersectMixins from "~/components/Mixins/IntersectMixins.vue";

  const debounce = require('lodash.debounce');

  const ratio = .2;

  @Component({
    components: {
      ArrowSymbol,
      FilterPanel,
      HistoricalPanel,
      SearchSymbol,
      TrashSymbol,
      FavoritePanel,
      CloseSymbol,
      CheckSymbol
    },
    async fetch({app: {$accessor}}) {
      await $accessor.tags.fetch();
      await $accessor.tags.apply();
      await $accessor.search.fetch({metadata: {size: 50}} as SearchRequest);
      await $accessor.favorites.fetch()
    },
    auth: true,
    middleware: ['auth', 'gestion-store']
  })
  export default class extends Mixins(FilterPanelMixins, IntersectMixins) {
    @Ref() inputText!: HTMLInputElement;

    intersectionObserverOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: ratio
    };

    get exercises() {
      return this.$accessor.search.exercises
    }

    debounceInput = debounce((e: any) => {
      const value = e.target.value;
      this.$accessor.search.fetch({data: {title: value}});
      this.$accessor.historical.addHistorical({tags: this.$accessor.tags.selectedTags, title: value})
    }, 300);

    resetInput() {
      this.inputText.value = ''
    }

    handleIntersect(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.intersectionRatio > ratio && this.$accessor.search.isRemainingPages) {
          this.$accessor.search.next()
        }
      });
    }

    beforeMount() {
      const target = document.querySelector('#Anchor');
      if (target !== null) {
        this.targets.push(target);
      }
    }

    mounted() {
      const title = this.$accessor.search.search_criterion.title;
      this.inputText.value = !!title ? title : '';
    }


  }
</script>

<style lang="scss" scoped>

  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";
  @import "./../../assets/css/_table";


  #MyExercises {

    section {
      background-color: white;
      @include box-shadow($SHADOW);
      border-radius: 4px;
      margin-bottom: 30px;
      padding: 20px;

      .search-bar {
        position: sticky;
        padding: 48px 0 10px 0;
        top: 72px;
        width: 100%;
        background-color: white;
      }

      .input-wrapper--with-icon {
        input {
          max-width: 400px;
          width: 100%;
        }
      }
    }

    table {
      width: 100%;

      &.table--with-sticky-header {
        thead th {
          top: 168px;
        }
      }
    }
  }
</style>

