<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path :class="theme" d="M96.4 416h77.1l50.9-96.6V96h-160v223.4h77.1L96.4 416zm224 0h77.1l50-96.6V96H288.4v223.4h82l-50 96.6z"/></svg>
</template>

<script lang="ts">
  import Symbol from "../Symbol.vue";
  import {Component, Mixins} from 'vue-property-decorator'

  @Component
  export default class QuoteSymbol extends Mixins(Symbol) {}
</script>
