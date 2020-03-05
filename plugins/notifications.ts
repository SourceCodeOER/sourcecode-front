import Vue from 'vue'
import BusEvent from './../components/Event/BusEvent'
import {Plugin} from '@nuxt/types'

interface NotificationOptions {
  time?: number,
  statusCode?: number
}

declare module 'vue/types/vue' {
  interface Vue {
    $displayWarning(message: string, options?: NotificationOptions): void,

    $displayError(message: string, options?: NotificationOptions): void,

    $displaySuccess(message: string, options?: NotificationOptions): void
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $displayWarning(message: string, options?: NotificationOptions): void,

    $displayError(message: string, options?: NotificationOptions): void,

    $displaySuccess(message: string, options?: NotificationOptions): void
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $displayWarning(message: string, options?: NotificationOptions): void,

    $displayError(message: string, options?: NotificationOptions): void,

    $displaySuccess(message: string, options?: NotificationOptions): void
  }
}

const notifications: Plugin = (context, inject) => {
  inject('displayWarning', (message: string, options?: NotificationOptions) => {
    if (process.client) {
      BusEvent.$emit('displayNotification', {
        mode: 'warning',
        message,
        ...options
      })
    }
  });

  inject('displayError', (message: string, options?: NotificationOptions) => {
    if (process.client) {
      BusEvent.$emit('displayNotification', {
        mode: 'error',
        message,
        ...options
      })
    } else {
      const statusCode = options ? options.statusCode : undefined;
      context.error({statusCode, message})
    }
  });

  inject('displaySuccess', (message: string, options?: NotificationOptions) => {
    if (process.client) {
      BusEvent.$emit('displayNotification', {
        mode: 'success',
        message,
        ...options
      })
    }
  });
};

export default notifications
