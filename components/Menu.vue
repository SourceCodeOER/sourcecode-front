<template>
  <div id="Menu">
    <nuxt-link to="/">
      <div class="logo-wrapper">
        <img src="@/assets/logo/logo.png" alt="Source Code - Logo">
      </div>
    </nuxt-link>

    <div class="menu-wrapper">
      <div class="connection-profile">
        <div v-if="!isAuthenticated">
          <nuxt-link to="/login">
            <span class="connection-profile--login">
              se connecter
            </span>
          </nuxt-link>



        </div>
        <span v-else>Alexandre Dewit</span>
      </div>

      <nav class="menu-nav-list">

        <span>Pages</span>

        <ul>
          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/">
            <div class="logo-link-wrapper">
              <img src="@/assets/logo/menu.svg" alt="Accueil">
            </div>
            Accueil
          </nuxt-link>

          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/exercices">
            <div class="logo-link-wrapper">
              <img src="@/assets/logo/exercises.svg" alt="Exercices">
            </div>
            Exercices
          </nuxt-link>
        </ul>

        <template v-if="isExercisePage">

          <span>Panneaux</span>

          <ul>

            <li @click="changePanel(0)" class="cta-link cta-link-with-arrow">
              <div class="logo-link-wrapper">
                <FilterSymbol theme="theme--white"/>
              </div>
              Filtres
            </li>

            <li @click="changePanel(1)" class="cta-link cta-link-with-arrow">
              <div class="logo-link-wrapper">
                <img src="@/assets/logo/history.svg" alt="Historique">
              </div>
              Historique
            </li>

            <nuxt-link class="cta-link cta-link-with-arrow" v-if="isAuthenticated" tag="li" to="/">
              <div class="logo-link-wrapper">
                <StarSymbol theme="theme--white"/>
              </div>
              Favoris
            </nuxt-link>

          </ul>
        </template>


        <template v-if="isAuthenticated">
          <span>Gestion</span>
          <ul>
            <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/">
              <div class="logo-link-wrapper">
                <img src="@/assets/logo/profile.svg" alt="Profile">
              </div>
              Profil
            </nuxt-link>
          </ul>
        </template>

      </nav>

      <div v-if="isAuthenticated" class="cta-link bottom" @click="logout">
        <div class="logo-link-wrapper">
          <img src="@/assets/logo/disconnect.svg" alt="Déconnexion">
        </div>
        Déconnexion
      </div>

      <div v-else class="cta-link bottom cta-register">
        <nuxt-link to="/register">
          <span class="connection-profile--login">
            créer un compte
          </span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component} from "vue-property-decorator";
  import ArrowSymbol from '~/components/Symbols/ArrowSymbol.vue'
  import StarSymbol from '~/components/Symbols/StarSymbol.vue'
  import FilterSymbol from '~/components/Symbols/FilterSymbol.vue'
  import {BusEvent} from '~/components/Event/BusEvent'

  type FILTER_PANEL = 0;
  type HISTORICAL_PANEL = 1;
  type FAVORITE_PANEL = 2;

  @Component({
    components: {
      ArrowSymbol,
      StarSymbol,
      FilterSymbol
    }
  })
  export default class Menu extends Vue {
    changePanel(id: FILTER_PANEL | HISTORICAL_PANEL | FAVORITE_PANEL) {
      BusEvent.$emit('changePanel', id)
    }

    get isExercisePage() {
      if (this.$route.name !== undefined) {
        return this.$route.name === "exercices"
      }

      return false;
    }

    get isAuthenticated() {
      return this.$auth.loggedIn;
    }

    get fullName() {
      return this.$accessor.user.user.fullName
    }

    get role() {
      return this.$accessor.user.user.role
    }

    async logout() {
      await this.$auth.logout();
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
      text-align: center;

      .connection-profile--login {
        text-decoration: underline;
      }
    }

    .menu-wrapper {
      background-image: $MAIN_GRADIENT_V;
      color: white;
      height: calc(100% - #{$BANNER_LOGO_HEIGHT});
      padding: $PADDING_MENU 0;
      position: relative;
    }

    nav {
      margin-top: 60px;

      span {
        font-weight: bold;
        padding: 0 #{$PADDING_MENU/2};
        font-size: 0.875em;
      }
    }

    ul {
      padding: 0;
      list-style-type: none;
      margin-top: 5px;
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

    .bottom {
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
    }

    .cta-register {
      text-align: center;

      a {
        display: block;
        width: 100%;
        font-weight: bold;
        text-decoration: underline;
      }

    }
  }
</style>
