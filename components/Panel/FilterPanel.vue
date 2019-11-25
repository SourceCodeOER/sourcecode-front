<template>
  <div id="FilterPanel" class="panel">

    <h3>
      Filtres<br>
      <span class="secondary-color">Ajouter aux favoris
      <StarSymbol theme="theme--secondary-color"/>
      </span>
    </h3>

    <div class="cta-wrapper">
      <ReturnSymbol @click.native="reset" class="return" theme="theme--secondary-color"/>
    </div>
    <div class="panel-wrapper">
        <ul class="selectable-tags">
          <TagSelecter ref="tagSelecter" v-for="tag in tags" @apply="apply" :tags="tag.tags" :category="tag.id"
                       :key="tag.id">
            {{tag.category}}
          </TagSelecter>
        </ul>
    </div>
  </div>
</template>

<script lang="ts">
    import FilterSymbol from "~/components/Symbols/FilterSymbol.vue";
    import ReturnSymbol from "~/components/Symbols/ReturnSymbol.vue";
    import StarSymbol from "~/components/Symbols/StarSymbol.vue";
    import Tag from "~/components/Tag/Tag.vue";
    import TagSelecter from "~/components/Search/TagSelecter.vue";
    import {Component, Vue, Ref} from 'vue-property-decorator';

    @Component({
        components: {
            FilterSymbol,
            Tag,
            TagSelecter,
            ReturnSymbol,
            StarSymbol
        }
    })
    export default class FilterPanel extends Vue {

        @Ref() tagSelecter!: TagSelecter[];

        get confirmedTags() {
            return this.$accessor.tags.selectedTags
        }

        get tags() {
            return this.$accessor.tags.tags
        }

        async apply() {
            await this.$accessor.tags.apply();
            await this.$accessor.search.fetch({data: {tags: this.$accessor.tags.tagsRequest}});
            this.$accessor.historical.addHistorical(this.confirmedTags);
        }

        async reset() {
            this.$accessor.tags.CLEAR();
            await this.$accessor.search.fetch({data: {tags: []}});

            this.resetFilterPanel()
        }

        private resetFilterPanel() {
            const filterPanel = document.getElementById('FilterPanel');

            if (!!filterPanel) {
                filterPanel.scrollTop = 0
            }

            this.tagSelecter.forEach(instance => instance.$data.active = false)
        }
    }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";

  #FilterPanel {
    display: flex;
    flex-direction: column;
    justify-content: stretch;

    .panel-wrapper {
      height: calc(100% - 80px);
    }

    .cta-wrapper {
      position: absolute;
      top: 20px;
      right: 20px;
      color:$SECONDARY_COLOR;

      svg {
        width: 19px;
        vertical-align: middle;
        margin-left: 10px;
        cursor: pointer;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    h3 {
      svg {
        width: 19px;
        margin-left: 5px;
        height: 23px;
        vertical-align: sub;
      }

      span {
        display: block;
        cursor: pointer;
        margin-top: 10px;
      }
    }

    .button-wrapper {
      position: absolute;
      bottom: 0;
      margin-top: auto;
      padding-bottom: 20px;
      width: calc(100% - 40px);
    }

    .selectable-tags {
      list-style-type: none;
      padding: 0;
      overflow-y: scroll;
      overflow-x: visible;
      height: 100%;
      margin-bottom: 0;

      .tag-selecter {
        margin-bottom: 20px;
      }
    }

  }


</style>
