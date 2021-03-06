<template>
  <section class="content">

    <h1>{{title}}</h1>

    <h2 v-if="exercise" class="title--primary-color__light">Status actuel de la ressource</h2>

    <div v-if="exercise" class="status">
      <template v-if="exercise.state === 'VALIDATED'">
        Valide
        <Icon type="check" theme="theme--green"/>
      </template>

      <template v-else-if="exercise.state === 'NOT_VALIDATED'">
        Non valide
        <Icon type="close" theme="theme--red-light"/>
      </template>

      <template v-else-if="exercise.state === 'PENDING'">
        En attente
        <Icon type="send" theme="theme--yellow"/>
      </template>

      <template v-else-if="exercise.state === 'DRAFT'">
        Brouillon
        <Icon title="Créé" type="paper" theme="theme--primary-color-light"/>
      </template>

      <template v-else-if="exercise.state === 'ARCHIVED'">
        Archivé
        <Icon type="archive" theme="theme--red-light"/>
      </template>
    </div>

    <ValidationObserver ref="observer1" tag="form" @submit.prevent="validateBeforeSubmit()">
      <TextInput
        tag="label"
        name="titre"
        v-model="form.title"
        :value="form.title"
        @input="debounceInput"
        placeholder="Entrez le nom de votre exercice"
        rules="required|min:3|max:200">
        <span class="label__name">
              Titre *
        </span>
      </TextInput>

    </ValidationObserver>

    <h2 class="title--primary-color__light">Description *</h2>

    <blockquote>
      <p>Décrivez l'énoncé de votre exercice et expliquez ce que contient votre archive zip (si présente). Un énoncé
        bien écrit aura bien plus de retours positifs qu'un descriptif vide et sans explication
        pour utiliser le contenu de votre archive.</p>
    </blockquote>

    <RichTextEditor ref="richTextEditor" :default-content="exercise ? exercise.description : ''"/>

    <h2 class="title--primary-color__light">Tags *</h2>
    <button class="button--secondary-color-reverse" v-show="isEmptyTags" @click="changePanel(1)">
      Commencer la sélection
    </button>


    <div class="tags__wrapper">
      <Tag v-for="(tag, id) in selectedTags"
           :state="tag.state"
           :title="tag.tag_text"
           :key="tag.tag_text + '_' + tag.category + '_'+ id"
           :id="id"
           @deleteTag="deleteTag($event, tag)"/>

      <Tag v-for="(tag, id) in newTags"
           @deleteTag="deleteTagProposal"
           :title="tag.text"
           state="PENDING"
           :key="tag.tag_text + '_'+ id"
           :id="id"/>
    </div>


    <p class="disclaimer">
      Un tag <b>ne figure pas</b> dans la liste ?<br>
      Pas de problème, vous pouvez toujours nous en proposer <span @click="showNewTagLayout = true"
                                                                   class="link">ici</span> !
    </p>

    <TagColorLegend/>

    <transition name="fade">
      <ValidationObserver class="validation__tag" ref="observer3" tag="form" v-show="showNewTagLayout"
                          v-slot="{valid}"
                          @submit.prevent="validateNewTag">
        <ValidationProvider tag="label"
                            name="catégorie"
                            :rules="`oneOf:${Array.from(categories.keys())}`"
                            v-slot="{ errors }">
          <select id="CategoryID" name="categoryID" v-model="selectedNewTag.category_id"
                  class="input--grey">
            <option :value="i" v-for="(category, i) in categoriesName">{{category}}</option>
          </select>
          <CustomSelect ref="customSelect" legend="choisir une catégorie" @change="chooseCategory"
                        class="custom-select--secondary-color custom-select-focus--secondary-color"
                        :options="categoriesName" name="newTags"/>
          <span class="error-message">{{errors[0]}}</span>
        </ValidationProvider>

        <TextInput
          tag="label"
          name="tag"
          rules="required|min:3|max:100"
          v-model="selectedNewTag.text"
          placeholder="Entrez votre nouveau tag">
        </TextInput>

        <button :class="{'button--ternary-color-reverse': valid, 'button--ternary-color': !valid}" type="submit">
          Ajouter ce tag
        </button>
      </ValidationObserver>
    </transition>

    <ValidationObserver ref="observer2" tag="form"
                        @submit.prevent="validateBeforeSubmit">
      <FileInput
        name="archive zip"
        rules="mimes:application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream"
        :default-filename="filename"
        @input="updateFile"
        ref="fileObserver">

        <span class="label__name">
              Uploadez votre archive (zip)
        </span>

        <template v-slot:footer>
        <span v-if="exercise && exercise.file && filename" @click="downloadFile"
              class="message message--primary-color"
              style="text-decoration: underline; cursor: pointer;">Télécharger le fichier</span>

        </template>
      </FileInput>

      <TextInput
        tag="label"
        name="url"
        type="url"
        v-model="form.url"
        placeholder="Entrez l'url absolue vers votre exercice"
        rules="url">
        <span class="label__name">
              Url vers l'exercice
        </span>
      </TextInput>
    </ValidationObserver>


    <p class="disclaimer">* champs obligatoires</p>
    <div class="cta__validate--wrapper">
      <template v-if="['admin', 'super_admin'].includes(userRole)">
        <button @click="validateBeforeSubmit('NOT_VALIDATED')" class="button--red-reverse cta__validate">
          Invalider
        </button>
        <button @click="validateBeforeSubmit('ARCHIVED')" class="button--orange-reverse cta__validate">
          Archiver
        </button>
        <button @click="validateBeforeSubmit('PENDING')" class="button--yellow-reverse cta__validate">
          Mettre en attente
        </button>
      </template>
      <button @click="validateBeforeSubmit('DRAFT')" class="button--ternary-color cta__validate">
        Brouillon
      </button>
      <button v-if="['admin', 'super_admin'].includes(userRole)" @click="validateBeforeSubmit('VALIDATED')"
              class="button--ternary-color-reverse cta__validate">
        Valider
      </button>
      <button v-if="userRole === 'user'" @click="validateBeforeSubmit('PENDING')"
              class="button--ternary-color-reverse cta__validate">
        Soumettre
      </button>
    </div>

  </section>

