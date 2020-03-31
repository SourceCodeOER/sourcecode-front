<template>
  <ValidationProvider :tag="tag" :rules="rules" :name="name" :vid="vid" v-slot="{ errors }">
    <slot></slot>
    <input class="input--grey" :type="type" :placeholder="placeholder" v-model="currentValue">
    <span class="error-message">{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script lang="ts">
  import {ValidationProvider} from 'vee-validate';
  import {Component, Emit, Prop, Vue, Watch} from "vue-property-decorator";

  @Component({
    components: {
      ValidationProvider
    }
  })
  export default class TextInput extends Vue {

    @Prop({type: [String, Object], default: ''}) rules!: string | object;
    @Prop({type: String, default: ''}) value!: string;
    @Prop({type: String, default: ''}) name!: string;
    @Prop({type: String, default: undefined}) vid!: string | undefined;
    @Prop({type: String, default: 'text'}) type!: string;
    @Prop({type: String, default: 'div'}) tag!: string;
    @Prop({type:String, default: ''}) placeholder!:string;

    currentValue: string = '';

    @Watch('currentValue')
    OnCurrentValueChange(val: string) {
      this.input(val);
    }

    @Watch('value')
    OnValueChange(val: string) {
      if(this.currentValue !==  val) this.currentValue = val;
    }

    @Emit()
    input(value: string) {
      return value;
    }

  }
</script>
