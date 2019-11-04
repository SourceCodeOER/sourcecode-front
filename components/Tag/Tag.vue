<template>
  <div class="tag" :class="{'tag--confirmed' : confirmed}">
    {{title}}
    <CrossSymbol :theme="theme"/>
  </div>
</template>

<script>
    import CrossSymbol from "../Symbols/CrossSymbol";

    export default {
        name: "Tag",
        components: {
            CrossSymbol
        },
        props: {
            title: {
                required: true,
                type: String
            },
            confirmed: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            theme() {
                return this.confirmed ? 'white-theme' : 'red-light-theme'
            }
        }
    }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";

  .tag {
    display: inline-block;
    padding: 10px 10px;
    border-radius: 4px;
    background-color: white;
    color: $RED;
    border: 1px solid $RED;
    font-weight: lighter;
    font-size: .75em;
    margin-right: 5px;
    margin-bottom: 5px;

    svg {
      margin-left: 5px;
      cursor: pointer;
    }

    &.tag--confirmed {
      background: $LINEAR_GRADIENT_RED_ORANGE_H;
      color: white;
    }
  }
</style>
