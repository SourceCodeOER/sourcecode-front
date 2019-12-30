<template>
  <div id="FilterPanel" class="panel scroll-bar--grey">

    <h3>
      {{title}}
    </h3>

    <transition name="fade">
      <div class="cta-favorite" v-if="favorite && $auth.loggedIn && !createFavoriteInput" @click="displayFavoriteInput">
        Ajouter aux favoris
        <Icon type="starHalf" theme="theme--secondary-color"/>
      </div>

      <div class="input-favorite-wrapper" v-else-if="favorite && $auth.loggedIn && createFavoriteInput">
        <ValidationObserver v-slot="{valid}">
          <ValidationProvider name="email" rules="required">
            <input v-model="favoriteName" type="text" placeholder="Entrez un nom" class="input--secondary-color">
          </ValidationProvider>
          <button :disabled="!valid" type="submit" @click="validateBeforeSubmit" :class="{'button--secondary-color': !valid, 'button--secondary-color-reverse': valid}"
                  class="button--secondary-color">OK
          </button>
        </ValidationObserver>
      </div>
    </transition>

    <div class="cta-wrapper" v-if="resetButton">
      <Icon type="return" @click.native="reset" class="return" theme="theme--secondary-color"/>
    </div>
    <div class="panel-wrapper">
      <ul class="selectable-tags">
        <TagSelecter v-for="tag in tags" @apply="apply" @toggle-list="toggleList" :tags="tag.tags"
                     :category="tag.id"
                     :key="tag.id">
          {{tag.category}}
        </TagSelecter>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import Tag from "~/components/Tag/Tag.vue";
  import TagSelecter from "~/components/Search/TagSelecter.vue";
  import {Component, Vue, Emit, Prop} from 'vue-property-decorator';
  import Icon from "~/components/Symbols/Icon.vue";
  import {ValidationProvider, ValidationObserver} from "vee-validate";
  import {BusEvent} from "~/components/Event/BusEvent";
  import {CreateConfigurationRequest} from "~/types";

  @Component({
    components: {
      Tag,
      TagSelecter,
      Icon,
      ValidationProvider,
      ValidationObserver
    }
  })
  export default class FilterPanel extends Vue {

    selectedTagSelecter: TagSelecter | undefined = undefined;
    createFavoriteInput: boolean = false;
    favoriteName:string = ''

    @Prop({type: Boolean, default: false}) searchMode!: boolean;
    @Prop({type: Boolean, default: false}) historicalMode!: boolean;
    @Prop({type: Boolean, default: false}) resetButton!: boolean;
    @Prop({type: Boolean, default: false}) favorite!: boolean;
    @Prop({type: String, default: 'Filtres'}) title!: boolean;
    @Prop({type: String, default: 'default'}) mode!: "strict" | "default";

    get confirmedTags() {
      return this.$accessor.tags.selectedTags
    }

    get tags() {
      return this.$accessor.tags.tags
    }

    displayFavoriteInput() {
      this.createFavoriteInput = true;
      //BusEvent.$emit('changePanel', 2)
    }

    async apply() {
      await this.$accessor.tags.apply(this.mode);

      if (this.searchMode) {
        await this.$accessor.search.fetch({data: {tags: this.$accessor.tags.tagsRequest}});
      }

      if (this.historicalMode) {
        this.$accessor.historical.addHistorical({
          tags: this.confirmedTags,
          title: this.$accessor.search.search_criterion.title
        });
      }
    }

    async validateBeforeSubmit() {
      if(this.confirmedTags.length !== 0) {
        const tags_id: number[] = this.confirmedTags.map(tag => tag.tag_id);
        const title:string|undefined = this.$accessor.search.search_criterion.title;

        const configurationBuild:CreateConfigurationRequest = {
          tags:tags_id,
          name: this.favoriteName
        };

        if(title !== '' && title !== undefined) {
          configurationBuild.title = title
        }

        try {
          await this.$accessor.favorites.createFavorite(configurationBuild)
        } catch (e) {
          console.log('hello')
        }
      } else {
        BusEvent.$emit('displayNotification', {
          mode:'warning',
          message: 'Vous devez ajouter au moins un tag afin de créer votre favori'
        })
      }
    }

    @Emit()
    async reset() {
      this.$accessor.tags.CLEAR();

      if (this.searchMode) {
        await this.$accessor.search.fetch({data: {tags: [], title: ''}});
      }

      this.resetFilterPanel()
    }

    toggleList(tagSelecter: TagSelecter) {
      if (this.selectedTagSelecter !== undefined) {
        this.selectedTagSelecter.$data.active = false;
        this.selectedTagSelecter = undefined;
      }

      if (tagSelecter.$data.active === true) {
        this.selectedTagSelecter = tagSelecter
      }
    }

    private resetFilterPanel() {
      const filterPanel = document.getElementById('FilterPanel');

      if (!!filterPanel) {
        filterPanel.scrollTop = 0
      }

      if (this.selectedTagSelecter !== undefined) {
        this.selectedTagSelecter.$data.active = false;
        this.selectedTagSelecter = undefined;
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../assets/css/_variables";
  @import "./../../assets/css/_function";
  @import "./../../assets/css/_font";

  #FilterPanel {
    display: flex;
    flex-direction: column;
    justify-content: stretch;

    .panel-wrapper {
      height: calc(100% - 80px);
    }

    .cta-wrapper {
      position: absolute;
      top: 20px;
      right: 20px;
      color: $SECONDARY_COLOR;

      svg {
        width: 19px;
        vertical-align: middle;
        margin-left: 10px;
        cursor: pointer;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    h3 {
      margin-bottom: 0;
    }

    .cta-favorite {
      display: flex;
      align-items: center;
      color: $SECONDARY_COLOR;
      cursor: pointer;
      font-weight: bold;
      margin-top: 5px;
      margin-bottom: 15px;


      svg {
        width: 23px;
        margin-left: 8px;
      }

      span {
        display: block;
      }
    }

    .input-favorite-wrapper {
      margin-top: 5px;
      margin-bottom: 15px;

      button {
        padding: 8px 14px;
        height: 100%;
        margin-top: 0;
      }
    }

    .button-wrapper {
      position: absolute;
      bottom: 0;
      margin-top: auto;
      padding-bottom: 20px;
      width: calc(100% - 40px);
    }

    .selectable-tags {
      list-style-type: none;
      padding: 0;
      overflow-y: scroll;
      overflow-x: visible;
      height: 100%;
      margin-bottom: 0;

      .tag-selecter {
        margin-bottom: 20px;
      }
    }

  }


</style>
