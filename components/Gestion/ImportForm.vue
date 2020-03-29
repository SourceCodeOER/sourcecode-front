<template>
  <section class="content">

    <h1>{{title}}</h1>

    <p>
      Vous pouvez importer des exercices depuis cette interface en tenant compte de ce
      <a href="https://sourcecodeoer.github.io/sourcecode_api/#operation/createMultipleExercises" target="_blank">
        format</a>.
    </p>
    <ValidationObserver ref="observer" tag="form"
                        @submit.prevent="validateBeforeSubmit">
      <ValidationProvider tag="div"
                          name="fichier json"
                          rules="mimes:application/json"
                          ref="fileObserver"
                          v-slot="{ errors }">
            <span class="label__name">
              Uploadez votre fichier (json)
            </span>
        <input id="Archive" name="archive" ref="inputFile" @change="selectedFile" class="input--secondary-color"
               type="file">
        <label for="Archive">
          <Icon type="archive" theme="theme--white"/>
          {{labelFileText}}</label>
        <span class="error-message">{{errors[0]}}</span>
        <span class="message message--red" v-if="filename"
              style="text-decoration: underline; cursor: pointer;"
              @click="deleteFile">Supprimer le fichier</span>
      </ValidationProvider>

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
  import {ValidationProvider, ValidationObserver} from 'vee-validate';
  import {AxiosError} from "axios";
  import Icon from "~/components/Symbols/Icon.vue";
  import CustomSelect from "~/components/Input/CustomSelect.vue";

  @Component({
    components: {CustomSelect, ValidationObserver, ValidationProvider, Icon}
  })
  export default class ExerciseForm extends Vue {
    /**
     * Validation Observer for the zip archive and the url
     */
    @Ref() observer!: InstanceType<typeof ValidationObserver>;
    /**
     * Observer for the input file element
     */
    @Ref() inputFile!: HTMLInputElement;
    /**
     * Validation Observer for the zip archive and the url
     */
    @Ref() fileObserver!: InstanceType<typeof ValidationProvider>;

    @Prop({type: String, required: true}) title!: string;

    /**
     * The name of the uploaded file
     * Default is null
     */
    filename: string | null = null;


    /**
     * Returns the name of the uploaded file or a default message instead
     */
    protected get labelFileText() {
      if (this.filename !== null) {
        if (this.filename.length > 18) {
          return this.filename.slice(0, 18) + '...'
        }

        return this.filename
      }

      return 'Choisir un fichier...'
    }

    /**
     * Get the json file from the input file element
     */
    file(): File | null {

      const inputFile: any = this.fileObserver.value;

      if (!inputFile) {
        return null;
      }

      return inputFile
    }

    /**
     * Event for the changed state of the input file
     */
    async selectedFile(event: Event) {
      const inputElement: HTMLInputElement | null = event.target as HTMLInputElement | null;

      if (inputElement !== null) {
        const files = inputElement.files;
        if (files !== null) {
          const file: File | null = files.item(0);
          this.filename = file !== null ? file.name : null;
          await this.fileObserver.validate(file);
        }
      }
    }

    /**
     * Delete file from input and reset the filename
     */
    deleteFile() {
      this.filename = null;
      this.inputFile.files = null;
      this.fileObserver.reset();
    }

    /**
     * Validate the entire page and send the new exercise
     */
    async validateBeforeSubmit() {

      // Basic validation form
      const isValid = await this.observer.validate();

      let reader = new FileReader();

      if (isValid) {

        const file: File | null = this.file();

        if (file !== null) {
          reader.onloadend = async () => {
            if (reader.result !== null) {
              const buffer = reader.result as ArrayBuffer;
              const string: string = new TextDecoder().decode(buffer);

              try {
                this.$nuxt.$loading.start();
                await this.$axios.$post("/api/bulk/create_exercises", JSON.parse(string));
                this.$displaySuccess("L'importation s'est correctement déroulée.");
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
                  this.$displayError("Une erreur est survenue.")
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
