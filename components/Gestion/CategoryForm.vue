<template>
  <section class="content">
    <h1>{{title}}</h1>

    <ValidationObserver ref="observer" tag="form" @submit.prevent="validateBeforeSubmit">
      <TextInput tag="label"
                 name="catégorie"
                 v-model="form.title"
                 placeholder="Entrez le nom de la catégorie"
                 rules="required|min:3|max:100">
            <span class="label__name">
              Nom *
            </span>
      </TextInput>
    </ValidationObserver>

    <p class="disclaimer">* champs obligatoires</p>
    <div class="cta__validate--wrapper">
      <button @click="validateBeforeSubmit" class="button--ternary-color-reverse cta__validate">
        Publier
      </button>
    </div>

  </section>

</template>

<script lang="ts">

  import {Component, Vue, Ref, Prop} from "vue-property-decorator";
  import {ValidationObserver} from 'vee-validate';
  import {AxiosError} from "axios";
  import {
    Category
  } from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import TextInput from "~/components/Input/TextInput.vue";

  @Component({
    components: {TextInput, ValidationObserver, Icon}
  })
  export default class ExerciseForm extends Vue {

    @Prop({type: Object, default: undefined}) category!: Category | undefined;
    @Prop({type: String, required: true}) title!: string;
    @Prop({type: Boolean, default: false}) backToParentPage!: boolean;

    /**
     * ValidationObserver for the title
     */
    @Ref() observer!: InstanceType<typeof ValidationObserver>;

    form = {
      title: ""
    };

    /**
     * Reset all the all page and all the observers to start with a fresh form
     */
    async resetGeneralForm() {
      this.form.title = "";
    }

    /**
     * Validate the entire page and send the new exercise
     */
    async validateBeforeSubmit() {

      // Basic validation form
      const isValid = await this.observer.validate();

      if (isValid) {

        try {

          if (this.category) {
            await this.$axios.$put('/api/tags_categories', {id: this.category.id, category: this.form.title});
            this.$displaySuccess("La catégorie a bien été modifiée.");
          } else {
            await this.$axios.$post('/api/bulk/create_or_find_tag_categories', [this.form.title]);
            this.$displaySuccess("La catégorie a bien été créée.");
          }

          if (this.backToParentPage) {
            this.$router.push('/administration/categories')
          }

          requestAnimationFrame(() => {
            this.resetGeneralForm();
            this.observer.reset();
          });

        } catch (e) {
          const error = e as AxiosError;

          if(error.response) {
            const status: number = error.response.status;

            if(status === 400) {
              this.$displayError(`Vous ne respectez pas les conditions pour publier la catégorie.`);
            } else if(status === 401) {
              this.$displayError("Vous devez vous connecter pour effectuer cette action.")
            } else if(status === 403) {
              this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action !`);
            } else if(status === 409) {
              this.$displayError(`Conflit ! Une catégorie avec le même nom existe déjà.`);
            } else if(status === 500) {
              this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`);
            }
          } else {
            this.$displayError(`Une erreur est survenue.`);
          }
        }
      } else {
        this.$displayWarning("Vous ne respectez pas les conditions pour publier la catégorie.");
      }
    }

    mounted() {
      if (process.client && this.category !== undefined) {
        this.form.title = this.category.category;
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../assets/css/exercise-gestion";
</style>
