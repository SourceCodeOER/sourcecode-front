<template>
  <div>
    <Menu/>
    <Notification/>
    <nuxt/>
  </div>
</template>

<script lang="ts">
  import Menu from "../components/Menu.vue";
  import {Component, Vue} from "vue-property-decorator";
  import Notification from '~/components/Notification/Notification.vue'

  @Component({
    components: {
      Menu,
      Notification
    }
  })
  export default class extends Vue {}
</script>
