<template>
  <label @click.prevent="check">
    {{title}}
    <input type="checkbox" v-model="checked">
    <span class="checkmark"></span>
  </label>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Emit, Watch} from 'vue-property-decorator'
    import {CheckBoxObjectEmitted} from "@/types";

    @Component
    export default class CheckBox extends Vue {

        checked:boolean = false;

        @Prop(String) readonly title!: string;
        @Prop(Boolean) readonly state!: boolean;
        @Prop({type: [String, Number], default: 'none'}) readonly id!: number;

        @Emit()
        check(): CheckBoxObjectEmitted {
            this.checked = !this.checked;
            return {tag_text: this.title, state: this.checked, tag_id: this.id}
        }

        @Watch('state')
        onStatePropChanged(val:boolean) {
            this.checked = val
        }

        created() {
            this.checked = this.state;
        }
    }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";

  label {
    position: relative;
    display: block;
    line-height: 1.5em;
    padding-left: 35px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-transform: capitalize;

    &:hover input ~ .checkmark {
      background-color: #ccc;
    }

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;

      &:checked ~ .checkmark {
        background-color: $TERNARY_COLOR;
      }

      &:checked ~ .checkmark:after {
        display: block;
        background-color: $TERNARY_COLOR;
      }
    }

    .checkmark:after {
      left: 9px;
      top: 5px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  .checkmark {
    position: absolute;
    top: 50%;
    @include transformHelper(translateY(-50%));
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;

    &:after {
      content: "";
      position: absolute;
      display: none;
    }
  }
</style>
