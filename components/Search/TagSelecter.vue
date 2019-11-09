<template>
  <li class="tag-selecter">
    <span @click="toggleList">
      <ArrowSymbol class="arrow" :class="{'arrow-rotate': active}"/>
      {{title}}
    </span>
    <ul :class="{active}">
      <li>
        <input type="text" v-model="filter" placeholder="Filtrer">
      </li>
      <li v-for="el in filteredTags" :key="el.id">
        <CheckBox :title="el.title" :state="!!map.get(el.id)" :id="el.id" @check="check"></CheckBox>
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
    import ArrowSymbol from "~/components/Symbols/ArrowSymbol.vue";
    import CheckBox from "~/components/Input/CheckBox.vue";
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {CheckBoxObjectEmitted, Tag} from "~/types";

    @Component({
        components: {
            CheckBox,
            ArrowSymbol
        }
    })
    export default class TagSelecter extends Vue {
        filter: string = "";
        active: boolean = false;
        map: Map<number, boolean> = new Map();

        @Prop({type: String, required: true}) readonly title!: string;

        @Prop({
            type: Array, default() {
                return [
                    {
                        id: 1,
                        title: 'Facile'
                    },
                    {
                        id: 2,
                        title: 'Normal'
                    },
                    {
                        id: 3,
                        title: 'Difficile'
                    },
                    {
                        id: 4,
                        title: 'Java'
                    },
                    {
                        id: 5,
                        title: 'QCM'
                    },
                    {
                        id: 6,
                        title: 'Liste Chainées'
                    }
                ]
            }
        }) readonly tags!: Tag[];

        get filteredTags(): Tag[] {
            return this.filter === '' ? this.tags : this.tags.filter((element: Tag) => element.title.toLowerCase().match(this.filter.toLowerCase()) !== null);
        }

        toggleList() {
            this.active = !this.active
        }

        check({id, state}: CheckBoxObjectEmitted) {
            this.map.set(id, state);
        }

    }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";


  ul {
    list-style-type: none;
    padding: 0 10px 0 20px;
    max-height: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    @include transitionHelper(max-height .4s ease);

    .active {
      max-height: 200px;
    }

  }

  .tag-selecter {
    margin-bottom: 20px;

    ul > li {
      margin-bottom: 10px;
    }

    > span {
      display: block;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      margin-bottom: 10px;
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
      @include transformHelper(rotate(90deg))
    }
  }
</style>
