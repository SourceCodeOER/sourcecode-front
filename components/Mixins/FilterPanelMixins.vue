<script lang="ts">

  import {Component, Vue} from "vue-property-decorator";
  import {BusEvent} from "../Event/BusEvent";

  @Component
  export default class FilterPanelMixins extends Vue {
    currentAsidePanel: number = 0;

    private changePanel(id: number) {
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
