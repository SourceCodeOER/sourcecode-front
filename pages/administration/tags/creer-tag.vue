<template>
  <div class="container--with-menu">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav banner__nav--with-link">
        <span>
          Administration > Gestion des tags > Créer un tag
        </span>
        <nuxt-link to="/administration/tags" tag="span">
          <Icon type="arrowLeft" class="reversed-arrow" theme="theme--primary-color-light"/>
          Gestion des tags
        </nuxt-link>
      </div>
    </div>

    <div class="wrapper">
      <TagForm title="Créer un tag"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import Icon from "~/components/Symbols/Icon.vue";
  import TagForm from "~/components/Gestion/TagForm.vue";
  import CustomSelect from "~/components/Input/CustomSelect.vue";


  @Component({
    components: {CustomSelect, Icon, TagForm},
    middleware: ['auth', 'admin', 'reset-search-request'],
    async fetch({app: {$accessor}}) {
      await $accessor.tags.fetch();
    }
  })
  export default class extends Vue {}
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/exercise-gestion";

  .wrapper {
    margin-bottom: 40px;
  }
</style>
