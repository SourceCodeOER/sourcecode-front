<template>
  <div class="container--with-menu container--with-table" id="AdminExercises">
    <div class="banner banner--with-shadow-bottom">

      <div class="banner__nav">
      <span>
        Administration > Gestion des exercices
      </span>
      </div>
    </div>

    <div class="wrapper wrapper--with-panel wrapper--with-table">

      <Panel>
        <PanelItem>
          <FilterPanel strategy="admin" :radio-button-rating="true"
                       :radio-button-state="true"
                       :favorite="true"
                       :search-mode="true"
                       :historical-mode="true"
                       @reset="resetInput"/>
        </PanelItem>
        <PanelItem>
          <HistoricalPanel @refresh="refreshInput"/>
        </PanelItem>

        <PanelItem>
          <FavoritePanel @fetch="refreshInput"/>
        </PanelItem>
      </Panel>

      <section>

        <h1>Gestion des exercices</h1>

        <div>Nombre de résultat(s) : {{nbExercises}}</div>
        <div class="subheader"><span @click.self="exportAll" class="export">exporter les résultats</span> - <span
          @click.self="reset" class="init">réinitialiser la recherche</span></div>


        <div class="header-wrapper">
          <div class="input-wrapper--with-icon input-with--enter-icon">
            <Icon type="search"/>
            <input ref="inputText" class="input--primary-color" type="text" @input="resetIfEmpty" @keydown.enter="debounceInput"
                   placeholder="Rechercher">
          </div>

          <div class="header-wrapper__buttons">

            <transition name="fade">
              <CustomSelect v-show="!isSelectedExercisesEmpty" :stateless="true" @change="selectAction"
                            name="moreActions" legend="Plus d'actions"
                            class="custom-select--primary-color custom-select-focus--primary-color"
                            :options="dropdownSelectionOptions"/>
            </transition>

            <!-- In case you only want a delete button -->
            <!--
            <transition name="fade">
              <button v-show="!isSelectedExercisesEmpty" @click="deleteSelectedExercises"
                      class="button--red-reverse button--with-symbol">
                Supprimer
                <Icon type="trash" theme="theme--white"/>
              </button>
            </transition>
            -->

            <nuxt-link to="/administration/exercices/creer-exercice">
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
            <th>Créateur</th>
            <th>Nb de votes</th>
            <th>Moyenne</th>
            <th>Mis à jour</th>
            <th class="item-centered">Fichier(s)</th>
            <th class="item-centered">Statut</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="exercise in exercises" :key="exercise.id">
            <td class="item-centered item-checkbox">
              <CheckBox :state="exercise.isSelected" :id="exercise.id" @check="addOrRemoveExercise"/>
            </td>
            <td class="item-left" style="max-width: 350px;" @click="gotoExercise(exercise.id)">{{exercise.title}}</td>
            <td class="td--with-icon">
              <template v-if="exercise.creator">
                {{exercise.creator.fullName}}
              </template>
              <template v-else>-</template>
            </td>
            <td @click="gotoExercise(exercise.id)">{{exercise.metrics.votes}}</td>
            <td @click="gotoExercise(exercise.id)">
              {{!!exercise.metrics.avg_score ? exercise.metrics.avg_score : '-'}}
            </td>
            <td @click="gotoExercise(exercise.id)">{{$moment(exercise.updatedAt).format("DD/MM/YY à H:mm")}}</td>
            <td @click="gotoExercise(exercise.id)" class="item-centered">
              <Icon type="check" theme="theme--green" v-if="!!exercise.file"/>
              <Icon type="close" theme="theme--red-light" v-else/>
            </td>
            <td @click="gotoExercise(exercise.id)" class="item-centered">
              <i title="Validé" v-if="exercise.state === 'VALIDATED'">
                <Icon type="check" theme="theme--green"/>
              </i>

              <i title="Invalidé" v-else-if="exercise.state === 'NOT_VALIDATED'">
                <Icon type="close" theme="theme--red-light"/>
              </i>

              <i title="En attente de validation" v-else-if="exercise.state === 'PENDING'">
                <Icon type="send" theme="theme--yellow"/>
              </i>

              <i title="Brouillon" v-else-if="exercise.state === 'DRAFT'">
                <Icon title="Créé" type="paper" theme="theme--primary-color-light"/>
              </i>

              <i title="Archivé" v-else-if="exercise.state === 'ARCHIVED'">
                <Icon type="archive" theme="theme--red-light"/>
              </i>
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
  import {
    CheckBoxObjectEmitted,
    Exercise,
    ExerciseState,
    ExerciseWithSelection,
    ExportExerciseRequest,
    SearchExerciseRequest
  } from "~/types";
  import FilterPanel from "~/components/Panel/Item/FilterPanel.vue";
  import HistoricalPanel from "~/components/Panel/Item/HistoricalPanel.vue";
  import FavoritePanel from "~/components/Panel/Item/FavoritePanel.vue";
  import IntersectMixins from "~/components/Mixins/IntersectMixins.vue";
  import Icon from "~/components/Symbols/Icon.vue";
  import CheckBox from "~/components/Input/CheckBox.vue";
  import sortedIndex from 'lodash.sortedindex'
  import binarySearch from "~/assets/js/array/binarySearch";
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import CustomSelect from "~/components/Input/CustomSelect.vue";
  import UserMixins from "~/components/Mixins/Api/UserMixins";
  import {User} from "~/assets/js/api/user";
  import {AxiosError} from "axios";

  const ratio = .2;

  const download = require('downloadjs');


  @Component({
    components: {
      CustomSelect,
      PanelItem,
      Panel,
      FilterPanel,
      HistoricalPanel,
      FavoritePanel,
      Icon,
      CheckBox
    },
    async fetch({app: {$accessor}}) {
      await $accessor.tags.fetch({});
      await $accessor.tags.apply("default");
      await $accessor.exercises.fetch({
        metadata: {size: 50},
        orderBy: [{field: "date", value: "DESC"}, {field: 'id', value: 'ASC'}],
        includeOptions: {
          includeTags: false,
          includeDescription: false,
          includeCreator: true
        }
      } as SearchExerciseRequest);
      await $accessor.favorites.fetch()
    },
    middleware: ['auth', 'admin', 'reset-search-request']
  })
  export default class extends Mixins(UserMixins, IntersectMixins) {
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
      const exercises = this.$accessor.exercises.exercises;
      const length = this.selectedExercises.length;
      return exercises.map((exercise: Exercise) => {
        return {...exercise, isSelected: binarySearch(this.selectedExercises, exercise.id, 0, length - 1)}
      });
    }

    get dropdownSelectionOptions(): string[] {
      const options: string[] = ['Valider', 'Brouillon', 'Mettre en attente', 'Invalider', 'Exporter', 'Archiver'];

      switch (this.role) {
        case User.ADMIN:
          return options;
        case User.SUPER_ADMIN:
          return [...options, 'Supprimer']
      }

      return []
    }

    /**
     * Check if the selected exercises array is empty
     */
    get isSelectedExercisesEmpty() {
      return this.selectedExercises.length === 0;
    }

    get nbExercises(): number {
      return this.$accessor.exercises.metadata.totalItems
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
        this.$displaySuccess(`${this.selectedExercises.length} ${this.selectedExercises.length === 1 ? 'exercice a' : 'exercices ont'} été correctement supprimé.`);
      } catch (e) {
        const error = e as AxiosError;

        if (error.response) {
          const status: number = error.response.status;

          if (status === 400) {
            this.$displayError(`Une erreur est survenue, vérifiez vos données.`);
          } else if (status === 401) {
            this.$displayError("Vous devez vous connecter pour effectuer cette action.")
          } else if (status === 403) {
            this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action !`);
          } else if (status === 500) {
            this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`);
          }
        } else {
          this.$displayError(`Une erreur est survenue lors de la suppression.`);
        }
      }

      this.selectedExercises = [];
      this.$accessor.exercises.fetch({})
    }

    /**
     * Remove from the databases the exercises and update the search store
     */
    async updateStateOfExercises(state: ExerciseState) {
      let message: string;
      const nbOfExercises = this.selectedExercises.length;

      if (state === 'PENDING') {
        message = `${nbOfExercises} ${nbOfExercises === 1 ? 'exercice a' : 'exercices ont'} été correctement envoyé${nbOfExercises === 1 ? '' : 's'} pour inspection.`
      } else if (state === 'VALIDATED') {
        message = `${nbOfExercises} ${nbOfExercises === 1 ? 'exercice a' : 'exercices ont'} bien été publié${nbOfExercises === 1 ? '' : 's'}.`
      } else if (state === 'NOT_VALIDATED') {
        message = `${nbOfExercises} ${nbOfExercises === 1 ? 'exercice a' : 'exercices ont'} été marqué${nbOfExercises === 1 ? '' : 's'} comme invalide${nbOfExercises === 1 ? '' : 's'}.`
      } else if (state === 'DRAFT') {
        message = `${nbOfExercises} ${nbOfExercises === 1 ? 'exercice a' : 'exercices ont'} été marqué${nbOfExercises === 1 ? '' : 's'} comme brouillon${nbOfExercises === 1 ? '' : 's'}.`
      } else if (state === 'ARCHIVED') {
        message = `${nbOfExercises} ${nbOfExercises === 1 ? 'exercice a' : 'exercices ont'} été marqué${nbOfExercises === 1 ? '' : 's'} comme archivé${nbOfExercises === 1 ? '' : 's'}.`

      } else {
        message = `${nbOfExercises} ${nbOfExercises === 1 ? 'exercice a' : 'exercices ont'} été correctement dépublié${nbOfExercises === 1 ? '' : 's'}.`
      }

      try {
        await this.$axios.$put('/api/bulk/modify_exercises_status', {exercises: this.selectedExercises, state});
        this.$displaySuccess(message);
      } catch (e) {
        const error = e as AxiosError;

        if (error.response) {
          const status: number = error.response.status;

          if (status === 400) {
            this.$displayError(`Une erreur est survenue, vérifiez vos données.`);
          } else if (status === 401) {
            this.$displayError("Vous devez vous connecter pour effectuer cette action.")
          } else if (status === 403) {
            this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action !`);
          } else if (status === 500) {
            this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`);
          }
        } else {
          this.$displayError(`Une erreur est survenue lors du changement d'état.`);
        }
      }

      this.selectedExercises = [];
      this.$accessor.exercises.fetch({})
    }

    /**
     * Event for the input html element
     * Search with the title entered and update the store
     */
    debounceInput(e: any)  {
      const value = e.target.value;
      this.$accessor.exercises.fetch({data: {title: value}});
      this.$accessor.historical.addHistorical({tags: this.$accessor.tags.selectedTags, title: value})
    }

    resetIfEmpty(e:any) {
      const value:string =  e.target.value;

      if(value === '') {
        this.$accessor.exercises.fetch({data: {title: ''}});
      }
    }

    refreshInput() {
      this.inputText.value = this.$accessor.exercises.search_criterion.title || '';
    }

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
      this.$router.push('/administration/exercices/' + id)
    }

    /**
     * Intersection observer logic for the mixin
     * @param entries
     */
    handleIntersect(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.intersectionRatio > ratio && this.$accessor.exercises.isRemainingPages) {
          this.$accessor.exercises.next()
        }
      });
    }

    /**
     * add the target to the intersection observer
     */
    targets(): Element[] {
      return [this.anchor]
    }

    selectAction(action: { content: string, index: number }) {
      if (action.index === 0) {
        this.updateStateOfExercises('VALIDATED')
      } else if (action.index === 1) {
        this.updateStateOfExercises('DRAFT')
      } else if (action.index === 2) {
        this.updateStateOfExercises('PENDING')
      } else if (action.index === 3) {
        this.updateStateOfExercises('NOT_VALIDATED')
      } else if (action.index === 4) {
        this.exportExercises()
      } else if (action.index === 5) {
        this.updateStateOfExercises('ARCHIVED')
      } else if (action.index === 6 && this.isSuperAdmin) {
        this.deleteSelectedExercises()
      }
    }

    async exportExercises() {
      try {
        const result = await this.$axios.$post('/api/export', {data: {exercise_ids: this.selectedExercises}});

        const blob = new Blob([JSON.stringify(result)], {type: 'application/json;charset=utf-8;'});

        download(blob, "export.json", 'application/json;charset=utf-8;');

        this.$displaySuccess("L'export a bien été effectué.");
        this.selectedExercises = [];

      } catch (e) {
        const error = e as AxiosError;

        if (error.response) {
          const status: number = error.response.status;

          if (status === 400) {
            this.$displayError(`Une erreur est survenue, vérifiez vos données.`);
          } else if (status === 401) {
            this.$displayError("Vous devez vous connecter pour effectuer cette action.")
          } else if (status === 403) {
            this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action !`);
          } else if (status === 500) {
            this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`);
          }
        } else {
          this.$displayError(`Une erreur est survenue lors de l'export.`);
        }
      }
    }

    async exportAll() {
      try {
        const data = this.$accessor.exercises.search_criterion;
        const filterOptions = this.$accessor.exercises.filterOptions;
        const orderBy = this.$accessor.exercises.orderBy;
        const includeOptions = this.$accessor.exercises.includeOptions;

        const exportExerciseRequest: ExportExerciseRequest = {
          data,
          filterOptions,
          orderBy,
          includeOptions
        };

        const result = await this.$axios.$post('/api/export', exportExerciseRequest);

        const blob = new Blob([JSON.stringify(result)], {type: 'application/json;charset=utf-8;'});

        download(blob, "export.json", 'application/json;charset=utf-8;');

        this.$displaySuccess("L'export a bien été effectué.");
        this.selectedExercises = [];

      } catch (e) {
        const error = e as AxiosError;

        if (error.response) {
          const status: number = error.response.status;

          if (status === 400) {
            this.$displayError(`Une erreur est survenue, vérifiez vos données.`);
          } else if (status === 401) {
            this.$displayError("Vous devez vous connecter pour effectuer cette action.")
          } else if (status === 403) {
            this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action !`);
          } else if (status === 500) {
            this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`);
          }
        } else {
          this.$displayError(`Une erreur est survenue lors de l'export.`);
        }
      }
    }

    async reset() {
      this.resetInput();
      this.$accessor.tags.CLEAR();
      this.$accessor.exercises.RESET_SEARCH_CRITERION();
      this.$accessor.exercises.RESET_STATE();
      await this.$accessor.exercises.fetch({});
    }

    mounted() {
      const title = this.$accessor.exercises.search_criterion.title;
      this.inputText.value = !!title ? title : '';
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/table";
</style>

