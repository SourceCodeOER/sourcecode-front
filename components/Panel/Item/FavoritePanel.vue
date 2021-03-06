<template>
  <div id="FavoritePanel">
    <div v-show="isConfigurationsEmpty" class="disclaimer">
      Aucun favori
    </div>

    <div v-show="!isConfigurationsEmpty" class="panel-wrapper">
      <div class="favorite" @click="fetch(configuration)" v-for="configuration in configurations"
           :key="configuration.id">
        <h4>{{configuration.name}}</h4>

        <div class="content">
          <div v-if="configuration.title" class="title">
            {{configuration.title}}
          </div>
          <div>
            <template v-for="(tag, i) in configuration.tags">
              <span v-if="i === 0" :key="tag.tag_id">{{tag.tag_text}}</span>
              <span v-else :key="tag.tag_id"><span class="separator"> |</span> {{tag.tag_text}}</span>
            </template>
          </div>
        </div>
        <div class="cta-wrapper">
          <span @click.stop="editFavorite(configuration.id)">
            <Icon type="edit" theme="theme--grey"/>
          </span>

          <span @click.stop="deleteFavorite(configuration.id)">
            <Icon type="trash" theme="theme--grey"/>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {
    Configuration,
    DataSearchExerciseRequest,
    SearchExerciseRequest,
    SelectedTag,
    TagExtended, TagExtendedWithTotal
  } from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import {Prop} from "~/node_modules/vue-property-decorator";
  import {AxiosError} from "axios";

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

        this.$displaySuccess('Votre favori a bien été supprimé.')
      } catch (e) {
        const error = e as AxiosError;

        if(error.response) {
          const status = error.response.status;

          if(status === 400) {
            this.$displayError('Une erreur est survenue lors de la suppression du favori.')
          } else if(status === 401) {
            this.$displayError('Vous devez vous connecter pour effectuer cette action !');
          } else if(status === 403) {
            this.$displayError("Vous n'êtes pas autorisé à effectuer cette action !");
          } else if(status === 500) {
            this.$displayError("Une erreur est survenue depuis nos serveurs, veuillez nous en excuser.");
          } else {
            this.$displayError('Une erreur est survenue lors de la suppression du favori.')
          }
        } else {
          this.$displayError('Une erreur est survenue lors de la suppression du favori.')
        }
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

      const confirmedTags: SelectedTag[] = configuration.tags.map((tag: TagExtendedWithTotal) => {
        return {...tag, isSelected: true}
      });

      this.$accessor.tags.applyConfirmedTags({confirmedTags: confirmedTags.filter(tag => tag.isSelected), mode: "default"});

      searchCriterion.tags = this.$accessor.tags.tagsRequest;
      searchRequest.data = searchCriterion;

      await this.$accessor.exercises.fetch(searchRequest);

      this.$emit('fetch');
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
    position: relative;


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

    .favorite {
      cursor: pointer;
      border-bottom: 1px solid rgba($GREY, .1);

      .content {
        padding: 0 20px;
      }


      .title {
        margin-bottom: 20px;
        color: $PRIMARY_COLOR_LIGHT;
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
