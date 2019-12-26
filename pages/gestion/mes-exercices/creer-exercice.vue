<template>
  <div class="container--with-menu" id="CreateExercise">
    <div class="banner banner--with-shadow-bottom banner--nav">
      <span>
        Gestion > Mes exercices > Créer un exercice
      </span>
      <nuxt-link to="/gestion/mes-exercices" tag="span">
        <Icon type="arrow" class="reversed-arrow" theme="theme--secondary-color"/>
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

        <h2>Uploadez votre archive (zip)</h2>

        <ValidationObserver class="validation__archive" ref="observer2" tag="form"
                            @submit.prevent="validateBeforeSubmit()">
          <ValidationProvider tag="div"
                              name="archive zip"
                              rules="mimes:application/zip"
                              v-slot="{ errors, validate }">
            <input id="Archive" name="archive" @change="validate" class="input--ternary-color"
                   type="file">
            <label for="Archive">
              <Icon type="archive" theme="theme--white"/>
              Choisir un fichier...</label>
            <span class="error-message">{{errors[0]}}</span>
          </ValidationProvider>
        </ValidationObserver>

        <h2>Tags *</h2>
        <button class="button--ternary-color-reverse" v-show="isEmptyTags" @click="changePanel(1)">
          Commencer la sélection
        </button>


        <Tag v-for="(tag, id) in selectedTags" :store-mode="true" :search-mode="true" mode="strict" :state="tag.state"
             :title="tag.tag_text"
             :key="tag.tag_text + '_' + tag.category + '_'+ id"
             :category="tag.category" :id="tag.tag_id"/>

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

        <h2>Description *</h2>

        <RichTextEditor ref="richTextEditor"/>

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
  import {ACTIVE, Category, DEACTIVATED, ExerciseBuild, SelectedTag, TagProposal} from "~/types";
  import RichTextEditor from "~/components/Editor/RichTextEditor.vue"
  import Icon from "~/components/Symbols/Icon.vue";
  import FilterPanelMixins from "~/components/Mixins/FilterPanelMixins.vue";
  import FilterPanel from "~/components/Panel/FilterPanel.vue";
  import ExercisesCheckPanel from "~/components/Panel/ExercisesCheckPanel.vue";
  import Tag from "~/components/Tag/Tag.vue";
  import {BusEvent} from "~/components/Event/BusEvent";
  import CustomSelect from "~/components/Input/CustomSelect.vue"

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
    async fetch({app: {$accessor}}) {
      $accessor.search.RESET_SEARCH_CRITERION();
      $accessor.search.RESET();
      $accessor.tags.CLEAR();

      await $accessor.tags.fetch();
      await $accessor.tags.apply("strict");
    }
  })
  export default class extends Mixins(FilterPanelMixins) {
    /**
     * ValidationObserver for the title, and url
     */
    @Ref() observer1!: InstanceType<typeof ValidationObserver>;
    /**
     * Validation Observer for the zip archive
     */
    @Ref() observer2!: InstanceType<typeof ValidationObserver>;
    /**
     * ValidationObserver for the Tag section
     */
    @Ref() observer3!: InstanceType<typeof ValidationObserver>;
    /**
     * Reference of the custom select element attached to the observer3
     */
    @Ref() customSelect!: CustomSelect;
    /**
     * The component containing the description with the editor
     */
    @Ref() richTextEditor!: RichTextEditor;

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
     * Display or not the layout for adding new tags
     */
    showNewTagLayout: boolean = false;

    /**
     * The main form to build a new exercise
     */
    form: ExerciseBuild = {
      title: '',
      description: '',
      tags: [],
      url: ''
    };

    /**
     * Returns true if either the tags selected in the tags panel is empty or the array of new tags added
     */
    private get isEmptyTags(): boolean {
      return this.selectedTags.length === 0 && this.newTags.length === 0
    }

    /**
     * Get categories from the tags store
     */
    private get categories(): Category[] {
      return this.$accessor.tags.categories
    }

    /**
     * Only get the names of each categories
     */
    private get categoriesName(): string[] {
      return this.categories.map(el => el.category_text)
    }

    /**
     * Get the selected tags from the tags store
     */
    private get selectedTags() {
      return this.$accessor.tags.selectedTags
    }

    /**
     * Get the zip archive from the input file element
     */
    private file(): File | null {
      const inputFile: any = this.observer2.$children.find((component: any) => {
        return component.id === "archive zip"
      });

      if (!inputFile) {
        return null;
      }

      if (inputFile.value) {
        return inputFile.value[0]
      }

      return null
    }

    /**
     * Event for the title input to search after similar exercises
     */
    debounceInput = debounce((e: any) => {
      const value = e.target.value;

      if (value.length >= 3) {
        this.$accessor.search.fetch({data: {title: value}});
      }
    }, 300);

    /**
     * Select handler for the customSelect reference
     * @param event
     */
    chooseCategory(event: { content: string, index: number }) {
      this.selectedNewTag.category_id = event.index;
    }

    /**
     * Deletes a tag proposal
     * @param event
     */
    deleteTag(event: { id: number, title: string, category: number, state: ACTIVE | DEACTIVATED }) {
      const index = this.newTags.findIndex((el) => el.text === event.title);

      if (index !== -1) {
        this.newTags.splice(index, 1)
      }
    }

    /**
     * Validator logic for the validation of tag proposal
     */
    async validateNewTag() {
      const isValid = await this.observer3.validate();

      if (isValid) {
        const category_id = this.categories[this.selectedNewTag.category_id].category_id;

        let isDuplicate = false;

        let i = 0;

        while (i < this.newTags.length && !isDuplicate) {
          if (this.newTags[i].text === this.selectedNewTag.text) isDuplicate = true;
          i++;
        }

        if (!isDuplicate) {
          this.newTags.push({category_id, text: this.selectedNewTag.text});

          this.resetTagForm();

          requestAnimationFrame(() => {
            this.observer3.reset();
          });
        } else {
          BusEvent.$emit('displayNotification', {
            mode: "warning",
            message: "Vous ne pouvez pas créer plusieurs fois le même tag",
            time: 4000
          })
        }

      }
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
      this.form.description = "";
      this.form.tags = [];
      this.form.url = '';

      this.$accessor.search.RESET_SEARCH_CRITERION();
      this.$accessor.search.RESET();
      this.$accessor.tags.CLEAR();

      await this.$accessor.tags.fetch();
      await this.$accessor.tags.apply("strict");
    }

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
          const exerciseBuild: ExerciseBuild = {
            title: this.form.title,
            description,
            tags
          };

          if (!!this.form.url) {
            exerciseBuild.url = this.form.url;
          }

          await this.$axios.$post('/api/create_exercise', exerciseBuild);

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

      button {
        max-width: 250px;
        margin-top: 0;
      }
    }

    .validation__archive {
      grid-template-columns: 1fr;

      div {
        min-height: auto;
        flex-direction: row;
        align-items: center;
      }

      .error-message {
        margin-top: 0;
        max-width: 300px;
        margin-left: 40px;
      }
    }
  }
</style>
