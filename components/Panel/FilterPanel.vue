<template>
  <div id="FilterPanel" class="panel">

    <h3><span class="secondary-color">42 résultats</span> <StarSymbol theme="theme--secondary-color"/><br>Tout</h3>

    <div class="cta-wrapper">
      <ReturnSymbol @click.native="reset" class="return" theme="theme--secondary-color"/>
    </div>
    <div class="panel-wrapper">

      <div class="filters">
        <div class="selected-tags">
          <div class="no-filter" v-if="isEmptyTagsArray">
            <span>Aucun filtre</span>
          </div>
          <Tag v-for="(tag) in confirmedTags" :state="tag.state" :title="tag.text" :key="tag.text + tag.category"
               :category="tag.category" :id="tag.id"></Tag>
          <Tag v-for="(tag) in selectedTags" :title="tag.text" :key="tag.text + tag.category" :category="tag.category"
               :id="tag.id"></Tag>
        </div>

        <ul class="selectable-tags">
          <TagSelecter ref="tagSelecter" v-for="tag in tags" :tags="tag.tags" :category="tag.id" :key="tag.id">
            {{tag.category}}
          </TagSelecter>
        </ul>

        <div class="button-wrapper">
          <button :disabled="!isModified" @click="apply" :class="{'button--ternary-color-reverse' : isModified, 'button--ternary-color': !isModified }">
            Appliquer
          </button>
        </div>
      </div>
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
            return this.$accessor.tags.filteredConfirmedTags
        }

        get selectedTags() {
            return this.$accessor.tags.filteredSelectedTags
        }

        get isEmptyTagsArray() {
            return this.confirmedTags.length + this.selectedTags.length === 0
        }

        get isModified() {
            return this.$accessor.tags.isModified
        }


        get tags() {
            return this.$accessor.tags.tags
        }

        apply() {
            this.$accessor.tags.apply();
            if (!this.isEmptyTagsArray) {
                this.$accessor.search.fetch({data: {tags: this.$accessor.tags.tagsRequest}});
                this.$accessor.historical.addHistorical(this.confirmedTags);
            }
            this.resetFilterPanel()
        }

        reset() {
            this.$accessor.tags.CLEAR();
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
  @import "./../../assets/css/_panel";

  #FilterPanel {

    .panel-wrapper {
      height: auto;
    }

    .cta-wrapper {
      position: absolute;
      top:20px;
      right: 20px;

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
        cursor: pointer;
      }
    }


    .button-wrapper {
      position: absolute;
      bottom: 0;
      margin-top: auto;
      padding-bottom: 20px;
      width: calc(100% - 40px);
    }


    .no-filter {
      text-align: center;
      margin-top: 35px;
    }

    .selected-tags {
      margin-bottom: 20px;
      min-height: 90px;
      max-height: 90px;
      overflow-y: hidden;
      z-index: 3;
      position: relative;
      background-color: white;

      &:hover {
        height: auto;
        max-height: 400px;
        overflow-y: scroll;
        padding-bottom: 10px;
        border-bottom: 1px dashed $TERNARY_COLOR;
      }
    }

    .selectable-tags {
      list-style-type: none;
      padding: 0;
      overflow-y: scroll;
      overflow-x: visible;
      height: calc(100vh - 450px);
      position: absolute;
      top: 180px;

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
