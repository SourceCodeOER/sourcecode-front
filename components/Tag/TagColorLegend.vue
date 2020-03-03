<template>
  <div class="legend-wrapper">
    <div class="legend__title">
      Code couleur
    </div>
    <div class="legend legend--validated">
      valide
    </div>
    <div class="legend legend--pending">
      en attente
    </div>
    <div class="legend legend--deprecated">
      obsolète
    </div>
    <div class="legend legend--not-validated">
      non valide
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  @Component
  export default class TagColorLegend extends Vue {
  }
</script>

<style lang="scss" scoped>
  @import "assets/css/variables";
  @import "assets/css/function";

  .legend-wrapper {
    font-weight: 200;
    margin-top: 20px;
    margin-bottom: 20px;

    .legend__title {
      margin-bottom: 10px;
      text-decoration: underline;
    }

    > .legend {
      &:not(:last-child) {
        margin-bottom: 7px;
      }

      &:before {
        content: "";
        position: relative;
        width: 10px;
        height: 10px;
        @include border-radius(50%);
        display: inline-block;
        vertical-align: middle;
        margin-right: 7px;
      }
    }


    .legend--validated:before {
      background-color: $SECONDARY_COLOR;
    }

    .legend--not-validated:before {
      background-color: lighten($RED, 10);
    }

    .legend--pending:before {
      background-color: lighten($YELLOW, 13);
    }

    .legend--deprecated:before {
      background-color: lighten($ORANGE, 13);
    }
  }
</style>
