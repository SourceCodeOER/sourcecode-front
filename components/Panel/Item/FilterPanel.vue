<template>
  <div id="FilterPanel" class="scroll-bar--grey">

    <transition name="fade">
      <div class="cta-favorite" v-if="favorite && $auth.loggedIn && !createFavoriteInput" @click="displayFavoriteInput">
        Ajouter aux favoris
        <Icon type="starHalf" theme="theme--secondary-color"/>
      </div>

      <div class="input-favorite-wrapper" v-else-if="favorite && $auth.loggedIn && createFavoriteInput">
        <ValidationObserver v-slot="{valid}">
          <ValidationProvider name="name" rules="required">
            <input v-model="favoriteName" type="text" placeholder="Nommer le favori" class="input--grey">
          </ValidationProvider>
          <button :disabled="!valid" type="submit" @click="validateBeforeSubmit"
                  :class="{'button--grey-light': !valid, 'button--grey-light-reverse': valid}">OK
          </button>
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
        <TagSelecter v-for="tag in tags" ref="tagSelecter" @apply="apply" @toggle-list="toggleList" :tags="tag.tags"
                     :category="tag.id"
                     :select-all-option="mode === 'default'"
                     :key="tag.id">
          {{tag.category}}
        </TagSelecter>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import Tag from "~/components/Tag/Tag.vue";
  import TagSelecter from "~/components/Search/TagSelecter.vue";
  import {Component, Vue, Emit, Prop, Ref} from 'vue-property-decorator';
  import Icon from "~/components/Symbols/Icon.vue";
  import {ValidationProvider, ValidationObserver} from "vee-validate";
  import {BusEvent} from "~/components/Event/BusEvent";
  import {CreateConfigurationRequest} from "~/types";

  @Component({
    components: {
      Tag,
      TagSelecter,
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
     * A reference to each TagSelecter components
     */
    @Ref() tagSelecter!: TagSelecter[]

    /**
     * The current opened tag selecter component
     */
    selectedTagSelecter: TagSelecter | undefined = undefined;
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

    /**
     * Display the favorite input form
     */
    displayFavoriteInput() {
      this.createFavoriteInput = true;
    }

    /**
     * Apply the search request of the user
     */
    async apply() {
      await this.$accessor.tags.apply(this.mode);

      if (this.searchMode) {
        await this.$accessor.search.fetch({data: {tags: this.$accessor.tags.tagsRequest}});
      }

      if (this.historicalMode) {
        this.$accessor.historical.addHistorical({
          tags: this.confirmedTags,
          title: this.$accessor.search.search_criterion.title
        });
      }
    }

    /**
     * Validating part for the favorite input
     */
    async validateBeforeSubmit() {
      if (this.confirmedTags.length !== 0) {
        const tags_id: number[] = this.confirmedTags.map(tag => tag.tag_id);
        const title: string | undefined = this.$accessor.search.search_criterion.title;

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
          BusEvent.$emit('displayNotification', {
            mode: 'success',
            message: "Votre favori a bien été créé."
          })
        } catch (e) {
          BusEvent.$emit('displayNotification', {
            mode: 'error',
            message: "Vos favoris n'ont pas pu être chargé"
          })
        }
      } else {
        BusEvent.$emit('displayNotification', {
          mode: 'warning',
          message: 'Vous devez ajouter au moins un tag afin de créer votre favori'
        })
      }
    }

    /**
     * reset the form and restore the default panel
     */
    @Emit()
    async reset() {
      this.$accessor.tags.CLEAR();

      if (this.searchMode) {
        await this.$accessor.search.fetch({data: {tags: [], title: ''}});
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
    toggleList(tagSelecter: TagSelecter) {
      if (this.selectedTagSelecter !== undefined) {
        this.selectedTagSelecter.$data.active = false;
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
      margin-top: 5px;
      margin-bottom: 15px;

      button {
        padding: 8px 14px;
        height: 100%;
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
      overflow-y: scroll;
      overflow-x: visible;
      height: 100%;
      margin-bottom: 0;

      .tag-selecter {
        margin-bottom: 20px;
      }
    }

  }


</style>
