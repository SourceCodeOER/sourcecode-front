<template>
  <div id="TagFilterPanel" class="scroll-bar--grey">

    <div class="cta-wrapper" v-if="resetButton">
      <span @click="reset">
        <Icon type="return" class="return" theme="theme--secondary-color"/>
      </span>
    </div>
    <div class="panel-wrapper">
      <ul class="selectable-tags">
        <CheckBoxSelecter @change="apply" @toggle-list="toggleList"
                          :default-options="categoriesToCheckboxObjects"
                          :select-all-option="true" ref="tagSelecter">
          Catégories
        </CheckBoxSelecter>

        <CheckBoxSelecter @change="setStateCriteria" @toggle-list="toggleList"
                          :select-all-option="true"
                          :default-options="[
              {title:'Valide', state: false},
              {title:'Invalide', state: false},
              {title:'Obsolète', state: false}
              ]">
          Status
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
  import {BusEvent} from "~/components/Event/BusEvent";
  import {
    Category,
    CategoryWithSelectedTags, CheckboxObject,
    CheckboxSelecterObjectEmitted,
    CreateConfigurationRequest, ExerciseState, RadiobuttonObject, RadiobuttonSelecterObjectEmitted,
    SelectedTag, TagState, VoteExerciseRequest
  } from "~/types";
  import RadioButtonSelecter from "~/components/Search/RadioButtonSelecter.vue";

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
  export default class TagFilterPanel extends Vue {

    name = "tag-filter-panel";

    /**
     * If activated, the reset button will be displayed on the panel
     */
    @Prop({type: Boolean, default: false}) resetButton!: boolean;
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
    @Ref() tagSelecter!: CheckBoxSelecter;

    /**
     * The current opened tag selecter component
     */
    selectedTagSelecter: CheckBoxSelecter | undefined = undefined;

    /**
     * get all the existing tags from the store
     */
    get tags() {
      return this.$accessor.tags.tags
    }

    get categories(): Category[] {
      return this.$accessor.tags.categories
    }

    get selectedCategoriesID(): number[] {
      return this.$accessor.tags.selectedCategories;
    }

    get categoriesToCheckboxObjects(): CheckboxObject[] {
      return this.categories.map(el => {
        return {
          title: el.category,
          state: this.selectedCategoriesID.findIndex(id => el.id === id) !== -1
        }
      })
    }

    setStateCriteria(event: CheckboxSelecterObjectEmitted[]) {

      const switchFunction = function (el: CheckboxSelecterObjectEmitted) {
        switch (el.index) {
          case 0:
            return 'VALIDATED';
          case 1:
            return 'NOT_VALIDATED';
          case 2:
            return 'DEPRECATED';
          default:
            return 'DEPRECATED';
        }
      };

      const tagStateToAdd: TagState[] = event
        .filter(el => el.data.state)
        .map(switchFunction);

      const tagStateToDelete: TagState[] = event
        .filter(el => !el.data.state)
        .map(switchFunction);

      this.$accessor.tags.REMOVE_SELECTED_TAG_STATE(tagStateToDelete);
      this.$accessor.tags.UPDATE_SELECTED_TAG_STATE(tagStateToAdd);
    }

    /**
     * Apply the search request of the user
     */
    async apply(selectedOptions: CheckboxSelecterObjectEmitted[]) {
      selectedOptions.forEach(selectOption => {
        this.$accessor.tags.addOrRemoveCategory({
          index: this.categories[selectOption.index].id,
          state: selectOption.data.state
        })
      });
    }


    /**
     * reset the form and restore the default panel
     */
    @Emit()
    async reset() {
      this.$accessor.tags.CLEAR();

      if (this.mode === 'default') {
        this.tagSelecter.$data.selectAllState = false
      }

      this.resetFilterPanel()
    }

    /**
     * Save the current tagSelecter or close a tag selecter if previously activated
     * @param tagSelecter
     */
    toggleList(tagSelecter: CheckBoxSelecter) {
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
      const filterPanel = document.getElementById('TagFilterPanel');

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

  #TagFilterPanel {
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

    .selectable-tags {
      list-style-type: none;
      padding: 0;
      overflow-y: scroll;
      overflow-x: visible;
      height: 100%;
      margin-bottom: 0;

    }

  }


</style>
