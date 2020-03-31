<template>
  <section class="content">

    <h1>{{title}}</h1>

    <p>
      Vous pouvez importer des exercices depuis cette interface en tenant compte de ce
      <a href="https://sourcecodeoer.github.io/sourcecode_api/#operation/createMultipleExercises" target="_blank">
        format</a>. Votre fichier doit être en UTF-8 !
    </p>
    <ValidationObserver ref="observer"
                        tag="form"
                        @submit.prevent="validateBeforeSubmit">

      <FileInput
        ref="fileObserver"
        rules="required|mimes:application/json"
        name="fichier json"
        @input="updateFile">
            <span class="label__name">
              Uploadez votre fichier (json)
            </span>
      </FileInput>

    </ValidationObserver>

    <p class="disclaimer">* champs obligatoires</p>
    <div class="cta__validate--wrapper">
      <button @click="validateBeforeSubmit"
              class="button--ternary-color-reverse cta__validate">
        Importer les exercices
      </button>
    </div>
  </section>

</template>

<script lang="ts">

  import {Component, Vue, Prop, Ref} from "vue-property-decorator";
  import {ValidationObserver} from 'vee-validate';
  import {AxiosError} from "axios";
  import Icon from "~/components/Symbols/Icon.vue";
  import FileInput from "~/components/Input/FileInput.vue";

  @Component({
    components: {FileInput, ValidationObserver, Icon}
  })
  export default class ExerciseForm extends Vue {
    /**
     * Validation Observer for the zip archive and the url
     */
    @Ref() observer!: InstanceType<typeof ValidationObserver>;

    @Ref() fileObserver!: FileInput;

    @Prop({type: String, required: true}) title!: string;

    form: {file: File | null} = {
      file: null
    };

    updateFile(file: File | null) {
      this.form.file = file;
    }

    /**
     * Validate the entire page and send the new exercise
     */
    async validateBeforeSubmit() {

      // Basic validation form
      const isValid = await this.observer.validate();

      let reader = new FileReader();

      if (isValid) {

        const file: File | null = this.form.file;

        if (file !== null) {
          reader.onloadend = async () => {
            if (reader.result !== null) {
              const buffer = reader.result as ArrayBuffer;
              const string: string = new TextDecoder().decode(buffer);

              try {
                this.$nuxt.$loading.start();
                await this.$axios.$post("/api/bulk/create_exercises", JSON.parse(string));
                this.$displaySuccess("L'importation s'est correctement déroulée.");

                this.$nextTick(() => {
                  this.form.file;
                  // @ts-ignore
                  this.fileObserver.deleteFile();
                  this.observer.reset();
                })
              } catch (e) {
                const error = e as AxiosError;

                if (error.response) {
                  const status = error.response.status;

                  if (status === 400) {
                    this.$displayWarning("Votre fichier ne possède pas le bon format.")
                  } else if (status === 401) {
                    this.$displayWarning("Vous n'êtes pas autorisé à effectuer cette action.")
                  } else if (status === 500) {
                    this.$displayError("Une erreur est survenue depuis nos serveurs.")
                  } else {
                    this.$displayError("Une erreur est survenue.")
                  }
                } else {
                  this.$displayError("Le contenu de votre fichier n'est pas correct.")
                }
              } finally {
                this.$nuxt.$loading.finish();
              }

            }
          };

          reader.readAsArrayBuffer(file);

        }

        requestAnimationFrame(() => {
          this.observer.reset();
        });

      } else {
        this.$displayWarning("Votre fichier ne possède pas le bon format.", {time: 5000})
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../assets/css/exercise-gestion";
</style>
