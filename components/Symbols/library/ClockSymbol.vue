<template>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path :class="themeStroke" d='M256,64C150,64,64,150,64,256s86,192,192,192,192-86,192-192S362,64,256,64Z' style='fill:none;stroke-miterlimit:10;stroke-width:32px'/><polyline :class="themeStroke" points='256 128 256 272 352 272' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/></svg>
</template>

<script lang="ts">
  import Symbol from "../Symbol.vue";
  import {Component, Mixins} from 'vue-property-decorator'

  @Component
  export default class ClockSymbol extends Mixins(Symbol) {}
</script>
