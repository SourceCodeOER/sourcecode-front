<template>
  <div id="FavoritePanel" class="panel">

    <h3>Favoris <span @click="close" class="secondary-color">
      <Icon type="arrowLeft" theme="theme--secondary-color"/> Retour</span>
    </h3>

    <div class="panel-wrapper">
      <div class="historical" @click="fetch(configuration)" v-for="configuration in configurations"
           :key="configuration.id">
        <h4>{{configuration.name}}</h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {BusEvent} from '~/components/Event/BusEvent'
  import {Component, Vue} from "vue-property-decorator";
  import {Configuration, DataSearchExerciseRequest, SearchExerciseRequest, SelectedTag, TagExtended} from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";

  @Component({
    components: {
      Icon
    }
  })
  export default class FavoritePanel extends Vue {
    get historical() {
      return this.$accessor.historical.historical
    }

    close() {
      BusEvent.$emit('changePanel', 0)
    }

    get configurations(): Configuration[] {
      return this.$accessor.favorites.favorites
    }

    async fetch(configuration: Configuration) {
      const searchRequest: SearchExerciseRequest = {};
      const searchCriterion: DataSearchExerciseRequest = {};

      if (configuration.title) {
        searchCriterion.title = configuration.title
      }

      console.log(configuration)

      const confirmedTags: SelectedTag[] = configuration.tags.map((tag: TagExtended) => {
        return {...tag, state: 1}
      });

      console.log(confirmedTags);

      this.$accessor.tags.applyConfirmedTags({confirmedTags, mode: "default"});

      searchCriterion.tags = this.$accessor.tags.tagsRequest;
      searchRequest.data = searchCriterion;

      await this.$accessor.search.fetch(searchRequest);
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";
  @import "./../../assets/css/_panel";


  #FavoritePanel {
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
