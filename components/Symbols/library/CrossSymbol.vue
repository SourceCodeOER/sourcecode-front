<template>
  <svg width="7px" height="8px" viewBox="0 0 7 8" version="1.1" xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="recherche" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-355.000000, -152.000000)" :class="theme" fill-rule="nonzero" id="Filtre">
        <g transform="translate(230.000000, 103.000000)">
          <g id="1-copy" transform="translate(81.000000, 38.000000)">
            <path
              d="M48.3294056,15 L50.8295365,12.4992142 C51.0568212,12.2718701 51.0568212,11.8978523 50.8295365,11.6705081 C50.6022519,11.443164 50.228332,11.443164 50.0010474,11.6705081 L47.5009165,14.1712939 L45.0007855,11.6705081 C44.7735009,11.443164 44.399581,11.443164 44.1722964,11.6705081 C44.0586541,11.7841802 44,11.9345207 44,12.0848612 C44,12.2352017 44.0586541,12.3855422 44.1722964,12.4992142 L46.6724273,15 L44.1722964,17.5007858 C44.0586541,17.6144578 44,17.7647983 44,17.9151388 C44,18.0654793 44.0586541,18.2158198 44.1722964,18.3294919 C44.399581,18.556836 44.7735009,18.556836 45.0007855,18.3294919 L47.5009165,15.8287061 L50.0010474,18.3294919 C50.228332,18.556836 50.6022519,18.556836 50.8295365,18.3294919 C51.0568212,18.1021477 51.0568212,17.7281299 50.8295365,17.5007858 L48.3294056,15 Z"
              id="Path"></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
    import Symbol from "../Symbol.vue";
    import {Component, Mixins} from 'vue-property-decorator'

    @Component
    export default class CrossSymbol extends Mixins(Symbol) {}
</script>
