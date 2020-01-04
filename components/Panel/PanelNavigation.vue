<template>
  <div :title="title" class="panel__nav" :class="{'panel__nav--active' : active}" @click="changePanel">
    <Icon :type="icon" theme="theme--white"/>
    <span>
      {{title}}
    </span>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import Icon from "~/components/Symbols/Icon.vue";

  @Component({
    components: {Icon}
  })
  export default class PanelNavigation extends Vue {
    /**
     * The name of the icon (see Icon component)
     */
    @Prop({type: String, required: true}) readonly icon!: string;
    /**
     * The title of this tab
     */
    @Prop({type: String, required: true}) readonly title!: string;
    /**
     * is this the current tab active ?
     */
    @Prop({type: Boolean, default: false}) readonly active!: boolean;

    /**
     * Emit a changePanel event when the tab is clicked
     */
    changePanel() {
      this.$emit('changePanel')
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/_variables";
  @import "../../assets/css/_font";
  @import "../../assets/css/_function";

  .panel__nav {
    display: flex;
    align-items: center;
    background-color: $PRIMARY_COLOR_LIGHT;
    color: white;
    width: 100%;
    padding: 15px;
    justify-content: center;
    cursor: pointer;
    @include transitionHelper(background-color .4s ease);

    &:not(:first-child) {
      border-left: 1px solid lighten($PRIMARY_COLOR, 20);
    }

    span {
      display: none;
      text-transform: lowercase;
      font-family: $CircularStd;
    }

    &:hover {
      background-color: $PRIMARY_COLOR;
    }

    &--active {
      background-color: $PRIMARY_COLOR;
      cursor: default;

      span {
        margin-left: 10px;
        display: block;
      }
    }

    svg {
      width: 20px;
    }
  }
</style>
