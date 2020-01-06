<template>
  <div class="container--with-menu" id="MyExercises">
    <div class="banner banner--with-shadow-bottom">

      <div class="banner__nav">
      <span>
        Gestion > Mes exercices
      </span>
      </div>
    </div>

    <div class="wrapper wrapper--with-panel wrapper--with-table">

      <Panel>
        <PanelItem>
          <FilterPanel :reset-button="true" :favorite="true" :search-mode="true" :historical-mode="true"
                       @reset="resetInput"/>
        </PanelItem>
        <PanelItem>
          <HistoricalPanel/>
        </PanelItem>

        <PanelItem>
          <FavoritePanel/>
        </PanelItem>
      </Panel>

      <section>

        <h1>Mes exercices</h1>

        <div class="header-wrapper">
          <div class="input-wrapper--with-icon">
            <Icon type="search"/>
            <input ref="inputText" class="input--primary-color" type="text" v-on:input="debounceInput"
                   placeholder="Rechercher">
          </div>

          <div class="header-wrapper__buttons">

            <transition name="fade">
              <button v-show="!isSelectedExercisesEmpty" @click="deleteSelectedExercises"
                      class="button--red-reverse button--with-symbol">
                Supprimer
                <Icon type="trash" theme="theme--white"/>
              </button>
            </transition>

            <nuxt-link to="/gestion/mes-exercices/creer-exercice">
              <button class="button--ternary-color-reverse button--with-symbol">Créer un exercice
                <Icon type="plus" theme="theme--white"/>
              </button>
            </nuxt-link>
          </div>

        </div>

        <table class="table--with-sticky-header">
          <thead>
          <tr>
            <th class="item-checkbox"></th>
            <th class="item-left">Titre</th>
            <th>Nb de votes</th>
            <th>Moyenne</th>
            <th>Mis à jour</th>
            <th class="item-centered">Fichier(s)</th>
            <th class="item-centered">Validé</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="exercise in exercises" :key="exercise.id">
            <td class="item-centered item-checkbox">
              <CheckBox :state="exercise.isSelected" :id="exercise.id" @check="addOrRemoveExercise"/>
            </td>
            <td class="item-left" @click="gotoExercise(exercise.id)">{{exercise.title}}</td>
            <td @click="gotoExercise(exercise.id)">{{exercise.metrics.votes}}</td>
            <td @click="gotoExercise(exercise.id)">{{!!exercise.metrics.avg_score ? exercise.metrics.avg_score : '-'}}
            </td>
            <td @click="gotoExercise(exercise.id)">{{$moment(exercise.updatedAt).format("DD/MM/YY à H:mm")}}</td>
            <td @click="gotoExercise(exercise.id)" class="item-centered td--with-icon">
              <Icon type="check" theme="theme--green" v-if="!!exercise.file"/>
              <Icon type="close" theme="theme--red-light" v-else/>
            </td>
            <td @click="gotoExercise(exercise.id)" class="item-centered td--with-icon">
              <Icon type="check" theme="theme--green" v-if="exercise.isValidated"/>
              <Icon type="close" theme="theme--red-light" v-else/>
            </td>
          </tr>
          <tr ref="anchor" id="Anchor"/>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins, Ref} from 'vue-property-decorator'
  import {CheckBoxObjectEmitted, Exercise, ExerciseWithSelection, SearchExerciseRequest} from "~/types";
  import FilterPanel from "~/components/Panel/Item/FilterPanel.vue";
  import HistoricalPanel from "~/components/Panel/Item/HistoricalPanel.vue";
  import FavoritePanel from "~/components/Panel/Item/FavoritePanel.vue";
  import IntersectMixins from "~/components/Mixins/IntersectMixins.vue";
  import Icon from "~/components/Symbols/Icon.vue";
  import CheckBox from "~/components/Input/CheckBox.vue";
  import sortedIndex from 'lodash.sortedindex'
  import {BusEvent} from "~/components/Event/BusEvent";
  import binarySearch from "~/assets/js/array/binarySearch";
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";

  const debounce = require('lodash.debounce');

  const ratio = .2;

  @Component({
    components: {
      PanelItem,
      Panel,
      FilterPanel,
      HistoricalPanel,
      FavoritePanel,
      Icon,
      CheckBox
    },
    async fetch({app: {$accessor}, $auth}) {
      await $accessor.tags.fetch();
      await $accessor.tags.apply("default");
      await $accessor.search.fetch({metadata: {size: 50}, data: {user_ids: [$auth.user.id]}} as SearchExerciseRequest);
      await $accessor.favorites.fetch()
    },
    auth: true,
    middleware: ['auth', 'gestion-store']
  })
  export default class extends Mixins(IntersectMixins) {
    /**
     * A reference to the input html element for the search
     */
    @Ref() inputText!: HTMLInputElement;
    /**
     * A reference to the anchor element in the table (for the intersection observer)
     */
    @Ref() anchor!: Element;

    /**
     * The selected exercises with the checkboxes
     */
    selectedExercises: number[] = [];

    /**
     * Configuration for the intersection observer
     */
    intersectionObserverOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: ratio
    };

    /**
     * Retrieve the exercises from the store and add a state for the selection of the exercise
     */
    get exercises(): ExerciseWithSelection[] {
      const exercises = this.$accessor.search.exercises;
      const length = this.selectedExercises.length;
      return exercises.map((exercise: Exercise) => {
        return {...exercise, isSelected: binarySearch(this.selectedExercises, exercise.id, 0, length - 1)}
      });
    }

    /**
     * Check if the selected exercises array is empty
     */
    get isSelectedExercisesEmpty() {
      return this.selectedExercises.length === 0;
    }

    /**
     * Add or remove an id from the selected exercises array
     * Add if state of the checkbox is true and the item is not in the array
     * Remove if state of the checkbox is false and the item is in the array
     * @param id
     * @param state
     */
    addOrRemoveExercise({id, state}: CheckBoxObjectEmitted) {
      const index = this.selectedExercises.findIndex(exerciseId => exerciseId === id);

      if (index === -1 && state) {
        this.selectedExercises.splice(sortedIndex(this.selectedExercises, id), 0, id);
      } else if (index !== -1 && !state) {
        this.selectedExercises.splice(index, 1)
      }
    }

    /**
     * Remove from the databases the exercises and update the search store
     */
    async deleteSelectedExercises() {
      try {
        await this.$axios.$delete('api/bulk/delete_exercises', {data: this.selectedExercises});
        BusEvent.$emit('displayNotification', {
          mode: "success",
          message: `${this.selectedExercises.length} ${this.selectedExercises.length === 1 ? 'exercice a' : 'exercices ont'} été correctement supprimé.`
        });

        this.selectedExercises = [];
        this.$accessor.search.fetch({})
      } catch (e) {
        BusEvent.$emit('displayNotification', {
          mode: "error",
          message: `Une erreur est survenue lors de la suppression.`
        });
      }
    }

    /**
     * Event for the input html element
     * Search with the title entered and update the store
     */
    debounceInput = debounce((e: any) => {
      const value = e.target.value;
      this.$accessor.search.fetch({data: {title: value}});
      this.$accessor.historical.addHistorical({tags: this.$accessor.tags.selectedTags, title: value})
    }, 300);

    /**
     * Reset the input value
     */
    resetInput() {
      this.inputText.value = ''
    }

    /**
     * Go to the exercise with a specific id
     * @param id
     */
    gotoExercise(id: number) {
      this.$router.push('/gestion/mes-exercices/' + id)
    }

    /**
     * Intersection observer logic for the mixin
     * @param entries
     */
    handleIntersect(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.intersectionRatio > ratio && this.$accessor.search.isRemainingPages) {
          this.$accessor.search.next()
        }
      });
    }

    /**
     * add the target to the intersection observer
     */
    targets(): Element[] {
      return [this.anchor]
    }

    mounted() {
      const title = this.$accessor.search.search_criterion.title;
      this.inputText.value = !!title ? title : '';
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../assets/css/variables";
  @import "../../../assets/css/function";
  @import "../../../assets/css/font";
  @import "../../../assets/css/table";


  #MyExercises {

    table {
      width: 100%;

      .item-checkbox {
        max-width: 35px;
        min-width: 35px;
      }

      &.table--with-sticky-header {
        thead th {
          top: 168px;
        }
      }
    }
  }
</style>

