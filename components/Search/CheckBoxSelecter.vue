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
      <li v-if="selectAllOption">
        <CheckBox title="Tout sélectionner" :state="selectAllState" :id="-1" @check="check"/>
      </li>
      <li v-for="(option, index) in filteredOptions" :key="option.title + '_' + index">
        <CheckBox :title="option.title" :state="option.state" :id="index" @check="check"/>
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
  import CheckBox from "~/components/Input/CheckBox.vue";
  import {Vue, Component, Prop, Emit, Watch} from "vue-property-decorator";
  import {CheckboxObject, CheckBoxObjectEmitted, CheckboxSelecterObjectEmitted} from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";

  @Component({
    components: {
      CheckBox,
      Icon
    }
  })
  export default class CheckBoxSelecter extends Vue {
    @Prop({type: Array, required: true}) readonly defaultOptions!: CheckboxObject[];
    @Prop({type: Boolean, default: false}) readonly selectAllOption!: boolean;

    filter: string = "";
    active: boolean = false;
    selectAllState: boolean = false;

    options: CheckboxObject[] = this.defaultOptions;

    get filteredOptions(): CheckboxObject[] {
      return this.filter === '' ? this.options : this.options.filter((element: CheckboxObject) => element.title.toLowerCase().match(this.filter.toLowerCase()) !== null);
    }

    @Watch('defaultOptions')
    onDefaultOptionsChange(newVal: CheckboxObject[]) {
      this.options = newVal
    }

    @Emit()
    toggleList(): CheckBoxSelecter {
      this.active = !this.active;
      return this
    }

    @Emit('change')
    check(checkBoxObjectEmitted: CheckBoxObjectEmitted): CheckboxSelecterObjectEmitted[] {
      const changedOptions: CheckboxSelecterObjectEmitted[] = [];
      if (checkBoxObjectEmitted.id === -1) {

        let index = 0;
        this.options.forEach((object) => {
          if (object.state !== checkBoxObjectEmitted.state) {
            object.state = checkBoxObjectEmitted.state;
            changedOptions.push({data: {...object, state: checkBoxObjectEmitted.state}, index})
          }
          index++;
        });

      } else {
        const index: number = this.options.findIndex((option) => option.title === checkBoxObjectEmitted.title);
        if (index !== -1) {
          this.options[index].state = checkBoxObjectEmitted.state;
          changedOptions.push({
            index,
            data: {title: checkBoxObjectEmitted.title, state: checkBoxObjectEmitted.state}
          })
        }
      }

      return changedOptions;
    }

    mounted() {
      let condition = false;

      for (let i = 0; i < this.options.length; i++) {
        if (!this.options[i].state) {
          condition = true;
          break;
        }
      }

      if (!condition) this.selectAllState = true;
    }

  }
</script>
