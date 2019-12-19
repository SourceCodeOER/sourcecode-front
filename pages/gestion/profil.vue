<template>
  <div class="container--with-menu">
    <div class="banner banner--nav banner--with-shadow-bottom">
      <span>
        Gestion > Mon profil
      </span>
      <nuxt-link to="/exercices" tag="span">
        <ArrowSymbol class="reversed-arrow" theme="theme--secondary-color"/>
        Retour
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import ArrowSymbol from "~/components/Symbols/ArrowSymbol.vue";

  @Component({
    components: {
      ArrowSymbol
    }
  })
  export default class extends Vue {

  }
</script>
