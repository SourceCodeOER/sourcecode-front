import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class Notification extends Vue {

  displayed: boolean = false;

  @Prop({type: String, required: true}) message!: string;

  display() {
    this.displayed = true;
  }

  dissim() {
    this.displayed = false;
  }

};
