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
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import ArrowSymbol from "~/components/Symbols/ArrowSymbol.vue";
  import SearchSymbol from "~/components/Symbols/SearchSymbol.vue";
  import TrashSymbol from "~/components/Symbols/TrashSymbol.vue";
  import CloseSymbol from "~/components/Symbols/CloseSymbol.vue";
  import CheckSymbol from "~/components/Symbols/CheckSymbol.vue";
  import {SearchRequest} from "~/types";
  import FilterPanel from "~/components/Panel/FilterPanel.vue";
  import HistoricalPanel from "~/components/Panel/HistoricalPanel.vue";
  import {Ref} from "~/node_modules/vue-property-decorator";
  import {BusEvent} from "~/components/Event/BusEvent";

  const debounce = require('lodash.debounce');


  const FILTER_PANEL = 0;
  const HISTORICAL_PANEL = 1;
  const FAVORITE_PANEL = 2;

  @Component({
    components: {
      ArrowSymbol,
      FilterPanel,
      HistoricalPanel,
      SearchSymbol,
      TrashSymbol,
      CloseSymbol,
      CheckSymbol
    },
    async fetch({app: {$accessor}}) {
      await $accessor.tags.fetch();
      await $accessor.tags.apply();
      await $accessor.search.fetch({} as SearchRequest);
    },
    middleware: 'auth'
  })
  export default class extends Vue {
    currentAsidePanel: 0 | 1 | 2 = FILTER_PANEL;

    @Ref() inputText!: HTMLInputElement;

    debounceInput = debounce((e: any) => {

      const value = e.target.value;
      this.$accessor.search.fetch({data: {title: value}});
      this.$accessor.historical.addHistorical({tags: this.$accessor.tags.selectedTags, title: value})
    }, 300);

    private changePanel(id: 0 | 1 | 2) {
      this.currentAsidePanel = id
    }

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

    get exercises() {
      return this.$accessor.search.exercises
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

