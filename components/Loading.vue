<template>
  <transition name="fade">
    <div class="showbox" v-if="loading">
      <div class="showbox-content">
        <div class="loader">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2"
                    stroke-miterlimit="10"></circle>
          </svg>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
    export default {
        data: () => ({
            loading: false
        }),
        methods: {
            start() {
                this.loading = true
            },
            finish() {
                this.loading = false
            }
        }
    }
</script>

<style lang="scss" scoped>
  @import './../assets/css/_variables';

  $green: #008744;
  $blue: #0057e7;
  $red: #d62d20;
  $yellow: #ffa700;
  $white: #eee;

  // scaling... any units
  $width: 60%;

  .showbox {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100000;

    .showbox-content {
      background-color: white;
      width: 100px;
      height: 100px;
      display: flex;
      border-radius: 50%;
      box-shadow: 5px 10px 45px -13px rgba(0,0,0,0.75);
      opacity: 0.9;
    }
    .loader {
      position: relative;
      margin: 0 auto;
      width: $width;
      &:before {
        content: '';
        display: block;
        padding-top: 100%;
      }
    }
    .circular {
      animation: rotate 2s linear infinite;
      height: 100%;
      transform-origin: center center;
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }

    .path {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
      stroke-linecap: round;
    }
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }

  @keyframes color {

    100%,
    0% {
      stroke: $PRIMARY_COLOR;
    }
    40% {
      stroke: $PRIMARY_COLOR_LIGHT;
    }
    66% {
      stroke: $SECONDARY_COLOR;
    }
    80%,
    90% {
      stroke: $TERNARY_COLOR;
    }
  }

</style>
