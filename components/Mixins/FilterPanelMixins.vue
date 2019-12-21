<script lang="ts">

  import {Component, Vue} from "vue-property-decorator";
  import {BusEvent} from "../Event/BusEvent";

  const FILTER_PANEL = 0;
  const HISTORICAL_PANEL = 1;
  const FAVORITE_PANEL = 2;

  @Component
  export default class FilterPanelMixins extends Vue {
    currentAsidePanel: 0 | 1 | 2 = FILTER_PANEL;

    private changePanel(id: 0 | 1 | 2) {
      this.currentAsidePanel = id
    }

    beforeDestroy() {
      BusEvent.$off('changePanel', this.changePanel);
    }

    created() {
      BusEvent.$on('changePanel', this.changePanel)
    }
  }
</script>
