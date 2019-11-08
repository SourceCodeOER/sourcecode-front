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

<script>
    import ArrowSymbol from "../Symbols/ArrowSymbol";
    import CheckBox from "../Input/CheckBox";

    export default {
        name: "TagSelecter",
        components: {CheckBox, ArrowSymbol},
        props: {
            title: {
                type: String,
                required: true
            },
            tags: {
                type: Array,
                default() {
                    return [
                        {
                            id: 1,
                            title:'Facile'
                        },
                        {
                            id: 2,
                            title:'Normal'
                        },
                        {
                            id: 3,
                            title:'Difficile'
                        },
                        {
                            id: 4,
                            title:'Java'
                        },
                        {
                            id: 5,
                            title:'QCM'
                        },
                        {
                            id: 6,
                            title:'Liste Chainées'
                        }
                    ]
                }
            }
        },
        data() {
            return {
                filter: "",
                active: false,
                map: new Map()
            }
        },
        computed: {
            filteredTags() {
                return this.filter === '' ? this.tags : this.tags.filter(element => element.title.toLowerCase().match(this.filter.toLowerCase()) !== null);
            }
        },
        methods: {
            toggleList() {
                this.active = !this.active
            },
            check(event) {
                this.map.set(event.id, event.state);
            }
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
