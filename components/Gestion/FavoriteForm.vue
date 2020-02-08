<template>
  <section class="content">
    <h1>{{title}}</h1>

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
    <button class="button--secondary-color-reverse" v-show="selectedTags.length === 0 && !voteTag"
            @click="changePanel(1)">
      Commencer la sélection
    </button>


    <div class="tags__wrapper">
      <Tag v-for="(tag, id) in selectedTags" :state="tag.state" :validated="tag.isValidated"
           :title="tag.tag_text"
           :key="tag.tag_text + '_' + tag.category + '_'+ id" :id="id" @deleteTag="deleteTag($event, tag)"/>
    </div>
    <br>

    <div class="cta__validate--wrapper">
      <button @click="validateBeforeSubmit" class="button--ternary-color-reverse button__validate">
        sauver le favori
      </button>
    </div>
    <p class="disclaimer">* champs obligatoires</p>
  </section>

</template>

<script lang="ts">
  import {Component, Mixins, Prop} from "vue-property-decorator";
  import FilterPanelMixins from "~/components/Mixins/FilterPanelMixins.vue";
  import FavoriteFormMixins from "~/components/Mixins/FavoriteFormMixins";
  import {Configuration, CreateConfigurationRequest, SelectedTag, UpdateConfigurationRequest} from "../../types";
  import {ValidationObserver, ValidationProvider} from "vee-validate";
  import qs from "qs";
  import Tag from "../Tag/Tag.vue";

  @Component({
    components: {Tag, ValidationProvider, ValidationObserver}
  })
  export default class FavoriteForm extends Mixins(FilterPanelMixins, FavoriteFormMixins) {

    @Prop({type: Object, default: null}) configuration!: Configuration | null;
    @Prop({type: String, required: true}) title!: string;

    async validateBeforeSubmit() {
      // Basic validation form
      const isValid = await this.observer1.validate();

      // Tags validation
      const tags: number[] = this.selectedTags.map((tag: SelectedTag) => tag.tag_id);
      const isTagsValid = tags.length !== 0;

      if (isValid && isTagsValid) {

        const request: UpdateConfigurationRequest | CreateConfigurationRequest = {
          name: this.form.name,
          tags,
          title: this.form.title
        };

        if (this.configuration !== null) {
          (request as UpdateConfigurationRequest).id = this.configuration.id
        }

        try {
          if (this.configuration !== null) {

            await this.$axios.$put('api/configurations', request);

            const query = {
              ids: [this.configuration.id]
            };

            const refreshConfig: Configuration[] = await this.$axios.$get('api/configurations', {params: query});

            this.$accessor.favorites.UPDATE_CONFIGURATION(refreshConfig[0]);

            this.$displaySuccess('Votre favori a bien été mis à jour !')
          } else {
            await this.$axios.$post('api/configurations', request);

            await this.$accessor.favorites.fetch();

            this.$displaySuccess('Votre favori a bien été créé !')
          }

        } catch (e) {
          this.$displayError('Une erreur est survenue lors de la modification du favori.')
        }
      } else {
        this.$displayError('Vous ne respectez pas les conditions pour ajouter votre favori.')
      }
    }

    mounted() {
      if (process.client && this.configuration) {
        this.form.title = this.configuration.title;
        this.form.name = this.configuration.name;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/_exercise-gestion.scss";
</style>
