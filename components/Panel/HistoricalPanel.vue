<template>
  <div id="HistoricalPanel" class="panel">

    <h3>Historique <span @click="close" class="secondary-color"><Icon type="arrowLeft"
                                                                      theme="theme--secondary-color"/> Retour</span>
    </h3>

    <div class="panel-wrapper">
      <div class="historical" v-for="(el, id) in historical" @click="fetchFilter({tags: el.tags, title: el.title})"
           :key="el.datetime + '_' + id">
        <h4>{{el.datetime}}</h4>
        <div v-if="el.title" class="title">
          {{el.title}}
        </div>
        <template v-for="(tag, i) in el.tags">
          <span v-if="i === 0" :key="tag.tag_id">{{tag.tag_text}}</span>
          <span v-else :key="tag.tag_id"><span class="separator"> |</span> {{tag.tag_text}}</span>
        </template>
      </div>

    </div>
  </div>

</template>

<script lang="ts">
  import {BusEvent} from '~/components/Event/BusEvent'
  import {Component, Vue} from "vue-property-decorator";
  import {SelectedTag} from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";

  @Component({
    components: {
      Icon
    }
  })
  export default class HistoricalPanel extends Vue {
    get historical() {
      return this.$accessor.historical.historical
    }

    close() {
      BusEvent.$emit('changePanel', 0)
    }

    async fetchFilter(historical: { tags?: SelectedTag[], title?: string }) {
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

      await this.$accessor.search.fetch({data: {tags: tagsRequest, title: title}});
      BusEvent.$emit('changePanel', 0)
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";
  @import "./../../assets/css/_panel";


  #HistoricalPanel {
    padding: 20px 0;

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
        color: $TERNARY_COLOR;
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
