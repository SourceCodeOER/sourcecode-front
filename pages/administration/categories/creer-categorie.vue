<template>
  <div class="container--with-menu">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav banner__nav--with-link">
        <span>
          Administration > Gestion des tags > Créer une catégorie
        </span>
        <nuxt-link to="/administration/categories" tag="span">
          <Icon type="arrowLeft" class="reversed-arrow" theme="theme--primary-color"/>
          Gestion des catégories
        </nuxt-link>
      </div>
    </div>

    <div class="wrapper">
      <CategoryForm title="Créer une catégorie"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import Icon from "~/components/Symbols/Icon.vue";
  import CategoryForm from "~/components/Gestion/CategoryForm.vue";

  @Component({
    components: {CategoryForm, Icon},
    middleware: ['auth', 'admin']
  })
  export default class extends Vue {}
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/exercise-gestion";

  .wrapper {
    margin-bottom: 40px;
  }
</style>
