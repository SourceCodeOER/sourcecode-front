<template>
  <transition name="slide-fade-left">
    <div v-show="displayed" class="notification" :class="`notification--${mode}`">
      {{message}}
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {BusEvent} from "~/components/Event/BusEvent";

  type NotificationMode = "warning" | "error" | "success" | "information";

  @Component
  export default class Notification extends Vue {
    displayed: boolean = false;
    mode: NotificationMode = "warning";
    message: string = "";

    trigger(data: { message: string, mode?: NotificationMode, time?:number }) {
      this.mode = data.mode ? data.mode : 'warning';
      this.message = data.message;
      this.displayed = true;

      setTimeout(() => {
        this.dissim()
      }, data.time ? data.time : 4000)
    }

    dissim() {
      this.displayed = false;
    }

    mounted() {
      BusEvent.$on('displayNotification', this.trigger);
    }

    beforeDestroy() {
      BusEvent.$off('displayNotification', this.trigger);
    }

  };

</script>

<style lang="scss" scoped>
  @import "../../assets/css/_notification.scss";
</style>
