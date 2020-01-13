<template>
  <section class="content">

    <h1>{{title}}</h1>

    <ValidationObserver ref="observer1" tag="form" @submit.prevent="validateBeforeSubmit()">
      <ValidationProvider tag="label"
                          name="titre"
                          rules="required|min:3|max:200"
                          v-slot="{ errors }">
            <span class="label__name">
              Titre *
            </span>
        <input id="Title" placeholder="Entrez le nom de votre exercice" name="title" v-model="form.title"
               v-on:input="debounceInput" class="input--grey" type="text">
        <span class="error-message">{{errors[0]}}</span>
      </ValidationProvider>

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
      <Tag v-for="(tag, id) in selectedTags" :state="tag.state"
           :title="tag.tag_text"
           :key="tag.tag_text + '_' + tag.category + '_'+ id" :id="id" @deleteTag="deleteTag($event, tag)"/>

      <Tag v-for="(tag, id) in newTags" @deleteTag="deleteTagProposal" :title="tag.text"
           :key="tag.tag_text + '_'+ id" :id="id"/>
    </div>


    <p class="disclaimer">
      Un tag <b>ne figure pas</b> dans la liste ?<br>
      Pas de problème, vous pouvez toujours nous en proposer <span @click="showNewTagLayout = true"
                                                                   class="link">ici</span> !
    </p>


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

        <ValidationProvider tag="label"
                            name="tag"
                            rules="required|min:3|max:100"
                            v-slot="{ errors }">
          <input id="NewTagName" name="selectedNewTag.text" placeholder="Entrez votre nouveau tag"
                 v-model="selectedNewTag.text"
                 class="input--grey" type="text">
          <span class="error-message">{{errors[0]}}</span>
        </ValidationProvider>

        <button :class="{'button--ternary-color-reverse': valid, 'button--ternary-color': !valid}" type="submit">
          Ajouter ce tag
        </button>
      </ValidationObserver>
    </transition>

    <ValidationObserver ref="observer2" tag="form"
                        @submit.prevent="validateBeforeSubmit()">
      <ValidationProvider tag="div"
                          name="archive zip"
                          rules="mimes:application/zip"
                          ref="fileObserver"
                          v-slot="{ errors, validate }">
            <span class="label__name">
              Uploadez votre archive (zip)
            </span>
        <input id="Archive" name="archive" ref="inputFile" @change="selectedFile" class="input--secondary-color"
               type="file">
        <label for="Archive">
          <Icon type="archive" theme="theme--white"/>
          {{labelFileText}}</label>
        <span class="error-message">{{errors[0]}}</span>
        <span class="error-message error-message--red" v-if="filename"
              style="text-decoration: underline; cursor: pointer;"
              @click="deleteFile">Supprimer le fichier</span>
      </ValidationProvider>

      <ValidationProvider tag="label"
                          name="url"
                          :rules="{regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/}"
                          v-slot="{ errors }">
            <span class="label__name">
              Url vers l'exercice
            </span>
        <input id="Url" placeholder="Entrez l'url absolue vers votre exercice" name="url" v-model="form.url"
               class="input--grey" type="text">
        <span class="error-message">{{errors[0]}}</span>
      </ValidationProvider>
    </ValidationObserver>


    <button @click="validateBeforeSubmit" class="button--ternary-color-reverse button__validate">
      Publier l'exercice
    </button>
    <p class="disclaimer">* champs obligatoires</p>

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
    PostExerciseRequest
  } from "~/types";
  import RichTextEditor from "~/components/Editor/RichTextEditor.vue"
  import Icon from "~/components/Symbols/Icon.vue";
  import FilterPanelMixins from "~/components/Mixins/FilterPanelMixins.vue";
  import Tag from "~/components/Tag/Tag.vue";
  import {BusEvent} from "~/components/Event/BusEvent";
  import CustomSelect from "~/components/Input/CustomSelect.vue";
  import jsonFormData from 'json-form-data';
  import ExerciseFormMixins from "~/components/Mixins/ExerciseFormMixins";

  const debounce = require('lodash.debounce');
  @Component({
    components: {CustomSelect, ValidationObserver, ValidationProvider, RichTextEditor, Tag, Icon}
  })
  export default class ExerciseForm extends Mixins(FilterPanelMixins, ExerciseFormMixins) {
    @Prop({type: Object, default: undefined}) exercise!: Exercise | undefined;
    @Prop({type: String, required: true}) title!: string;

    /**
     * Validate the entire page and send the new exercise
     */
    async validateBeforeSubmit() {

      // Basic validation form
      const isValid1 = await this.observer1.validate();
      const isValid2 = await this.observer2.validate();

      // HTML description validation
      const description: string = (this.richTextEditor as any).content();
      const isHTMLValid = description !== '<p></p>' && description !== '<p><br></p>';

      // Tags validation
      const selectedTags: number[] = this.selectedTags.map((tag: SelectedTag) => tag.tag_id);
      const tags: (TagProposal | number)[] = [...selectedTags, ...this.newTags];
      const isTagsValid = tags.length !== 0;

      if (isValid1 && isValid2 && isHTMLValid && isTagsValid) {

        try {
          const exerciseBuild: UpdateExerciseRequest | UpdateExerciseRequestWithFile | PostExerciseRequestWithFile | PostExerciseRequest = {
            title: this.form.title,
            description,
            tags
          };

          if (this.exercise !== undefined) {
            (exerciseBuild as UpdateExerciseRequest | UpdateExerciseRequestWithFile).version = this.exercise.version
          }


          if (!!this.form.url) {
            exerciseBuild.url = this.form.url;
          }

          const file: File | null = this.file();

          if (file !== null) {
            console.log('fichier');

            (exerciseBuild as UpdateExerciseRequestWithFile | PostExerciseRequestWithFile).exerciseFile = file;

            const formData: FormData = jsonFormData(exerciseBuild);

            if(this.exercise !== undefined) {

              await this.$axios.$put('/api/exercises/' + this.exercise.id, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
            } else {
              await this.$axios.$post('/api/create_exercise', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
            }

          } else {
            console.log('pas de fichier');

            if(this.exercise !== undefined) {
              if (this.filename === null) (exerciseBuild as UpdateExerciseRequest).removePreviousFile = true;
              console.log(exerciseBuild);
              await this.$axios.$put('/api/exercises/' + this.exercise.id, exerciseBuild);
            } else {
              await this.$axios.$post('/api/create_exercise', exerciseBuild);
            }
          }

          BusEvent.$emit('displayNotification', {
            mode: "success",
            message: "Votre exercice a été publié ! Notre équipe le validera très prochainement."
          });

          if(this.exercise !== undefined) {
            await this.resetTagForm();
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

          const response = error.response;

          if (!response) {
            BusEvent.$emit('displayNotification', {
              mode: "error",
              message: "Une erreur est survenue depuis nos serveurs :("
            })
          } else {
            const status = response.status;
            if (status >= 500 && status < 600) {
              BusEvent.$emit('displayNotification', {
                mode: "error",
                message: "Une erreur est survenue depuis nos serveurs :("
              })
            } else if (status === 401) {
              BusEvent.$emit('displayNotification', {
                mode: "error",
                message: "Vous n'êtes pas autorisé à publier cette exercice. Reconnectez-vous !"
              })
            } else if (status === 409) {
              BusEvent.$emit('displayNotification', {
                mode: "error",
                message: "Vous ne pouvez pas ajouter plusieurs fois le même tag !"
              })
            } else {
              BusEvent.$emit('displayNotification', {
                mode: "error",
                message: "La publication de votre exercice à échoué. Vérifiez le formulaire ou contactez notre support."
              })
            }
          }
        }

      } else {
        BusEvent.$emit('displayNotification', {
          mode: "warning",
          message: "Vous ne respectez pas les conditions pour la publication de votre exercice.",
          time: 5000
        })
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
  }

</script>

<style lang="scss" scoped>
  @import "../../assets/css/exercise-gestion";
</style>