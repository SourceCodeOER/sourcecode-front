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
                return this.confirmed ? 'theme--white' : 'theme--default'
            }
        },
        methods: {
            delete() {
                // TODO
                if (this.confirmed) {

                } else {

                }
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
    color: $PRIMARY_COLOR;
    border: 1px solid $PRIMARY_COLOR;
    font-weight: lighter;
    font-size: .75em;
    margin-right: 5px;
    margin-bottom: 10px;

    svg {
      margin-left: 5px;
      cursor: pointer;
    }

    &.tag--confirmed {
      background: $MAIN_GRADIENT_H;
      border: 0;
      color: white;
    }
  }
</style>
