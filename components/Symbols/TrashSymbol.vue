<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path :class="theme" d="M128 405.429C128 428.846 147.198 448 170.667 448h170.667C364.802 448 384 428.846 384 405.429V160H128v245.429zM416 96h-80l-26.785-32H202.786L176 96H96v32h320V96z"/></svg>
</template>

<script lang="ts">
  import Symbol from "./Symbol.vue";
  import {Component, Mixins} from 'vue-property-decorator'

  @Component
  export default class TrashSymbol extends Mixins(Symbol) {}
</script>
