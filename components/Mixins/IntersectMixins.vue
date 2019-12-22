<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  @Component
  export default class IntersectMixins extends Vue {
    private observer: IntersectionObserver | undefined = undefined;

    intersectionObserverOptions: IntersectionObserverInit = {};

    handleIntersect(entries: IntersectionObserverEntry[]) {
    }

    targets(): Element[] {
      return []
    }

    beforeDestroy() {
      if (process.client) {
        if (!!this.observer) this.observer.disconnect()
      }
    }

    mounted() {
      if (process.client) {
        this.observer = new IntersectionObserver(this.handleIntersect, this.intersectionObserverOptions);
        this.targets().forEach((element) => {
          // Dumb verification because of typescript...
          if (this.observer) {
            this.observer.observe(element)
          }
        })
      }
    }
  }
</script>
