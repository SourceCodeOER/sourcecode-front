<template>
  <div class="container--with-menu" id="MyFavorite">
    <div class="banner banner--with-shadow-bottom banner__nav banner__nav--with-link">
      <span>
        Gestion > Mes Favoris > {{configuration.name}}
      </span>
      <nuxt-link to="/gestion/mes-favoris" tag="span">
        <Icon type="arrowLeft" class="reversed-arrow" theme="theme--secondary-color"/>
        Mes favoris
      </nuxt-link>
    </div>

    <div class="wrapper wrapper--with-panel">
      <transition name="fade" mode="out-in" duration="400">
        <ExercisesCheckPanel title="Exercices similaires" v-if="currentAsidePanel === 0"/>
        <FilterPanel :reset-button="true" :search-mode="true" mode="strict" title="Choix des tags"
                     v-if="currentAsidePanel === 1"/>
      </transition>

      <section class="content">
        <h1>Modifier mon favori</h1>

        <ValidationObserver ref="observer1" tag="form" @submit.prevent="validateBeforeSubmit()">
          <ValidationProvider tag="label"
                              name="favori"
                              rules="required|max:200"
                              v-slot="{ errors }">
            <span class="label__name">
              Nom du favori *
            </span>
            <input id="Name" placeholder="Entrez le nom de votre favori" name="name" v-model="form.name"
                   v-on:input="debounceInput" class="input--grey" type="text">
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

        <h2>Tags *</h2>
        <button class="button--ternary-color-reverse" v-show="selectedTags.length === 0" @click="changePanel(1)">
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
  import {Component, Mixins, Ref} from "vue-property-decorator";
  import {
    Configuration,
    CreateConfigurationRequest,
    SelectedTag,
    TagExtended, TagProposal, UpdateConfigurationRequest,
  } from "~/types";
  import ExercisesCheckPanel from "~/components/Panel/ExercisesCheckPanel.vue";
  import FilterPanel from "~/components/Panel/FilterPanel.vue";
  import FilterPanelMixins from "~/components/Mixins/FilterPanelMixins.vue";
  import Icon from "~/components/Symbols/Icon.vue";
  import Tag from "~/components/Tag/Tag.vue";
  import {ValidationObserver, ValidationProvider} from "vee-validate";
  import {BusEvent} from "~/components/Event/BusEvent";
  const debounce = require('lodash.debounce');

  @Component({
    components: {
      ExercisesCheckPanel,
      FilterPanel,
      Icon,
      ValidationObserver,
      ValidationProvider,
      Tag
    },
    async asyncData({params, error, app: {$accessor}}) {
      if (!$accessor.favorites.loaded) {
        await $accessor.favorites.fetch()
      }

      const id: number = parseInt(params.id);
      const configuration: Configuration | undefined = $accessor.favorites.favorites.find(config => config.id === id);

      if (!configuration) {
        error({statusCode: 404, message: "Ce favori est introuvable"});
      } else {
        $accessor.search.RESET_SEARCH_CRITERION();
        $accessor.tags.CLEAR();

        const confirmedTags: SelectedTag[] = configuration.tags.map((tag: TagExtended) => {
          return {...tag, state: 1}
        });

        await $accessor.tags.fetch();
        await $accessor.tags.applyConfirmedTags({confirmedTags, mode: "default"});

        return {configuration}

      }

    },
    middleware: ['favorite-store']
  })
  export default class extends Mixins(FilterPanelMixins) {
    @Ref() observer1!:InstanceType<typeof ValidationObserver>;

    configuration!: Configuration;

    form:CreateConfigurationRequest = {
      title:'',
      name: '',
      tags: []
    }

    get selectedTags(): SelectedTag[] {
      return this.$accessor.tags.selectedTags
    }

    async validateBeforeSubmit() {
      // Basic validation form
      const isValid = await this.observer1.validate();

      // Tags validation
      const tags: number[] = this.selectedTags.map((tag: SelectedTag) => tag.tag_id);
      const isTagsValid = tags.length !== 0;

      if(isValid && isTagsValid) {

        const config:UpdateConfigurationRequest = {
          id:this.configuration.id,
          name: this.form.name,
          tags,
          title: this.form.title
        };

        try {
          await this.$axios.put('api/configurations', config);

          /*
          this.$accessor.favorites.UPDATE_CONFIGURATION({
            id:config.id,
            name:config.name,
            title:config.title ? config.title : '',
            tags:this.selectedTags
          })
          */

          BusEvent.$emit('displayNotification', {
            mode:'success',
            message: 'Votre favori a bien été mis à jour !'
          })

        } catch (e) {
          BusEvent.$emit('displayNotification', {
            mode:'error',
            message: 'Une erreur est survenue lors de la modification du favori.'
          })
        }
      } else {
        BusEvent.$emit('displayNotification', {
          mode:'warning',
          message: 'Vous ne respectez pas les conditions pour ajouter votre favori.'
        })
      }
    }

    /**
     * Event for the title input to search after similar exercises
     */
    debounceInput = debounce((e: any) => {
      const value = e.target.value;
      this.$accessor.search.fetch({data: {title: value}});
    }, 300);

    mounted() {
      if (process.client) {
        this.form.title = this.configuration.title;
        this.form.name = this.configuration.name;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/_exercise-gestion.scss";
</style>