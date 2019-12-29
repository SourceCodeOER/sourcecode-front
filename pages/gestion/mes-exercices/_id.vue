<template>
  <div class="container--with-menu" id="CreateExercise">
    <div class="banner banner--with-shadow-bottom banner--nav">
      <span>
        Gestion > Mes exercices > {{exercise.title}}
      </span>
      <nuxt-link to="/gestion/mes-exercices" tag="span">
        <Icon type="arrowLeft" class="reversed-arrow" theme="theme--secondary-color"/>
        Mes exercices
      </nuxt-link>
    </div>

    <div class="wrapper wrapper--with-panel">

      <transition name="fade" mode="out-in" duration="400">
        <ExercisesCheckPanel title="Exercices similaires" v-if="currentAsidePanel === 0"/>
        <FilterPanel :reset-button="true" :search-mode="true" mode="strict" title="Choix des tags"
                     v-if="currentAsidePanel === 1"/>
      </transition>

      <section class="content">

        <h1>Créer un exercice</h1>

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

        <h2>Description *</h2>

        <RichTextEditor ref="richTextEditor" :default-content="exercise.description"/>

        <h2>Tags *</h2>
        <button class="button--ternary-color-reverse" v-show="isEmptyTags" @click="changePanel(1)">
          Commencer la sélection
        </button>


        <Tag v-for="(tag, id) in selectedTags" :store-mode="true" :search-mode="true" mode="strict" :state="tag.state"
             :title="tag.tag_text"
             :key="tag.tag_text + '_' + tag.category + '_'+ id"
             :category="tag.category_id" :id="tag.tag_id"/>

        <Tag v-for="(tag, id) in newTags" @deleteTag="deleteTag" :title="tag.text"
             :key="tag.tag_text + '_'+ id"
             :category="tag.category_id" :id="-1"/>


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
                            class="custom-select--ternary-color custom-select-focus--ternary-color"
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
            <input id="Archive" name="archive" @change="selectedFile" class="input--ternary-color"
                   type="file">
            <label for="Archive">
              <Icon type="archive" theme="theme--white"/>
              {{labelFileText}}</label>
            <span class="error-message">{{errors[0]}}</span>
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


        <p class="disclaimer">* champs obligatoires</p>
        <button @click="validateBeforeSubmit" class="button--ternary-color-reverse">
          Publier l'exercice
        </button>

      </section>
    </div>
  </div>

</template>

<script lang="ts">
  import {Component, Ref, Mixins} from "vue-property-decorator";
  import {ValidationProvider, ValidationObserver} from 'vee-validate';
  import {AxiosError} from "axios";
  import {
    Exercise,
    ExerciseModify,
    SelectedTag,
    TagProposal
  } from "~/types";
  import RichTextEditor from "~/components/Editor/RichTextEditor.vue"
  import Icon from "~/components/Symbols/Icon.vue";
  import FilterPanelMixins from "~/components/Mixins/FilterPanelMixins.vue";
  import FilterPanel from "~/components/Panel/FilterPanel.vue";
  import ExercisesCheckPanel from "~/components/Panel/ExercisesCheckPanel.vue";
  import Tag from "~/components/Tag/Tag.vue";
  import {BusEvent} from "~/components/Event/BusEvent";
  import CustomSelect from "~/components/Input/CustomSelect.vue";
  import jsonFormData from 'json-form-data';
  import qs from 'qs'
  import ExerciseFormMixins from "~/components/Mixins/ExerciseFormMixins";

  const debounce = require('lodash.debounce');


  @Component({
    components: {
      ValidationObserver,
      ValidationProvider,
      RichTextEditor,
      Icon,
      FilterPanel,
      ExercisesCheckPanel,
      Tag,
      CustomSelect
    },
    async asyncData({params, error, app: {$axios, $accessor}}) {
      const id = params.id;

      try {
        const exercise: Exercise = await $axios.$get(`api/exercises/${id}`);

        const queryObject: { tags_ids: number[] } = {tags_ids: exercise.tags.map(tag => tag.tag_id)};

        const queryString: string = qs.stringify(queryObject);

        const tags:SelectedTag[] = await $axios.$get(`api/tags?${queryString}`);

        $accessor.search.RESET_SEARCH_CRITERION();
        $accessor.search.RESET();

        await $accessor.tags.fetch();
        await $accessor.tags.applyConfirmedTags({confirmedTags: tags, mode:'strict'});

        return {exercise}
      } catch (e) {
        error({statusCode: 404, message: "Cette exercice est introuvable"});
      }


    },
  })
  export default class extends Mixins(FilterPanelMixins, ExerciseFormMixins) {
    /**
     * The loaded exercise
     */
    exercise!: Exercise;

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
          const exerciseBuild: ExerciseModify = {
            title: this.form.title,
            description,
            tags,
            version:this.exercise.version
          };

          if (!!this.form.url) {
            exerciseBuild.url = this.form.url;
          }

          const file: File | null = this.file();

          if (file !== null) {

            exerciseBuild.exerciseFile = file;

            const formData: FormData = jsonFormData(exerciseBuild);

            await this.$axios.$put('/api/exercises/' + this.exercise.id , formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

          } else {
            await this.$axios.$put('/api/exercises/' + this.exercise.id, exerciseBuild);
          }

          BusEvent.$emit('displayNotification', {
            mode: "success",
            message: "Votre exercice a été publié ! Notre équipe le validera très prochainement."
          });

          await this.resetGeneralForm();

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
      if(process.client) {
        this.form.title = this.exercise.title;
        const file: string | null | undefined = this.exercise.file;
        this.form.url = this.exercise.url;
        this.form.description = this.exercise.description;
        this.form.tags = this.exercise.tags.map((tag) => tag.tag_id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../assets/css/_variables';
  @import '../../../assets/css/_function';

  #CreateExercise {

    h1 {
      margin-bottom: 35px;
    }

    .wrapper {
      margin-bottom: 40px;
    }

    .disclaimer {
      margin-top: 30px;
      font-style: italic;
      margin-bottom: 30px;
      font-size: .8em;

      span.link {
        text-decoration: underline;
        font-weight: bold;
        color: $TERNARY_COLOR;
        cursor: pointer;
      }
    }

    .content {
      background-color: white;
      border-radius: 4px;
      @include box-shadow($SHADOW);
      padding: 20px;
    }

    button {
      font-size: .7em;
    }

    h2 {
      margin-top: 30px;
      margin-bottom: 15px;
      color: $SECONDARY_COLOR
    }

    blockquote {
      margin-top: 0;
      max-width: 800px;
    }

    form {
      display: grid;
      max-width: 800px;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 30px 15px;
      margin-top: 0;
      margin-bottom: 0;

      > label, > div {
        display: flex;
        flex-direction: column;
        min-height: 90px;
      }

      .label__name {
        margin-bottom: 10px;
        color: $SECONDARY_COLOR;
        font-weight: bold;
      }

      label[for=Archive] {
        align-self: flex-start;
      }

      .error-message {
        margin-top: 10px;
      }
    }

    .validation__tag {
      grid-row-gap: 0;
      margin-bottom: 30px;

      button {
        max-width: 250px;
        margin-top: 0;
      }
    }
  }
</style>