<template>
  <div id="FilterPanel" class="scroll-bar--grey">

    <transition name="fade">
      <div class="cta-favorite" v-if="favorite && $auth.loggedIn && !createFavoriteInput" @click="displayFavoriteInput">
        Ajouter aux favoris
        <Icon type="starHalf" theme="theme--secondary-color"/>
      </div>

      <div class="input-favorite-wrapper" v-else-if="favorite && $auth.loggedIn && createFavoriteInput">
        <ValidationObserver v-slot="{valid}" tag="form" @submit.prevent="validateBeforeSubmit">
          <ValidationProvider name="name" rules="required">
            <input v-model="favoriteName" type="text" placeholder="Nommer le favori" class="input--primary-color">
          </ValidationProvider>

          <div>
            <button :disabled="!valid" type="submit"
                    :class="{'button--primary-color': !valid, 'button--primary-color-reverse': valid}">OK
            </button>
            <button class="button--red-reverse">Annuler</button>
          </div>
        </ValidationObserver>
      </div>
    </transition>

    <div class="cta-wrapper" v-if="resetButton">
      <span @click="reset">
        <Icon type="return" class="return" theme="theme--secondary-color"/>
      </span>
    </div>
    <div class="panel-wrapper">
      <ul class="selectable-tags">
        <CheckBoxSelecter v-for="(categoryWithTags, index) in categoryWithSelectedTags" ref="tagSelecter"
                          @change="apply($event, index)" @toggle-list="toggleList"
                          :default-options="categoryWithTags.tags"
                          :select-all-option="mode === 'default'"
                          :key="categoryWithTags.category + '_' + index">
          {{categoryWithTags.category}}
        </CheckBoxSelecter>


        <RadioButtonSelecter v-if="radioButtonRating" @toggle-list="toggleList" @change="setRatingCriteria"
                             :default-value="voteCriteria"
                             :select-default-option="true" :default-options="[
              {title:'Plus de 4 étoiles', value:{operator: '>=', value: 4}},
              {title:'Plus de 3 étoiles', value:{operator: '>=', value: 3}},
              {title:'Plus de 2 étoiles', value:{operator: '>=', value: 2}},
              {title:'Moins de 2 étoiles', value:{operator: '<=', value: 2}}
              ]">
          Cotation
        </RadioButtonSelecter>

        <CheckBoxSelecter v-if="radioButtonState"
                          :select-all-option="true"
                          :default-options="stateDefaultOptions"
                          @toggle-list="toggleList"
                          @change="setStateCriteria"
        >
          Statut
        </CheckBoxSelecter>

      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import Tag from "~/components/Tag/Tag.vue";
  import CheckBoxSelecter from "~/components/Search/CheckBoxSelecter.vue";
  import {Component, Vue, Emit, Prop, Ref} from 'vue-property-decorator';
  import Icon from "~/components/Symbols/Icon.vue";
  import {ValidationProvider, ValidationObserver} from "vee-validate";
  import {
    CategoryWithSelectedTags,
    CheckboxObject,
    CheckboxSelecterObjectEmitted,
    CreateConfigurationRequest,
    ExerciseState,
    RadiobuttonSelecterObjectEmitted,
    UserRoleWithGuest,
    VoteExerciseRequest
  } from "~/types";
  import RadioButtonSelecter from "~/components/Search/RadioButtonSelecter.vue";
  import {AxiosError} from "axios";

  @Component({
    components: {
      CheckBoxSelecter,
      RadioButtonSelecter,
      Tag,
      Icon,
      ValidationProvider,
      ValidationObserver
    }
  })
  export default class FilterPanel extends Vue {

    name = "filter-panel";

    /**
     * If activated, when clicking on one checkbox, a search request to the database will be triggered
     */
    @Prop({type: Boolean, default: false}) searchMode!: boolean;
    /**
     * If activated, every action in this component will be save in the historical store
     */
    @Prop({type: Boolean, default: false}) historicalMode!: boolean;
    /**
     * If activated, the reset button will be displayed on the panel
     */
    @Prop({type: Boolean, default: false}) resetButton!: boolean;
    /**
     * If activated, add the possibility to create a favorite in this panel
     */
    @Prop({type: Boolean, default: false}) favorite!: boolean;
    /**
     * The default title of this panel
     */
    @Prop({type: String, default: 'Filtres'}) title!: string;
    /**
     * The default icon of this panel (see Icon component)
     */
    @Prop({type: String, default: 'filterBasic'}) icon!: string;
    /**
     * If set to strict, the search request will only consider exercises with the exact match of tags and title
     */
    @Prop({type: String, default: 'default'}) mode!: "strict" | "default";
    /**
     * If activated, the radio button selecter for the rating filter is available
     */
    @Prop({type: Boolean, default: false}) radioButtonRating!: boolean;
    /**
     * If activated, the radio button selecter for the rating filter is available
     */
    @Prop({type: Boolean, default: false}) radioButtonState!: boolean;
    /**
     * The strategy option gives more flexibility whether we are guest, user, admin
     * resetting the filter panel as a guest will only retrieve validated exercises
     */
    @Prop({type: String, default: 'guest'}) strategy!: UserRoleWithGuest;

    /**
     * A reference to each TagSelecter components
     */
    @Ref() tagSelecter!: CheckBoxSelecter[];

    /**
     * The current opened tag selecter component
     */
    selectedTagSelecter: CheckBoxSelecter | RadioButtonSelecter | undefined = undefined;
    /**
     * If active, the input form is displayed to let the user enters the name of the favorite
     */
    createFavoriteInput: boolean = false;
    /**
     * The name of the favorite entered by the user
     */
    favoriteName: string = '';


    /**
     * get the current selected tags from the store
     */
    get confirmedTags() {
      return this.$accessor.tags.selectedTags
    }

    /**
     * get all the existing tags from the store
     */
    get tags() {
      return this.$accessor.tags.tags
    }

    get voteCriteria() {
      const vote = this.$accessor.exercises.search_criterion.vote;
      return vote ? vote : 'default';
    }

    get stateCriteria(): ExerciseState[] {
      const state: ExerciseState[] | undefined = this.$accessor.exercises.filterOptions.state;
      return state ? state : [];
    }

    get stateDefaultOptions() {
      const defaultOptions: CheckboxObject[] = [
        {
          title: 'Non répertorié',
          state: false,
        },
        {
          title: 'En attente',
          state: false,
        },
        {
          title: 'Valide',
          state: false,
        },
        {
          title: 'Invalide',
          state: false,
        },
        {
          title: 'Archivé',
          state:false
        }
      ];

      for (let state of this.stateCriteria) {
        switch (state) {
          case 'DRAFT':
            defaultOptions[0].state = true;
            break;
          case 'PENDING':
            defaultOptions[1].state = true;
            break;
          case 'VALIDATED':
            defaultOptions[2].state = true;
            break;
          case 'NOT_VALIDATED':
            defaultOptions[3].state = true;
            break;
        }
      }

      return defaultOptions
    }

    /**
     * get all the existing tags from the store
     */
    get categoryWithSelectedTags(): { category: string, tags: CheckboxObject[] }[] {
      return this.$accessor.tags.tags.map((tag: CategoryWithSelectedTags) => {
        const tags: { title: string, state: boolean }[] = tag.tags.map(tagSelecter => {
          return {title: `${tagSelecter.tag_text} (${tagSelecter.total})`, state: tagSelecter.isSelected}
        });
        return {category: tag.category, tags}
      })
    }

    setRatingCriteria(event: RadiobuttonSelecterObjectEmitted) {

      if (this.searchMode) {
        if (event.index === -1) {
          this.$accessor.exercises.RESET_VOTE();
          this.$accessor.exercises.fetch({});
        } else {
          const value: VoteExerciseRequest = event.data.value as VoteExerciseRequest;
          this.$accessor.exercises.fetch({data: {vote: value}})
        }
      }

      if (this.historicalMode) {
        this.$accessor.historical.addHistorical({
          tags: this.confirmedTags,
          title: this.$accessor.exercises.search_criterion.title,
          vote: this.$accessor.exercises.search_criterion.vote
        });
      }
    }

    async setStateCriteria(event: CheckboxSelecterObjectEmitted[]) {

      const deletedStates: ExerciseState[] = event
        .filter(el => !el.data.state)
        .map(el => {
          const i = el.index;

          if (i == 0) {
            return 'DRAFT'
          } else if (i == 1) {
            return 'PENDING'
          } else if (i == 2) {
            return 'VALIDATED'
          } else if(i == 3) {
            return 'NOT_VALIDATED'
          } else {
            return 'ARCHIVED'
          }
        });

      const selectedStates: ExerciseState[] = event
        .filter(el => el.data.state)
        .map(el => {
          const i = el.index;

          if (i == 0) {
            return 'DRAFT'
          } else if (i == 1) {
            return 'PENDING'
          } else if (i == 2) {
            return 'VALIDATED'
          } else if(i == 3) {
            return 'NOT_VALIDATED'
          } else {
            return 'ARCHIVED'
          }
        });

      const remainingStateCriteria: ExerciseState[] = this.stateCriteria
        .filter(el =>
          deletedStates.findIndex(state => state === el) === -1
          &&
          selectedStates.findIndex(state => state === el) === -1);

      const states: ExerciseState[] = [...remainingStateCriteria, ...selectedStates];

      await this.$accessor.exercises.fetch({filterOptions: {state: states.length > 0 ? states : undefined}})

    }

    /**
     * Display the favorite input form
     */
    displayFavoriteInput() {
      this.createFavoriteInput = true;
    }

    closeFavoriteInput() {
      this.createFavoriteInput = false;
    }

    /**
     * Apply the search request of the user
     */
    async apply(selectedOptions: CheckboxSelecterObjectEmitted[], index: number) {
      selectedOptions.forEach(selectOption => {
        this.$accessor.tags.addOrRemoveTag({
          ...this.tags[index].tags[selectOption.index],
          isSelected: selectOption.data.state
        });
      });

      await this.$accessor.tags.apply(this.mode);

      if (this.searchMode) {
        await this.$accessor.exercises.fetch({data: {tags: this.$accessor.tags.tagsRequest}});
      }

      if (this.historicalMode) {
        this.$accessor.historical.addHistorical({
          tags: this.confirmedTags,
          title: this.$accessor.exercises.search_criterion.title,
          vote: this.$accessor.exercises.search_criterion.vote
        });
      }
    }

    /**
     * Validating part for the favorite input
     */
    async validateBeforeSubmit() {
        const tags_id: number[] = this.confirmedTags.map(tag => tag.tag_id);
        const title: string | undefined = this.$accessor.exercises.search_criterion.title;

        const configurationBuild: CreateConfigurationRequest = {
          tags: tags_id,
          name: this.favoriteName
        };

        if (title !== '' && title !== undefined) {
          configurationBuild.title = title
        }

        try {
          await this.$accessor.favorites.createFavorite(configurationBuild);
          this.favoriteName = '';
          this.createFavoriteInput = false;
          this.$displaySuccess("Votre favori a bien été créé.");
        } catch (e) {
          this.$displayError('Un problème est survenu lors de la création du favori.');
        }
    }

    /**
     * reset the form and restore the default panel
     */
    @Emit()
    async reset() {
      this.$accessor.tags.CLEAR();

      if (this.searchMode) {
        this.$accessor.exercises.RESET_SEARCH_CRITERION();
        this.$accessor.exercises.RESET_STATE();

        if (this.strategy === 'guest') {
          await this.$accessor.exercises.fetch({
            filterOptions: {
              state: ["VALIDATED"]
            }
          });

        } else {
          await this.$accessor.exercises.fetch({});
        }
      }

      if (this.mode === 'default') {
        this.tagSelecter.forEach(selecter => selecter.$data.selectAllState = false)
      }

      this.resetFilterPanel()
    }

    /**
     * Save the current tagSelecter or close a tag selecter if previously activated
     * @param tagSelecter
     */
    toggleList(tagSelecter: CheckBoxSelecter | RadioButtonSelecter) {
      if (this.selectedTagSelecter !== undefined) {
        // @ts-ignore
        this.selectedTagSelecter.closeList();
        this.selectedTagSelecter = undefined;
      }

      if (tagSelecter.$data.active === true) {
        this.selectedTagSelecter = tagSelecter
      }
    }

    /**
     * Reset all the panel scroll position and close the current tag selecter opened
     */
    private resetFilterPanel() {
      const filterPanel = document.getElementById('FilterPanel');

      if (!!filterPanel) {
        filterPanel.scrollTop = 0
      }

      if (this.selectedTagSelecter !== undefined) {
        this.selectedTagSelecter.$data.active = false;
        this.selectedTagSelecter = undefined;
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/css/variables";
  @import "assets/css/function";
  @import "assets/css/font";

  #FilterPanel {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    position: relative;
    padding: 20px 20px 0;

    .panel-wrapper {
      height: calc(100% - 80px);
    }

    .cta-wrapper {
      position: absolute;
      top: 20px;
      right: 20px;
      color: $SECONDARY_COLOR;

      svg {
        width: 19px;
        vertical-align: middle;
        margin-left: 10px;
        cursor: pointer;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    h3 {
      margin-bottom: 0;
    }

    .cta-favorite {
      display: flex;
      align-items: center;
      color: $SECONDARY_COLOR;
      cursor: pointer;
      font-weight: bold;
      margin-bottom: 15px;


      svg {
        width: 23px;
        margin-left: 8px;
      }

      span {
        display: block;
      }
    }

    .input-favorite-wrapper {
      margin-top: 30px;
      margin-bottom: 15px;

      > form {
        display: flex;
        flex-direction: column;
      }
      input {
        width: 100%;
      }

      div {
        margin-top: 10px;

        display: flex;
        justify-content: space-between;
      }

      button {
        padding: 8px 14px;
        height: 40px;
        width: 48%;
        margin-top: 0;
      }
    }

    .button-wrapper {
      position: absolute;
      bottom: 0;
      margin-top: auto;
      padding-bottom: 20px;
      width: calc(100% - 40px);
    }

    .selectable-tags {
      list-style-type: none;
      padding: 0;
      height: 100%;
      margin-bottom: 0;

      /*
      .tag-selecter {
        margin-bottom: 20px;
      }

       */
    }

  }


</style>
