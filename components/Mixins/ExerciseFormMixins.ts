import {Component, Ref, Vue} from "vue-property-decorator";
import {ValidationObserver} from 'vee-validate';
import {
  Category,
  PostExerciseRequest,
  PostExerciseRequestWithFile,
  SelectedTag, TagLabelObjectEmitted,
  TagProposal,
  UpdateExerciseRequest,
  UpdateExerciseRequestWithFile
} from "~/types";
import RichTextEditor from "~/components/Editor/RichTextEditor.vue"
import {BusEvent} from "~/components/Event/BusEvent";
import CustomSelect from "~/components/Input/CustomSelect.vue";
import FileInput from "~/components/Input/FileInput.vue";

const debounce = require('lodash.debounce');

@Component
export default class ExerciseFormMixins extends Vue {
  /**
   * ValidationObserver for the title
   */
  @Ref() observer1!: InstanceType<typeof ValidationObserver>;
  /**
   * Validation Observer for the zip archive and the url
   */
  @Ref() observer2!: InstanceType<typeof ValidationObserver>;
  /**
   * Validation Observer for the zip archive and the url
   */
  @Ref() fileObserver!: FileInput;
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

  categories: Category[] = [];

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
  form: PostExerciseRequestWithFile | PostExerciseRequest | UpdateExerciseRequestWithFile | UpdateExerciseRequest = {
    title: '',
    description: '',
    tags: [],
    url: ''
  };

  /**
   * The name of the uploaded file
   * Default is null
   */
  filename: string | null = null;

  /**
   * The file uploaded (in zip)
   */
  file: File | null = null;

  /**
   * Returns true if either the tags selected in the tags panel is empty or the array of new tags added
   */
  protected get isEmptyTags(): boolean {
    return this.selectedTags.length === 0 && this.newTags.length === 0
  }

  /**
   * Only get the names of each categories
   */
  protected get categoriesName(): string[] {
    return this.categories.map(el => el.category).filter(el => el !== 'licence');
  }

  /**
   * Only get categories without licence
   */
  protected get categoriesWithoutLicense(): Category[] {
    return this.categories.filter(el => el.category !== 'licence');
  }

  /**
   * Get the selected tags from the tags store
   */
  protected get selectedTags(): SelectedTag[] {
    return this.$accessor.tags.selectedTags
  }


  /**
   * Event for the title input to search after similar exercises
   */
  debounceInput = debounce((value: string) => {
    this.$accessor.exercises.fetch({data: {title: value}});
  }, 300);


  updateFile(file: File | null) {
    if (file !== null) {
      this.filename = file.name;
      this.file = file;
    } else {
      this.file = null;
      this.filename = null;
    }
  }

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
  deleteTagProposal(event: { id: number, title: string, state: boolean }) {
    const index = this.newTags.findIndex((el) => el.text === event.title);

    if (index !== -1) {
      this.newTags.splice(index, 1)
    }
  }

  async deleteTag(event: TagLabelObjectEmitted, tag: SelectedTag) {
    await this.$accessor.tags.addOrRemoveTag({...tag, isSelected: false});
    await this.$accessor.tags.apply('strict');
    await this.$accessor.exercises.fetch({data: {tags: this.$accessor.tags.tagsRequest}});
  }

  /**
   * Validator logic for the validation of tag proposal
   */
  async validateNewTag() {
    const isValid = await this.observer3.validate();

    if (isValid) {
      const category_id = this.categoriesWithoutLicense[this.selectedNewTag.category_id].id;

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

    // @ts-ignore
    this.richTextEditor.reset();

    this.newTags = [];

    if(this.file !== null) {
      // @ts-ignore
      this.fileObserver.deleteFile();
    }

    this.$accessor.exercises.RESET_SEARCH_CRITERION();
    this.$accessor.exercises.RESET();
    this.$accessor.tags.CLEAR();

    await this.$accessor.tags.fetch({});
    await this.$accessor.tags.apply("strict");
  }

  created() {
    this.$axios.$get('/api/tags_categories').then(categories => {
      this.categories = categories
    }).catch(err => {
      this.categories = [];
      this.$displayError('Une erreur est survenue lors de la récupération des catégories.')
    })
  }

}
