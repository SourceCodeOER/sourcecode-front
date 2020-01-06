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
  }

  get selectedTags(): SelectedTag[] {
    return this.$accessor.tags.selectedTags
  }

  /**
   * Event for the title input to search after similar exercises
   */
  debounceInput = debounce((e: any) => {
    const value = e.target.value;
    this.$accessor.search.fetch({data: {title: value}});
  }, 300);
}
