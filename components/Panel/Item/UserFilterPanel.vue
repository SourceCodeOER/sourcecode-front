<template>
  <div id="UserFilterPanel" class="scroll-bar--grey">

    <div class="cta-wrapper" v-if="resetButton">
      <span @click="reset">
        <Icon type="return" class="return" theme="theme--secondary-color"/>
      </span>
    </div>
    <div class="panel-wrapper">
      <ul class="selectable-tags">
        <CheckBoxSelecter @change="setUserCriteria"
                          ref="checkBoxSelecter"
                          @toggle-list="toggleList"
                          :select-all-option="true"
                          :default-options="[
              {title:'Utilisateur', state: false},
              {title:'Admin', state: false},
              {title:'Super admin', state: false}
              ]">
          Rôle
        </CheckBoxSelecter>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import CheckBoxSelecter from "~/components/Search/CheckBoxSelecter.vue";
  import {Component, Vue, Emit, Prop, Ref} from 'vue-property-decorator';
  import Icon from "~/components/Symbols/Icon.vue";
  import {ValidationProvider, ValidationObserver} from "vee-validate";
  import {
    CheckboxSelecterObjectEmitted,
    UserRole
  } from "~/types";
  import RadioButtonSelecter from "~/components/Search/RadioButtonSelecter.vue";

  @Component({
    components: {
      CheckBoxSelecter,
      RadioButtonSelecter,
      Icon,
      ValidationProvider,
      ValidationObserver
    }
  })
  export default class UserFilterPanel extends Vue {

    name = "user-filter-panel";

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
     * A reference to each TagSelecter components
     */
    @Ref() checkBoxSelecter!: CheckBoxSelecter;

    /**
     * The current opened tag selecter component
     */
    selectedCheckBoxSelecter: CheckBoxSelecter | undefined = undefined;


    setUserCriteria(event: CheckboxSelecterObjectEmitted[]) {

      const switchFunction = function (el: CheckboxSelecterObjectEmitted) {
        switch (el.index) {
          case 0:
            return 'user';
          case 1:
            return 'admin';
          case 2:
            return 'super_admin';
          default:
            return 'user';
        }
      };

      const userRoleToAdd: UserRole[] = event
        .filter(el => el.data.state)
        .map(switchFunction);

      const userRoleToDelete: UserRole[] = event
        .filter(el => !el.data.state)
        .map(switchFunction);

      this.$accessor.users.REMOVE_SELECTED_USER_ROLE(userRoleToDelete);
      this.$accessor.users.UPDATE_SELECTED_USER_ROLE(userRoleToAdd);

      this.apply();
    }

    /**
     * Apply the search request of the user
     */
    async apply() {
      await this.$accessor.users.fetch({})
    }

    /**
     * reset the form and restore the default panel
     */
    @Emit()
    async reset() {
      this.$accessor.users.RESET();
      await this.apply();
      this.resetFilterPanel()
    }

    /**
     * Save the current tagSelecter or close a tag selecter if previously activated
     * @param userSelecter
     */
    toggleList(userSelecter: CheckBoxSelecter) {
      if (this.selectedCheckBoxSelecter !== undefined) {
        this.selectedCheckBoxSelecter.$data.active = false;
        this.selectedCheckBoxSelecter = undefined;
      }

      if (userSelecter.$data.active === true) {
        this.selectedCheckBoxSelecter = userSelecter
      }
    }

    /**
     * Reset all the panel scroll position and close the current tag selecter opened
     */
    private resetFilterPanel() {
      const filterPanel = document.getElementById('UserFilterPanel');

      if (!!filterPanel) {
        filterPanel.scrollTop = 0
      }

      if (this.selectedCheckBoxSelecter !== undefined) {
        this.selectedCheckBoxSelecter.$data.active = false;
        this.selectedCheckBoxSelecter = undefined;
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/css/variables";
  @import "assets/css/function";
  @import "assets/css/font";

  #UserFilterPanel {
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
