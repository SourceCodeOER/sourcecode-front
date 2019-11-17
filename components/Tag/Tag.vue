<template>
  <div class="tag" :class="{'tag--confirmed' : state === 1, 'tag--deactivated': state === 0}">
    {{title}}
    <CrossSymbol @click.native="deleteTag" :theme="theme"/>
  </div>
</template>

<script lang="ts">
    import CrossSymbol from "~/components/Symbols/CrossSymbol.vue";

    import {Vue, Component, Prop} from 'vue-property-decorator'
    import {ACTIVE, DEACTIVATED, PENDING} from "~/types";

    @Component({
        components: {
            CrossSymbol
        }
    })
    export default class Tag extends Vue {
        @Prop({type: String, required: true}) readonly title!: string;
        @Prop({type: Number, default: 2}) readonly state!: DEACTIVATED|ACTIVE|PENDING;
        @Prop({type: Number, required: true}) readonly category!: number;
        @Prop({type: Number, required: true}) readonly id!: number;

        get theme() {
            if (this.state === 2) {
                return 'theme--secondary-color'
            } else if(this.state === 1) {
                return 'theme--white'
            } else {
                return 'theme--red'
            }
        }

        deleteTag() {
            if(this.state !== 0) this.$accessor.tags.REMOVE_TAG({id:this.id, text: this.title, state: this.state, category: this.category})
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
      background-color: darken($SECONDARY_COLOR, 12);
      border: 0;
      color: white;
    }

    &.tag--deactivated {
      background-color: transparent;
      border-color: $RED;
      color:$RED;
    }
  }
</style>
