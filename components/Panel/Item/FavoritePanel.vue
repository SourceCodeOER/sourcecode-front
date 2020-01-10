<template>
  <div id="FavoritePanel">
    <div v-show="isConfigurationsEmpty" class="disclaimer">
      Aucun favori
    </div>

    <div v-show="!isConfigurationsEmpty" class="panel-wrapper">
      <div class="historical" @click="fetch(configuration)" v-for="configuration in configurations"
           :key="configuration.id">
        <h4>{{configuration.name}}</h4>
        <div class="cta-wrapper">
          <span @click.stop="editFavorite(configuration.id)">
            <Icon type="edit" theme="theme--primary-color-light"/>
          </span>

          <span @click.stop="deleteFavorite(configuration.id)">
            <Icon type="trash" theme="theme--red"/>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {BusEvent} from '~/components/Event/BusEvent'
  import {Component, Vue} from "vue-property-decorator";
  import {
    Configuration,
    DataSearchExerciseRequest,
    SearchExerciseRequest,
    SelectedTag,
    TagExtended
  } from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import {Prop} from "~/node_modules/vue-property-decorator";

  @Component({
    components: {
      Icon
    }
  })
  export default class FavoritePanel extends Vue {
    name = "favorite-panel";

    /**
     * The default title of this panel
     */
    @Prop({type: String, default: "Favoris"}) title!: string;
    /**
     * The default icon of this panel (see Icon component)
     */
    @Prop({type: String, default: "starHalf"}) icon!: string;

    /**
     * Retrieve all favorites from the store
     */
    get configurations(): Configuration[] {
      return this.$accessor.favorites.favorites
    }

    /**
     * Check if there is at least one favorite
     */
    get isConfigurationsEmpty() {
      return this.configurations.length === 0;
    }

    /**
     * Delete a favorite from the database and updates the store
     * @param id
     */
    async deleteFavorite(id: number) {
      try {
        await this.$axios.$delete('/api/configurations', {
          data: {id}
        });

        await this.$accessor.favorites.REMOVE_CONFIGURATION(id);

        BusEvent.$emit('displayNotification', {
          mode: 'success',
          message: 'Votre favori a bien été supprimé.'
        })
      } catch (e) {
        BusEvent.$emit('displayNotification', {
          mode: 'error',
          message: 'Une erreur est survenue lors de la suppression du favori.'
        })
      }
    }

    /**
     * Go to the modify page for the specific favorite
     * @param id
     */
    editFavorite(id: number) {
      this.$router.push('/gestion/mes-favoris/' + id);
    }

    /**
     * Search for the selected tags and the title entered
     * @param configuration
     */
    async fetch(configuration: Configuration) {
      const searchRequest: SearchExerciseRequest = {};
      const searchCriterion: DataSearchExerciseRequest = {};

      searchCriterion.title = configuration.title ? configuration.title : "";

      const confirmedTags: SelectedTag[] = configuration.tags.map((tag: TagExtended) => {
        return {...tag, state: true}
      });

      this.$accessor.tags.applyConfirmedTags({confirmedTags, mode: "default"});

      searchCriterion.tags = this.$accessor.tags.tagsRequest;
      searchRequest.data = searchCriterion;

      await this.$accessor.search.fetch(searchRequest);
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/css/variables";
  @import "assets/css/function";
  @import "assets/css/font";
  @import "assets/css/panel";


  #FavoritePanel {
    padding: 0;

    .disclaimer {
      padding: 0 20px;
      font-weight: lighter;
      font-style: italic;
      text-align: center;
      margin-top: 80px;

      b {
        color: $PRIMARY_COLOR_LIGHT;
      }
    }

    h3 {
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 0;
      display: flex;

      span {
        color: $SECONDARY_COLOR;
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        margin-left: auto;

        svg {
          width: 20px;
          margin-right: 2px;
        }
      }

    }

    h4 {
      margin-bottom: 0;
      margin-top: 0;
      padding: 20px;
    }

    .cta-wrapper {
      margin-left: auto;
      text-align: right;
      padding: 0 10px 10px 0;

      svg {
        width: 22px;
        margin-left: 0;
        opacity: 0;
        @include transitionHelper(opacity .4s ease);
      }
    }

    .historical {
      cursor: pointer;
      border-bottom: 1px solid rgba($GREY, .1);


      .title {
        margin-bottom: 20px;
        color: $TERNARY_COLOR;
        font-family: $CircularStd;
      }

      .separator {
        color: $TERNARY_COLOR;
      }

      &:hover {
        background-color: rgba($GREY, .1);

        .cta-wrapper svg {
          opacity: 1;
        }
      }
    }
  }


</style>
