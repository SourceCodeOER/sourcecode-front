import Vue from 'vue'
import BusEvent from './../components/Event/BusEvent'


declare module 'vue/types/vue' {
  interface Vue {
    $displayWarning(message: string, time?: number): void,

    $displayError(message: string, time?: number): void,

    $displaySuccess(message: string, time?: number ): void

  }
}

Vue.prototype.$displayWarning = (message: string, time?: number) => {
BusEvent.$emit('displayNotification', {
  mode: 'warning',
  message,
  time
})
};

Vue.prototype.$displayError = (message: string, time?: number) => {
  BusEvent.$emit('displayNotification', {
    mode: 'error',
    message,
    time
  })
};

Vue.prototype.$displaySuccess = (message: string, time?: number) => {
  BusEvent.$emit('displayNotification', {
    mode: 'success',
    message,
    time
  })
};
