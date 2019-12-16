<template>
  <transition name="slide-fade-left">
    <div v-show="displayed" class="notification notification--error">
      {{message}}
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component} from "~/node_modules/vue-property-decorator";
  import {mixins} from "~/node_modules/vue-class-component";
  import Notification from "~/components/Notification/Notification";

  @Component
  export default class NotificationError extends mixins(Notification) {

  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/_notification.scss";
</style>
