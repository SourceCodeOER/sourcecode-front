<template>
  <section class="content">
    <h1>{{title}}</h1>

    <ValidationObserver ref="observer1" tag="form" @submit.prevent="validateBeforeSubmit">
      <TextInput
        tag="label"
        name="favori"
        v-model="form.name"
        placeholder="Entrez le nom de votre favori"
        rules="required|max:200">
        <span class="label__name">
          Nom du favori *
        </span>
      </TextInput>

      <TextInput
        tag="label"
        name="titre"
        v-model="form.title"
        @input="debounceInput"
        placeholder="Entrez le titre de votre recherche"
        rules="max:100">
        <span class="label__name">
              Titre de recherche
        </span>
      </TextInput>

    </ValidationObserver>

    <h2 class="title--primary-color__light">Tags *</h2>
    <button class="button--secondary-color-reverse" v-show="selectedTags.length === 0"
            @click="changePanel(1)">
      Commencer la sélection
    </button>


    <div class="tags__wrapper">
      <Tag v-for="(tag, id) in selectedTags"
           :state="tag.state"
           :title="tag.tag_text"
           :key="tag.tag_text + '_' + tag.category + '_'+ id"
           :id="id"
           @deleteTag="deleteTag($event, tag)"/>
    </div>

    <TagColorLegend/>

    <p class="disclaimer">* champs obligatoires</p>
    <div class="cta__validate--wrapper">
      <button @click="validateBeforeSubmit" class="button--ternary-color-reverse button__validate">
        sauver le favori
      </button>
    </div>
  </section>

</template>

<script lang="ts">
  import {Component, Mixins, Prop} from "vue-property-decorator";
  import FilterPanelMixins from "~/components/Mixins/FilterPanelMixins.vue";
  import FavoriteFormMixins from "~/components/Mixins/FavoriteFormMixins";
  import {Configuration, CreateConfigurationRequest, SelectedTag, UpdateConfigurationRequest} from "../../types";
  import {ValidationObserver} from "vee-validate";
  import Tag from "../Tag/Tag.vue";
  import TagColorLegend from "~/components/Tag/TagColorLegend.vue";
  import {AxiosError} from "axios";
  import TextInput from "~/components/Input/TextInput.vue";

  @Component({
    components: {TextInput, TagColorLegend, Tag, ValidationObserver}
  })
  export default class FavoriteForm extends Mixins(FilterPanelMixins, FavoriteFormMixins) {

    @Prop({type: Object, default: null}) configuration!: Configuration | null;
    @Prop({type: String, required: true}) title!: string;

    async validateBeforeSubmit() {
      // Basic validation form
      const isValid = await this.observer1.validate();

      // Tags validation
      const tags: number[] = this.selectedTags.map((tag: SelectedTag) => tag.tag_id);

      if (isValid) {

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
          const error = e as AxiosError;

          if (error.response) {
            const status: number = error.response.status;

            if (status === 400) {
              this.$displayError(`Vous ne respectez pas les conditions pour publier ce favori.`);
            } else if (status === 401) {
              this.$displayError("Vous devez vous connecter pour effectuer cette action.")
            } else if (status === 403) {
              this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action !`);
            } else if (status === 409) {
              this.$displayError(`Cette catégorie existe déjà.`);
            } else if (status === 500) {
              this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`);
            }
          } else {
            this.$displayError('Une erreur est survenue lors de la publication du favori.')
          }
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
