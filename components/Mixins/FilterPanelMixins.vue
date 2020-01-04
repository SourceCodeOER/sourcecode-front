<script lang="ts">

  import {Component, Vue} from "vue-property-decorator";
  import {BusEvent} from "../Event/BusEvent";

  @Component
  export default class FilterPanelMixins extends Vue {
    private changePanel(id: number) {
      BusEvent.$emit('changePanel', id)
    }
  }
</script>
