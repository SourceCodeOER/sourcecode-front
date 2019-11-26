<template>
  <div class="tag" :class="{'tag--confirmed' : state === 1, 'tag--deactivated': state === 0}">
    {{title}}
    <CrossSymbol @click.native.stop="deleteTag" :theme="theme"/>
  </div>
</template>

<script lang="ts">
    import CrossSymbol from "~/components/Symbols/CrossSymbol.vue";

    import {Vue, Component, Prop} from 'vue-property-decorator'
    import {ACTIVE, DEACTIVATED} from "~/types";

    @Component({
        components: {
            CrossSymbol
        }
    })
    export default class Tag extends Vue {
        @Prop({type: String, required: true}) readonly title!: string;
        @Prop({type: Number, default: 0}) readonly state!: DEACTIVATED|ACTIVE;
        @Prop({type: Number, required: true}) readonly category!: number;
        @Prop({type: Number, required: true}) readonly id!: number;

        get theme() {
            if (this.state === 0) {
                return 'theme--secondary-color'
            }

            if (this.state === 1) {
                return 'theme--white'
            }
        }

        async deleteTag() {
            await this.$accessor.tags.addOrRemoveTag({tag_id:this.id, tag_text: this.title, state: 0, category: this.category});
            await this.$accessor.tags.apply();
            await this.$accessor.search.fetch({data: {tags: this.$accessor.tags.tagsRequest}});
            this.$accessor.historical.addHistorical(this.$accessor.tags.selectedTags)
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
      background-color: transparent;
      border-color: $RED;
      color:$RED;
    }
  }
</style>
