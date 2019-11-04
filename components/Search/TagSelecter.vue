<template>
  <li class="tag-selecter">
    <span @click="toggleList">
      <ArrowSymbol class="arrow" :class="{'arrow-rotate': active}" theme="orange-theme"/>
      {{title}}
    </span>
    <ul :class="{active}">
      <li>
        <input type="text" v-model="filter" placeholder="Filtrer">
      </li>
      <li>
        <label>
          Un
          <input type="checkbox">
          <span class="checkmark"></span>
        </label>
      </li>
      <li>
        <label>
          Deux
          <input type="checkbox">
          <span class="checkmark"></span>
        </label>
      </li>
      <li>
        <label>
          Trois
          <input type="checkbox">
          <span class="checkmark"></span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
    import ArrowSymbol from "../Symbols/ArrowSymbol";

    export default {
        name: "TagSelecter",
        components: {ArrowSymbol},
        component: {
            ArrowSymbol
        },
        props: {
            title: {
                type: String,
                required: true
            },
            tags: {
                type: Object,
                //required: true
            }
        },
        data() {
            return {
                filter: "",
                active: false
            }
        },
        methods: {
            toggleList() {
                this.active = !this.active
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

    li {
      margin-bottom: 20px;
    }

    .active {
      max-height: 200px;
    }

  }

  .tag-selecter {
    ul > li:nth-child(n + 2) {
      position: relative;
      display: block;
      line-height: 2em;
      padding-left: 35px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

      label {
        display: inline-block;
        width: 100%;
      }

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
          background-color: $LIGHT_BLUE;
        }

        &:checked ~ .checkmark:after {
          display: block;
          background-color: $LIGHT_BLUE;
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
