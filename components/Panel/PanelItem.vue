<template>
  <div v-if="currentIndex === index && isActive" class="panel__item">
    <slot></slot>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from "~/node_modules/vue-property-decorator";
  import {BusEvent} from "~/components/Event/BusEvent";

  @Component
  export default class PanelItem extends Vue {
    /**
     * The name this component
     */
    name: string = "panel-item";

    /**
     * is this panel made available in the interface ?
     */
    @Prop({type: Boolean, default: true}) readonly isActive!: boolean;


    /**
     * The index of this panel
     */
    index: number = 0;

    /**
     * emit a panelActivity event when the default index change
     * @param newVal
     * @param oldVal
     */
    @Watch('isActive')
    emitActive(newVal: boolean, oldVal: boolean) {
      if (oldVal !== newVal) {
        BusEvent.$emit('panelActivity', {
          state: newVal,
          index: this.index
        })
      }
    }

    /**
     * Get the current index from the parent component Panel
     */
    get currentIndex(): number {
      return this.$parent.$data.currentIndex;
    }

  }
</script>

<style lang="scss" scoped>
  .panel__item {
    height: calc(100% - 50px);
    margin-top: 50px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
