<template>
  <div id="FilterPanel">

    <h3>Tout - <span class="orange">42 résultats</span></h3>

    <div class="filter-tag-wrapper">

      <div class="filters">
        <div class="selected-tags">
          <Tag confirmed title="Facile"></Tag>
          <Tag confirmed title="Java"></Tag>
          <Tag confirmed title="QCM"></Tag>
          <Tag title="Liste Chainées"></Tag>
        </div>

        <ul class="selectable-tags">
          <TagSelecter class="tag-selecter" title="Langage"></TagSelecter>
          <TagSelecter class="tag-selecter" title="Difficulté"></TagSelecter>
          <TagSelecter class="tag-selecter" title="Type d'exercice"></TagSelecter>
          <TagSelecter class="tag-selecter" title="Plateforme"></TagSelecter>
          <TagSelecter class="tag-selecter" title="Auteur"></TagSelecter>
          <TagSelecter class="tag-selecter" title="Cotation"></TagSelecter>
          <TagSelecter class="tag-selecter" title="Thématique"></TagSelecter>
          <TagSelecter class="tag-selecter" title="Institution"></TagSelecter>
        </ul>

        <div class="button-wrapper">
          <button class="button--light-blue-reverse">
            Appliquer
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
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {
            FilterSymbol,
            Tag,
            TagSelecter
        }
    })
    export default class FilterPanel extends Vue {
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
      margin-bottom: 40px;
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
