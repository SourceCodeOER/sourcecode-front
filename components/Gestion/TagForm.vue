<template>
  <section class="content">
    <h1>{{title}}</h1>

    <ValidationObserver ref="observer" tag="form" @submit.prevent="validateBeforeSubmit">
      <ValidationProvider tag="label"
                          name="titre"
                          rules="required|min:1|max:200"
                          v-slot="{ errors }">
            <span class="label__name">
              Titre *
            </span>
        <input id="Title" placeholder="Entrez le nom du tag" name="title" v-model="form.title"
               class="input--grey" type="text">
        <span class="error-message">{{errors[0]}}</span>
      </ValidationProvider>

      <ValidationProvider tag="label"
                          name="catégorie"
                          :rules="`required|oneOf:${Array.from(categories.keys())}`"
                          v-slot="{ errors }">
            <span class="label__name">
              Catégorie *
            </span>
        <select id="CategoryID" name="categoryID" v-model="selectedNewTag.category_id"
                class="input--grey">
          <option :value="i" v-for="(category, i) in categoriesName">{{category}}</option>
        </select>
        <CustomSelect ref="customSelect" legend="choisir une catégorie" @change="chooseCategory"
                      class="custom-select--secondary-color custom-select-focus--secondary-color"
                      :options="categoriesName" name="newTags" :default-value="form.category"/>
        <span class="error-message">{{errors[0]}}</span>
      </ValidationProvider>

    </ValidationObserver>

    <div class="cta__validate--wrapper">
      <button @click="validateBeforeSubmit(false)" class="button--yellow-reverse cta__validate">
        Mettre en attente
      </button>
      <button @click="validateBeforeSubmit(true)" class="button--ternary-color-reverse cta__validate">
        Publier
      </button>
    </div>
    <p class="disclaimer">* champs obligatoires</p>

  </section>

</template>

<script lang="ts">

  import {Component, Vue, Ref, Prop} from "vue-property-decorator";
  import {ValidationProvider, ValidationObserver} from 'vee-validate';
  import {AxiosError} from "axios";
  import {
    TagProposal, Category, CreateTagRequest, TagExtended
  } from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import Tag from "~/components/Tag/Tag.vue";
  import CustomSelect from "~/components/Input/CustomSelect.vue";

  @Component({
    components: {CustomSelect, ValidationObserver, ValidationProvider, Tag, Icon}
  })
  export default class ExerciseForm extends Vue {

    @Prop({type: Object, default: undefined}) tag!: TagExtended | undefined;
    @Prop({type: String, required: true}) title!: string;

    /**
     * ValidationObserver for the title
     */
    @Ref() observer!: InstanceType<typeof ValidationObserver>;

    /**
     * Reference of the custom select element attached to the observer3
     */
    @Ref() customSelect!: CustomSelect;

    form = {
      title: "",
      category: ""
    };

    /**
     * A new tag proposal
     */
    selectedNewTag: TagProposal = {
      category_id: -1,
      text: ""
    };

    /**
     * Contains all the new tags proposal
     */
    newTags: TagProposal[] = [];

    /**
     * Get categories from the tags store
     */
    protected get categories(): Category[] {
      return this.$accessor.tags.categories
    }

    /**
     * Only get the names of each categories
     */
    protected get categoriesName(): string[] {
      return this.categories.map(el => el.category).filter(el => el !== 'licence');
    }

    /**
     * Select handler for the customSelect reference
     * @param event
     */
    chooseCategory(event: { content: string, index: number }) {
      this.selectedNewTag.category_id = this.categories[event.index].id;
    }

    /**
     * Reset the form for tag proposal
     */
    resetTagForm() {
      this.selectedNewTag.text = "";
      this.selectedNewTag.category_id = -1;
      (this.customSelect as any).reset();
    }

    /**
     * Reset all the all page and all the observers to start with a fresh form
     */
    async resetGeneralForm() {
      this.resetTagForm();

      this.form.title = "";

      this.newTags = [];
    }

    /**
     * Validate the entire page and send the new exercise
     */
    async validateBeforeSubmit(tagState: boolean) {

      // Basic validation form
      const isValid = await this.observer.validate();

      if (isValid) {

        const tagsSettingsRequest: CreateTagRequest = [{
          text: this.form.title,
          category_id: this.selectedNewTag.category_id,
          isValidated: tagState
        }];

        try {

          console.log(tagsSettingsRequest)
          await this.$axios.$post('/api/bulk/create_tags', tagsSettingsRequest);

          this.$displaySuccess("Le tag a bien été créé.");

          requestAnimationFrame(() => {
            this.observer.reset();
          });

        } catch (e) {
          const error = e as AxiosError;

          const response = error.response;

          if (!response) {
            this.$displayError("Une erreur est survenue depuis nos serveurs :(");
          } else {
            const status = response.status;
            if (status >= 500 && status < 600) {

              this.$displayError("Une erreur est survenue depuis nos serveurs :(");

            } else if (status === 401) {
              this.$displayError("Vous n'êtes pas autorisé à publier ce tag. Reconnectez-vous !")
            } else if (status === 409) {
              this.$displayError("ce tag a déjà été créé !")
            } else {
              this.$displayError("La publication du tag à échoué. Vérifiez le formulaire ou contactez notre support.")
            }
          }
        }

      } else {
        this.$displayWarning("Vous ne respectez pas les conditions pour la publication de votre exercice.", 5000)
      }
    }

    mounted() {
      if (process.client && this.tag !== undefined) {
        this.form.title = this.tag.tag_text;
        const cat_ID = this.tag.category_id;

        const categoryObject = this.categories.find(cat => cat.id === cat_ID);
        this.form.category = categoryObject ? categoryObject.category : "";

      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../assets/css/exercise-gestion";
</style>
