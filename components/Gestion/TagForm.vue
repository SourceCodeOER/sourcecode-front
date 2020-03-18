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
        <select id="CategoryID" name="categoryID" v-model="selectedNewTag.index"
                class="input--grey">
          <option :value="i" v-for="(category, i) in categoriesName">{{category}}</option>
        </select>
        <CustomSelect ref="customSelect" legend="choisir une catégorie" @change="chooseCategory"
                      class="custom-select--secondary-color custom-select-focus--secondary-color"
                      :options="categoriesName" name="newTags" :default-value="form.category"/>
        <span class="error-message">{{errors[0]}}</span>
      </ValidationProvider>

    </ValidationObserver>

    <p class="disclaimer">* champs obligatoires</p>
    <div class="cta__validate--wrapper">
      <button @click="validateBeforeSubmit('NOT_VALIDATED')" class="button--red-reverse cta__validate">
        Invalider
      </button>
      <button @click="validateBeforeSubmit('DEPRECATED')" class="button--orange-reverse cta__validate">
        Marquer comme obsolète
      </button>
      <button @click="validateBeforeSubmit('PENDING')" class="button--yellow-reverse cta__validate">
        Mettre en attente
      </button>
      <button @click="validateBeforeSubmit('VALIDATED')" class="button--ternary-color-reverse cta__validate">
        Valider
      </button>
    </div>

  </section>

</template>

<script lang="ts">

  import {Component, Vue, Ref, Prop} from "vue-property-decorator";
  import {ValidationProvider, ValidationObserver} from 'vee-validate';
  import {AxiosError} from "axios";
  import {
    TagState, Category, CreateTagRequest, TagExtended
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
    @Prop({type: Boolean, default: false}) backToParentPage!: boolean;

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
    selectedNewTag: { index: number } = {
      index: -1
    };

    categories: Category[] = [];

    /**
     * Only get the names of each categories
     */
    protected get categoriesName(): string[] {
      return this.categories.map(el => el.category)
    }

    /**
     * Select handler for the customSelect reference
     * @param event
     */
    chooseCategory(event: { content: string, index: number }) {
      this.selectedNewTag.index = event.index;
    }

    /**
     * Reset the form for tag proposal
     */
    resetTagForm() {
      this.selectedNewTag.index = -1;
      (this.customSelect as any).reset();
    }

    /**
     * Reset all the all page and all the observers to start with a fresh form
     */
    async resetGeneralForm() {
      this.resetTagForm();

      this.form.title = "";
    }

    /**
     * Validate the entire page and send the new exercise
     */
    async validateBeforeSubmit(tagState: TagState) {

      // Basic validation form
      const isValid = await this.observer.validate();

      if (isValid) {

        const tagsSettingsRequest: CreateTagRequest = [{
          text: this.form.title,
          category_id: this.categories[this.selectedNewTag.index].id,
          state: tagState
        }];

        try {

          if (this.tag) {

            const tag: TagExtended = {
              tag_id: this.tag.tag_id,
              tag_text: this.form.title,
              category_id: this.categories[this.selectedNewTag.index].id,
              state: tagState,
              version: this.tag.version
            };

            await this.$axios.$put('/api/tags', tag);
            this.$displaySuccess("Le tag a bien été modifié.");
          } else {
            await this.$axios.$post('/api/bulk/create_tags', tagsSettingsRequest);
            this.$displaySuccess("Le tag a bien été créé.");
          }

          if (this.backToParentPage) {
            this.$router.push('/administration/tags')
          }

          requestAnimationFrame(() => {
            this.resetGeneralForm()
            this.observer.reset();
          });

        } catch (e) {
          const error = e as AxiosError;

          if(error.response) {
            const status: number = error.response.status;

            if(status === 400) {
              this.$displayError(`Vous ne respectez pas les conditions pour publier le tag.`);
            } else if(status === 401) {
              this.$displayError("Vous devez vous connecter pour effectuer cette action.")
            } else if(status === 403) {
              this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action !`);
            } else if(status === 409) {
              this.$displayError(`Ce tag existe déjà !`);
            } else if(status === 500) {
              this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`);
            }
          } else {
            this.$displayError("La publication du tag à échoué. Vérifiez le formulaire ou contactez notre support.");
          }
        }

      } else {
        this.$displayWarning("Vous ne respectez pas les conditions pour publier le tag.", {time: 5000})
      }
    }

    mounted() {
      this.$axios.$get('/api/tags_categories').then(categories => {
        this.categories = categories.filter((cat: Category) => cat.category !== 'licence');

        if (this.tag !== undefined) {
          this.form.title = this.tag.tag_text;
          const cat_ID = this.tag.category_id;
          const index: number = this.categories.findIndex(cat => cat.id === cat_ID);
          this.selectedNewTag.index = index;

          const categoryObject: Category = this.categories[index];
          this.form.category = categoryObject ? categoryObject.category : "";
        }
      }).catch(err => {
        this.categories = [];
        this.$displayError('Une erreur est survenue lors de la récupération des catégories.');
      });

    }
  }

</script>

<style lang="scss" scoped>
  @import "../../assets/css/exercise-gestion";
</style>