</template>

<script lang="ts">

  import {Component, Mixins, Prop} from "vue-property-decorator";
  import {ValidationProvider, ValidationObserver} from 'vee-validate';
  import {AxiosError} from "axios";
  import {
    Exercise,
    UpdateExerciseRequest,
    UpdateExerciseRequestWithFile,
    SelectedTag,
    TagProposal,
    PostExerciseRequestWithFile,
    PostExerciseRequest, ExerciseState, UserRole
  } from "~/types";
  import RichTextEditor from "~/components/Editor/RichTextEditor.vue"
  import Icon from "~/components/Symbols/Icon.vue";
  import FilterPanelMixins from "~/components/Mixins/FilterPanelMixins.vue";
  import Tag from "~/components/Tag/Tag.vue";
  import CustomSelect from "~/components/Input/CustomSelect.vue";
  import jsonFormData from 'json-form-data';
  import ExerciseFormMixins from "~/components/Mixins/ExerciseFormMixins";
  import TagColorLegend from "~/components/Tag/TagColorLegend.vue";
  import TextInput from "~/components/Input/TextInput.vue";
  import FileInput from "~/components/Input/FileInput.vue";

  const download = require('downloadjs');

  @Component({
    components: {
      FileInput,
      TextInput,
      TagColorLegend, CustomSelect, ValidationObserver, ValidationProvider, RichTextEditor, Tag, Icon
    }
  })
  export default class ExerciseForm extends Mixins(FilterPanelMixins, ExerciseFormMixins) {
    @Prop({type: Object, default: undefined}) exercise!: Exercise | undefined;
    @Prop({type: String, required: true}) title!: string;
    @Prop({type: Boolean, default: false}) admin!: boolean;
    @Prop({type: Boolean, default: false}) backToParentPage!: boolean;

    private cdnLink!: string;

    get userRole(): UserRole {
      return this.$auth.user.role
    }

    /**
     * Validate the entire page and send the new exercise
     */
    async validateBeforeSubmit(exerciseState: ExerciseState) {

      // Basic validation form
      const isValid1 = await this.observer1.validate();
      const isValid2 = await this.observer2.validate();

      // HTML description validation
      const description: string = (this.richTextEditor as any).content;
      const isHTMLValid = !(this.richTextEditor as any).isEmpty;

      // Tags validation
      const selectedTags: number[] = this.selectedTags.map((tag: SelectedTag) => tag.tag_id);
      const tags: (TagProposal | number)[] = [...selectedTags, ...this.newTags];
      const isTagsValid = this.selectedTags.filter(tag => tag.state === "VALIDATED").length >= 3;

      if (isValid1 && isValid2 && isHTMLValid && isTagsValid) {

        try {
          const exerciseBuild: UpdateExerciseRequest | UpdateExerciseRequestWithFile | PostExerciseRequestWithFile | PostExerciseRequest = {
            title: this.form.title,
            description,
            tags
          };

          exerciseBuild.state = exerciseState;

          if (this.exercise !== undefined) {
            (exerciseBuild as UpdateExerciseRequest | UpdateExerciseRequestWithFile).version = this.exercise.version
          }


          if (!!this.form.url) {
            exerciseBuild.url = this.form.url;
          }

          const file: File | null = this.file;

          if (file !== null) {

            (exerciseBuild as UpdateExerciseRequestWithFile | PostExerciseRequestWithFile).exerciseFile = file;

            const formData: FormData = jsonFormData(exerciseBuild);

            // Modify exercise
            if (this.exercise !== undefined) {

              await this.$axios.$put('/api/exercises/' + this.exercise.id, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
            } else { // Create new exercise
              await this.$axios.$post('/api/create_exercise', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
            }

          } else {
            // Modify exercise
            if (this.exercise !== undefined) {
              if (this.filename === null) (exerciseBuild as UpdateExerciseRequest).removePreviousFile = true;
              await this.$axios.$put('/api/exercises/' + this.exercise.id, exerciseBuild);
            } else { // Create new exercise
              await this.$axios.$post('/api/create_exercise', exerciseBuild);
            }
          }

          let message = "";
          if (exerciseState === "PENDING") {
            message += "mis en attente"
          } else if (exerciseState === "VALIDATED") {
            message += "validé"
          } else if (exerciseState === "NOT_VALIDATED") {
            message += "marqué comme invalide"
          } else if (exerciseState === "DRAFT") {
            message += "marqué comme brouillon"
          } else if (exerciseState === "ARCHIVED") {
            message += "archivé"
          }

          if (this.admin) {
            this.$displaySuccess("L'exercice a bien été " + message + " !")
          } else {
            if (exerciseState === "PENDING") {
              this.$displaySuccess("Votre exercice a été publié ! Notre équipe le validera très prochainement.")
            } else {
              this.$displaySuccess("L'exercice a bien été " + message + " !")
            }
          }

          if (this.backToParentPage) {
            if (this.admin) {
              this.$router.push('/administration/exercices')
            } else {
              this.$router.push('/gestion/mes-exercices')
            }
          } else {
            await this.resetGeneralForm();
          }

          requestAnimationFrame(() => {
            this.observer1.reset();
            this.observer2.reset();
            this.observer3.reset();
          });

        } catch (e) {
          const error = e as AxiosError;

          if (error.response) {
            const status: number = error.response.status;

            if (status === 400) {
              this.$displayError(`Vous ne respectez pas les conditions pour publier la catégorie.`);
            } else if (status === 401) {
              this.$displayError("Vous devez vous connecter pour effectuer cette action.")
            } else if (status === 403) {
              this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action !`);
            } else if (status === 409) {
              this.$displayError(`Un conflit a été détecté. Vérifiez vos données.`);
            } else if (status === 500) {
              this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`);
            }
          } else {
            this.$displayError(`La publication de votre exercice à échoué. Vérifiez le formulaire ou contactez notre support.`);
          }
        }

      } else if (!isHTMLValid) {
        this.$displayWarning("Le champ description est obligatoire.", {time: 5000})
      } else if (!isTagsValid) {
        this.$displayWarning("Vous devez ajouter au moins 3 tags valides.", {time: 5000})
      } else {
        this.$displayWarning("Vous ne respectez pas les conditions pour la publication de cet exercice.", {time: 5000})
      }
    }

    async downloadFile() {
      if (this.exercise) {
        try {

          const result: Blob = await this.$axios.$get(`/files/${this.exercise.file}`, {responseType: 'blob'});

          download(result, "archive.zip", result.type);

          this.$displaySuccess("Téléchargement éffectué.");

        } catch (e) {
          const error = e as AxiosError;

          if (error.response) {
            const status: number = error.response.status;

            if (status === 404) {
              this.$displayError(`Ce fichier est introuvable`);
            } else if (status === 500) {
              this.$displayError(`Une erreur est survenue lors du téléchargement.`);
            }
          } else {
            this.$displayError(`Une erreur est survenue lors du téléchargement.`);
          }
        }
      }
    }

    mounted() {
      if (process.client && this.exercise !== undefined) {
        this.form.title = this.exercise.title;
        const file: string | null | undefined = this.exercise.file;
        if (file) this.filename = file;

        this.form.url = this.exercise.url;
        this.form.description = this.exercise.description;
        this.form.tags = this.exercise.tags.map((tag) => tag.tag_id)
      }
    }

    created() {
      const link: string | undefined = this.$accessor.sharedEnv.CDN_SERVER;
      this.cdnLink = link ? link : ''
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../assets/css/exercise-gestion";
</style>
