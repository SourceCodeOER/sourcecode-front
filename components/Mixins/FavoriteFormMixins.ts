import {Component, Vue, Ref} from "vue-property-decorator";
import {ValidationObserver} from "vee-validate";
import {CreateConfigurationRequest, SelectedTag} from "~/types";
const debounce = require('lodash.debounce');


@Component
export default class extends Vue {
  @Ref() observer1!:InstanceType<typeof ValidationObserver>;

  form:CreateConfigurationRequest = {
    title:'',
    name: '',
    tags: []
  };

  get selectedTags(): SelectedTag[] {
    return this.$accessor.tags.selectedTags
  }

  async deleteTag(event: { title: string, id: number, state: boolean }, tag: SelectedTag) {
    await this.$accessor.tags.addOrRemoveTag({...tag, isSelected: event.state});
    await this.$accessor.tags.apply('default');
    await this.$accessor.exercises.fetch({data: {tags: this.$accessor.tags.tagsRequest}});
  }

  async removeRatingCriteria() {
    await this.$accessor.exercises.RESET_VOTE();
    await this.$accessor.exercises.fetch({});
  }

  /**
   * Event for the title input to search after similar exercises
   */
  debounceInput = debounce((e: any) => {
    const value = e.target.value;
    this.$accessor.exercises.fetch({data: {title: value}});
  }, 300);
}
