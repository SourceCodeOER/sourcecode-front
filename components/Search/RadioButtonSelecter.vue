<template>
  <li class="tag-selecter">
    <span @click="toggleList" class="arrow" :class="{'arrow-rotate': active}">
      <Icon type="arrowRight"/>
      <slot></slot>
    </span>
    <ul :class="{active}">
      <li>
        <input type="text" class="input--primary-color" v-model="filter" placeholder="Filtrer">
      </li>
      <li v-if="selectDefaultOption">
        <label>
          Tout
          <input type="radio" @change="onChange(-1)" v-model="selectedValue" value="default">
          <span class="radiobutton"></span>
        </label>
      </li>
      <li v-for="(el, index) in filteredTags" :key="el.title">
        <label>
          {{el.title}}
          <input type="radio" @change="onChange(index)" v-model="selectedValue" :value="el.value">
          <span class="radiobutton"></span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
  import {Vue, Component, Prop, Emit, Watch} from "vue-property-decorator";
  import Icon from "~/components/Symbols/Icon.vue";
  import {RadiobuttonObject, RadiobuttonSelecterObjectEmitted} from "~/types";

  @Component({
    components: {
      Icon
    }
  })
  export default class RadioButtonSelecter extends Vue {
    filter: string = "";
    active: boolean = false;

    @Prop({type: Array, required: true}) readonly defaultOptions!: RadiobuttonObject[];
    @Prop({default: 'default'}) readonly defaultValue!: any;
    @Prop({type: Boolean, default: false}) readonly selectDefaultOption!: boolean;

    selectedValue: any = this.defaultValue;

    options: RadiobuttonObject[] = this.defaultOptions;

    @Watch('defaultOptions')
    onOptionsChange(newVal: RadiobuttonObject[]) {
      this.options = newVal
    }

    @Watch('defaultValue')
    onDefaultValue(newVal: any) {
      this.selectedValue = newVal
    }

    @Emit('change')
    onChange(index: number): RadiobuttonSelecterObjectEmitted {
      if (index === -1) {
        return {data: {title: '', value: 'default'}, index: -1}
      }
      return {data: this.options[index], index}
    }

    get filteredTags(): RadiobuttonObject[] {
      return this.filter === '' ? this.options : this.options.filter((element) => element.title.toLowerCase().match(this.filter.toLowerCase()) !== null);
    }

    @Emit()
    toggleList() {
      this.active = !this.active;
      return this
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
    @include hyphens(true);

    &:hover input ~ .radiobutton {
      background-color: #ccc;
    }

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;

      &:checked ~ .radiobutton {
        background-color: $TERNARY_COLOR;
      }

      &:checked ~ .radiobutton:after {
        display: block;
        background-color: $TERNARY_COLOR;
      }
    }

    .radiobutton:after {
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

  .radiobutton {
    position: absolute;
    top: 50%;
    @include transformHelper(translateY(-50%));
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    @include border-radius(50%);

    &:after {
      content: "";
      position: absolute;
      display: none;
    }
  }
</style>
