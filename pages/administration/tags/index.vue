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
                            :options="['Valider', 'Invalider', 'Supprimer']"/>
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
                <CheckBox :state="tag.state" :id="tag.tag_id" @check="addOrRemoveTags($event, tag)"/>
              </td>
              <td class="item-left" @click="gotoExercise(1)">{{tag.tag_text}}</td>
              <td>
                {{categoryWithTags.category}}
              </td>
              <td @click="gotoExercise(1)">{{tag.version}}</td>
              <td @click="gotoExercise(1)" class="item-centered">
                <i title="Valide" v-if="tag.isValidated">
                  <Icon type="check" theme="theme--green"/>
                </i>

                <i title="Invalide" v-else-if="!tag.isValidated">
                  <Icon type="close" theme="theme--red-light"/>
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
  import {Component, Vue, Ref} from 'vue-property-decorator'
  import {
    CategoryWithSelectedTags,
    CheckBoxObjectEmitted,
    SelectedTag, TagExtended
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
  import {BusEvent} from "~/components/Event/BusEvent";

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
    async fetch({app: {$accessor}}) {
      await $accessor.tags.fetch();
    },
    middleware: ['auth', 'admin', 'reset-search-request']
  })
  export default class extends Vue {
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
      this.$accessor.tags.addOrRemoveTag({...tag, state})
    }

    /**
     * Remove from the databases the exercises and update the search store
     */
    async deleteSelectedTags() {
      try {
        await this.$axios.$delete('/api/bulk/delete_tags', {data: this.selectedTags.map(tag => tag.tag_id)});
        BusEvent.$emit('displayNotification', {
          mode: "success",
          message: `${this.selectedTags.length} ${this.selectedTags.length === 1 ? 'tag a' : 'tags ont'} été correctement supprimé${this.selectedTags.length === 1 ? '' : 's'}.`
        });
        this.$accessor.tags.CLEAR();
        this.$accessor.tags.fetch();
      } catch (e) {
        const error = e as AxiosError;

        BusEvent.$emit('displayNotification', {
          mode: "error",
          message: `Une erreur est survenue lors de la suppression.`
        });
      }
    }

    /**
     * update the state of exercises and notifies the user
     */
    async updateStateOfTags(state: boolean) {

      const updateState = (tag: SelectedTag, state: boolean) => {
        const TagModified: TagExtended = {
          category_id: tag.category_id,
          isValidated: state,
          tag_id: tag.tag_id,
          tag_text: tag.tag_text,
          version: tag.version
        };

        return this.$axios.$put('/api/tags', TagModified)
      };

      Promise
        .all(this.selectedTags.map(tag => updateState(tag, state)))
        .then((response) => {
          BusEvent.$emit('displayNotification', {
            mode: "success",
            message: `${this.selectedTags.length} ${this.selectedTags.length === 1 ? 'tag a' : 'tags ont'} été correctement ${state ? 'validé' : 'invalidé'}${this.selectedTags.length === 1 ? '' : 's'}.`
          });
          this.$accessor.tags.CLEAR();
          this.$accessor.tags.fetch();

        }).catch((error: AxiosError) => {
        if (error.response) {
          const status: number = error.response.status;

          if (status === 409) {
            BusEvent.$emit('displayNotification', {
              mode: "error",
              message: `Conflit ! Un tag a déjà été modifié entre temps, vous devez rafraîchir la page.`
            });
          }
        } else {
          BusEvent.$emit('displayNotification', {
            mode: "error",
            message: `Une erreur est survenue. Veuillez-nous en excuser.`
          });
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
     * Go to the exercise with a specific id
     * @param id
     */
    gotoExercise(id: number) {
      this.$router.push('/administration/tags/' + id)
    }


    selectAction(action: { content: string, index: number }) {

      if (action.index === 0) {
        this.updateStateOfTags(true)
      } else if (action.index === 1) {
        this.updateStateOfTags(false)
      } else if (action.index === 2) {
        this.deleteSelectedTags()
      }

    }

  }
</script>

<style lang="scss" scoped>

  @import "../../../assets/css/variables";
  @import "../../../assets/css/function";
  @import "../../../assets/css/font";
  @import "../../../assets/css/table";
</style>
