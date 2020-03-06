<template>
  <div class="container--with-menu container--with-table" id="AdminExercises">
    <div class="banner banner--with-shadow-bottom">

      <div class="banner__nav">
      <span>
        Administration > Gestion des tags
      </span>
      </div>
    </div>

    <div class="wrapper wrapper--with-panel wrapper--with-table">

      <Panel>
        <PanelItem>
          <TagFilterPanel
            :reset-button="true"
            :search-mode="true"
            @reset="resetInput"/>
        </PanelItem>
      </Panel>

      <section>

        <h1>Gestion des tags</h1>

        <div class="header-wrapper">
          <div class="input-wrapper--with-icon">
            <Icon type="search"/>
            <input ref="inputText" class="input--primary-color" type="text" v-model="searchModel"
                   placeholder="Rechercher">
          </div>

          <div class="header-wrapper__buttons">

            <transition name="fade">
              <CustomSelect v-show="!isSelectedTagsEmpty" :stateless="true" @change="selectAction"
                            name="moreActions" legend="Plus d'actions"
                            class="custom-select--primary-color custom-select-focus--primary-color"
                            :options="dropdownSelectionOptions"/>
            </transition>

            <nuxt-link to="/administration/tags/creer-tag">
              <button class="button--ternary-color-reverse button--with-symbol">Créer un tag
                <Icon type="plus" theme="theme--white"/>
              </button>
            </nuxt-link>
          </div>

        </div>

        <table class="table--with-sticky-header">
          <thead>
          <tr>
            <th class="item-checkbox"></th>
            <th class="item-left">Nom</th>
            <th>Catégorie</th>
            <th>Version</th>
            <th class="item-centered">Status</th>
          </tr>
          </thead>

          <tbody>
          <template v-for="(categoryWithTags, index) in filteredCategoriesWithSearchModel">

            <tr v-for="tag in categoryWithTags.tags" :key="tag.tag_id + '_' + categoryWithTags.category + '_' + index">
              <td class="item-centered item-checkbox">
                <CheckBox :state="tag.isSelected" :id="tag.tag_id" @check="addOrRemoveTags($event, tag)"/>
              </td>
              <td class="item-left" @click="gotoLink(tag.tag_id)">{{tag.tag_text}}</td>
              <td>
                {{categoryWithTags.category}}
              </td>
              <td @click="gotoLink(tag.tag_id)">{{tag.version}}</td>
              <td @click="gotoLink(tag.tag_id)" class="item-centered">
                <i title="Validé" v-if="tag.state === 'VALIDATED'">
                  <Icon type="check" theme="theme--green"/>
                </i>

                <i title="Invalide" v-else-if="tag.state === 'NOT_VALIDATED'">
                  <Icon type="close" theme="theme--red-light"/>
                </i>

                <i title="En attente" v-else-if="tag.state === 'PENDING'">
                  <Icon type="send" theme="theme--yellow"/>
                </i>

                <i title="Obsolète" v-else-if="tag.state === 'DEPRECATED'">
                  <Icon type="archive" theme="theme--orange"/>
                </i>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Ref, Mixins} from 'vue-property-decorator'
  import {
    CategoryWithSelectedTags,
    CheckBoxObjectEmitted,
    SelectedTag, TagExtended, TagState
  } from "~/types";
  import FilterPanel from "~/components/Panel/Item/FilterPanel.vue";
  import HistoricalPanel from "~/components/Panel/Item/HistoricalPanel.vue";
  import FavoritePanel from "~/components/Panel/Item/FavoritePanel.vue";
  import Icon from "~/components/Symbols/Icon.vue";
  import CheckBox from "~/components/Input/CheckBox.vue";
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import CustomSelect from "~/components/Input/CustomSelect.vue";
  import TagFilterPanel from "~/components/Panel/Item/TagFilterPanel.vue";
  import {AxiosError} from "~/node_modules/axios";
  import UserMixins from "~/components/Mixins/Api/UserMixins";
  import {User} from "~/assets/js/api/user";

  @Component({
    components: {
      TagFilterPanel,
      CustomSelect,
      PanelItem,
      Panel,
      FilterPanel,
      HistoricalPanel,
      FavoritePanel,
      Icon,
      CheckBox
    },
    async fetch({app: {$accessor}, error}) {
      try {
        await $accessor.tags.fetch();
      } catch (e) {
        const errorAxios = e as AxiosError;

        if (errorAxios.response) {
          const status: number = errorAxios.response.status;

          if (status === 400) {
            error({statusCode: status, message: "Une erreur est survenue."});
          } else if (status === 500) {
            error({
              statusCode: status,
              message: `Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`
            });
          }
        } else {
          error({statusCode: 400, message: "Une erreur est survenue."});
        }
      }
    },
    middleware: ['auth', 'admin', 'reset-search-request']
  })
  export default class extends Mixins(UserMixins) {
    /**
     * A reference to the input html element for the search
     */
    @Ref() inputText!: HTMLInputElement;

    searchModel: string = '';

    get categoriesWithTags(): CategoryWithSelectedTags[] {
      return this.$accessor.tags.filteredTagByCategories
    }

    /**
     * Check if the selected tags array is empty
     */
    get isSelectedTagsEmpty() {
      return this.selectedTags.length === 0
    }

    get selectedTags(): SelectedTag[] {
      return this.$accessor.tags.selectedTags
    }


    get dropdownSelectionOptions(): string[] {
      const options: string[] = ['Valider', ' Mettre en attente', 'Invalider', 'Marquer obsolète'];

      switch (this.role) {
        case User.ADMIN:
          return options;
        case User.SUPER_ADMIN:
          return [...options, 'Supprimer'];
      }

      return []

    }

    get filteredCategoriesWithSearchModel(): CategoryWithSelectedTags[] {
      return this.searchModel === '' ? this.categoriesWithTags : this.categoriesWithTags.map(categoryWithTags => {
        const filteredTags: SelectedTag[] = categoryWithTags.tags.filter(tag => {
          return tag.tag_text.toLowerCase().match(this.searchModel.toLowerCase()) !== null
        });

        return {
          ...categoryWithTags,
          tags: filteredTags
        } as CategoryWithSelectedTags
      })
    }

    /**
     * Add or remove an id from the selected tags array
     * Add if state of the checkbox is true and the item is not in the array
     * Remove if state of the checkbox is false and the item is in the array
     * @param id
     * @param state
     * @param tag
     */
    addOrRemoveTags({id, state}: CheckBoxObjectEmitted, tag: SelectedTag) {
      this.$accessor.tags.addOrRemoveTag({...tag, isSelected: state})
    }

    /**
     * Remove from the databases the tags and update the tag store
     */
    async deleteSelectedTags() {
      try {
        await this.$axios.$delete('/api/bulk/delete_tags', {data: this.selectedTags.map(tag => tag.tag_id)});
        this.$displaySuccess(`${this.selectedTags.length} ${this.selectedTags.length === 1 ? 'tag a' : 'tags ont'} été correctement supprimé${this.selectedTags.length === 1 ? '' : 's'}.`);
        this.$accessor.tags.CLEAR();
        this.$accessor.tags.fetch();
      } catch (e) {
        const error = e as AxiosError;

        if (error.response) {
          const status: number = error.response.status;

          if (status === 400) {
            this.$displayError(`Une erreur est survenue, vérifiez vos données.`);
          } else if (status === 500) {
            this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`);
          }
        } else {
          this.$displayError(`Une erreur est survenue lors de la suppression.`);
        }
      }
    }

    /**
     * update the state of tags and notifies the user
     */
    async updateStateOfTags(state: TagState) {

      const updateState = (tag: SelectedTag, state: TagState) => {
        const TagModified: TagExtended = {
          category_id: tag.category_id,
          state: state,
          tag_id: tag.tag_id,
          tag_text: tag.tag_text,
          version: tag.version
        };

        return this.$axios.$put('/api/tags', TagModified)
      };

      const length: number = this.selectedTags.length;
      const plural: string = length ? '' : 's';

      let message: string;

      switch (state) {
        case "DEPRECATED":
          message = `marqué${plural} obsolète${plural}`;
          break;
        case "PENDING":
          message = 'mis en attente';
          break;
        case "NOT_VALIDATED":
          message = `invalidé${plural}`;
          break;
        case "VALIDATED":
          message = `validé${plural}`;
          break;
        default:
          message = `modifié${plural}`
      }

      Promise
        .all(this.selectedTags.map(tag => updateState(tag, state)))
        .then((response) => {
          this.$displaySuccess(`${this.selectedTags.length} ${this.selectedTags.length === 1 ? 'tag a' : 'tags ont'} été correctement ${message}.`);
          this.$accessor.tags.CLEAR();
          this.$accessor.tags.fetch();

        })
        .catch((error: AxiosError) => {
          if(error.response) {
            const status: number = error.response.status;

            if(status === 400) {
              this.$displayError(`Une erreur est survenue, vérifiez vos données.`);
            } else if(status === 401) {
              this.$displayError("Vous devez vous connecter pour effectuer cette action.")
            } else if(status === 403) {
              this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action !`);
            } else if(status === 409) {
              this.$displayError(`Conflit ! Un tag a déjà été modifié entre temps, vous devez rafraîchir vos données.`);
            } else if(status === 500) {
              this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`);
            }
          } else {
            this.$displayError(`Une erreur est survenue.`);
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
     * Go to the tag with a specific id
     * @param id
     */
    gotoLink(id: number) {
      this.$router.push('/administration/tags/' + id)
    }

    /**
     * Handle action selection from CustomSelect component
     * 0 : VALIDATED
     * 1 : PENDING
     * 2 : NOT_VALIDATED
     * 3 : DEPRECATED
     * 4 : delete the tag(s)
     * @param action
     */
    selectAction(action: { content: string, index: number }) {
      if (action.index === 0) {
        this.updateStateOfTags("VALIDATED")
      } else if (action.index === 1) {
        this.updateStateOfTags("PENDING")
      } else if (action.index === 2) {
        this.updateStateOfTags("NOT_VALIDATED")
      } else if (action.index === 3) {
        this.updateStateOfTags("DEPRECATED")
      } else if (action.index === 4 && this.role === 'super_admin') {
        this.deleteSelectedTags()
      }

    }

  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/table";
</style>

