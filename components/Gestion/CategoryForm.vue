<template>
  <section class="content">
    <h1>{{title}}</h1>

    <ValidationObserver ref="observer" tag="form" @submit.prevent="validateBeforeSubmit">
      <ValidationProvider tag="label"
                          name="catégorie"
                          rules="required|min:3|max:100"
                          v-slot="{ errors }">
            <span class="label__name">
              Nom *
            </span>
        <input id="Title" placeholder="Entrez le nom de la catégorie" name="title" v-model="form.title"
               class="input--grey" type="text">
        <span class="error-message">{{errors[0]}}</span>
      </ValidationProvider>

    </ValidationObserver>

    <div class="cta__validate--wrapper">
      <button @click="validateBeforeSubmit" class="button--ternary-color-reverse cta__validate">
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
    Category
  } from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";

  @Component({
    components: {ValidationObserver, ValidationProvider, Icon}
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

          const response = error.response;

          if (!response) {
            this.$displayError("Une erreur est survenue depuis nos serveurs :(");
          } else {
            const status = response.status;
            if (status >= 500 && status < 600) {
              this.$displayError("Une erreur est survenue depuis nos serveurs :(");
            } else if (status === 401) {
              this.$displayError("Vous n'êtes pas autorisé à effectuer cette action. Reconnectez-vous avec un compte admin.");
            } else if (status === 409) {
              this.$displayError("Une catégorie avec le même nom existe déjà.");
            } else {
              this.$displayError("Une erreur est survenue, veuillez-nous en excuser.");
            }
          }
        }
      } else {
        this.$displayError("Vous ne respectez pas les conditions pour publier la catégorie.");
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
