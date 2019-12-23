<template>
  <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><title>logo</title><g id="recherche"><g id="search"><path id="Shape" d="M13.84,13a.61.61,0,0,1,0,.85.59.59,0,0,1-.84,0L9.1,9.91a5.6,5.6,0,1,1,.84-.85ZM5.5,10A4.5,4.5,0,0,0,8.68,2.32,4.5,4.5,0,1,0,2.32,8.68,4.47,4.47,0,0,0,5.5,10Z" :class="theme"/></g></g></svg>
</template>

<script lang="ts">
    import Symbol from "../Symbol.vue";
    import {Component, Mixins} from 'vue-property-decorator'

    @Component
    export default class SearchSymbol extends Mixins(Symbol) {}
</script>
