<template>
  <div class="tag" :class="tagStateClass">
    {{title}}
    <Icon type="cross" @click.native.stop="deleteTag" theme="theme--white"/>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop, Emit} from 'vue-property-decorator'
  import Icon from "~/components/Symbols/Icon.vue";
  import {TagLabelObjectEmitted, TagState} from "~/types";

  @Component({
    components: {
      Icon
    }
  })
  export default class Tag extends Vue {
    @Prop({type: String, required: true}) readonly title!: string;
    @Prop({type: String, default: "VALIDATED"}) readonly state!: TagState;
    @Prop({type: Number, required: true}) readonly id!: number;

    get tagStateClass(): string {
      switch (this.state) {
        case "VALIDATED":
          return "tag--validated";
        case "NOT_VALIDATED":
          return "tag--not-validated";
        case "DEPRECATED":
          return "tag--deprecated";
        case "PENDING":
          return "tag--pending";
        default:
          return "tag--validated"
      }
    }

    @Emit('deleteTag')
    deleteTag(): TagLabelObjectEmitted {
      return {title: this.title, id: this.id}
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";

  .tag {
    display: inline-block;
    padding: 12px 12px;
    letter-spacing: .5px;
    border-radius: 4px;
    background-color: white;
    color: darken($SECONDARY_COLOR, 12);
    border: 1px solid darken($SECONDARY_COLOR, 12);
    font-weight: bold;
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

    &.tag--validated {
      background-color: $SECONDARY_COLOR;
      border: 0;
      color: white;
    }

    &.tag--not-validated {
      background-color: lighten($RED, 10);
      border: 0;
      color: white;
    }

    &.tag--deprecated {
      background-color: lighten($ORANGE, 13);
      border: 0;
      color: white;
    }

    &.tag--pending {
      background-color: lighten($YELLOW, 13);
      border: 0;
      color: white;
    }
  }
</style>
