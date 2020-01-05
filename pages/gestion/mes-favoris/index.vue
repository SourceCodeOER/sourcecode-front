<template>
  <div class="container--with-menu" id="MyFavorites">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav">
        <span>
          Gestion > Mes Favoris
        </span>
      </div>
    </div>

    <div class="wrapper">
      <div class="content">
        <h1>Mes favoris</h1>

        <article>
          <section @click="gotoFavorite(configuration.id)" v-for="configuration in configurations" :key="configuration.id">
            <h2 class="title--primary-color__light">{{configuration.name}}</h2>
            <h3 class="title--normal">Titre de la sélection : {{configuration.title ? configuration.title: '-'}}</h3>
            <h3 class="title--normal">Nombre de tags sélectionnés : {{configuration.tags.length}}</h3>
            <hr>
            <h3>Tags</h3>
            <ul>
              <li v-for="(tag, index) in configuration.tags" :key="tag.tag_text + tag.tag_id" v-if="index < 10">
                {{tag.tag_text}}
              </li>
              <li class="see-more" v-if="configuration.tags.length > 10">Cliquez pour voir plus</li>
            </ul>
          </section>
        </article>

      </div>
    </div>
  </div></template>

<script lang="ts">

  import {Component, Vue} from "vue-property-decorator";
  import {Configuration} from "~/types";

  @Component({
    async asyncData({app: {$accessor}}) {
      if(!$accessor.favorites.loaded) {
        await $accessor.favorites.fetch()
      }

      return {configurations: $accessor.favorites.favorites}
    }
  })
  export default class extends Vue {
    configurations!:Configuration[];

    gotoFavorite(id:number) {
      this.$router.push('/gestion/mes-favoris/' + id)
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/_variables";
  @import "../../../assets/css/_function";

  #MyFavorites {
    article {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      max-width: 1400px;
      grid-gap:20px;
      margin-top: 40px;
    }

    section {
      background-color: white;
      border-radius: 4px;
      @include box-shadow($SHADOW);
      padding: 20px;
      max-width: 350px;
      width: 100%;
      max-height: 450px;
      position: relative;
      cursor: pointer;

      &::after {
        content:'';
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        @include box-shadow(0 0 15px 0 rgba(0, 0, 0, .2));
        @include transitionHelper(opacity .4s ease);
      }

      &:hover::after {
        opacity: 1;
      }

      h2 {
        margin-bottom: 5px;
      }

      h3 {
        font-size: .825em;

        &.title--normal {
          font-weight: normal;
          font-style: italic;
        }
      }

      hr {
        margin-top: 20px;
        margin-bottom: 20px;
        border:0 dashed grey;
        border-top: 1px dashed grey;
      }

      ul {
        font-size: .75em;
        padding: 0;
        list-style-type: none;
        li:nth-child(n + 2) {
          margin-top: 10px;
        }
      }

      .see-more {
        color:$TERNARY_COLOR;
        text-decoration: underline;
      }
    }
  }

  @media screen and (max-width:1670px) {
    #MyFavorites {
      article {
        max-width: 1105px;
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  @media screen and (max-width:1375px) {
    #MyFavorites {
      article {
        max-width: 730px;
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  @media screen and (max-width:990px) {
    #MyFavorites {
      article {
        max-width: 730px;
        grid-template-columns: 1fr;
        justify-items: center;
      }
    }
  }
</style>
