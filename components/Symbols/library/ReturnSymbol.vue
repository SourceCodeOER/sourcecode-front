<template>
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 358.06"><title>return</title><path :class="theme" d="M384.83,179.7H36.1l73.33-82.19a12.93,12.93,0,1,0-19.3-17.22L7.54,172.85a29.71,29.71,0,0,0,0,39.56L90.13,305a12.93,12.93,0,0,0,19.3-17.22L36.1,205.56H384.84a101.3,101.3,0,1,1,0,202.6H323.26a12.94,12.94,0,1,0,0,25.87h61.58a127.17,127.17,0,0,0,0-254.33Z" transform="translate(0 -75.97)"/></svg>
</template>

<script lang="ts">
    import Symbol from "../Symbol.vue";
    import {Component, Mixins} from 'vue-property-decorator'

    @Component
    export default class ReturnSymbol extends Mixins(Symbol) {}
</script>
