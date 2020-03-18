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
        <span v-else>{{fullName}}</span>
      </div>

      <nav class="menu-nav-list">

        <ul>
          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/">
            <div class="logo-link-wrapper">
              <Icon type="menuBasic" theme="theme--white"/>
            </div>
            Accueil
          </nuxt-link>

          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/exercices">
            <div class="logo-link-wrapper">
              <Icon type="book" theme="theme--white"/>
            </div>
            Bibliothèque
          </nuxt-link>

          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/tutoriel/introduction">
            <div class="logo-link-wrapper">
              <Icon type="info" theme="theme--white"/>
            </div>
            Tutoriel
          </nuxt-link>
        </ul>

        <template v-if="isAuthenticated && (role === 'admin' || role === 'super_admin')">
          <span>Administration</span>
          <ul>
            <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/administration/exercices">
              <div class="logo-link-wrapper">
                <Icon type="document" theme="theme--white"/>
              </div>
              Exercices
            </nuxt-link>
            <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/administration/categories">
              <div class="logo-link-wrapper">
                <Icon type="bookmark" theme="theme--white"/>
              </div>
              Catégories
            </nuxt-link>
            <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/administration/tags">
              <div class="logo-link-wrapper">
                <Icon type="tags" theme="theme--white"/>
              </div>
              Tags
            </nuxt-link>
            <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/administration/utilisateurs">
              <div class="logo-link-wrapper">
                <Icon type="user" theme="theme--white"/>
              </div>
              Utilisateurs
            </nuxt-link>
          </ul>
        </template>

        <template v-if="isAuthenticated">
          <span>Gestion</span>
          <ul>
            <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/gestion/mes-exercices">
              <div class="logo-link-wrapper">
                <Icon type="document" theme="theme--white"/>
              </div>
              Mes exercices
            </nuxt-link>
            <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/gestion/mes-favoris">
              <div class="logo-link-wrapper">
                <Icon type="star" theme="theme--white"/>
              </div>
              Mes favoris
            </nuxt-link>
            <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/gestion/profil">
              <div class="logo-link-wrapper">
                <Icon type="user" theme="theme--white"/>
              </div>
              Mon profil
            </nuxt-link>
          </ul>
        </template>



      </nav>

      <div v-if="isAuthenticated" class="cta-link bottom" @click="logout">
        <div class="logo-link-wrapper">
          <Icon theme="theme--white" type="off"/>
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
  import {Vue, Component, Watch} from "vue-property-decorator";
  import Icon from "~/components/Symbols/Icon.vue";
  import {BusEvent} from '~/components/Event/BusEvent'
  import {UserRole} from "~/types";

  @Component({
    components: {
      Icon
    }
  })
  export default class Menu extends Vue {

    get isAuthenticated() {
      return this.$auth.loggedIn;
    }

    get fullName() {
      return this.$auth.user.fullName
    }

    get role(): UserRole {
      return this.$auth.user.role
    }

    async logout() {
      this.$accessor.favorites.RESET();
      this.$accessor.historical.RESET();
      await this.$auth.logout();
    }
  }
</script>

<style lang="scss" scoped>

  @import "./../assets/css/_variables";
  @import "./../assets/css/_function";
  @import "./../assets/css/_font";


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
      @include hyphens(true);

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
      padding: 0 $PADDING_MENU/1.5 0 $PADDING_MENU/1.5;

      &.cta-link-with-arrow:after {
        content: url("~assets/logo/arrow.svg");
        position: absolute;
        right: $PADDING_MENU/1.5;

      }

      &.cta-animate {
        @include animation(blink-background 1.5s linear)
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
      padding: 0 $PADDING_MENU;

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
