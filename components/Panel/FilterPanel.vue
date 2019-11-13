<template>
  <div id="FilterPanel">

    <h3>Tout - <span class="orange">42 résultats</span></h3>

    <div class="filter-tag-wrapper">

      <div class="filters">
        <div class="selected-tags">
          <Tag v-for="(tag) in confirmedTags" confirmed :title="tag.text" :key="tag.text + tag.category" :category="tag.category" :id="tag.id"></Tag>
          <Tag v-for="(tag) in selectedTags" :title="tag.text" :key="tag.text + tag.category" :category="tag.category" :id="tag.id"></Tag>
        </div>

        <ul class="selectable-tags">
          <TagSelecter ref="tagSelecter" v-for="tag in tags" :tags="tag.tags" :category="tag.id" :key="tag.id">{{tag.category}}</TagSelecter>
        </ul>

        <div class="button-wrapper">
          <button @click="apply" class="button--ternary-color-reverse">
            Appliquer
          </button>

          <button @click="reset" v-if="!isEmptyTagsArray" class="button--ternary-color-reverse">
            Sauver filtre
          </button>

          <button @click="reset" v-if="!isEmptyTagsArray" class="button--ternary-color">
            Réinitialiser
          </button>
        </div>
      </div>

      <div class="no-filter" v-if="false">
        <span>Aucun filtre</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import FilterSymbol from "~/components/Symbols/FilterSymbol.vue";
    import Tag from "~/components/Tag/Tag.vue";
    import TagSelecter from "~/components/Search/TagSelecter.vue";
    import {Component, Vue, Ref} from 'vue-property-decorator';

    @Component({
        components: {
            FilterSymbol,
            Tag,
            TagSelecter
        }
    })
    export default class FilterPanel extends Vue {

        @Ref() tagSelecter!: TagSelecter[];

        get confirmedTags() {
            return this.$accessor.tags.filteredConfirmedTags
        }

        get selectedTags() {
            return this.$accessor.tags.filteredSelectedTags
        }

        get isEmptyTagsArray() {
            return this.confirmedTags.length + this.selectedTags.length === 0
        }


        get tags() {
            return this.$accessor.tags.tags
        }

        apply() {
            this.$accessor.tags.apply();
            this.resetFilterPanel()
        }

        reset() {
            this.$accessor.tags.CLEAR();
            this.resetFilterPanel()
        }

        private resetFilterPanel() {
            const filterPanel = document.getElementById('FilterPanel');

            if(!!filterPanel) {
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
    position: fixed;
    top: $PADDING_TOP_CONTENT;
    height: calc(100vh - #{$BANNER_LOGO_HEIGHT + 2* $PADDING_TOP_INNER_CONTENT});
    width: $FILTER_PANEL_WIDTH;
    border-radius: 4px;
    background-color: white;
    @include box-shadow($SHADOW);
    padding: 20px;
    overflow-y: scroll;
    overflow-x: hidden;


    .filter-tag-wrapper {
      height: calc(100% - 50px);

    }

    .filters {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .button-wrapper {
      margin-top:auto;
      padding-bottom: 20px;
    }

    h3 {
      font-family: $CircularStd;
      font-weight: 200;
      font-size: 1.125em;
      margin-bottom: 20px;

      .orange {
        color: $SECONDARY_COLOR;
      }
    }

    .no-filter {
      text-align: center;
    }

    .selected-tags {
      margin-bottom: 20px;
    }

    .selectable-tags {
      list-style-type: none;
      padding: 0;

      .tag-selecter {
        margin-bottom: 20px;
      }
    }

    .filters {

      button {
        width: 100%;
      }

    }
  }


</style>
