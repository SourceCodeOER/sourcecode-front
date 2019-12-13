<template>
  <li class="tag-selecter">
    <span @click="toggleList">
      <ArrowSymbol class="arrow" :class="{'arrow-rotate': active}"/>
      <slot></slot>
    </span>
    <ul :class="{active}">
      <li>
        <input type="text" class="input--primary-color" v-model="filter" placeholder="Filtrer">
      </li>
      <li v-for="el in filteredTags" :key="el.id">
        <CheckBox :title="el.tag_text" :state="el.state === 2 || el.state === 1" :id="el.tag_id" @check="check"/>
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
  import ArrowSymbol from "~/components/Symbols/ArrowSymbol.vue";
  import CheckBox from "~/components/Input/CheckBox.vue";
  import {Vue, Component, Prop} from "vue-property-decorator";
  import {CheckBoxObjectEmitted, SelectedTag, Tag} from "~/types";
  import {Emit} from "~/node_modules/vue-property-decorator";

  @Component({
    components: {
      CheckBox,
      ArrowSymbol
    }
  })
  export default class TagSelecter extends Vue {
    filter: string = "";
    active: boolean = false;

    @Prop({
      type: Array, default() {
        return []
      }
    }) readonly tags!: SelectedTag[];

    @Prop({
      type: Number,
      required: true
    }) readonly category!: number

    get filteredTags(): SelectedTag[] {
      return this.filter === '' ? this.tags : this.tags.filter((element: Tag) => element.tag_text.toLowerCase().match(this.filter.toLowerCase()) !== null);
    }

    @Emit()
    toggleList(): TagSelecter {
      this.active = !this.active;
      return this
    }

    check({tag_id, state, tag_text}: CheckBoxObjectEmitted) {
      this.$accessor.tags.addOrRemoveTag({tag_id, tag_text, state: state ? 1 : 0, category: this.category});
      this.$emit('apply')
    }

  }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";


  ul {
    list-style-type: none;
    padding: 0 20px 0 20px;
    max-height: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    @include transitionHelper(max-height .4s ease);

    .active {
      max-height: 300px;
    }

  }

  .tag-selecter {
    margin-bottom: 20px;

    ul > li {
      margin-bottom: 15px;
    }

    > span {
      display: block;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      margin-bottom: 10px;
      text-transform: capitalize;
    }
  }

  li {
    margin-bottom: 10px;
  }

  input {
    padding-left: 20px;
    width: 100%;
  }

  .arrow {
    @include transitionHelper(transform .3s ease);
    margin-right: 10px;

    &.arrow-rotate {
      @include transformHelper(translateX(2px) rotate(90deg))
    }
  }
</style>
