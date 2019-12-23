<template>
  <div id="FavoritePanel" class="panel">

    <h3>Favoris <span @click="close" class="secondary-color"><Icon type="arrow" class="reversed-arrow"
                                                                          theme="theme--secondary-color"/> Retour</span>
    </h3>

    <div class="panel-wrapper">
      <div class="historical" v-for="configuration in configurations" :key="configuration.id">
        <h4>{{configuration.name}}</h4>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
  import {BusEvent} from '~/components/Event/BusEvent'
  import {Component, Vue} from "vue-property-decorator";
  import {Configuration, SelectedTag} from "~/types";
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

    async fetch(historical: { tags?: SelectedTag[], title?: string }) {
      BusEvent.$emit('changePanel', 0)
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

      .reversed-arrow {
        @include transformHelper(rotate(180deg));
        @include transformOriginHelper(center center);
        height: 15px;
        width: 8px;
        margin-bottom: -1px;
        margin-right: 2px;
      }

      span {
        margin-left: auto;
        cursor: pointer;
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
