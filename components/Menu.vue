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

        <span>Pages</span>

        <ul>
          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/">
            <div class="logo-link-wrapper">
              <Icon type="menuBasic" theme="theme--white"/>
            </div>
            Accueil
          </nuxt-link>

          <nuxt-link class="cta-link cta-link-with-arrow" tag="li" to="/exercices">
            <div class="logo-link-wrapper">
              <Icon type="exercises" theme="theme--white"/>
            </div>
            Exercices
          </nuxt-link>
        </ul>

        <template v-if="displayFilterPanel">

          <span>Panneaux</span>

          <ul>

            <li @click="changePanel(0)" class="cta-link cta-link-with-arrow">
              <div class="logo-link-wrapper">
                <Icon type="filterBasic" theme="theme--white"/>
              </div>
              Filtres
            </li>

            <li @click="changePanel(1)" class="cta-link cta-link-with-arrow">
              <div class="logo-link-wrapper">
                <Icon type="history" theme="theme--white"/>
              </div>
              Historique
            </li>

            <li v-if="isAuthenticated" @click="changePanel(2)" class="cta-link cta-link-with-arrow">
              <div class="logo-link-wrapper">
                <Icon type="starHalf" theme="theme--white"/>
              </div>
              Favoris
            </li>

          </ul>
        </template>

        <template v-if="displayCreationPanel">

          <span>Panneaux</span>

          <ul>

            <li @click="changePanel(0)" class="cta-link cta-link-with-arrow" :class="{'cta-animate': animateCta}">
              <div class="logo-link-wrapper">
                <Icon type="album" theme="theme--white"/>
              </div>
              Similarités
            </li>

            <li @click="changePanel(1)" class="cta-link cta-link-with-arrow">
              <div class="logo-link-wrapper">
                <Icon type="tags" theme="theme--white"/>
              </div>
              Tags
            </li>

            <!--

            <li v-if="isAuthenticated" @click="changePanel(2)" class="cta-link cta-link-with-arrow">
              <div class="logo-link-wrapper">
                <Icon type="eye" theme="theme--white"/>
              </div>
              Preview
            </li>
            -->

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

  @Component({
    components: {
      Icon
    }
  })
  export default class Menu extends Vue {
    animateCta: boolean = false;
    timer: number | null = null;

    changePanel(id: number) {
      BusEvent.$emit('changePanel', id)
    }

    get displayFilterPanel() {
      if (this.$route.name !== undefined) {
        return this.$route.name === "exercices" || this.$route.name === "gestion-mes-exercices"
      }

      return false;
    }

    get displayCreationPanel() {
      if (this.$route.name !== undefined) {
        const routeName = this.$route.name;
        return routeName === "gestion-mes-exercices-creer-exercice" || routeName === 'gestion-mes-exercices-id'
      }

      return false;
    }

    get isAuthenticated() {
      return this.$auth.loggedIn;
    }

    get fullName() {
      return this.$auth.user.fullName
    }

    get role() {
      return this.$auth.user.role
    }

    get nbExercises() {
      return this.$accessor.search.metadata.totalItems
    }

    @Watch('nbExercises')
    animateSimilarExercisesLink() {
      if (this.timer === null && this.displayCreationPanel) {
        this.animateCta = true;

        this.timer = window.setTimeout(() => {
          this.animateCta = false;
          this.timer = null;
        }, 1500)
      }
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
