<template>
  <div class="container" id="Exercise">
    <div class="banner">
      <span>
        The Weighted Set Cover Problem
      </span>
      <nuxt-link to="/" tag="span">
        <ArrowSymbol class="reversed-arrow" theme="theme--secondary-color"/>
        Retour à la recherche
      </nuxt-link>
    </div>

    <div class="wrapper">
      <aside class="panel">
        <h3>Détails</h3>
        <h3>Sources</h3>
      </aside>

      <section>
        <h1>The Weighted Set Cover Problem</h1>

        <h2>Description</h2>

        <article>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A asperiores aspernatur debitis eaque exercitationem, expedita, fuga id, impedit molestiae molestias natus necessitatibus nisi nostrum omnis quidem? Ab iste recusandae veritatis?
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto consectetur consequatur deserunt dicta ducimus eius molestias, neque odit omnis quia quod repellat rerum voluptate! Accusamus atque consectetur dolorum facilis nemo?
          </p>
        </article>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import ArrowSymbol from "~/components/Symbols/ArrowSymbol.vue";

    @Component({
        components: {
            ArrowSymbol
        }
    })
    export default class extends Vue {

    }
</script>

<style lang="scss" scoped>

  @import "../../assets/css/_variables";
  @import "../../assets/css/_function";

  #Exercise {

    .banner {
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;


      span:first-child {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }

      span:last-child {
        color: $SECONDARY_COLOR;
        display: block;
        position: relative;
        cursor: pointer;
      }

      .reversed-arrow {
        @include transformHelper(rotate(180deg));
        @include transformOriginHelper(center center);
        height: 15px;
        width: 8px;
        margin-bottom: -1px;
        margin-right: 2px;
      }
    }

    section {
      width: calc(100% - #{$FILTER_PANEL_WIDTH + $PADDING_CONTENT});
      margin-left: auto;
      height: 100%;
      background-color:white;
      @include box-shadow($SHADOW);
      border-radius: 4px;

      padding: 20px;

      h1 {
        margin-bottom: 20px;
      }

      h2 {
        color:$SECONDARY_COLOR;
      }

      article {
        font-size: .875em;
      }
    }
  }
</style>
