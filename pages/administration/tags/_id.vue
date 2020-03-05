<template>
  <div class="container--with-menu">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav banner__nav--with-link">
        <span>
          Administration > Gestion des tags > {{tag.tag_text}}
        </span>
        <nuxt-link to="/administration/tags" tag="span">
          <Icon type="arrowLeft" class="reversed-arrow" theme="theme--primary-color-light"/>
          Gestion des tags
        </nuxt-link>
      </div>
    </div>

    <div class="wrapper">
      <TagForm :tag="tag" title="Modifier un tag" back-to-parent-page/>
    </div>

  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import TagForm from "~/components/Gestion/TagForm.vue";
  import Icon from "~/components/Symbols/Icon.vue";
  import {TagExtended} from "~/types";
  import {AxiosError} from "axios";

  @Component({
    middleware: ['auth', 'admin', 'reset-search-request'],
    components: {
      TagForm,
      Icon
    },
    async asyncData({app: {$accessor, $axios}, params, error}) {
      await $accessor.tags.fetch();
      const data: TagExtended[] = await $axios.$get('/api/tags?tags_ids=' + params.id);
      if (data.length === 0) error({statusCode: 404, message: `Cette page est introuvable.`});

      return {tag: data[0]}
    }
  })
  export default class extends Vue {
    tag!: TagExtended
  }
</script>

