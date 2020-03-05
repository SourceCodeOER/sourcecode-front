<template>
  <div id="HistoricalPanel">

    <div v-show="isHistoricalEmpty" class="disclaimer">
      Choisissez quelques <b>filtres</b> et/ou un <b>titre</b> de recherche pour remplir cette
      section
    </div>

    <div v-show="!isHistoricalEmpty" class="panel-wrapper">
      <div class="historical" v-for="(el, id) in historical" @click="fetchFilter(el)"
           :key="el.datetime + '_' + id">
        <h4>{{el.datetime}}</h4>
        <div v-if="el.title" class="title">
          {{el.title}}
        </div>
        <template v-for="(tag, i) in el.tags">
          <span v-if="i === 0" :key="tag.tag_id">{{tag.tag_text}}</span>
          <span v-else :key="tag.tag_id"><span class="separator"> |</span> {{tag.tag_text}}</span>
        </template>

        <span v-if="el.vote"><span v-if="el.tags && el.tags.length > 0" class="separator"> | </span>{{formattedVote(el.vote)}}</span>
      </div>

    </div>
  </div>

</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {Historical, SelectedTag, VoteExerciseRequest} from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import {Prop} from "~/node_modules/vue-property-decorator";

  @Component({
    components: {
      Icon
    }
  })
  export default class HistoricalPanel extends Vue {
    name = "historical-panel";

    /**
     * The default title of this panel
     */
    @Prop({type: String, default: "Historique"}) title!: string;

    /**
     * The default icon of this panel (see Icon component)
     */
    @Prop({type: String, default: "search"}) icon!: string;

    /**
     * Get the historical of the user from the store
     */
    get historical() {
      return this.$accessor.historical.historical
    }

    /**
     * Check if the historical is empty
     */
    get isHistoricalEmpty() {
      return this.historical.length === 0;
    }

    formattedVote(vote: VoteExerciseRequest) {
      let message = '';
      if (vote) {
        if (vote.operator === '>=' || vote.operator === '>') {
          message += 'Plus de '
        } else if (vote.operator === '<=' || vote.operator === '<') {
          message += 'Moins de '
        }

        message += vote.value + ' étoiles';

      }

      return message
    }

    /**
     * Make a search request for a selected historical
     * @param historical
     */
    async fetchFilter(historical: Historical) {
      let tagsRequest: (number | number[])[] = [];
      if (historical.tags) {
        await this.$accessor.tags.applyConfirmedTags({confirmedTags: historical.tags, mode: "default"});
        tagsRequest = this.$accessor.tags.tagsRequest;
      } else {
        this.$accessor.tags.CLEAR()
      }

      let title = '';
      if (historical.title) {
        title = historical.title
      }

      await this.$accessor.exercises.fetch({data: {tags: tagsRequest, title: title, vote: historical.vote}});
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/css/variables";
  @import "assets/css/function";
  @import "assets/css/font";
  @import "assets/css/panel";


  #HistoricalPanel {
    padding: 0 0 20px;

    h3 {
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 0;
      display: flex;

      span {
        color: $SECONDARY_COLOR;
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        margin-left: auto;

        svg {
          width: 20px;
          margin-right: 2px;
        }
      }

    }

    .disclaimer {
      padding: 0 20px;
      font-weight: lighter;
      font-style: italic;
      text-align: center;
      margin-top: 80px;

      b {
        color: $PRIMARY_COLOR_LIGHT;
      }
    }

    h4 {
      margin-bottom: 10px;
      margin-top: 0;
    }

    .historical {
      padding: 20px;
      cursor: pointer;
      border-bottom: 1px solid rgba($GREY, .1);

      .title {
        margin-bottom: 20px;
        color: $PRIMARY_COLOR_LIGHT;
        font-family: $CircularStd;
      }

      .separator {
        color: $TERNARY_COLOR;
      }

      &:hover {
        background-color: rgba($GREY, .1);
      }
    }
  }


</style>
