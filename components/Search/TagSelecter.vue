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
      <li v-for="el in filteredTags" :key="el.id">
        <CheckBox :title="el.tag_text" :state="el.state === 2 || el.state === 1" :id="el.tag_id" @check="check"/>
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
  import CheckBox from "~/components/Input/CheckBox.vue";
  import {Vue, Component, Prop} from "vue-property-decorator";
  import {CheckBoxObjectEmitted, SelectedTag, Tag} from "~/types";
  import {Emit} from "~/node_modules/vue-property-decorator";
  import Icon from "~/components/Symbols/Icon.vue";

  @Component({
    components: {
      CheckBox,
      Icon
    }
  })
  export default class TagSelecter extends Vue {
    filter: string = "";
    active: boolean = false;
    selectAllState: boolean = false;

    @Prop({
      type: Array, default() {
        return []
      }
    }) readonly tags!: SelectedTag[];

    @Prop({type: Boolean, default: false}) readonly selectAllOption!: boolean;

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

    check({id, state, title}: CheckBoxObjectEmitted) {
      if (id !== -1) {
        this.$accessor.tags.addOrRemoveTag({
          tag_id: id,
          tag_text: title,
          state: state ? 1 : 0,
          category_id: this.category
        });
      } else {
        this.selectAllState = state;
        this.tags.forEach(tag => {
          if (tag.state === 0 && state) {
            this.$accessor.tags.ADD_TAG(tag)
          } else if (tag.state === 1 && !state) {
            this.$accessor.tags.REMOVE_TAG(tag)
          }
        });

      }
      this.$emit('apply');
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
      &.arrow {
        svg {
          @include transitionHelper(transform .3s ease);
          margin-right: 10px;
        }

        &.arrow-rotate {
          svg {
            @include transformHelper(translateX(2px) rotate(90deg))
          }
        }
      }
      svg {
        width: 19px;
        vertical-align: text-top;
      }
    }
  }

  li {
    margin-bottom: 10px;
  }

  input {
    padding-left: 20px;
    width: 100%;
  }



</style>
