<template>
  <div id="Menu">
    <div class="logo-wrapper">
      <img src="@/assets/logo/logo.png" alt="Source Code - Logo">
    </div>

    <div class="menu-wrapper">
      <div class="connection-profile">
        <span>Alexandre Dewit</span>
      </div>

      <nav class="menu-nav-list">
        <ul>
          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/">
            <div class="logo-link-wrapper">
              <img src="@/assets/logo/menu.svg" alt="Accueil">
            </div>
            Accueil
          </nuxt-link>

          <li @click="changePanel(1)" class="cta-link cta-link-with-arrow">
            <div class="logo-link-wrapper">
              <img src="@/assets/logo/history.svg" alt="Historique">
            </div>
            Historique
          </li>

          <!--
          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/">
            <div class="logo-link-wrapper">
              <img src="@/assets/logo/exercises.svg" alt="Exercices">
            </div>
            Exercices
          </nuxt-link>
          -->

          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/">
            <div class="logo-link-wrapper">
              <StarSymbol theme="theme--white"/>
            </div>
            Favoris
          </nuxt-link>

          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/">
            <div class="logo-link-wrapper">
              <img src="@/assets/logo/profile.svg" alt="Profile">
            </div>
            Profil
          </nuxt-link>
        </ul>
      </nav>

      <div class="cta-link disconnect">
        <div class="logo-link-wrapper">
          <img src="@/assets/logo/disconnect.svg" alt="Déconnexion">
        </div>
        Déconnexion
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import ArrowSymbol from '~/components/Symbols/ArrowSymbol.vue'
    import StarSymbol from '~/components/Symbols/StarSymbol.vue'
    import {BusEvent} from '~/components/Event/BusEvent'

    type FILTER_PANEL = 0;
    type HISTORICAL_PANEL = 1;
    type FAVORITE_PANEL = 2;

    @Component({
        components: {
            ArrowSymbol,
            StarSymbol
        }
    })
    export default class Menu extends Vue{
        changePanel(id:FILTER_PANEL|HISTORICAL_PANEL|FAVORITE_PANEL) {
            BusEvent.$emit('changePanel', id)
        }
    }
</script>

<style lang="scss" scoped>

  @import "./../assets/css/_variables";
  @import "./../assets/css/_function";
  @import "./../assets/css/_font";

  $PADDING_MENU: 28px;

  #Menu {
    width: $MENU_WIDTH;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;

    a {
      color: inherit;
      text-decoration: none;
    }

    .logo-wrapper {
      background-color: white;
      height: $BANNER_LOGO_HEIGHT;
      text-align: center;

      img {
        margin-top: 16.5px;
        width: 140px;
      }
    }

    .connection-profile {
      font-family: $CircularStd;
      font-weight: bold;
      padding: 0 $PADDING_MENU;
    }

    .menu-wrapper {
      background-image: $MAIN_GRADIENT_V;
      color: white;
      height: calc(100% - #{$BANNER_LOGO_HEIGHT});
      padding: $PADDING_MENU 0;
      position: relative;
    }

    ul {
      padding: 0;
      list-style-type: none;
      margin-top: 60px;
    }

    .cta-link {
      font-family: $CircularStd;
      font-weight: 200;
      cursor: pointer;
      display: flex;
      align-items: center;
      height: 40px;
      position: relative;
      padding: 0 $PADDING_MENU;

      &.cta-link-with-arrow:after {
        content: url("~assets/logo/arrow.svg");
        position: absolute;
        right: $PADDING_MENU;

      }

      &:hover {
        background-color: rgba(white, .2);
        @include transitionHelper(background-color .3s ease)
      }
    }

    .logo-link-wrapper {
      width: 20px;
      text-align: center;
      display: flex;
      justify-content: center;
      margin-right: 8px;

      svg {
        width: 100%;
      }
    }

    .disconnect {
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
    }
  }
</style>
