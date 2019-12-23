<template>
  <div id="FilterPanel" class="panel scroll-bar--grey">

    <h3>
      Filtres<br>
      <span v-if="$auth.loggedIn" class="secondary-color">Ajouter aux favoris
      <Icon type="starHalf" theme="theme--secondary-color"/>
      </span>
    </h3>

    <div class="cta-wrapper">
      <Icon type="return" @click.native="reset" class="return" theme="theme--secondary-color"/>
    </div>
    <div class="panel-wrapper">
      <ul class="selectable-tags">
        <TagSelecter v-for="tag in tags" @apply="apply" @toggle-list="toggleList" :tags="tag.tags"
                     :category="tag.id"
                     :key="tag.id">
          {{tag.category}}
        </TagSelecter>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import Tag from "~/components/Tag/Tag.vue";
  import TagSelecter from "~/components/Search/TagSelecter.vue";
  import {Component, Vue, Emit} from 'vue-property-decorator';
  import Icon from "~/components/Symbols/Icon.vue";

  @Component({
    components: {
      Tag,
      TagSelecter,
      Icon
    }
  })
  export default class FilterPanel extends Vue {

    selectedTagSelecter: TagSelecter | undefined = undefined;

    get confirmedTags() {
      return this.$accessor.tags.selectedTags
    }

    get tags() {
      return this.$accessor.tags.tags
    }

    async apply() {
      await this.$accessor.tags.apply();
      await this.$accessor.search.fetch({data: {tags: this.$accessor.tags.tagsRequest}});

      this.$accessor.historical.addHistorical({
        tags: this.confirmedTags,
        title: this.$accessor.search.search_criterion.title
      });
    }

    @Emit()
    async reset() {
      this.$accessor.tags.CLEAR();
      await this.$accessor.search.fetch({data: {tags: [], title: ''}});

      this.resetFilterPanel()
    }

    toggleList(tagSelecter: TagSelecter) {
      if (this.selectedTagSelecter !== undefined) {
        this.selectedTagSelecter.$data.active = false;
        this.selectedTagSelecter = undefined;
      }

      if (tagSelecter.$data.active === true) {
        this.selectedTagSelecter = tagSelecter
      }
    }

    private resetFilterPanel() {
      const filterPanel = document.getElementById('FilterPanel');

      if (!!filterPanel) {
        filterPanel.scrollTop = 0
      }

      if (this.selectedTagSelecter !== undefined) {
        this.selectedTagSelecter.$data.active = false;
        this.selectedTagSelecter = undefined;
      }

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
      color: $SECONDARY_COLOR;

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
        width: 23px;
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
