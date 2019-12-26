<template>
  <ul class="custom-select no-select" :class="{'custom-select-focus': isFocus}">
    <li @click.self="toggleDropdown(null)">
      <div @click.self="toggleDropdown(null)">{{textLegend}}</div>
      <ul v-if="isFocus">
        <li v-for="(option, i) in options" :key="option + i" @click.self="toggleDropdown({content:option, index:i})">
          {{option}}
        </li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from "vue-property-decorator";

  @Component
  export default class CustomSelect extends Vue {
    @Prop({type: String, required: true}) name!: string;
    @Prop({type: Array, required: true}) options!: string[];
    @Prop({type: String, default: "Choisir"}) legend!: string;
    @Prop({type: String, default: ""}) defaultValue!: string;

    optionSelected: string | null = null;
    isFocus: boolean = false;

    /**
     * open/close the dropdown options
     * @param option
     */
    toggleDropdown(option: null | { content: string, index: number }) {
      if (option !== null) {
        this.optionSelected = option.content;
        this.$emit('change', option);
      }
      this.isFocus = !this.isFocus;
    }

    reset() {
      this.optionSelected = null;
      this.isFocus = false;
    }

    get textLegend() {
      return this.optionSelected !== null ? this.optionSelected : this.legend
    }

    mounted() {
      if (this.defaultValue !== '') {
        const element = this.options.find(option => {
          return option === this.defaultValue;
        });
        this.optionSelected = element ? element : '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/css/_variables';
  @import '../../assets/css/_function';

  .no-select {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently supported by Chrome and Opera */
  }

  .custom-select {
    text-align: left;
    padding: 0;
    list-style-type: none;
    position: relative;
    cursor: pointer;
    //min-width: 245px;
    line-height: 3.5em;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 2px;
    margin:0;

    //line-height: 2.7em;
    overflow-y: unset;
    max-height: 3.5em;

    &:after {
      content: '';
      height: 8px;
      width: 8px;
      position: absolute;
      top: 1em;
      right: 20px;
      border-width: 1px;
      border-style: solid;
      transform: rotate(45deg);
      transition: transform 0.3s, border-color 0.3s;
    }

    div {
      padding: 0 25px;
      position: relative;
      z-index: 1;
    }

    & > li {
      transition: color 0.3s ease, background-color 0.3s ease;
    }

    ul {
      list-style-type: none;
      max-height: 183px;
      overflow-y: scroll;
      padding: 5px 15px 10px 15px;
      transition: color 0.3s ease, background-color 0.3s ease;

      /* width */
      &::-webkit-scrollbar {
        width: 6px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        background: transparent;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        border-radius: 45px;
      }

      li {
        cursor: pointer;
      }

    }

  }

  .custom-select-focus {
    border: 0;

    ul {
      padding: 0;
      box-shadow: none;

      /* width */
      &::-webkit-scrollbar {
        width: 0;
      }

      li {
        padding: 0 25px;
        transition: background-color 0.3s ease, color 0.3s ease;
      }

    }

    &:after {
      transform: rotate(225deg) translate(-7px, -7px);
    }
  }
</style>
