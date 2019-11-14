<template>
  <div id="HistoricalPanel" class="panel">

    <h3>Historique <span @click="close" class="secondary-color"><ArrowSymbol class="reversed-arrow" theme="theme--secondary-color"/> Retour</span></h3>

    <div class="panel-wrapper">
      <div class="historical" v-for="el in historical" @click="fetchFilter(el.tags)" :key="el.datetime">
        <h4>{{el.datetime}}</h4>
        <template v-for="(tag, i) in el.tags">
          <span v-if="i === 0" :key="tag.id">{{tag.text}}</span>
          <span v-else :key="tag.id"> | {{tag.text}}</span>
        </template>
      </div>

    </div>
  </div>

</template>

<script lang="ts">
    import {BusEvent} from '~/components/Event/BusEvent'
    import {Component, Vue} from "vue-property-decorator";
    import ArrowSymbol from "~/components/Symbols/ArrowSymbol.vue";
    import {SelectedTag} from "~/types";

    @Component({
        components: {
            ArrowSymbol
        }
    })
    export default class HistoricalPanel extends Vue {
        get historical() {
            return this.$accessor.historical.historical
        }
        close() {
            BusEvent.$emit('changePanel', 0)
        }

        fetchFilter(confirmedTags: SelectedTag[]) {
            this.$accessor.tags.applyConfirmedTags(confirmedTags);
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

      &:hover {
        background-color: rgba($GREY, .1);
      }
    }
  }


</style>
