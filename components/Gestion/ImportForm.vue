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
  import {ImportExportFormat} from "~/types/exercise";

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

    form: { file: File | null } = {
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

              let jsonInput: ImportExportFormat | any;
              // since TypeScript doesn't check type at runtime ; better check that
              const isExportFormat = (obj: any) =>
                (obj as ImportExportFormat).categories &&
                (obj as ImportExportFormat).exercises &&
                Array.isArray(obj.exercises) &&
                typeof (obj as ImportExportFormat).categories == "object"
              ;

              try {
                this.$nuxt.$loading.start();
                // first validate the json before anything else
                jsonInput = JSON.parse(string);
                // at the end, both import type use the same endpoint
                let exercises;

                // Type Guards to distinct the two types
                if (isExportFormat(jsonInput)) {

                  const exportFormat = jsonInput as ImportExportFormat;

                  // need that function in the next lines
                  // Credits to https://gist.github.com/JamieMason/0566f8412af9fe6a1d470aa1e089a752
                  const groupBy = (key: string) => (array: any[]) =>
                    array.reduce((objectsByKeyValue, obj) => {
                      const value = obj[key];
                      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
                      return objectsByKeyValue;
                    }, {});

                  // creates or find the category/ies
                  const tags_categories = Object.values(exportFormat.categories);
                  const tags_categories_ids: {
                    id: number,
                    category: string
                  }[] = await this.$axios.$post("/api/bulk/create_or_find_tag_categories", tags_categories);
                  const tags_dictionary = groupBy("category")(tags_categories_ids);

                  // prepare json
                  exercises = exportFormat.exercises.map(
                    ex => ({
                      title: ex.title,
                      description: ex.description,
                      url: ex.url,
                      state: ex.state,
                      tags: ex.tags.map(tag => (
                        {
                          text: tag.text,
                          category_id: tags_dictionary[exportFormat.categories[tag.category]][0].id,
                          state: tag.state
                        }
                      ))
                    })
                  );

                } else {
                  exercises = jsonInput;
                }

                // Trial time : execute query
                await this.$axios.$post("/api/bulk/create_exercises", exercises);

                this.$displaySuccess("L'importation s'est correctement déroulée.");
                this.$nextTick(() => {
                  this.form.file;
                  // @ts-ignore
                  this.fileObserver.deleteFile();
                  this.observer.reset();
                })
              } catch (e) {

                if (e instanceof SyntaxError || e instanceof TypeError || e instanceof ReferenceError) {
                  this.$displayError("Le contenu de votre fichier n'est pas correct.");
                } else {
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
                  }
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
