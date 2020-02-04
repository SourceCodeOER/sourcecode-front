<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path :class="theme" d="M360 64H152c-22.002 0-40 17.998-40 40v344l144-64 144 64V104c0-22.002-17.998-40-40-40z"/></svg>
</template>

<script lang="ts">
  import Symbol from "../Symbol.vue";
  import {Component, Mixins} from 'vue-property-decorator'

  @Component
  export default class BookmarkSymbol extends Mixins(Symbol) {}
</script>
