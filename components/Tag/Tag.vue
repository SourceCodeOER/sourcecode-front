<template>
  <div class="tag" :class="{'tag--confirmed' : confirmed}">
    {{title}}
    <CrossSymbol :theme="theme"/>
  </div>
</template>

<script lang="ts">
    import CrossSymbol from "~/components/Symbols/CrossSymbol.vue";

    import {Vue, Component, Prop} from 'vue-property-decorator'

    @Component({
        components: {
            CrossSymbol
        }
    })
    export default class Tag extends Vue {
        @Prop({type: String, required: true}) readonly title!: string;
        @Prop({type: Boolean, default: false}) readonly confirmed?: boolean;

        get theme() {
            return this.confirmed ? 'theme--white' : 'theme--secondary-color'
        }

        delete() {
            // TODO
            if (this.confirmed) {

            } else {

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
    color: darken($SECONDARY_COLOR, 12);
    border: 1px solid darken($SECONDARY_COLOR, 12);
    font-weight: lighter;
    font-size: .75em;
    margin-right: 5px;
    margin-bottom: 10px;

    svg {
      margin-left: 5px;
      cursor: pointer;
    }

    &.tag--confirmed {
      background: darken($SECONDARY_COLOR, 12);
      border: 0;
      color: white;
    }
  }
</style>
