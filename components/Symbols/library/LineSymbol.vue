<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path :class="theme" d="M96 235h320v42H96z"/></svg>
</template>

<script lang="ts">
  import Symbol from "../Symbol.vue";
  import {Component, Mixins} from 'vue-property-decorator'

  @Component
  export default class LineSymbol extends Mixins(Symbol) {}
</script>
