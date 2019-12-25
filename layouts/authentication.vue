<template>
  <div>
    <Notification/>
    <nuxt/>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import Notification from '~/components/Notification/Notification.vue'

  @Component({
    components: {
      Notification
    }
  })
  export default class extends Vue {}
</script>
