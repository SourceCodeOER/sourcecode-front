<template>
  <div class="container--with-menu container--with-table" id="AdminUsers">
    <div class="banner banner--with-shadow-bottom">

      <div class="banner__nav">
      <span>
        Administration > Gestion des utilisateurs
      </span>
      </div>
    </div>

    <div class="wrapper wrapper--with-panel wrapper--with-table">

      <Panel>
        <PanelItem>
          <UserFilterPanel></UserFilterPanel>
        </PanelItem>
      </Panel>

      <section>

        <h1>Gestion des utilisateurs</h1>

        <div class="header-wrapper">
          <div class="input-wrapper--with-icon">
            <Icon type="search"/>
            <input ref="inputText" class="input--primary-color" type="text" v-on:input="debounceInput"
                   placeholder="Rechercher">
          </div>

          <div class="header-wrapper__buttons">

            <transition name="fade">
              <CustomSelect v-show="!isSelectedUsersEmpty && role === 'super_admin'" :stateless="true"
                            @change="selectAction"
                            name="moreActions" legend="Plus d'actions"
                            class="custom-select--primary-color custom-select-focus--primary-color"
                            :options="['Utilisateur', 'Admin', 'Super-admin']"/>
            </transition>
          </div>

        </div>

        <table class="table--with-sticky-header">
          <thead>
          <tr>
            <th class="item-checkbox" v-if="role === 'super_admin'"></th>
            <th class="item-left">ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="item-centered item-checkbox" v-if="role === 'super_admin'">
              <CheckBox :state="user.isSelected" :id="user.id" @check="addOrRemoveUser($event, user)"/>
            </td>
            <td class="item-left">{{user.id}}</td>
            <td>{{user.fullName}}</td>
            <td>
              {{user.email}}
            </td>
            <td>
              {{user.role === 'admin' ? 'Administrateur' : user.role === 'super_admin' ? 'Super Administrateur' :
              'Utilisateur'}}
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
  import {Component, Ref, Mixins} from 'vue-property-decorator'
  import {
    CheckBoxObjectEmitted, PutUserRequest,
    UserInfo, UserInfoWithSelection, UserRole
  } from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import CheckBox from "~/components/Input/CheckBox.vue";
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import CustomSelect from "~/components/Input/CustomSelect.vue";
  import TagFilterPanel from "~/components/Panel/Item/TagFilterPanel.vue";
  import {AxiosError} from "~/node_modules/axios";
  import binarySearch from "~/assets/js/array/binarySearch";
  import sortedIndex from "lodash.sortedindex";
  import IntersectMixins from "~/components/Mixins/IntersectMixins.vue";
  import UserFilterPanel from "~/components/Panel/Item/UserFilterPanel.vue";

  const ratio = .2;
  const debounce = require('lodash.debounce');


  @Component({
    components: {
      UserFilterPanel,
      TagFilterPanel,
      CustomSelect,
      PanelItem,
      Panel,
      Icon,
      CheckBox
    },
    async fetch({app: {$accessor}}) {
      await $accessor.users.fetch({})
    },
    middleware: ['auth', 'admin', 'reset-users-store']
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
     * Configuration for the intersection observer
     */
    intersectionObserverOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: ratio
    };

    /**
     * The selected exercises with the checkboxes
     */
    selectedUsers: { id: number, email: string, fullName: string }[] = [];

    get role(): UserRole {
      return this.$auth.user.role
    }

    /**
     * Retrieve the exercises from the store and add a state for the selection of the exercise
     */
    get users(): UserInfoWithSelection[] {
      const users: UserInfo[] = this.$accessor.users.users;
      const length = users.length;
      return users.map((user: UserInfo) => {
        return {...user, isSelected: binarySearch(this.selectedUsers.map(el => el.id), user.id, 0, length - 1)}
      });
    }

    get isSelectedUsersEmpty() {
      return this.selectedUsers.length === 0
    }

    /**
     * Add or remove an id from the selected users array
     * Add if state of the checkbox is true and the item is not in the array
     * Remove if state of the checkbox is false and the item is in the array
     * @param id
     * @param state
     * @param user
     */
    addOrRemoveUser({id, state}: CheckBoxObjectEmitted, user: UserInfoWithSelection) {
      const index = this.selectedUsers.findIndex(user => user.id === id);

      if (index === -1 && state) {
        this.selectedUsers.splice(sortedIndex(this.selectedUsers.map(user => user.id), id), 0, user);
      } else if (index !== -1 && !state) {
        this.selectedUsers.splice(index, 1)
      }
    }

    /**
     * update the state of exercises and notifies the user
     */
    async updateStateOfUsers(state: UserRole) {
      const updateState = (user: { id: number, fullName: string, email: string }, state: UserRole) => {
        const userModified: PutUserRequest = {
          id: user.id,
          role: state
        };

        return this.$axios.$put('/auth/update', userModified)
      };


      Promise
        .all(this.selectedUsers.map(user => updateState(user, state)))
        .then((response) => {
          const length: number = this.selectedUsers.length;

          let roleFormatted: string;

          switch (state) {
            case "admin":
              roleFormatted = "Administrateur";
              break;
            case "user":
              roleFormatted = "Utilisateur";
              break;
            case "super_admin":
              roleFormatted = "Super Administrateur";
              break;
            default:
              roleFormatted = "Visiteur";
              break;
          }

          const messageFormatted = `${length} utilisateur${length > 1 ? 's ont' : ' a'} été promu${length > 1 ? 's' : ''} : ${roleFormatted}`;

          this.$displaySuccess(messageFormatted);
          this.$accessor.users.RESET();
          this.$accessor.users.fetch({});

        }).catch((error: AxiosError) => {
        if (error.response) {
          const status: number = error.response.status;

          if (status >= 400 && status < 500) {
            this.$displayError(`Une erreur est survenue, vérifiez vos données.`)
          } else {
            this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`)
          }
        } else {
          this.$displayError(`Une erreur est survenue. Veuillez-nous en excuser.`)
        }

      });
    }

    /**
     * Reset the input value
     */
    resetInput() {
      this.inputText.value = ''
    }

    /**
     * Event for the input html element
     * Search with the title entered and update the store
     */
    debounceInput = debounce((e: any) => {
      const value = e.target.value;

      if (!!value) {
        this.$accessor.users.fetch({
          fullName: value
        });
      } else {
        this.$accessor.users.fetch({
          fullName: undefined
        });
      }
    }, 300);


    /**
     * Handle action selection from CustomSelect component
     * @param action
     */
    selectAction(action: { content: string, index: number }) {
      if (this.role !== 'super_admin') return;

      if (action.index === 0) {
        this.updateStateOfUsers("user")
      } else if (action.index === 1) {
        this.updateStateOfUsers("admin")
      } else if (action.index === 2) {
        this.updateStateOfUsers("super_admin")
      }
    }

    /**
     * Intersection observer logic for the mixin
     * @param entries
     */
    handleIntersect(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.intersectionRatio > ratio && this.$accessor.users.isRemainingPages) {
          this.$accessor.users.next()
        }
      });
    }

    /**
     * add the target to the intersection observer
     */
    targets(): Element[] {
      return [this.anchor]
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/table";
</style>

