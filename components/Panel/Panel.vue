<template>
  <div class="panel panel__main">
    <div class="panel__nav__wrapper">
      <PanelNavigation v-for="(navigation, index) in panelNavigation"
                       :key="navigation.title + index"
                       :title="navigation.title"
                       :icon="navigation.icon" :active="index === currentIndex"
                       v-if="navigation.isActive"
                       @changePanel="changePanel(index)"
      />
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import PanelNavigation from "~/components/Panel/PanelNavigation.vue";
  import {BusEvent} from "~/components/Event/BusEvent";

  @Component({
    components: {PanelNavigation}
  })
  export default class Panel extends Vue {
    /**
     * The number of xxxPanel component used
     */
    nbPanel: number = 0;
    /**
     * Control of the navigation tab
     */
    panelNavigation: { title: string, icon: string, isActive: boolean }[] = [];
    /**
     * The current active panel
     */
    currentIndex: number = 0;

    /**
     * change the current panel given an index
     * @param index
     */
    changePanel(index: number) {
      if (index !== this.currentIndex) {
        this.currentIndex = index;
      }
    }

    mounted() {
      let nbPanel = 0;

      // Place here all the allowed components for the navigation
      const allowedPanelName: string[] = [
        'favorite-panel',
        'filter-panel',
        'historical-panel',
        'exercises-check-panel',
        'details-panel',
        'tag-filter-panel'
      ];

      // Search for every added panel
      this.$children.forEach((panelItem) => {
        const name: string | undefined = panelItem.$data.name;
        const children = panelItem.$children;

        if (name && name === 'panel-item' && children.length > 0) {
          const child: Vue = children[0];

          const componentName: string | undefined = child.$data.name;

          if (componentName && allowedPanelName.find(panelName => componentName === panelName)) {

            // Put the right title and right icon for the navigation bar
            this.panelNavigation.push({title: child.$props.title, icon: child.$props.icon, isActive: true});

            panelItem.$data.index = nbPanel;
            nbPanel++;
          }

        }

        this.nbPanel = nbPanel;

      });

      /**
       * Event listener when a panel is active/deactivated
       */
      BusEvent.$on('panelActivity', (event: { state: boolean, index: number }) => {
        if (this.panelNavigation.length === this.nbPanel) {
          this.panelNavigation[event.index].isActive = event.state;

          const panel: number = this.panelNavigation.findIndex(panel => panel.isActive);

          if (panel !== -1) {
            this.currentIndex = panel
          }
        }
      });

      BusEvent.$on('changePanel', (id: number) => {
        this.changePanel(id)
      })
    }

    beforeDestroy() {
      BusEvent.$off('panelActivity');
      BusEvent.$off('changePanel');
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/_variables";
  @import "../../assets/css/_function";

  .panel__main {
    .panel__nav__wrapper {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      width: 100%;
      justify-content: stretch;
      overflow: hidden;
      @include box-shadow($SHADOW_BOTTOM);
    }
  }
</style>
