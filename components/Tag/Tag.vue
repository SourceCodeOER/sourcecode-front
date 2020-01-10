<template>
  <div class="tag" :class="{'tag--confirmed' : state, 'tag--deactivated': !state}">
    {{title}}
    <Icon type="cross" @click.native.stop="deleteTag" theme="theme--white"/>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop, Emit} from 'vue-property-decorator'
  import Icon from "~/components/Symbols/Icon.vue";
  import {TagLabelObjectEmitted} from "~/types";

  @Component({
    components: {
      Icon
    }
  })
  export default class Tag extends Vue {
    @Prop({type: String, required: true}) readonly title!: string;
    @Prop({type: Boolean, default: false}) readonly state!: boolean;
    @Prop({type: Number, required: true}) readonly id!: number;

    currentState: boolean = this.state;

    @Emit('deleteTag')
    deleteTag(): TagLabelObjectEmitted {
      this.currentState = !this.currentState;
      return {title: this.title, state: this.currentState, id: this.id}
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
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;

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
      background-color: lighten($TERNARY_COLOR, 10);
      border: 0;
      color: white;
    }
  }
</style>
