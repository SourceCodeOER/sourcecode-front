<template>
  <div class="container--with-menu" id="MyFavorite">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav banner__nav--with-link">
        <span>
          Gestion > Mes Favoris > Créer un favori
        </span>
        <nuxt-link to="/gestion/mes-favoris" tag="span">
          <Icon type="arrowLeft" class="reversed-arrow" theme="theme--primary-color-light"/>
          Mes favoris
        </nuxt-link>
      </div>
    </div>

    <div class="wrapper wrapper--with-panel">

      <Panel>
        <PanelItem>
          <ExercisesCheckPanel title="Exercices"/>
        </PanelItem>

        <PanelItem>
          <FilterPanel :reset-button="true" :search-mode="true" mode="strict" title="Tags"/>
        </PanelItem>
      </Panel>

      <section class="content">
        <h1>Créer un favori</h1>

        <ValidationObserver ref="observer1" tag="form" @submit.prevent="validateBeforeSubmit()">
          <ValidationProvider tag="label"
                              name="favori"
                              rules="required|max:200"
                              v-slot="{ errors }">
            <span class="label__name">
              Nom du favori *
            </span>
            <input id="Name" placeholder="Entrez le nom de votre favori" name="name" v-model="form.name"
                   class="input--grey" type="text">
            <span class="error-message">{{errors[0]}}</span>
          </ValidationProvider>

          <ValidationProvider tag="label"
                              name="titre"
                              rules="max:100"
                              v-slot="{ errors }">
            <span class="label__name">
              Titre de la sélection
            </span>
            <input id="Title" placeholder="Entrez le titre de votre recherche" name="title" v-model="form.title"
                   v-on:input="debounceInput" class="input--grey" type="text">
            <span class="error-message">{{errors[0]}}</span>
          </ValidationProvider>

        </ValidationObserver>

        <h2 class="title--primary-color__light">Tags *</h2>
        <button class="button--secondary-color-reverse" v-show="selectedTags.length === 0" @click="changePanel(1)">
          Commencer la sélection
        </button>


        <Tag v-for="(tag, id) in selectedTags" :store-mode="true" :search-mode="true" mode="strict" :state="tag.state"
             :title="tag.tag_text"
             :key="tag.tag_text + '_' + tag.category + '_'+ id"
             :category="tag.category_id" :id="tag.tag_id"/>

        <br>

        <button @click="validateBeforeSubmit" class="button--ternary-color-reverse button__validate">
          sauver le favori
        </button>
        <p class="disclaimer">* champs obligatoires</p>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins} from "vue-property-decorator";
  import {
    CreateConfigurationRequest,
    SelectedTag,
  } from "~/types";
  import ExercisesCheckPanel from "~/components/Panel/Item/ExercisesCheckPanel.vue";
  import FilterPanel from "~/components/Panel/Item/FilterPanel.vue";
  import FilterPanelMixins from "~/components/Mixins/FilterPanelMixins.vue";
  import Icon from "~/components/Symbols/Icon.vue";
  import Tag from "~/components/Tag/Tag.vue";
  import {ValidationObserver, ValidationProvider} from "vee-validate";
  import {BusEvent} from "~/components/Event/BusEvent";
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import FavoriteFormMixins from "~/components/Mixins/FavoriteFormMixins";

  @Component({
    components: {
      PanelItem,
      Panel,
      ExercisesCheckPanel,
      FilterPanel,
      Icon,
      ValidationObserver,
      ValidationProvider,
      Tag
    },
    async fetch({app: {$accessor}}) {
      await $accessor.tags.fetch();
    },
    middleware: ['reset-search-request']
  })
  export default class extends Mixins(FilterPanelMixins, FavoriteFormMixins) {
    async validateBeforeSubmit() {
      // Basic validation form
      const isValid = await this.observer1.validate();

      // Tags validation
      const tags: number[] = this.selectedTags.map((tag: SelectedTag) => tag.tag_id);
      const isTagsValid = tags.length !== 0;

      if (isValid && isTagsValid) {

        try {

          const request: CreateConfigurationRequest = {
            name: this.form.name,
            tags
          };

          if (this.form.title !== '') {
            request.title = this.form.title
          }

          await this.$axios.$post('api/configurations', request);

          await this.$accessor.favorites.fetch();

          BusEvent.$emit('displayNotification', {
            mode: 'success',
            message: 'Votre favori a bien été créé !'
          })

        } catch (e) {
          BusEvent.$emit('displayNotification', {
            mode: 'error',
            message: 'Une erreur est survenue lors de la création du favori.'
          })
        }
      } else {
        BusEvent.$emit('displayNotification', {
          mode: 'warning',
          message: 'Vous ne respectez pas les conditions pour ajouter votre favori.'
        })
      }
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/_exercise-gestion.scss";
</style>
