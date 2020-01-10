<template>
  <div class="container--with-menu">

  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component({
    middleware: ['auth', 'admin', 'reset-search-request']
  })
  export default class extends Vue {

  }
</script>


