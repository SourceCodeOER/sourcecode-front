<template>
  <div class="container--with-menu">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav banner__nav--with-link">
        <span>
          Administration > Gestion des catégories > {{category.category}}
        </span>
        <nuxt-link to="/administration/categories" tag="span">
          <Icon type="arrowLeft" class="reversed-arrow" theme="theme--primary-color-light"/>
          Gestion des catégories
        </nuxt-link>
      </div>
    </div>

    <div class="wrapper">
      <CategoryForm :category="category" title="Modifier une catégorie" back-to-parent-page/>
    </div>

  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import Icon from "~/components/Symbols/Icon.vue";
  import {Category} from "~/types";
  import CategoryForm from "~/components/Gestion/CategoryForm.vue";
  import {AxiosError} from "axios";

  @Component({
    middleware: ['auth', 'admin'],
    components: {
      CategoryForm,
      Icon
    },
    async asyncData({app: {$axios}, params, error}) {

      try {
        const data: Category[] = await $axios.$post('/api/bulk/create_or_find_tag_categories', [params.id]);
        return {category: data[0]}
      } catch (e) {
        const errorAxios = e as AxiosError;

        if (errorAxios.response) {
          const status: number = errorAxios.response.status;

          if (status === 400) {
            error({statusCode: status, message: "Une erreur est survenue."});
          } else if (status === 500) {
            error({
              statusCode: status,
              message: `Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`
            });
          }
        } else {
          error({statusCode: 400, message: "Une erreur est survenue."});
        }
      }
    }
  })
  export default class extends Vue {
    category!: Category

  }
</script>

