<template>
  <div>
    <Menu/>
    <Notification/>

    <div class="container--with-menu">
      <div class="banner banner--ith-shadow-bottom">

        <div class="banner__nav">
        <span>
          Tutoriel > {{tutorialNameFormatted}}
        </span>
        </div>
      </div>

      <div id="Tutorial" class="wrapper wrapper--with-panel">
        <Panel>
          <PanelItem>
            <div id="TutorialPanel">
              <div class="panel-wrapper">
                <nuxt-link :to="`/tutoriel/${pageName}`" v-for="(pageName, i) in pageNames" :key="i + pageName">
                  <div class="tutorial__link">
                    <span class="title">
                      {{tutorialLink(pageName)}}
                    </span>

                    <div class="icon-wrapper">
                      <Icon type="arrowRight"/>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </PanelItem>
        </Panel>

        <nuxt/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Menu from "~/components/Menu.vue";
  import {Component, Vue} from "vue-property-decorator";
  import Notification from '~/components/Notification/Notification.vue'
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import Icon from "~/components/Symbols/Icon.vue";

  @Component({
    components: {
      Icon,
      PanelItem,
      Panel,
      Menu,
      Notification
    }
  })
  export default class extends Vue {
    private pageNames!: string[];

    get tutorialNameFormatted() {
      const name = this.$route.name;

      switch (name) {
        case "tutoriel-bibliotheque":
          return 'Bibliothèque';
        case "tutoriel-comptes-et-utilisateurs":
          return 'Comptes et utilisateurs';
        case "tutoriel-panneau-a-onglets":
          return 'Panneau à onglets';
        case "tutoriel-favoris":
          return 'Favoris';
        case "tutoriel-introduction":
          return 'Introduction';
      }

      return this.$route.name
    }

    tutorialLink(pageName: string) {
      switch (pageName) {
        case "bibliotheque":
          return 'Bibliothèque';
        case "panneau-a-onglets":
          return 'Panneau à onglets';
        case "favoris":
          return 'Favoris';
        case "comptes-et-utilisateurs":
          return 'Comptes et utilisateurs';
        case "introduction":
          return 'Introduction';
      }
    }

    created() {
      this.pageNames = ["introduction", "comptes-et-utilisateurs", "bibliotheque", "panneau-a-onglets", "favoris"];
    }
  }
</script>

<style lang="scss">
  @import "../assets/css/_variables";
  @import "../assets/css/_function";
  @import "../assets/css/_font";

  #Tutorial {
    section {
      background-color: white;
      @include box-shadow($SHADOW);
      border-radius: 4px;
      margin-bottom: 30px;
      padding: 20px;

      h1 {
        margin-bottom: 5px;
      }

      h2 {
        margin-bottom: 10px;
        margin-top: 30px;

        ~ h3 {
          margin-top:20px;
        }
      }

      h3 {
        font-size: 1em;
      }

      > .exercise-article {
        font-size: .875em;

        ol {
          > li {
            padding-left: 10px;
            margin-bottom: 20px;

            ul {
              margin-top: 10px;
            }
          }
        }

        ul {
          max-width: 700px;
        }
        > ul > li {
          margin-bottom: 10px;
        }

        img.extra-large {
          max-width: 1000px;
          width: 100%;
        }

        img.large {
          max-width: 750px;
          width: 100%;
        }

        img.medium {
          max-width: 500px;
          width: 100%;
        }

        img.small {
          max-width: 250px;
          width: 100%;
        }
      }

    }
  }


  #TutorialPanel {
    padding: 0 0 20px;

    a {
      color: inherit;
      text-decoration: none;
    }

    .nuxt-link-active {
      font-weight: bolder;
    }

    .icon-wrapper {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 50%;
      right: 10px;
      @include transformHelper(translateY(-50%));
    }

    .tutorial__link {
      padding: 20px;
      cursor: pointer;
      position: relative;
      border-bottom: 1px solid rgba($GREY, .1);

      .title {
        margin-bottom: 20px;
        font-family: $CircularStd;
      }

      .separator {
        color: $TERNARY_COLOR;
      }

      &:hover {
        background-color: rgba($GREY, .1);
      }
    }
  }

</style>
