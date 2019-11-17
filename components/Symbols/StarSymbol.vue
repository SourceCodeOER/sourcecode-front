<template>
  <svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.87 53.23"><title>star</title><path :class="theme" d="M11.29,54.55a1,1,0,0,1-.59-.19,1,1,0,0,1-.4-1l3.09-18L.3,22.6a1,1,0,0,1-.25-1,1,1,0,0,1,.81-.68L19,18.27,27,1.88a1,1,0,0,1,.89-.56h0a1,1,0,0,1,.9.56l8.09,16.39L55,20.9a1,1,0,0,1,.56,1.7L42.47,35.36l3.09,18a1,1,0,0,1-1.45,1l-16.18-8.5-16.18,8.5A.93.93,0,0,1,11.29,54.55Zm-8.14-32,12,11.72a1,1,0,0,1,.29.88L12.61,51.72l14.86-7.81a1,1,0,0,1,.93,0l14.85,7.81L40.42,35.18a1,1,0,0,1,.28-.88l12-11.72L36.11,20.17a1,1,0,0,1-.75-.55l-7.43-15-7.42,15a1,1,0,0,1-.76.55Z" transform="translate(0 -1.32)"/></svg>
</template>

<script lang="ts">
    import Symbol from "./Symbol.vue";
    import {Component, Mixins} from 'vue-property-decorator'

    @Component
    export default class StarSymbol extends Mixins(Symbol) {}
</script>
