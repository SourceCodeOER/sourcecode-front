<template>
  <div class="container--with-menu container--with-table" id="AdminExercises">
    <div class="banner banner--with-shadow-bottom">

      <div class="banner__nav">
      <span>
        Administration > Gestion des catégories
      </span>
      </div>
    </div>

    <div class="wrapper wrapper--with-table">

      <section>

        <h1>Gestion des catégories</h1>

        <div class="header-wrapper">
          <div class="input-wrapper--with-icon">
            <Icon type="search"/>
            <input ref="inputText" class="input--primary-color" type="text" v-model="searchModel"
                   placeholder="Rechercher">
          </div>

          <div class="header-wrapper__buttons">

            <!-- In case you only want multiple actions -->
            <!--
            <transition name="fade">
              <CustomSelect v-show="!isSelectedCategoriesEmpty" :stateless="true" @change="selectAction"
                            name="moreActions" legend="Plus d'actions"
                            class="custom-select--primary-color custom-select-focus--primary-color"
                            :options="['Supprimer']"/>
            </transition>
            -->

            <transition name="fade">
              <button v-show="!isSelectedCategoriesEmpty" @click="deleteSelectedCategories"
                      class="button--red-reverse button--with-symbol">
                Supprimer
                <Icon type="trash" theme="theme--white"/>
              </button>
            </transition>

            <nuxt-link to="/administration/categories/creer-categorie">
              <button class="button--ternary-color-reverse button--with-symbol">Créer une catégorie
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
            <th>Nb de tags</th>
            <th>Nb de tags valides</th>
            <th>Nb de tags invalides</th>
            <th>Nb de tags Obsolètes</th>
          </tr>
          </thead>

          <tbody>

          <tr v-for="(category, index) in filteredCategoriesWithSearchModel"
              :key="category.id + '_' + category.category + '_' + index">
            <td class="item-centered item-checkbox">
              <CheckBox :state="category.state" :id="category.id" @check="addOrRemoveCategories($event, category)"/>
            </td>
            <td class="item-left" @click="gotoCategory(category.category)">{{category.category}}</td>
            <td @click="gotoCategory(category.category)">{{category.total}}</td>
            <td @click="gotoCategory(category.category)">{{category.total_validated}}</td>
            <td @click="gotoCategory(category.category)">{{category.total_unvalidated}}</td>
            <td @click="gotoCategory(category.category)">{{category.total_deprecated}}</td>
          </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Ref} from 'vue-property-decorator'
  import {
    Category, CategoryExtended, CategoryExtendedWithState,
    CategoryWithSelectedTags,
    CheckBoxObjectEmitted,
    SelectedTag, TagExtended
  } from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import CheckBox from "~/components/Input/CheckBox.vue";
  import CustomSelect from "~/components/Input/CustomSelect.vue";
  import TagFilterPanel from "~/components/Panel/Item/TagFilterPanel.vue";
  import {AxiosError} from "~/node_modules/axios";

  @Component({
    components: {
      TagFilterPanel,
      CustomSelect,
      Icon,
      CheckBox
    },
    async asyncData({app: {$axios}, redirect}) {

      try {
        const data: CategoryExtended[] = await $axios.$get('/api/tags_categories?fetchStats=1');

        return {
          categories: data.map(cat => {
            return {
              ...cat,
              state: false
            }
          })
        }

      } catch (e) {
        this.$displayError('Une erreur est survenue lors du chargement des catégories.');
        redirect('/')
      }


    },
    middleware: ['auth', 'admin']
  })
  export default class extends Vue {

    categories!: CategoryExtendedWithState[];
    /**
     * A reference to the input html element for the search
     */
    @Ref() inputText!: HTMLInputElement;

    searchModel: string = '';

    /**
     * Check if the selected tags array is empty
     */
    get isSelectedCategoriesEmpty() {
      return this.selectedCategories.length === 0
    }

    get selectedCategories(): CategoryExtendedWithState[] {
      return this.categories.filter(cat => cat.state)
    }

    get filteredCategoriesWithSearchModel(): CategoryExtendedWithState[] {
      return this.searchModel === '' ? this.categories : this.categories.filter(cat => {
        return cat.category.toLowerCase().match(this.searchModel.toLowerCase()) !== null
      })
    }

    /**
     * Add or remove an id from the selected tags array
     * Add if state of the checkbox is true and the item is not in the array
     * Remove if state of the checkbox is false and the item is in the array
     * @param id
     * @param state
     * @param category
     */
    addOrRemoveCategories({id, state}: CheckBoxObjectEmitted, category: CategoryExtendedWithState) {
      category.state = state
    }

    /**
     * Remove from the databases the exercises and update the search store
     */
    async deleteSelectedCategories() {
      try {
        const n = this.selectedCategories.length;
        await this.$axios.$delete('/api/bulk/delete_tags_categories', {data: this.selectedCategories.map(cat => cat.id)});

        this.$displaySuccess(`${n} catégorie${n > 1 ? 's ont ' : 'a '} bien été supprimée${n > 1 ? 's' : ''}`);

        const data: CategoryExtended[] = await this.$axios.$get('/api/tags_categories?fetchStats=1');

        this.categories = data.map(cat => {
          return {
            ...cat,
            state: false
          }
        });

      } catch (e) {
        this.$displayError(`Une erreur est survenue lors de la suppression.`);
      }
    }


    /**
     * Reset the input value
     */
    resetInput() {
      this.inputText.value = ''
    }

    /**
     * Go to the exercise with a specific id
     * @param name
     */
    async gotoCategory(name: string) {
      this.$router.push('/administration/categories/' + name)
    }


  }
</script>

<style lang="scss" scoped>

  @import "../../../assets/css/variables";
  @import "../../../assets/css/function";
  @import "../../../assets/css/font";
  @import "../../../assets/css/table";
</style>

